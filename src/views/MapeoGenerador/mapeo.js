import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, LayersControl, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { FaFilter } from 'react-icons/fa';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField } from '@mui/material';
import './mapeoStyle.css';
import { API_BASE_URL } from "../../utils/config";
import * as turf from '@turf/turf';

import Slider from '@mui/material/Slider';
import Draggable from 'react-draggable';

const { BaseLayer } = LayersControl;

const MapComponent = () => {
    const [polygonGeoJSON, setPolygonGeoJSON] = useState(null); // Estado para almacenar el GeoJSON del polígono
    const [hullPolygon, setHullPolygon] = useState(null); // Estado para almacenar el polígono convex hull

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
    useEffect(() => {
        workerRef.current = new Worker('dataWorker.js');

        workerRef.current.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                const { points: newPoints, polygon: newPolygon } = e.data.data;
                setPoints(newPoints);  // Actualiza el estado de los puntos
                setPolygon(newPolygon); // Actualiza el estado del polígono
                console.log("ESTOY AFUERA DEL IF DEL POLIGONO:");
                if (newPolygon.length > 0) {
                    console.log("ENTRE AL IF DEL POLIGONO:");
                    const polygonLatLngs = newPolygon.map(([lng, lat]) => [lat,lng]);
                    console.log("ESTAS SON LAS COORDENADAS DEL POLIGONO: ", polygonLatLngs);
                    const polygonBounds = L.latLngBounds(polygonLatLngs);
                    console.log("ESTOS SON LOS LIMITES DEL POLIGONO: ", polygonBounds);
                    setMapCenter(polygonBounds.getCenter());
                    setZoom(7);
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
                const speed = point.properties.velocidad;
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
                const quality = point.properties.calidad_senal;
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
                const fuel = point.properties.consumo_combustible;
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
                const rpm = point.properties.rpm;
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
                const cutterBase = point.properties.presion_cortador;
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
            const pointsForHull = turf.points(filteredPoints.map(point => point.geometry.coordinates));
            const hull = turf.convex(pointsForHull);
            if (hull) {
                setHullPolygon(hull.geometry.coordinates[0].map(coord => [coord[1], coord[0]]));
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

            return val === '0' ? "blue" : "red";
        }
        if(filter === "autoPilot" ){
            return val === 1 ? "red" : "blue";
        }

        if (ranges[filter]) {

            return getColorFromRange(val, ranges[filter]);
        }

        return "blue";
    }

    function getColorFromRange(val, [low, med]) {
        if (val <= low) {
            return "blue";
        } else if (val <= med) {
            return "green";
        } else {
            return "red";
        }
    }





    return (
        <>

            <div className="floating-filter-button">
                <Button variant="contained" color="primary" onClick={openFilterDialog}>
                    <FaFilter />
                </Button>
            </div>

            <MapContainer key={mapKey} center={mapCenter} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
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
                        let fillColor;
                        if(filterAutoPilot){
                            fillColor = chooseColor(point.properties.piloto_automatico, "autoPilot");
                        }else if(filterAutoTracket){
                            fillColor = chooseColor(point.properties.auto_tracket, "autoTracket");
                        }else if(filterSpeed){
                            fillColor = chooseColor(point.properties.velocidad, "speed");
                        }else if(filterGpsQuality){
                            fillColor = chooseColor(point.properties.calidad_senal, "gpsQuality");
                        }else if(filterFuel){
                            fillColor = chooseColor(point.properties.consumo_combustible, "fuel");
                        }else if (filterRpm) {
                            fillColor = chooseColor(point.properties.rpm, "rpm");
                        }else if (filterCutterBase) {
                            fillColor = chooseColor(point.properties.presion_cortador, "cutterBase");
                        }else{
                            fillColor = "blue";
                        }

                        return (
                            <CircleMarker
                                key={idx}
                                center={[coordinates[0], coordinates[1]]}
                                radius={5}
                                fillColor={fillColor}
                                color={fillColor}
                                weight={1}
                                opacity={1}
                                fillOpacity={0.8}
                            />
                        );
                    })}

                    {hullPolygon && (
                        <Polygon positions={hullPolygon} color="purple" />
                    )}
                </LayersControl>
                {polygon.length > 0 && (
                    <Polygon positions={polygon} color="purple" />
                )}
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
