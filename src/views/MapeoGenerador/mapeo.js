import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, LayersControl, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { FaFilter } from 'react-icons/fa';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField } from '@mui/material';
import './mapeoStyle.css';
import { API_BASE_URL } from "../../utils/config";
import * as turf from '@turf/turf';
import BarIndicator from "../../components/BarIndicator/BarIndicator";
import Slider from '@mui/material/Slider';
import Draggable from 'react-draggable';

const { BaseLayer } = LayersControl;

const MapComponent = ({ csvData, zipFile, onAreaCalculated, percentageAutoPilot }) => {
    const [hullPolygon, setHullPolygon] = useState(null); // Estado para almacenar el polígono convex hull

    const [pilotAutoPercentage, setPilotAutoPercentage] = useState(0);

    const [autoTracketPercentage, setAutoTracketPercentage] = useState(0);

    const [points, setPoints] = useState([]);
    const [filteredPoints, setFilteredPoints] = useState([]); // Estado para almacenar los puntos filtrados
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [filterAutoPilot, setFilterAutoPilot] = useState(false);
    const [filterAutoTracket, setFilterAutoTracket] = useState(false);

    // Filtros de velocidad
    const [lowSpeed, setLowSpeed] = useState(-1);
    const [medSpeed, setMedSpeed] = useState(-1);
    const [highSpeed, setHighSpeed] = useState(-1);

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


    const [zoom, setZoom] = useState(2);


    const [filterSpeed, setFilterSpeed] = useState(false);
    const [filterGpsQuality, setFilterGpsQuality] = useState(false);
    const [filterFuel, setFilterFuel] = useState(false);
    const [filterRpm, setFilterRpm] = useState(false);
    const [filterCutterBase, setFilterCutterBase] = useState(false);


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

    const [percentage, setPercentage] = useState({
        autoTracket: null,
        autoPilot: null,
        totalEfficiency: null
    });


    const MapEffect = () => {
        const map = useMap();

        useEffect(() => {
            if (filteredPoints.length === 0) return;

            const latLngs = filteredPoints.map(point => {
                const coordinates = point.geometry.coordinates;
                return L.latLng(coordinates[1], coordinates[0]);
            });

            const bounds = latLngs.length > 0 ? L.latLngBounds(latLngs) : null;
            if (bounds) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }, [filteredPoints, map]);

        return null;
    };
    useEffect(() => {
        const calculateArea = (polygon) => {
            // Crear un polígono en el formato que Turf espera
            const turfPolygon = turf.polygon([polygon]);
            // Calcular el área del polígono en metros cuadrados
            const areaInSquareMeters = turf.area(turfPolygon);
            // Convertir el área a hectáreas (1 hectárea = 10,000 metros cuadrados)
            return areaInSquareMeters / 10000;
        };

        if (polygon.length > 0 && outsidePolygon.length > 0) {
            // Transformar las coordenadas para Turf
            const turfPolygonCoords = transformPolygonCoords(polygon).flat();
            const turfOutsidePolygonCoords = transformPolygonCoords(outsidePolygon).flat();

            // Calcular las áreas en hectáreas
            const polygonArea = calculateArea(turfPolygonCoords);
            const outsidePolygonArea = calculateArea(turfOutsidePolygonCoords);

            // Calcular la diferencia de área en hectáreas
            const areaDifference = Math.abs(polygonArea - outsidePolygonArea);

            setAreaData({
                polygonArea,
                outsidePolygonArea,
                areaDifference
            });
            setIsAreaDataCalculated(true);

            if (onAreaCalculated) {
                onAreaCalculated(polygonArea, outsidePolygonArea, areaDifference);
            }

        }
    }, [polygon, outsidePolygon]);

    useEffect(() => {
        workerRef.current = new Worker('dataWorker.js');

        workerRef.current.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                const { points: newPoints, polygon: newPolygon, outsidePolygon: newOutsidePolygon } = e.data.data;

                setPoints(newPoints);
                setPolygon(newPolygon);
                setOutsidePolygon(newOutsidePolygon);
                if (Array.isArray(newPolygon) && newPolygon.length > 0) {
                    const polygonLatLngs = newPolygon.map(([lng, lat], index) => {
                        if (typeof lat === 'number' && typeof lng === 'number') {
                            return L.latLng(lat, lng);
                        } else {
                            console.error('Coordenada no válida en el polígono', lat, lng);
                            return null;
                        }
                    }).filter(coord => coord !== null);

                    // Solo procede si hay coordenadas válidas
                    if (polygonLatLngs.length > 0) {
                        try {
                            const polygonBounds = L.latLngBounds(polygonLatLngs);
                            const center = polygonBounds.getCenter();

                            if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
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
                workerRef.current.postMessage({ action: 'processGeoJsonData', geojsonData });
            }
        });

        return () => {
            workerRef.current.terminate();
            socket.off('updateGeoJSONLayer');
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

        let totalEfficiency = areaData.outsidePolygonArea / convertTimeToDecimalHours(tiempoTotal) ;

        const calculatedPilotAutoPercentaje = totalPoints > 0 ? (pilotAutoPoints / totalPoints) * 100 : 0;
        const calculatedAutoTracketPercentaje = totalPoints > 0 ? (autoTracketPoints / totalPoints) * 100 : 0;
        const calculatedModoCortadorBasePercentaje = totalPoints > 0 ? (modoCorteBase / totalPoints) * 100 : 0;
        console.log("ESTE ES EL CALCULO DE PORCENTAJE DE PILOTO: " + calculatedPilotAutoPercentaje);
        console.log("ESTE ES EL CALCULO DE PORCENTAJE DE CORTADOR BASE: " + calculatedModoCortadorBasePercentaje);
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


    const toggleFilter = () => {
        setFilterAutoPilot(current => !current);
        setZoom(7);
        setMapKey(Date.now());
    };
    const toggleFilterAutoTracket = () => {
        setFilterAutoTracket(current => !current);
        setZoom(7);
        setMapKey(Date.now());
    };

    const toggleFilterSpeed = () => {
        if(lowSpeed !== -1 && medSpeed !== -1 && highSpeed !== -1){
            setFilterSpeed(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }
    };

    const toggleFilterGpsQuality = () => {
        if(lowGpsQuality !== -1 && medGpsQuality !== -1 && highGpsQuality !== -1){
            setFilterGpsQuality(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }

    };

    const toggleFilterFuel = () => {
        if (lowFuel !== -1 && medFuel !== -1 && highFuel !== -1) {
            setFilterFuel(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }

    }

    const toggleFilterRpm = () => {
        if (lowRpm !== -1 && medRpm !== -1 && highRpm !== -1) {
            setFilterRpm(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }
    }


    const toggleFilterCutterBase = () => {
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
        if(filter === "autoPilot" ){
            if(val !== '0' && val !== '1'){
                return val.toLowerCase().trim() === 'automatic' ? "blue" : "green";

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

            <div className="floating-filter-button">
                <Button variant="contained" color="primary" onClick={openFilterDialog}>
                    <FaFilter />
                </Button>
            </div>

            <MapContainer key={mapKey} center={mapCenter} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
                <MapEffect />
                <LayersControl position="topright">
                    <BaseLayer checked name="Satellite View">
                        <TileLayer
                            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
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
                        }else{
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
                                weight={1}
                                opacity={1}
                                fillOpacity={0.8}
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

                    {outsidePolygon.length > 0 && (
                        <Polygon
                            positions={transformPolygonCoords(outsidePolygon)}
                            color="red"
                        />
                    )}


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
                    Filtros de Mapa
                </DialogTitle>
                <DialogContent>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={filterAutoPilot} onChange={toggleFilter} />}
                            label="Piloto Automático"
                        />

                        <FormControlLabel
                            control={<Switch checked={filterAutoTracket} onChange={toggleFilterAutoTracket} />}
                            label="AutoTracket"
                        />


                        <FormControlLabel
                            control={<Switch checked={filterSpeed} onChange={toggleFilterSpeed} />}
                            label="Filtrar por Velocidad"
                        />
                        <TextField
                            label="Velocidad Baja Máxima"
                            variant="outlined"
                            type="number"
                            name="low"
                            value={lowSpeed}
                            onChange={e => setLowSpeed(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Velocidad Media Máxima"
                            variant="outlined"
                            type="number"
                            name="medium"
                            value={medSpeed}
                            onChange={e => setMedSpeed(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Velocidad Alta Mínima"
                            variant="outlined"
                            type="number"
                            name="high"
                            value={highSpeed}
                            onChange={e => setHighSpeed(Number(e.target.value))}
                            margin="normal"
                        />

                        <FormControlLabel
                            control={<Switch checked={filterGpsQuality} onChange={toggleFilterGpsQuality} />}
                            label="Filtrar Calidad Gps"
                        />

                        <TextField
                            label="Señal Gps Baja Máxima"
                            variant="outlined"
                            type="number"
                            name="lowGps"
                            value={lowGpsQuality}
                            onChange={e => setLowGpsQuality(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Señal Gps Media Máxima"
                            variant="outlined"
                            type="number"
                            name="mediumGps"
                                value={medGpsQuality}
                            onChange={e => setMedGpsQuality(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Señal Gps Alta Mínima"
                            variant="outlined"
                            type="number"
                            name="highGps"
                            value={highGpsQuality}
                            onChange={e => setHighGpsQuality(Number(e.target.value))}
                            margin="normal"
                        />


                        <FormControlLabel
                            control={<Switch checked={filterFuel} onChange={toggleFilterFuel} />}
                            label="Combustible"
                        />


                        <TextField
                            label="Combustible Bajo Máxima"
                            variant="outlined"
                            type="number"
                            name="lowFuel"
                            value={lowFuel}
                            onChange={e => setLowFuel(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Combustible Medio Máxima"
                            variant="outlined"
                            type="number"
                            name="mediumFuel"
                            value={medFuel}
                            onChange={e => setMedFuel(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Combustible Alto Mínima"
                            variant="outlined"
                            type="number"
                            name="highFuel"
                            value={highFuel}
                            onChange={e => setHighFuel(Number(e.target.value))}
                            margin="normal"
                        />


                        <FormControlLabel
                            control={<Switch checked={filterRpm} onChange={toggleFilterRpm} />}
                            label="RPM"
                        />


                        <TextField
                            label="RPM Bajo Máxima"
                            variant="outlined"
                            type="number"
                            name="lowRPM"
                            value={lowRpm}
                            onChange={e => setLowRpm(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="RPM Medio Máxima"
                            variant="outlined"
                            type="number"
                            name="mediumRPM"
                            value={medRpm}
                            onChange={e => setMedRpm(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="RPM Alto Mínima"
                            variant="outlined"
                            type="number"
                            name="highRPM"
                            value={highRpm}
                            onChange={e => setHighRpm(Number(e.target.value))}
                            margin="normal"
                        />


                        <FormControlLabel
                            control={<Switch checked={filterCutterBase} onChange={toggleFilterCutterBase} />}
                                label="Cortador Base"
                        />


                        <TextField
                            label="Cortador Base Bajo Máxima"
                            variant="outlined"
                            type="number"
                            name="lowCutterBase"
                            value={lowCutterBase}
                            onChange={e => setLowCutterBase(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Cortador Base Medio Máxima"
                            variant="outlined"
                            type="number"
                            name="mediumCutterBase"
                            value={medCutterBase}
                            onChange={e => setMedCutterBase(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Cortador Base Alto Mínima"
                            variant="outlined"
                            type="number"
                            name="highCutterBase"
                            value={highCutterBase}
                            onChange={e => setHighCutterBase(Number(e.target.value))}
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
