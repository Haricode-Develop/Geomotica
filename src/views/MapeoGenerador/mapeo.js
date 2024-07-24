import React, { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { Button, Tooltip } from '@mui/material';
import './mapeoStyle.css';
import { API_BASE_URL } from "../../utils/config";
import * as turf from '@turf/turf';
import BarIndicator from "../../components/BarIndicator/BarIndicator";
import { toast } from 'react-toastify';
import CommonMap from '../../components/CommonMap/CommonMap';
import MapDialog from '../../components/MapDialog/MapDialog';

const MapComponent = ({ onAreaCalculated, percentageAutoPilot, progressFinish, idAnalisis, tipoAnalisis }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    const [hullPolygon, setHullPolygon] = useState(null);
    const [pilotAutoPercentage, setPilotAutoPercentage] = useState(0);
    const [autoTracketPercentage, setAutoTracketPercentage] = useState(0);
    const [activeFilter, setActiveFilter] = useState(null);
    const [points, setPoints] = useState([]);
    const [filteredPoints, setFilteredPoints] = useState([]);
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [filterAutoPilot, setFilterAutoPilot] = useState(false);
    const [filterAutoTracket, setFilterAutoTracket] = useState(false);
    const [mapBounds, setMapBounds] = useState(null);
    const [openIndicator, setOpenIndicator] = useState(null); // Estado para controlar el indicador abierto

    const [lowSpeed, setLowSpeed] = useState(0);
    const [medSpeed, setMedSpeed] = useState(0);
    const [highSpeed, setHighSpeed] = useState(0);

    const [lowGpsQuality, setLowGpsQuality] = useState(0);
    const [medGpsQuality, setMedGpsQuality] = useState(0);
    const [highGpsQuality, setHighGpsQuality] = useState(0);

    const [lowFuel, setLowFuel] = useState(0);
    const [medFuel, setMedFuel] = useState(0);
    const [highFuel, setHighFuel] = useState(0);

    const [lowRpm, setLowRpm] = useState(0);
    const [medRpm, setMedRpm] = useState(0);
    const [highRpm, setHighRpm] = useState(0);

    const [lowCutterBase, setLowCutterBase] = useState(0);
    const [medCutterBase, setMedCutterBase] = useState(0);
    const [highCutterBase, setHighCutterBase] = useState(0);

    const [zoom, setZoom] = useState(3);

    const [filterSpeed, setFilterSpeed] = useState(false);
    const [filterGpsQuality, setFilterGpsQuality] = useState(false);
    const [filterFuel, setFilterFuel] = useState(false);
    const [filterRpm, setFilterRpm] = useState(false);
    const [filterCutterBase, setFilterCutterBase] = useState(false);
    const [filterModeCutterBase, setFilterModeCutterBase] = useState(false);
    const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
    const [mapKey, setMapKey] = useState(Date.now());
    const workerRef = useRef(null);
    const mapRef = useRef(null);

    const [polygon, setPolygon] = useState([]);
    const [outsidePolygon, setOutsidePolygon] = useState([]);
    const [isAreaDataCalculated, setIsAreaDataCalculated] = useState(false);
    const [toastShown, setToastShown] = useState(false);
    const [areaData, setAreaData] = useState({
        polygonArea: null,
        outsidePolygonArea: null,
        areaDifference: null
    });
    const [formData, setFormData] = useState({
        filterAutoPilot: false,
        filterAutoTracket: false,
        filterModeCutterBase: false,
        filterSpeed: false,
        lowSpeed: 0,
        medSpeed: 0,
        highSpeed: 0,
        filterGpsQuality: false,
        lowGpsQuality: 0,
        medGpsQuality: 0,
        highGpsQuality: 0,
        filterFuel: false,
        lowFuel: 0,
        medFuel: 0,
        highFuel: 0,
        filterRpm: false,
        lowRpm: 0,
        medRpm: 0,
        highRpm: 0,
        filterCutterBase: false,
        lowCutterBase: 0,
        medCutterBase: 0,
        highCutterBase: 0,
        idAnalisis: 0
    });
    const [percentage, setPercentage] = useState({
        autoTracket: null,
        autoPilot: null,
        totalEfficiency: null
    });
    const [availableFilters, setAvailableFilters] = useState({
        speed: false,
        gpsQuality: false,
        fuel: false,
        rpm: false,
        cutterBase: false,
        autoPilot: false,
        autoTracket: false,
        modeCutterBase: false,
    });

    const [isMapButtonDisabled, setIsMapButtonDisabled] = useState(!progressFinish);
    const [originalPoints, setOriginalPoints] = useState([]);


    const MapBounds = ({ onNoPoints }) => {
        const map = useMap();

        useEffect(() => {
            if (filteredPoints.length === 0) return;

            const latLngs = filteredPoints.map(point => {
                if (point.geometry.type !== 'MultiPolygon') {
                    const [longitude, latitude] = point.geometry.coordinates;
                    if (longitude && latitude) {
                        return L.latLng(latitude, longitude);
                    }
                    return null;
                } else {
                    return null;
                }
            }).filter(latLng => latLng !== null);

            if (latLngs.length > 0) {
                const bounds = L.latLngBounds(latLngs);
                map.fitBounds(bounds, { padding: [50, 50] });
                setMapBounds(bounds);
            } else {
                onNoPoints();
            }
        }, [filteredPoints, map]);

        return null;
    };

    useEffect(() => {
        const calculateArea = (polygonCoords) => {
            if (!polygonCoords || polygonCoords.length < 4) {
                console.error("Polygon must have at least 4 positions.");
                return 0;
            }
            const firstPoint = polygonCoords[0];
            const lastPoint = polygonCoords[polygonCoords.length - 1];
            if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
                console.error("The first and last position of the Polygon must be equal.");
                polygonCoords.push(firstPoint);
            }

            const turfPolygon = turf.polygon([polygonCoords]);
            const areaInSquareMeters = turf.area(turfPolygon);
            return areaInSquareMeters / 10000;
        };

        if (polygon.length > 0 && outsidePolygon.length > 0) {
            const turfPolygonCoords = transformPolygonCoords(polygon);
            const turfOutsidePolygonCoords = transformPolygonCoords(outsidePolygon);

            const polygonArea = calculateArea(turfPolygonCoords.flat());
            const outsidePolygonArea = calculateArea(turfOutsidePolygonCoords.flat());
            const areaDifference = Math.abs(polygonArea - outsidePolygonArea);

            setAreaData({
                polygonArea,
                outsidePolygonArea,
                areaDifference,
            });
            setIsAreaDataCalculated(true);

            onAreaCalculated?.(polygonArea, outsidePolygonArea, areaDifference);
        }
    }, [polygon, outsidePolygon, onAreaCalculated]);



    useEffect(() => {
        if (idAnalisis && typeof idAnalisis.then === 'function') {
            idAnalisis.then((resultado) => {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    idAnalisis: resultado.data.ID_ANALISIS,
                }));
            }).catch(error => {
                console.error("Error al obtener idAnalisis:", error);
            });
        }
    }, [idAnalisis]);

    useEffect(() => {
        if (toastShown) {
            toast.warn('No se encontraron puntos para el polígono brindado.');
        }
    }, [toastShown]);

    useEffect(() => {
        const worker = new Worker('dataWorker.js');
        workerRef.current = worker;

        worker.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                const { points: newPoints, polygon: newPolygon, outsidePolygon: newOutsidePolygon } = e.data.data;

                setPoints(newPoints);
                setOriginalPoints(newPoints);
                setPolygon(newPolygon);
                setOutsidePolygon(newOutsidePolygon);

                if (Array.isArray(newPolygon) && newPolygon.length > 0) {
                    const polygonLatLngs = newPolygon.map(([lng, lat]) => {
                        if (typeof lat === 'number' && typeof lng === 'number') {
                            return L.latLng(lat, lng);
                        } else {
                            console.error('Coordenada no válida en el polígono', lat, lng);
                            return null;
                        }
                    }).filter(coord => coord !== null);

                    if (polygonLatLngs.length > 0) {
                        try {
                            const polygonBounds = L.latLngBounds(polygonLatLngs);
                            const center = polygonBounds.getCenter();

                            if (center) {
                                setMapCenter([center.lat, center.lng]);
                                setZoom(7);
                            } else {
                                console.error('Centro del polígono no válido', center);
                            }
                        } catch (error) {
                            console.error('Error al calcular los límites del polígono:', error);
                        }
                    }
                }

                // Filtrar puntos aquí
                applyFilters(newPoints);
            }
        };

        const socket = io(API_BASE_URL);

        socket.on('updateGeoJSONLayer', (geojsonData) => {
            if (geojsonData) {
                worker.postMessage({ action: 'processGeoJsonData', geojsonData, type: tipoAnalisis });
            }
        });

        return () => {
            worker.terminate();
            socket.off('updateGeoJSONLayer');
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData, filterSpeed, filterGpsQuality, filterFuel, filterRpm, filterCutterBase, filterAutoPilot]);


    const transformPolygonCoords = (polygon) => {
        return polygon.map(ring => {
            if (Array.isArray(ring) && ring.every(coords => Array.isArray(coords) && coords.length === 2 && coords.every(coord => typeof coord === 'number'))) {
                return ring.map(coords => [coords[1], coords[0]]);
            } else {
                console.error('Coordenadas no válidas en Polygon:', ring);
                return [];
            }
        });
    };


    const convertTimeToDecimalHours = (time) => {
        const parts = time.split(' ');
        let days = 0;
        let timePart = time;

        if (parts.length === 3 && parts[1] === 'days') {
            days = parseInt(parts[0], 10);
            timePart = parts[2];
        }

        const timeParts = timePart.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1] ? parseInt(timeParts[1], 10) / 60 : 0;
        const seconds = timeParts[2] ? parseInt(timeParts[2], 10) / 3600 : 0;

        return days * 24 + hours + minutes + seconds;
    };

    useEffect(() => {

        const pointsData = points;
        const totalPoints = pointsData.length;
        const pilotAutoPoints = pointsData.filter(point =>
            point.properties.PILOTO_AUTOMATICO &&
            point.properties.PILOTO_AUTOMATICO.trim().toLowerCase() === 'engaged'
        ).length;
        const autoTracketPoints = pointsData.filter(point =>
            point.properties.AUTO_TRACKET &&
            point.properties.AUTO_TRACKET.trim().toLowerCase() === 'engaged'
        ).length;

        const modoCorteBase = pointsData.filter(point =>
            point.properties.MODO_CORTE_BASE &&
            point.properties.MODO_CORTE_BASE.trim().toLowerCase() === 'automatic'
        ).length;

        const puntoEncontrado = pointsData.find(point => point.properties.TIEMPO_TOTAL && point.properties.TIEMPO_TOTAL !== "");
        let tiempoTotal = "00:00:00";

        if (puntoEncontrado) {
            tiempoTotal = puntoEncontrado.properties.TIEMPO_TOTAL;
        }

        let totalEfficiency = areaData.outsidePolygonArea / convertTimeToDecimalHours(tiempoTotal);
        const calculatedPilotAutoPercentaje = totalPoints > 0 ? (pilotAutoPoints / totalPoints) * 100 : 0;
        const calculatedAutoTracketPercentaje = totalPoints > 0 ? (autoTracketPoints / totalPoints) * 100 : 0;
        const calculatedModoCortadorBasePercentaje = totalPoints > 0 ? (modoCorteBase / totalPoints) * 100 : 0;

        setPercentage({
            calculatedAutoTracketPercentaje,
            calculatedPilotAutoPercentaje,
            calculatedModoCortadorBasePercentaje,
            totalEfficiency
        });


        if (percentageAutoPilot) {
            percentageAutoPilot(calculatedAutoTracketPercentaje, calculatedPilotAutoPercentaje, calculatedModoCortadorBasePercentaje, totalEfficiency);
        }
    }, [points, isAreaDataCalculated]);

    useEffect(() => {
        setIsMapButtonDisabled(!progressFinish);
    }, [progressFinish]);

    useEffect(() => {
        const checkAvailableFilters = () => {
            const hasSpeed = points.some(point => point.properties.VELOCIDAD_Km_H != null && point.properties.VELOCIDAD_Km_H !== "");
            const hasGpsQuality = points.some(point => point.properties.CALIDAD_DE_SENAL != null && point.properties.CALIDAD_DE_SENAL !== "");
            const hasFuel = points.some(point => point.properties.CONSUMOS_DE_COMBUSTIBLE != null && point.properties.CONSUMOS_DE_COMBUSTIBLE !== "");
            const hasRpm = points.some(point => point.properties.RPM != null && point.properties.RPM !== "");
            const hasCutterBase = points.some(point => point.properties.PRESION_DE_CORTADOR_BASE != null && point.properties.PRESION_DE_CORTADOR_BASE !== "");
            const hasAutoPilot = points.some(point => point.properties.PILOTO_AUTOMATICO != null && point.properties.PILOTO_AUTOMATICO !== "");
            const hasAutoTracket = points.some(point => point.properties.AUTO_TRACKET != null && point.properties.AUTO_TRACKET !== "");
            const hasModeCutterBase = points.some(point => point.properties.MODO_CORTE_BASE != null && point.properties.MODO_CORTE_BASE !== "");

            setAvailableFilters({
                speed: hasSpeed,
                gpsQuality: hasGpsQuality,
                fuel: hasFuel,
                rpm: hasRpm,
                cutterBase: hasCutterBase,
                autoPilot: hasAutoPilot,
                autoTracket: hasAutoTracket,
                modeCutterBase: hasModeCutterBase,
            });
        };

        checkAvailableFilters();
    }, [points]);

    useEffect(() => {
        applyFilters();
    }, [filterAutoPilot, filterAutoTracket, filterModeCutterBase, filterSpeed, filterGpsQuality, filterFuel, filterRpm, filterCutterBase]);

    useEffect(() => {
        applyFilters();
    }, [
        lowSpeed, medSpeed, highSpeed,
        lowGpsQuality, medGpsQuality, highGpsQuality,
        lowFuel, medFuel, highFuel,
        lowRpm, medRpm, highRpm,
        lowCutterBase, medCutterBase, highCutterBase
    ]);
    const applyFilters = (pointsToFilter = originalPoints) => {
        const filtered = pointsToFilter.map(point => {
            const props = point.properties;
            let color = 'blue';

            // Aplicar colores según los filtros activos
            if (filterAutoPilot) {
                if (props.PILOTO_AUTOMATICO?.toLowerCase() === 'engaged') {
                    color = 'green';
                } else if (props.PILOTO_AUTOMATICO?.toLowerCase() !== 'engaged') {
                    color = 'red';
                }
            } else if (filterAutoTracket) {
                if (props.AUTO_TRACKET?.toLowerCase() === 'engaged') {
                    color = 'green';
                } else if (props.AUTO_TRACKET?.toLowerCase() !== 'engaged') {
                    color = 'red';
                }
            } else if (filterModeCutterBase) {
                if (props.MODO_CORTE_BASE?.toLowerCase() === 'automatic') {
                    color = 'green';
                } else if (props.MODO_CORTE_BASE?.toLowerCase() !== 'automatic') {
                    color = 'red';
                }
            } else if (filterSpeed) {
                const speed = props.VELOCIDAD_Km_H;
                if (speed < lowSpeed) {
                    color = 'green';
                } else if (speed >= lowSpeed && speed < medSpeed) {
                    color = 'yellow';
                } else if (speed >= medSpeed && speed <= highSpeed) {
                    color = 'orange';
                } else {
                    color = 'red';
                }
            } else if (filterGpsQuality) {
                const gpsQuality = props.CALIDAD_DE_SENAL;
                if (gpsQuality < lowGpsQuality) {
                    color = 'green';
                } else if (gpsQuality >= lowGpsQuality && gpsQuality < medGpsQuality) {
                    color = 'yellow';
                } else if (gpsQuality >= medGpsQuality && gpsQuality <= highGpsQuality) {
                    color = 'orange';
                } else {
                    color = 'red';
                }
            } else if (filterFuel) {
                const fuel = props.CONSUMOS_DE_COMBUSTIBLE;
                if (fuel < lowFuel) {
                    color = 'green';
                } else if (fuel >= lowFuel && fuel < medFuel) {
                    color = 'yellow';
                } else if (fuel >= medFuel && fuel <= highFuel) {
                    color = 'orange';
                } else {
                    color = 'red';
                }
            } else if (filterRpm) {
                const rpm = props.RPM;
                if (rpm < lowRpm) {
                    color = 'green';
                } else if (rpm >= lowRpm && rpm < medRpm) {
                    color = 'yellow';
                } else if (rpm >= medRpm && rpm <= highRpm) {
                    color = 'orange';
                } else {
                    color = 'red';
                }
            } else if (filterCutterBase) {
                const cutterBase = props.PRESION_DE_CORTADOR_BASE;
                if (cutterBase < lowCutterBase) {
                    color = 'green';
                } else if (cutterBase >= lowCutterBase && cutterBase < medCutterBase) {
                    color = 'yellow';
                } else if (cutterBase >= medCutterBase && cutterBase <= highCutterBase) {
                    color = 'orange';
                } else {
                    color = 'red';
                }
            }

            return { ...point, color };
        });

        setFilteredPoints(filtered);
    };

    const handleOpenMapDialog = () => {
        setIsMapDialogOpen(true);
    };

    const handleCloseMapDialog = () => {
        setIsMapDialogOpen(false);
    };

    const handleToggleFilter = (filterName) => {
        setActiveFilter(filterName);
        setOpenIndicator(filterName);
        switch (filterName) {
            case 'PILOTO_AUTOMATICO':
                setFilterAutoPilot(prev => !prev);
                break;
            case 'AUTO_TRACKET':
                setFilterAutoTracket(prev => !prev);
                break;
            case 'MODO_CORTE_BASE':
                setFilterModeCutterBase(prev => !prev);
                break;
            case 'VELOCIDAD_Km_H':
                setFilterSpeed(prev => !prev);
                break;
            case 'CALIDAD_DE_SENAL':
                setFilterGpsQuality(prev => !prev);
                break;
            case 'CONSUMOS_DE_COMBUSTIBLE':
                setFilterFuel(prev => !prev);
                break;
            case 'RPM':
                setFilterRpm(prev => !prev);
                break;
            case 'PRESION_DE_CORTADOR_BASE':
                setFilterCutterBase(prev => !prev);
                break;
            default:
                break;
        }
    };

    const handleLabelClick = (filterLabel) => {
        applyFilters(points, filterLabel);
    };

    return (
        <>
            {availableFilters.speed && filterSpeed && openIndicator === 'VELOCIDAD_Km_H' && (
                <BarIndicator filterType="speed" onLabelClick={handleLabelClick} />
            )}
            {availableFilters.gpsQuality && filterGpsQuality && openIndicator === 'CALIDAD_DE_SENAL' && (
                <BarIndicator filterType="gpsQuality" onLabelClick={handleLabelClick} />
            )}
            {availableFilters.fuel && filterFuel && openIndicator === 'CONSUMOS_DE_COMBUSTIBLE' && (
                <BarIndicator filterType="fuel" onLabelClick={handleLabelClick} />
            )}
            {availableFilters.rpm && filterRpm && openIndicator === 'RPM' && (
                <BarIndicator filterType="rpm" onLabelClick={handleLabelClick} />
            )}
            {availableFilters.cutterBase && filterCutterBase && openIndicator === 'PRESION_DE_CORTADOR_BASE' && (
                <BarIndicator filterType="cutterBase" onLabelClick={handleLabelClick} />
            )}
            {availableFilters.autoPilot && filterAutoPilot && openIndicator === 'PILOTO_AUTOMATICO' && (
                <BarIndicator filterType="autoPilot" onLabelClick={handleLabelClick} />
            )}
            {availableFilters.autoTracket && filterAutoTracket && openIndicator === 'AUTO_TRACKET' && (
                <BarIndicator filterType="autoTracket" onLabelClick={handleLabelClick} />
            )}
            {availableFilters.modeCutterBase && filterModeCutterBase && openIndicator === 'MODO_CORTE_BASE' && (
                <BarIndicator filterType="modeCutterBase" onLabelClick={handleLabelClick} />
            )}

            <div className="floating-filter-button">
                <Tooltip title={isMapButtonDisabled ? "Espera a que termine de cargar todo el mapa para poder generar otros." : ""}>
                    <span>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenMapDialog}
                            disabled={isMapButtonDisabled}
                        >
                            Generar Mapas
                        </Button>
                    </span>
                </Tooltip>
            </div>

            <CommonMap
                key={mapKey}
                center={mapCenter}
                zoom={zoom}
                polygons={[polygon]}
                points={filteredPoints}
                hullPolygon={hullPolygon}
                areasSuperpuestas={[]}
                nonIntersectedAreas={[]}
                bufferedLines={[]}
                bufferedIntersections={[]}
                activeFilter={activeFilter}
                filterValues={{
                    PILOTO_AUTOMATICO: { low: 0, medium: 0, high: 1 },
                    AUTO_TRACKET: { low: 0, medium: 0, high: 1 },
                    MODO_CORTE_BASE: { low: 0, medium: 0, high: 1 },
                    VELOCIDAD_Km_H: { low: lowSpeed, medium: medSpeed, high: highSpeed },
                    CALIDAD_DE_SENAL: { low: lowGpsQuality, medium: medGpsQuality, high: highGpsQuality },
                    CONSUMOS_DE_COMBUSTIBLE: { low: lowFuel, medium: medFuel, high: highFuel },
                    RPM: { low: lowRpm, medium: medRpm, high: highRpm },
                    PRESION_DE_CORTADOR_BASE: { low: lowCutterBase, medium: medCutterBase, high: highCutterBase }
                }}
                polygonProperties={[]}
                showIntersections={false}
                onLineHover={() => { }}
                onLineMouseOut={() => { }}
                onLineClick={() => { }}
                mapRef={mapRef}
                userId={userData.ID_USUARIO}
            />

            <MapDialog
                isOpen={isMapDialogOpen}
                onClose={handleCloseMapDialog}
                availableFilters={availableFilters}
                filterSpeed={filterSpeed}
                filterGpsQuality={filterGpsQuality}
                filterFuel={filterFuel}
                filterRpm={filterRpm}
                filterCutterBase={filterCutterBase}
                filterAutoPilot={filterAutoPilot}
                filterAutoTracket={filterAutoTracket}
                filterModeCutterBase={filterModeCutterBase}
                lowSpeed={lowSpeed}
                medSpeed={medSpeed}
                highSpeed={highSpeed}
                lowGpsQuality={lowGpsQuality}
                medGpsQuality={medGpsQuality}
                highGpsQuality={highGpsQuality}
                lowFuel={lowFuel}
                medFuel={medFuel}
                highFuel={highFuel}
                lowRpm={lowRpm}
                medRpm={medRpm}
                highRpm={highRpm}
                lowCutterBase={lowCutterBase}
                medCutterBase={medCutterBase}
                highCutterBase={highCutterBase}
                handleToggleFilter={handleToggleFilter}
                setLowSpeed={setLowSpeed}
                setMedSpeed={setMedSpeed}
                setHighSpeed={setHighSpeed}
                setLowGpsQuality={setLowGpsQuality}
                setMedGpsQuality={setMedGpsQuality}
                setHighGpsQuality={setHighGpsQuality}
                setLowFuel={setLowFuel}
                setMedFuel={setMedFuel}
                setHighFuel={setHighFuel}
                setLowRpm={setLowRpm}
                setMedRpm={setMedRpm}
                setHighRpm={setHighRpm}
                setLowCutterBase={setLowCutterBase}
                setMedCutterBase={setMedCutterBase}
                setHighCutterBase={setHighCutterBase}
                usarVelocidadKmH={true}
            />
        </>
    );
};

export default MapComponent;