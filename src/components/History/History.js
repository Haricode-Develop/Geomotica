// MyTimeline.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './HistoryStyle.css';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from "../../utils/config";
import Modal from "../Modal/Modal";

const MyTimeline = () => {
    const [events, setEvents] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [currentGeoJson, setCurrentGeoJson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIdAnalisis, setSelectedIdAnalisis] = useState(null); // Estado para mantener el idAnalisis seleccionado
    const mapRef = useRef(null);
    const [mapKey, setMapKey] = useState(0); // Añade un estado para controlar la clave del mapa
    const geoJsonLayerRef = useRef(null);
    const [selectedLegend, setSelectedLegend] = useState("Velocidad"); // Nuevo estado para manejar la leyenda seleccionada

    const onEachFeature = (feature, layer) => {
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    };
    const geoJsonStyle = () => {
        return {
            color: "#33ff86",
            weight: 0.5,
            fillColor: "#ff5733",
            fillOpacity: 0.5,
        };
    };

    useEffect(() => {
        if (selectedIdAnalisis) {
            obtenerGeoJsonVariable("Velocidad", selectedIdAnalisis);
        }
    }, [selectedIdAnalisis]);

    // Modificar Legend para usar selectedIdAnalisis
    const Legend = ({ idAnalisis }) => (
        <div className="leyenda-container">
            {["Velocidad", "Piloto Automatico Num", "Calidad De Senal", "Consumos De Combustible", "Auto tracket Num", "RPM", "Presion De Cortador Base", "Modo Corte Base Num"].map(variable => (
                <div
                    key={variable}
                    className={`leyenda-item ${selectedLegend === variable ? "selected" : ""}`}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", variable)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => obtenerGeoJsonVariable(variable, idAnalisis)}
                >
                    {variable}
                </div>
            ))}
        </div>
    );


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log("ID USUARIO: " + userData.ID_USUARIO);

                const response = await axios.get(`${API_BASE_URL}historial/historialAnalisis?idUsuario=${userData.ID_USUARIO}`);
                setEvents(response.data.idsAnalisis.map(event => ({
                    ...event,
                    date: new Date(event.FECHA_CREACION).toLocaleString(),
                    activity: event.TIPO_ANALISIS,
                    farm: event.NOMBRES_FINCA
                })));
            } catch (error) {
                console.error("Error al obtener los eventos", error);
            }
        };
        fetchEvents();
    }, [userData.ID_USUARIO]);

    const [searchDate, setSearchDate] = useState('');
    const [searchActivity, setSearchActivity] = useState('');
    const [searchFarm, setSearchFarm] = useState('');
    const handleDateChange = (e) => setSearchDate(e.target.value);
    const handleActivityChange = (e) => setSearchActivity(e.target.value);
    const handleFarmChange = (e) => setSearchFarm(e.target.value);

    const filteredEvents = events.filter(event => {
        return event.date.includes(searchDate) &&
            (event.activity?.toLowerCase().includes(searchActivity.toLowerCase()) || searchActivity === '') &&
            (event.farm?.toLowerCase().includes(searchFarm.toLowerCase()) || searchFarm === '');
    });
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedIdAnalisis(null);
    };

    const handleMapLoaded = (map) => {
        mapRef.current = map;
        if (currentGeoJson) {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    };

    const obtenerGeoJSON = async (nombreAnalisis, idAnalisis) => {
        setSelectedIdAnalisis(idAnalisis);
        try {

            let nombreFormatoBackend = nombreAnalisis.replace(/\s+/g, '_').toUpperCase();

            const url = `${API_BASE_URL}historial/geojson/${nombreFormatoBackend}/${idAnalisis}`;
            const response = await axios.get(url);

            setCurrentGeoJson(response.data);
            setIsModalOpen(true);
            setMapKey(prevKey => prevKey + 1);

            setTimeout(() => {
                if (mapRef.current) {
                    mapRef.current.leafletElement.invalidateSize();
                }
            }, 100);
        } catch (error) {
            console.error("Error al obtener el GeoJSON", error);
        }
    };

    const obtenerGeoJsonVariable = async (variable, idAnalisis) => {
        setSelectedLegend(variable);
        try {
            let nombreFormatoBackend = variable.replace(/\s+/g, '_').toUpperCase();
            if(variable === 'Velocidad'){
                nombreFormatoBackend += "_Km_H";
            }
            let url = `${API_BASE_URL}historial/geojson/${nombreFormatoBackend}/${idAnalisis}`;
            const response = await axios.get(url);
            setCurrentGeoJson(response.data);
            setMapKey(prevKey => prevKey + 1);

        } catch (error) {
            console.error("Error al obtener el GeoJSON", error);
        }
    }

    const renderMap = () => {
        if (!currentGeoJson) return null;
        const geoJson = L.geoJSON(currentGeoJson);
        const bounds = geoJson.getBounds();
        const center = bounds.getCenter();
        return (
            <div className="map-container">
                <MapContainer
                    key={mapKey}
                    center={[center.lat, center.lng]}
                    zoom={17}
                    style={{ height: '100%', width: '100%' }}
                    whenCreated={handleMapLoaded}
                >
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
                    />
                    <GeoJSON
                        data={currentGeoJson}
                        style={geoJsonStyle}
                        onEachFeature={onEachFeature}
                        pointToLayer={(feature, latlng) => {
                            return L.circleMarker(latlng, {
                                radius: 5,
                                fillColor: "#ff7800",
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        }}
                        ref={geoJsonLayerRef}
                    />
                </MapContainer>
                {/* Pasar idAnalisis seleccionado a Legend */}
                <Legend idAnalisis={selectedIdAnalisis} />
            </div>
        );
    };

    return (
        <div className="timeline-container">
            <h1>HISTORIAL</h1>
            <div className="filters">
                <TextField
                    label="Buscar por fecha"
                    type="date"
                    value={searchDate}
                    onChange={handleDateChange}
                    margin="normal"
                    variant="outlined"
                    sx={{ m: 1, minWidth: 120 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" variant="outlined">
                    <InputLabel id="activity-select-label">Actividad</InputLabel>
                    <Select
                        labelId="activity-select-label"
                        id="activity-select"
                        value={searchActivity}
                        onChange={handleActivityChange}
                        label="Actividad"
                    >
                        <MenuItem value="">
                            <em>Ninguna</em>
                        </MenuItem>
                        <MenuItem value="APS">APS</MenuItem>
                        <MenuItem value="COSECHA_MECANICA">Cosecha Mecánica</MenuItem>
                        {/* Añade aquí otras actividades según sean necesarias */}
                    </Select>
                </FormControl>
                {/* Filtro de finca */}
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" variant="outlined">
                    <InputLabel id="farm-select-label">Finca</InputLabel>
                    <Select
                        labelId="farm-select-label"
                        id="farm-select"
                        value={searchFarm}
                        onChange={handleFarmChange}
                        label="Finca"
                    >
                        <MenuItem value="">
                            <em>Ninguna</em>
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="timeline-scroll">
                <VerticalTimeline>
                    {filteredEvents.map(event => (
                        <VerticalTimelineElement
                            key={event.ID_ANALISIS}
                            className="vertical-timeline-element--work"
                            date={event.date}
                            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                            onTimelineElementClick={() => obtenerGeoJSON(event.activity, event.ID_ANALISIS)}
                        >
                            <div className="timeline-element-content" onClick={() => obtenerGeoJSON(event.activity, event.ID_ANALISIS)}>
                                <h3 className="vertical-timeline-element-title">{event.activity}</h3>
                                <p>Finca(s): {event.farm}</p>
                            </div>
                        </VerticalTimelineElement>
                    ))}
                </VerticalTimeline>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {renderMap()}
            </Modal>
        </div>
    );
};

export default MyTimeline;
