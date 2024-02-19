import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, LayersControl, Polygon, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { FaMap } from 'react-icons/fa';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField, Tooltip } from '@mui/material';
import './mapeoStyle.css';
import { API_BASE_URL } from "../../utils/config";
import * as turf from '@turf/turf';
import BarIndicator from "../../components/BarIndicator/BarIndicator";

import Slider from '@mui/material/Slider';
import Draggable from 'react-draggable';

const { BaseLayer } = LayersControl;

const MapComponent = ({ csvData, zipFile, onAreaCalculated, percentageAutoPilot, progressFinish }) => {
    const [hullPolygon, setHullPolygon] = useState(null); // Estado para almacenar el polígono convex hull

    const [pilotAutoPercentage, setPilotAutoPercentage] = useState(0);

    const [autoTracketPercentage, setAutoTracketPercentage] = useState(0);
    const [activeFilter, setActiveFilter] = useState(null);

    const [points, setPoints] = useState([]);
    const [filteredPoints, setFilteredPoints] = useState([]); // Estado para almacenar los puntos filtrados
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [filterAutoPilot, setFilterAutoPilot] = useState(false);
    const [filterAutoTracket, setFilterAutoTracket] = useState(false);

    // Filtros de velocidad
    const [lowSpeed, setLowSpeed] = useState(0);
    const [medSpeed, setMedSpeed] = useState(0);
    const [highSpeed, setHighSpeed] = useState(0);

    // Filtros de calidad de GPS
    const [lowGpsQuality, setLowGpsQuality] = useState(0);
    const [medGpsQuality, setMedGpsQuality] = useState(0);
    const [highGpsQuality, setHighGpsQuality] = useState(0);

    // Filtros de combustible
    const [lowFuel, setLowFuel] = useState(0);
    const [medFuel, setMedFuel] = useState(0);
    const [highFuel, setHighFuel] = useState(0);

    // Filtros de RPM
    const [lowRpm, setLowRpm] = useState(0);
    const [medRpm, setMedRpm] = useState(0);
    const [highRpm, setHighRpm] = useState(0);

    // Filtros de CutterBase

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

    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

    const [mapKey, setMapKey] = useState(Date.now()); // Estado para la clave única del mapa
    const workerRef = useRef(null);
    const openFilterDialog = () => setIsFilterDialogOpen(true);
    const closeFilterDialog = () => setIsFilterDialogOpen(false);

    const [polygon, setPolygon] = useState([]);

    const [outsidePolygon, setOutsidePolygon] = useState([]);

    const [isAreaDataCalculated, setIsAreaDataCalculated] = useState(false);

    const [areaData, setAreaData] = useState({
        polygonArea: null,
        outsidePolygonArea: null,
        areaDifference: null
    });
    const incrementFilterValue = (filterSetter, currentValue) => {
        filterSetter(currentValue + 1);
    };

    // Función para decrementar los valores de los filtros
    const decrementFilterValue = (filterSetter, currentValue) => {
        filterSetter(currentValue - 1);
    };

    const [percentage, setPercentage] = useState({
        autoTracket: null,
        autoPilot: null,
        totalEfficiency: null
    });
    const changeActiveFilter = (newFilter) => {
        setActiveFilter(newFilter);
    };

    const [isMapButtonDisabled, setIsMapButtonDisabled] = useState(!progressFinish);

    const MapEffect = () => {
        const map = useMap();

        useEffect(() => {
            if (filteredPoints.length === 0) return;

            const latLngs = filteredPoints.map(point => {
                const [longitude, latitude] = point.geometry.coordinates;
                return L.latLng(latitude, longitude);
            });

            if (latLngs.length > 0) {
                const bounds = L.latLngBounds(latLngs);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }, [filteredPoints, map]); // Dependencias del efecto

        return null; // Este componente no renderiza nada
    };

    useEffect(() => {
        const calculateArea = (polygonCoords) => {
            if (!polygonCoords || polygonCoords.length < 4) {
                console.error("Polygon must have at least 4 positions.");
                return 0;
            }
            // Asegurarse de que el primer y último punto sean iguales
            const firstPoint = polygonCoords[0];
            const lastPoint = polygonCoords[polygonCoords.length - 1];
            if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
                console.error("The first and last position of the Polygon must be equal.");
                polygonCoords.push(firstPoint);
            }

            const turfPolygon = turf.polygon([polygonCoords]);
            const areaInSquareMeters = turf.area(turfPolygon);
            return areaInSquareMeters / 10000; // Convertir a hectáreas
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

            // Llamar a la función de callback si existe
            onAreaCalculated?.(polygonArea, outsidePolygonArea, areaDifference);
        }
    }, [polygon, outsidePolygon, onAreaCalculated]);



    useEffect(() => {
        // Inicializar el worker
        const worker = new Worker('dataWorker.js');
        workerRef.current = worker;

        worker.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                const { points: newPoints, polygon: newPolygon, outsidePolygon: newOutsidePolygon } = e.data.data;

                setPoints(newPoints);
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
            }
        };

        // Inicializar el socket
        const socket = io(API_BASE_URL);

        socket.on('updateGeoJSONLayer', (geojsonData) => {
            if (geojsonData) {
                worker.postMessage({ action: 'processGeoJsonData', geojsonData });
            }
        });

        // Función de limpieza para terminar el worker y remover listeners del socket
        return () => {
            worker.terminate();
            socket.off('updateGeoJSONLayer');
            socket.disconnect(); // Asegurarse de desconectar el socket también
        };
    }, []);

    const transformPolygonCoords = (polygon) => {
        return polygon.map(ring => {
            if (Array.isArray(ring) && ring.every(coords => Array.isArray(coords) && coords.length === 2 && coords.every(coord => typeof coord === 'number'))) {
                return ring.map(coords => [coords[0], coords[1]]);
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

        // Verificar si hay 'days' en la cadena de tiempo
        if (parts.length === 3 && parts[1] === 'days') {
            days = parseInt(parts[0], 10); // Convertir días a número
            timePart = parts[2]; // Parte de tiempo sin días
        }

        // Separar horas, minutos y segundos
        const timeParts = timePart.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1] ? parseInt(timeParts[1], 10) / 60 : 0;
        const seconds = timeParts[2] ? parseInt(timeParts[2], 10) / 3600 : 0;

        // Sumar los días convertidos a horas, más las horas, minutos y segundos
        return days * 24 + hours + minutes + seconds;
    };

    useEffect(() => {
        if (!isAreaDataCalculated) return;
        const pointsData = points;
        const totalPoints = pointsData.length;

        const pilotAutoPoints = pointsData.filter(point =>
            point.properties.PILOTO_AUTOMATICO &&
            point.properties.PILOTO_AUTOMATICO.trim().toLowerCase() === 'automatic'
        ).length;

        const autoTracketPoints = pointsData.filter(point =>
            point.properties.AUTO_TRACKET &&
            point.properties.AUTO_TRACKET.trim().toLowerCase() === 'disengaged'
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

        let totalEfficiency = areaData.outsidePolygonArea / convertTimeToDecimalHours(tiempoTotal) ;

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
            percentageAutoPilot(calculatedAutoTracketPercentaje, calculatedPilotAutoPercentaje, calculatedModoCortadorBasePercentaje,totalEfficiency);
        }


    }, [points, isAreaDataCalculated]);


    useEffect(() => {
        setIsMapButtonDisabled(!progressFinish);
    }, [progressFinish]);


    const toggleFilter = () => {
        setFilterRpm(false);
        setFilterFuel(false);
        setFilterSpeed(false);
        setFilterCutterBase(false);
        setFilterGpsQuality(false);
        setFilterModeCutterBase(false);
        setFilterAutoTracket(false);

        setFilterAutoPilot(current => !current);
        setZoom(7);
        setMapKey(Date.now());
    };
    const toggleFilterAutoTracket = () => {
        setFilterRpm(false);
        setFilterFuel(false);
        setFilterSpeed(false);
        setFilterCutterBase(false);
        setFilterGpsQuality(false);
        setFilterModeCutterBase(false);
        setFilterAutoPilot(false);

        setFilterAutoTracket(current => !current);
        setZoom(7);
        setMapKey(Date.now());
    };

    const toggleFilterModeCutterBase = ()   => {

        setFilterRpm(false);
        setFilterFuel(false);
        setFilterSpeed(false);
        setFilterCutterBase(false);
        setFilterGpsQuality(false);
        setFilterAutoPilot(false);
        setFilterAutoTracket(false);
        setFilterModeCutterBase(current => !current);
        setZoom(7);
        setMapKey(Date.now());
    };
    const toggleFilterSpeed = () => {
        setFilterRpm(false);
        setFilterFuel(false);
        setFilterCutterBase(false);
        setFilterGpsQuality(false);
        setFilterAutoPilot(false);
        setFilterModeCutterBase(false);
        setFilterAutoTracket(false);

        if(lowSpeed !== -1 && medSpeed !== -1 && highSpeed !== -1){
            setFilterSpeed(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }
    };

    const toggleFilterGpsQuality = () => {

        setFilterRpm(false);
        setFilterFuel(false);
        setFilterCutterBase(false);
        setFilterAutoPilot(false);
        setFilterModeCutterBase(false);
        setFilterAutoTracket(false);
        setFilterSpeed(false);

        if(lowGpsQuality !== -1 && medGpsQuality !== -1 && highGpsQuality !== -1){
            setFilterGpsQuality(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }

    };

    const toggleFilterFuel = () => {

        setFilterRpm(false);
        setFilterCutterBase(false);
        setFilterAutoPilot(false);
        setFilterAutoTracket(false);
        setFilterModeCutterBase(false);
        setFilterSpeed(false);
        setFilterGpsQuality(false);

        if (lowFuel !== -1 && medFuel !== -1 && highFuel !== -1) {
            setFilterFuel(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }

    }

    const toggleFilterRpm = () => {

        setFilterCutterBase(false);
        setFilterAutoPilot(false);
        setFilterAutoTracket(false);
        setFilterSpeed(false);
        setFilterModeCutterBase(false);
        setFilterGpsQuality(false);
        setFilterFuel(false);

        if (lowRpm !== -1 && medRpm !== -1 && highRpm !== -1) {
            setFilterRpm(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }
    }


    const toggleFilterCutterBase = () => {

        setFilterAutoPilot(false);
        setFilterAutoTracket(false);
        setFilterSpeed(false);
        setFilterModeCutterBase(false);
        setFilterGpsQuality(false);
        setFilterFuel(false);
        setFilterRpm(false);

        if (lowCutterBase !== -1 && medCutterBase !== -1 && highCutterBase !== -1) {
            setFilterCutterBase(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }
    }

    // ========= Filtros de velocidad
    useEffect(() => {
        if (filterSpeed) {
            // Aplicar el filtro de velocidad cuando esté activo
            setFilteredPoints(points.filter(point => {
                const speed = point.properties.VELOCIDAD_Km_H;
                return speed >= lowSpeed && speed <= highSpeed;
            }));
        } else {
            // Sin filtro de velocidad, mostrar todos los puntos
            setFilteredPoints(points);
        }
    }, [filterSpeed, lowSpeed, medSpeed, highSpeed, points]);

    // ========= Filtro de calidad de GPS
    useEffect(() => {
        if (filterGpsQuality) {
            setFilteredPoints(points.filter(point => {
                const quality = point.properties.CALIDAD_DE_SENAL;
                return quality >= lowGpsQuality && quality <= highGpsQuality;
            }));
        } else {
            setFilteredPoints(points);
        }
    }, [filterGpsQuality, lowGpsQuality, medGpsQuality, highGpsQuality, points]);


    // ========= Filtro de combustible

    useEffect(() => {
        if (filterFuel) {
            setFilteredPoints(points.filter(point => {
                const fuel = point.properties.CONSUMOS_DE_COMBUSTIBLE;
                return fuel >= lowFuel && fuel <= highFuel;
            }));
        } else {
            setFilteredPoints(points);
        }
    }, [filterFuel, lowFuel, medFuel, highFuel, points]);

    // ========= Filtro de RPM

    useEffect(() => {
        if (filterRpm) {
            setFilteredPoints(points.filter(point => {
                const rpm = point.properties.RPM;
                return rpm >= lowRpm && rpm <= highRpm;
            }));
        } else {
            setFilteredPoints(points);
        }
    } , [filterRpm, lowRpm, medRpm, highRpm, points]);


    // ========= Filtro de CutterBase

    useEffect(() => {
        if (filterCutterBase) {
            setFilteredPoints(points.filter(point => {
                const cutterBase = point.properties.PRESION_DE_CORTADOR_BASE;
                return cutterBase >= lowCutterBase && cutterBase <= highCutterBase;
            }));
        } else {
            setFilteredPoints(points);
        }
    }, [filterCutterBase, lowCutterBase, medCutterBase, highCutterBase, points]);


     // ========= Filtro de Piloto Automático
    useEffect(() => {
        if (filterAutoPilot) {
            setFilteredPoints(points);
        } else {
            setFilteredPoints(points);
        }
    }, [filterAutoPilot, points]);


    useEffect(() => {
        if (filterAutoTracket) {
            setFilteredPoints(points);
        } else {
            setFilteredPoints(points);
        }
    }, [filterAutoTracket, points]);



    useEffect(() => {
        if (filterModeCutterBase) {
            setFilteredPoints(points);
        } else {
            setFilteredPoints(points);
        }
    }, [filterModeCutterBase, points]);

    useEffect(() => {
        if (filteredPoints.length > 0) {
            const validPoints = filteredPoints.filter(point =>
                Array.isArray(point.geometry.coordinates) &&
                point.geometry.coordinates.length === 2 &&
                point.geometry.coordinates.every(coord => typeof coord === 'number')
            );

            if (validPoints.length > 0) {
                const pointsForHull = turf.points(validPoints.map(point => point.geometry.coordinates));

                const hull = turf.convex(pointsForHull);
                if (hull) {
                    setHullPolygon(hull.geometry.coordinates[0].map(coord => [coord[1], coord[0]]));
                }

            }
        }
    }, [filteredPoints]);



    const PaperComponent = (props) => {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <div {...props} />
            </Draggable>
        );
    };




    function chooseColor(val, filter){
        const ranges = {
            speed: [lowSpeed, medSpeed],
            gpsQuality: [lowGpsQuality, medGpsQuality],
            fuel: [lowFuel, medFuel],
            rpm: [lowRpm, medRpm],
            cutterBase: [lowCutterBase, medCutterBase],

        };
        if(filter === "autoTracket"){
            if(val !== '0' && val !== '1'){

                return val.toLowerCase().trim() === 'engaged' ? "blue" : "green";
            }else{
                return val === '0' ? "blue" : "red";

            }
        }
        if(filter === "autoPilot" || filter === "modeCutterBase"){
            if(val !== '0' && val !== '1'){
                return val.toLowerCase().trim() === 'automatic' ? "green" : "blue";

            }else{
                return val === '1' ? "red" : "blue";
            }

        }


        if (ranges[filter]) {

            return getColorFromRange(val, ranges[filter]);
        }

        return "blue";
    }

    function getColorFromRange(val, [low, med]) {
        if (val <= low) {
            return "green";
        } else if (val <= med) {
            return "yellow";
        } else {
            return "red";
        }
    }





    return (
        <>
            {filterSpeed && (
                <BarIndicator filterType="speed" low={lowSpeed} medium={medSpeed} high={highSpeed} />
            )}
            {filterGpsQuality && (
                <BarIndicator filterType="gpsQuality" low={lowGpsQuality} medium={medGpsQuality} high={highGpsQuality} />
            )}
            {filterFuel && (
                <BarIndicator filterType="fuel" low={lowFuel} medium={medFuel} high={highFuel} />
            )}
            {filterRpm && (
                <BarIndicator filterType="rpm" low={lowRpm} medium={medRpm} high={highRpm} />
            )}
            {filterCutterBase && (
                <BarIndicator filterType="cutterBase" low={lowCutterBase} medium={medCutterBase} high={highCutterBase} />
            )}
            {filterAutoPilot && (
                <BarIndicator filterType="autoPilot" low={0} medium={0} high={1} />
            )}
            {filterAutoTracket && (
                <BarIndicator filterType="autoTracket" low={0} medium={0} high={1} />
            )}
            {filterModeCutterBase && (
                <BarIndicator filterType="modeCutterBase" low={0} medium={0} high={1} />
            )}

            <div className="floating-filter-button">
                <Tooltip title={isMapButtonDisabled ? "Espera a que termine de cargar todo el mapa para poder generar otros." : ""}>
                    <span>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={openFilterDialog}
                            disabled={isMapButtonDisabled}
                        >
                            <FaMap />
                        </Button>
                    </span>
                </Tooltip>
            </div>

            <MapContainer key={mapKey} center={mapCenter} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
                <MapEffect />
                <LayersControl position="topright">
                    <BaseLayer checked name="Satellite View">
                        <TileLayer
                            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                            minZoom={3}
                            maxZoom={20}
                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        />
                    </BaseLayer>
                    <BaseLayer name="Street Map">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}&y}.png"
                            maxZoom={19}
                        />
                    </BaseLayer>
                    {filteredPoints.map((point, idx) => {
                        const coordinates = point.geometry.coordinates;


                        if (Array.isArray(coordinates) && coordinates.length === 2 && coordinates.every(coord => typeof coord === 'number')) {

                        let fillColor;
                        if(filterAutoPilot){
                            fillColor = chooseColor(point.properties.PILOTO_AUTOMATICO, "autoPilot");
                        }else if(filterAutoTracket){
                            fillColor = chooseColor(point.properties.AUTO_TRACKET, "autoTracket");

                        }else if(filterSpeed){
                            fillColor = chooseColor(point.properties.VELOCIDAD_Km_H, "speed");
                        }else if(filterGpsQuality){
                            fillColor = chooseColor(point.properties.CALIDAD_DE_SENAL, "gpsQuality");
                        }else if(filterFuel){
                            fillColor = chooseColor(point.properties.CONSUMOS_DE_COMBUSTIBLE, "fuel");
                        }else if (filterRpm) {
                            fillColor = chooseColor(point.properties.RPM, "rpm");
                        }else if (filterCutterBase) {
                            fillColor = chooseColor(point.properties.PRESION_DE_CORTADOR_BASE, "cutterBase");

                        }else if(filterModeCutterBase){
                            fillColor = chooseColor(point.properties.MODO_CORTE_BASE, "modeCutterBase");
                        }
                        else{
                            fillColor = "blue";
                        }
                        if (coordinates.length >= 2) {

                        return (
                            <CircleMarker
                                key={idx}
                                center={[coordinates[1],coordinates[0]]}
                                radius={5}
                                fillColor={fillColor}
                                color={fillColor}
                                weight={0.2}
                                opacity={1}
                                fillOpacity={1}
                            />
                        );
                        }

                        } else {
                            return null;
                        }
                    })}

                    {polygon.length > 0 && (
                        <Polygon
                            positions={transformPolygonCoords(polygon)}
                            color="black"
                        />
                    )}
                    {/*
   {outsidePolygon.length > 0 && (
                        <Polygon
                            positions={transformPolygonCoords(outsidePolygon)}
                            color="red"
                        />
                    )}

*/}


                </LayersControl>


            </MapContainer>
            <Dialog
                open={isFilterDialogOpen}
                onClose={closeFilterDialog}
                aria-labelledby="draggable-dialog-title"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '30%',
                        maxWidth: 'none',
                        overflow: 'hidden',
                        backgroundColor: 'white',
                        resize: 'both',
                    }
                }}
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Generar Mapas
                </DialogTitle>
                <DialogContent>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={filterAutoPilot} onChange={toggleFilter} />}
                            label="Piloto Automático"
                        />

                        <FormControlLabel
                            control={<Switch checked={filterAutoTracket} onChange={toggleFilterAutoTracket} />}
                            label="Auto Tracket"
                        />

                        <FormControlLabel
                            control={<Switch checked={filterModeCutterBase} onChange={toggleFilterModeCutterBase} />}
                            label="Modo corte base"
                        />


                        <FormControlLabel
                            control={<Switch checked={filterSpeed} onChange={toggleFilterSpeed} />}
                            label="Velocidad (Km/H)"
                        />


                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="low"
                            value={lowSpeed}
                            onChange={e => {
                                const value = e.target.value;
                                setLowSpeed(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setLowSpeed(value === '' ? 0 : Math.max(0, Number(value)));
                            }}

                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="medium"
                            value={medSpeed}
                            onChange={e => {
                                const value = e.target.value;
                                setMedSpeed(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setMedSpeed(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="high"
                            value={highSpeed}
                            onChange={e => {
                                const value = e.target.value;
                                setHighSpeed(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setHighSpeed(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />

                        <FormControlLabel
                            control={<Switch checked={filterGpsQuality} onChange={toggleFilterGpsQuality} />}
                            label="Calidad Gps"
                        />

                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="lowGps"
                            value={lowGpsQuality}
                            onChange={e => {
                                const value = e.target.value;
                                setLowGpsQuality(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setLowGpsQuality(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="mediumGps"
                                value={medGpsQuality}
                            onChange={e => {
                                const value = e.target.value;
                                setMedGpsQuality(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setMedGpsQuality(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="highGps"
                            value={highGpsQuality}
                            onChange={e => {
                                const value = e.target.value;
                                setHighGpsQuality(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setHighGpsQuality(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />


                        <FormControlLabel
                            control={<Switch checked={filterFuel} onChange={toggleFilterFuel} />}
                            label="Combustible"
                        />


                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="lowFuel"
                            value={lowFuel}
                            onChange={e => {
                                const value = e.target.value;
                                setLowFuel(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setLowFuel(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="mediumFuel"
                            value={medFuel}
                            onChange={e => {
                                const value = e.target.value;
                                setMedFuel(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setMedFuel(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="highFuel"
                            value={highFuel}
                            onChange={e => {
                                const value = e.target.value;
                                setHighFuel(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setHighFuel(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />


                        <FormControlLabel
                            control={<Switch checked={filterRpm} onChange={toggleFilterRpm} />}
                            label="RPM"
                        />


                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="lowRPM"
                            value={lowRpm}
                            onChange={e => {
                                const value = e.target.value;
                                setLowRpm(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setLowRpm(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="mediumRPM"
                            value={medRpm}
                            onChange={e => {
                                const value = e.target.value;
                                setMedRpm(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setMedRpm(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="highRPM"
                            value={highRpm}
                            onChange={e => {
                                const value = e.target.value;
                                setHighRpm(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setHighRpm(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />


                        <FormControlLabel
                            control={<Switch checked={filterCutterBase} onChange={toggleFilterCutterBase} />}
                                label="Presión de cortador base (Bar)"
                        />


                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="lowCutterBase"
                            value={lowCutterBase}
                            onChange={e => {
                                const value = e.target.value;
                                setLowCutterBase(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setLowCutterBase(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="mediumCutterBase"
                            value={medCutterBase}
                            onChange={e => {
                                const value = e.target.value;
                                setMedCutterBase(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setMedCutterBase(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="highCutterBase"
                            value={highCutterBase}
                            onChange={e => {
                                const value = e.target.value;
                                setHighCutterBase(value === '' ? '' : Number(value));
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                setHighCutterBase(value === '' ? 0 : Math.max(0, Number(value)));
                            }}
                            margin="normal"
                        />

                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeFilterDialog} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MapComponent;
