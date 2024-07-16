import React, { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { FaMap } from 'react-icons/fa';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField, Tooltip } from '@mui/material';
import './mapeoStyle.css';
import { API_BASE_URL } from "../../utils/config";
import * as turf from '@turf/turf';
import BarIndicator from "../../components/BarIndicator/BarIndicator";
import { toast } from 'react-toastify';
import Slider from '@mui/material/Slider';
import Draggable from 'react-draggable';
import CommonMap from '../../components/CommonMap/CommonMap';

const MapComponent = ({ onAreaCalculated, percentageAutoPilot, progressFinish, idAnalisis, tipoAnalisis }) => {
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
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [mapKey, setMapKey] = useState(Date.now());
    const workerRef = useRef(null);
    const mapRef = useRef(null);

    const lowSpeedRef = useRef(null);
    const medSpeedRef = useRef(null);
    const highSpeedRef = useRef(null);
    const lowGpsQualityRef = useRef(null);
    const medGpsQualityRef = useRef(null);
    const highGpsQualityRef = useRef(null);
    const lowFuelRef = useRef(null);
    const medFuelRef = useRef(null);
    const highFuelRef = useRef(null);
    const lowRpmRef = useRef(null);
    const medRpmRef = useRef(null);
    const highRpmRef = useRef(null);
    const lowCutterBaseRef = useRef(null);
    const medCutterBaseRef = useRef(null);
    const highCutterBaseRef = useRef(null);

    useEffect(() => {
        if (lowSpeedRef.current) lowSpeedRef.current.focus();
    }, [lowSpeed]);

    useEffect(() => {
        if (medSpeedRef.current) medSpeedRef.current.focus();
    }, [medSpeed]);

    useEffect(() => {
        if (highSpeedRef.current) highSpeedRef.current.focus();
    }, [highSpeed]);

    useEffect(() => {
        if (lowGpsQualityRef.current) lowGpsQualityRef.current.focus();
    }, [lowGpsQuality]);

    useEffect(() => {
        if (medGpsQualityRef.current) medGpsQualityRef.current.focus();
    }, [medGpsQuality]);

    useEffect(() => {
        if (highGpsQualityRef.current) highGpsQualityRef.current.focus();
    }, [highGpsQuality]);

    useEffect(() => {
        if (lowFuelRef.current) lowFuelRef.current.focus();
    }, [lowFuel]);

    useEffect(() => {
        if (medFuelRef.current) medFuelRef.current.focus();
    }, [medFuel]);

    useEffect(() => {
        if (highFuelRef.current) highFuelRef.current.focus();
    }, [highFuel]);

    useEffect(() => {
        if (lowRpmRef.current) lowRpmRef.current.focus();
    }, [lowRpm]);

    useEffect(() => {
        if (medRpmRef.current) medRpmRef.current.focus();
    }, [medRpm]);

    useEffect(() => {
        if (highRpmRef.current) highRpmRef.current.focus();
    }, [highRpm]);

    useEffect(() => {
        if (lowCutterBaseRef.current) lowCutterBaseRef.current.focus();
    }, [lowCutterBase]);

    useEffect(() => {
        if (medCutterBaseRef.current) medCutterBaseRef.current.focus();
    }, [medCutterBase]);

    useEffect(() => {
        if (highCutterBaseRef.current) highCutterBaseRef.current.focus();
    }, [highCutterBase]);

    const openFilterDialog = () => setIsFilterDialogOpen(true);
    const closeFilterDialog = () => setIsFilterDialogOpen(false);
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

    const manejarEnvioAlSalir = (e) => {
        const datosFormulario = JSON.parse(localStorage.getItem('formData'));
        if (datosFormulario) {
            enviarDatosFormulario(datosFormulario).then(() => { }).catch(error => {
                console.error('Error al enviar datos al salir', error);
            });
        }
    };

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

    useEffect(() => {
        const verificarYEnviarDatos = () => {
            if (
                (filterSpeed && lowSpeed !== -1 && medSpeed !== -1 && highSpeed !== -1) ||
                (filterGpsQuality && lowGpsQuality !== -1 && medGpsQuality !== -1 && highGpsQuality !== -1) ||
                (filterFuel && lowFuel !== -1 && medFuel !== -1 && highFuel !== -1) ||
                (filterRpm && lowRpm !== -1 && medRpm !== -1 && highRpm !== -1) ||
                (filterCutterBase && lowCutterBase !== -1 && medCutterBase !== -1 && highCutterBase !== -1) ||
                filterAutoPilot || filterAutoTracket || filterModeCutterBase
            ) {
                manejarEnvioAlSalir();
            }
        };

        verificarYEnviarDatos();
    }, [filterSpeed, lowSpeed, medSpeed, highSpeed, filterGpsQuality, lowGpsQuality, medGpsQuality, highGpsQuality, filterFuel, lowFuel, medFuel, highFuel, filterRpm, lowRpm, medRpm, highRpm, filterCutterBase, lowCutterBase, medCutterBase, highCutterBase, filterAutoPilot, filterAutoTracket, filterModeCutterBase]);

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

    const enviarDatosFormulario = async (datosFormulario) => {
        try {
            const response = await fetch(`${API_BASE_URL}dashboard/ultimosDatosIngresados`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosFormulario),
            });

            if (!response.ok) {
                throw new Error('Error al enviar los datos');
            }

            const resultado = await response.json();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
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
        if (!isAreaDataCalculated) return;
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

    const toggleFilter = () => {
        setFilterRpm(false);
        setFilterFuel(false);
        setFilterSpeed(false);
        setFilterCutterBase(false);
        setFilterGpsQuality(false);
        setFilterModeCutterBase(false);
        setFilterAutoTracket(false);

        setFilterAutoPilot(current => {
            const newValue = !current;
            setActiveFilter(newValue ? 'PILOTO_AUTOMATICO' : null);
            return newValue;
        });
        setFormData(prev => ({ ...prev, filterAutoPilot: !prev.filterAutoPilot }));
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

        setFilterAutoTracket(current => {
            const newValue = !current;
            setActiveFilter(newValue ? 'AUTO_TRACKET' : null);
            return newValue;
        });
        setFormData(prev => ({ ...prev, filterAutoTracket: !prev.filterAutoTracket }));
        setZoom(7);
        setMapKey(Date.now());
    };

    const toggleFilterModeCutterBase = () => {
        setFilterRpm(false);
        setFilterFuel(false);
        setFilterSpeed(false);
        setFilterCutterBase(false);
        setFilterGpsQuality(false);
        setFilterAutoPilot(false);
        setFilterAutoTracket(false);

        setFilterModeCutterBase(current => {
            const newValue = !current;
            setActiveFilter(newValue ? 'MODO_CORTE_BASE' : null);
            return newValue;
        });
        setFormData(prev => ({ ...prev, filterModeCutterBase: !prev.filterModeCutterBase }));
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

        if (lowSpeed !== -1 && medSpeed !== -1 && highSpeed !== -1) {
            setFilterSpeed(current => {
                const newValue = !current;
                setActiveFilter(newValue ? 'VELOCIDAD_Km_H' : null);
                return newValue;
            });
            setFormData(prev => ({
                ...prev,
                filterSpeed: !prev.filterSpeed,
                lowSpeed: lowSpeed,
                medSpeed: medSpeed,
                highSpeed: highSpeed
            }));
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

        if (lowGpsQuality !== -1 && medGpsQuality !== -1 && highGpsQuality !== -1) {
            setFilterGpsQuality(current => {
                const newValue = !current;
                setActiveFilter(newValue ? 'CALIDAD_DE_SENAL' : null);
                return newValue;
            });
            setFormData(prev => ({
                ...prev,
                filterGpsQuality: !prev.filterGpsQuality,
                lowGpsQuality: lowGpsQuality,
                medGpsQuality: medGpsQuality,
                highGpsQuality: highGpsQuality
            }));
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
            setFilterFuel(current => {
                const newValue = !current;
                setActiveFilter(newValue ? 'CONSUMOS_DE_COMBUSTIBLE' : null);
                return newValue;
            });
            setFormData(prev => ({
                ...prev,
                filterFuel: !prev.filterFuel,
                lowFuel: lowFuel,
                medFuel: medFuel,
                highFuel: highFuel
            }));
            setZoom(7);
            setMapKey(Date.now());
        }
    };

    const toggleFilterRpm = () => {
        setFilterCutterBase(false);
        setFilterAutoPilot(false);
        setFilterAutoTracket(false);
        setFilterSpeed(false);
        setFilterModeCutterBase(false);
        setFilterGpsQuality(false);
        setFilterFuel(false);

        if (lowRpm !== -1 && medRpm !== -1 && highRpm !== -1) {
            setFilterRpm(current => {
                const newValue = !current;
                setActiveFilter(newValue ? 'RPM' : null);
                return newValue;
            });
            setFormData(prev => ({
                ...prev,
                filterRpm: !prev.filterRpm,
                lowRpm: lowRpm,
                medRpm: medRpm,
                highRpm: highRpm
            }));
            setZoom(7);
            setMapKey(Date.now());
        }
    };

    const toggleFilterCutterBase = () => {
        setFilterAutoPilot(false);
        setFilterAutoTracket(false);
        setFilterSpeed(false);
        setFilterModeCutterBase(false);
        setFilterGpsQuality(false);
        setFilterFuel(false);
        setFilterRpm(false);

        if (lowCutterBase !== -1 && medCutterBase !== -1 && highCutterBase !== -1) {
            setFilterCutterBase(current => {
                const newValue = !current;
                setActiveFilter(newValue ? 'PRESION_DE_CORTADOR_BASE' : null);
                return newValue;
            });
            setFormData(prev => ({
                ...prev,
                filterCutterBase: !prev.filterCutterBase,
                lowCutterBase: lowCutterBase,
                medCutterBase: medCutterBase,
                highCutterBase: highCutterBase
            }));
            setZoom(7);
            setMapKey(Date.now());
        }
    };

    useEffect(() => {
        const applyFilter = () => {
            if (filterSpeed) {
                setFilteredPoints(points.filter(point => {
                    const speed = point.properties.VELOCIDAD_Km_H;
                    return speed >= lowSpeed && speed <= highSpeed;
                }));
            } else if (filterGpsQuality) {
                setFilteredPoints(points.filter(point => {
                    const quality = point.properties.CALIDAD_DE_SENAL;
                    return quality >= lowGpsQuality && quality <= highGpsQuality;
                }));
            } else if (filterFuel) {
                setFilteredPoints(points.filter(point => {
                    const fuel = point.properties.CONSUMOS_DE_COMBUSTIBLE;
                    return fuel >= lowFuel && fuel <= highFuel;
                }));
            } else if (filterRpm) {
                setFilteredPoints(points.filter(point => {
                    const rpm = point.properties.RPM;
                    return rpm >= lowRpm && rpm <= highRpm;
                }));
            } else if (filterCutterBase) {
                setFilteredPoints(points.filter(point => {
                    const cutterBase = point.properties.PRESION_DE_CORTADOR_BASE;
                    return cutterBase >= lowCutterBase && cutterBase <= highCutterBase;
                }));
            } else {
                setFilteredPoints(points);
            }
        };

        applyFilter();
    }, [filterAutoPilot, filterAutoTracket, filterSpeed, filterGpsQuality, filterFuel, filterRpm, filterCutterBase, filterModeCutterBase, points]);

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

    function chooseColor(val, filter) {
        const ranges = {
            speed: [lowSpeed, medSpeed],
            gpsQuality: [lowGpsQuality, medGpsQuality],
            fuel: [lowFuel, medFuel],
            rpm: [lowRpm, medRpm],
            cutterBase: [lowCutterBase, medCutterBase],
        };

        if (filter === "autoTracket") {
            if (val !== '0' && val !== '1') {
                return val.toLowerCase().trim() === 'engaged' ? "green" : "blue";
            } else {
                return val === '0' ? "blue" : "red";
            }
        }
        if (filter === "autoPilot" || filter === "modeCutterBase") {
            if (val !== '0' && val !== '1') {
                return val.toLowerCase().trim() === 'automatic' ? "green" : "blue";
            } else {
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

    return (
        <>
            {availableFilters.speed && filterSpeed && (
                <BarIndicator filterType="speed" low={lowSpeed} medium={medSpeed} high={highSpeed} />
            )}
            {availableFilters.gpsQuality && filterGpsQuality && (
                <BarIndicator filterType="gpsQuality" low={lowGpsQuality} medium={medGpsQuality} high={highGpsQuality} />
            )}
            {availableFilters.fuel && filterFuel && (
                <BarIndicator filterType="fuel" low={lowFuel} medium={medFuel} high={highFuel} />
            )}
            {availableFilters.rpm && filterRpm && (
                <BarIndicator filterType="rpm" low={lowRpm} medium={medRpm} high={highRpm} />
            )}
            {availableFilters.cutterBase && filterCutterBase && (
                <BarIndicator filterType="cutterBase" low={lowCutterBase} medium={medCutterBase} high={highCutterBase} />
            )}
            {availableFilters.autoPilot && filterAutoPilot && (
                <BarIndicator filterType="autoPilot" low={0} medium={0} high={1} />
            )}
            {availableFilters.autoTracket && filterAutoTracket && (
                <BarIndicator filterType="autoTracket" low={0} medium={0} high={1} />
            )}
            {availableFilters.modeCutterBase && filterModeCutterBase && (
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
                    CALIDAD_DE_SENAL: { low: lowGpsQuality, medium: medGpsQuality, highGpsQuality },
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
            />

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
                PaperComponent={PaperComponent}
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Generar Mapas
                </DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {availableFilters.autoPilot && (
                            <FormControlLabel
                                control={<Switch checked={filterAutoPilot} onChange={toggleFilter} />}
                                label="Piloto Automático"
                            />
                        )}
                        {availableFilters.autoTracket && (
                            <FormControlLabel
                                control={<Switch checked={filterAutoTracket} onChange={toggleFilterAutoTracket} />}
                                label="Auto Tracket"
                            />
                        )}
                        {availableFilters.modeCutterBase && (
                            <FormControlLabel
                                control={<Switch checked={filterModeCutterBase} onChange={toggleFilterModeCutterBase} />}
                                label="Modo corte base"
                            />
                        )}
                        {availableFilters.speed && (
                            <>
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
                                    inputRef={lowSpeedRef}
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
                                    inputRef={medSpeedRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setMedSpeed(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                                <TextField
                                    label="Alto"
                                    variant="outlined"
                                    type="number"
                                    name="high"
                                    value={highSpeed}
                                    inputRef={highSpeedRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setHighSpeed(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                            </>
                        )}
                        {availableFilters.gpsQuality && (
                            <>
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
                                    inputRef={lowGpsQualityRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setLowGpsQuality(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                                <TextField
                                    label="Medio"
                                    variant="outlined"
                                    type="number"
                                    name="mediumGps"
                                    value={medGpsQuality}
                                    inputRef={medGpsQualityRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setMedGpsQuality(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                                <TextField
                                    label="Alto"
                                    variant="outlined"
                                    type="number"
                                    name="highGps"
                                    value={highGpsQuality}
                                    inputRef={highGpsQualityRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setHighGpsQuality(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                            </>
                        )}
                        {availableFilters.fuel && (
                            <>
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
                                    inputRef={lowFuelRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setLowFuel(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                                <TextField
                                    label="Medio"
                                    variant="outlined"
                                    type="number"
                                    name="mediumFuel"
                                    value={medFuel}
                                    inputRef={medFuelRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setMedFuel(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                                <TextField
                                    label="Alto"
                                    variant="outlined"
                                    type="number"
                                    name="highFuel"
                                    value={highFuel}
                                    inputRef={highFuelRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setHighFuel(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                            </>
                        )}
                        {availableFilters.rpm && (
                            <>
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
                                    inputRef={lowRpmRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setLowRpm(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                                <TextField
                                    label="Medio"
                                    variant="outlined"
                                    type="number"
                                    name="mediumRPM"
                                    value={medRpm}
                                    inputRef={medRpmRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setMedRpm(value === '' ? '' : Math.max(0, Number(value)));
                                    }}
                                    margin="normal"
                                />
                                <TextField
                                    label="Alto"
                                    variant="outlined"
                                    type="number"
                                    name="highRPM"
                                    value={highRpm}
                                    inputRef={highRpmRef}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setHighRpm(value === '' ? '' : Number(value));
                                    }}
                                    margin="normal"
                                />
                            </>
                        )}
                        {availableFilters.cutterBase && (
                            <>
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
                                    inputRef={lowCutterBaseRef}
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
                                    inputRef={medCutterBaseRef}
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
                                    inputRef={highCutterBaseRef}
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
                            </>
                        )}
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