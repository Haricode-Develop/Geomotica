import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { FaFilter } from 'react-icons/fa';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField } from '@mui/material';
import './mapeoStyle.css';
import { API_BASE_URL } from "../../utils/config";
import Slider from '@mui/material/Slider';
import Draggable from 'react-draggable';

const { BaseLayer } = LayersControl;

const MapComponent = () => {
    const [points, setPoints] = useState([]);
    const [filteredPoints, setFilteredPoints] = useState([]); // Estado para almacenar los puntos filtrados
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [filterAutoPilot, setFilterAutoPilot] = useState(false);

    const [lowSpeed, setLowSpeed] = useState(-1);  // Inicializa como número
    const [medSpeed, setMedSpeed] = useState(-1);  // Inicializa como número
    const [highSpeed, setHighSpeed] = useState(-1); // Inicializa como número

    const [gpsQuality, setGpsQuality] = useState(0);

    const [fuel, setFuel] = useState(0);
    const [cutterBase, setCutterBase] = useState(0);
    const [rpm, setRpm] = useState(0);
    const [zoom, setZoom] = useState(2);


    const [filterSpeed, setFilterSpeed] = useState(false);
    const [filterGpsQuality, setFilterGpsQuality] = useState(false);
    const [filterFuel, setFilterFuel] = useState(false);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

    const [mapKey, setMapKey] = useState(Date.now()); // Estado para la clave única del mapa
    const workerRef = useRef(null);
    const openFilterDialog = () => setIsFilterDialogOpen(true);
    const closeFilterDialog = () => setIsFilterDialogOpen(false);
    useEffect(() => {
        workerRef.current = new Worker('dataWorker.js');

        workerRef.current.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                if (e.data.data && e.data.data.length > 0) {
                    setPoints(e.data.data);
                    setFilteredPoints(e.data.data); // Inicializamos los puntos filtrados

                    const polygon = L.polygon(e.data.data.map(point => {
                        const [longitude, latitude] = point.geometry.coordinates;
                        return [longitude, latitude];
                    }));

                    const center = polygon.getBounds().getCenter();
                    setMapCenter([center.lat, center.lng]);
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
    const toggleFilterSpeed = () => {
        if(lowSpeed !== -1 && medSpeed !== -1 && highSpeed !== -1){
            setFilterSpeed(current => !current);
            setZoom(7);
            setMapKey(Date.now());
        }
    };

    const toggleFilterGpsQuality = () => {
        setFilterGpsQuality(current => !current);
        setZoom(7);
        setMapKey(Date.now());
    };

    const toggleFilterFuel = () => {
        setFilterFuel(current => !current);
        setZoom(7);
        setMapKey(Date.now());
    }

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

    useEffect(() => {
        if (filterGpsQuality) {
            setFilteredPoints(points.filter(point => {
                const quality = point.properties.calidad_senal; // Asegúrate de que 'calidad_gps' es la propiedad correcta
                return quality <= gpsQuality;
            }));
        } else {
            setFilteredPoints(points);
        }
    }, [filterGpsQuality, gpsQuality, points]);


    useEffect(() => {
        if (filterFuel) {
            setFilteredPoints(points.filter(point => {
                const quality = point.properties.consumo_combustible; // Asegúrate de que 'combustible' es la propiedad correcta
                return quality <= fuel;
            }));
        } else {
            setFilteredPoints(points);
        }
    }, [filterFuel, fuel, points]);

    useEffect(() => {
        if (filterAutoPilot) {
            // Aplicar el filtro solo cuando esté activo
            setFilteredPoints(points); // Muestra todos los puntos pero con colores condicionales
        } else {
            // Sin filtro, todos los puntos son azules
            setFilteredPoints(points);
        }
    }, [filterAutoPilot, points]);


    const PaperComponent = (props) => {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <div {...props} />
            </Draggable>
        );
    };

    function choseColor(val, filtro){
        if(filtro === "autoPilot"){
            if(val === 1){
                return "red";
            }else{
                return "blue";
            }

        }
        else if (filtro === "speed") {
            if (val <= lowSpeed) {
                return "blue";
            } else if (val > lowSpeed && val <= medSpeed) {
                return "green";
            } else {
                return "red";
            }
        }
    }

    const handleSliderChange = (name, newValue) => {
        switch (name) {
            case 'gpsQuality':
                setGpsQuality(newValue);
                break;
            case 'fuel':
                setFuel(newValue);
                break;
            case 'cutterBase':
                setCutterBase(newValue);
                break;
            case 'rpm':
                setRpm(newValue);
                break;
        }
    };
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
                            fillColor = choseColor(point.properties.piloto_automatico, "autoPilot");
                        }else if(filterSpeed){
                            fillColor = choseColor(point.properties.velocidad, "speed");
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
                        <p>Calidad GPS:</p>
                        <Slider
                            value={gpsQuality}
                            onChange={(e, newValue) => handleSliderChange('gpsQuality', newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                        />

                        <FormControlLabel
                            control={<Switch checked={filterFuel} onChange={toggleFilterFuel} />}
                            label="Combustible"
                        />
                        <p>Combustible:</p>

                        <Slider
                            value={fuel}
                            onChange={(e, newValue) => handleSliderChange('fuel', newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                        />

                        <p>Cortador Base: {cutterBase[0]} - {cutterBase[1]}</p>

                        <Slider
                            value={cutterBase}
                            onChange={(e, newValue) => handleSliderChange('cutterBase', newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                        />


                        <p>RPM: {rpm[0]} - {rpm[1]}</p>

                        <Slider
                            value={rpm}
                            onChange={(e, newValue) => handleSliderChange('rpm', newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
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
