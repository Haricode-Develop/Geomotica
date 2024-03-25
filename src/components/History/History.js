// MyTimeline.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './HistoryStyle.css';
import axios from 'axios';
import { API_BASE_URL } from "../../utils/config";
import Modal from "../Modal/Modal";
import 'leaflet-geotiff';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import moment from 'moment';
import { TextField, FormControl, InputLabel, Select, MenuItem, Drawer, Button, Fab, Tooltip, Slider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';



const colorMappingBool = (valueArray) => {

    const value = valueArray[0];
    if(value === 0){
        return 'rgba(0, 0, 0, 0)';
    }
    const color = value === 1 ? '#00FF00' : '#FF0000';
    return color;
};

const colorMappingGradient = (valueArray, minVal, midVal, maxVal) => {
    const value = valueArray[0];
    if(value === 0){
        return 'rgba(0, 0, 0, 0)';
    }
    const range = maxVal - minVal;
    const midPoint = midVal - minVal;
    const normalized = (value - minVal) / range;

    if (normalized < 0.5) {
        // De verde a amarillo
        const midNormalized = normalized / 0.5;
        const red = Math.round(255 * midNormalized);
        const green = 255;
        return `rgb(${red}, ${green}, 0)`;
    } else {
        // De amarillo a rojo
        const topNormalized = (normalized - 0.5) / 0.5;
        const red = 255;
        const green = Math.round(255 * (1 - topNormalized));
        return `rgb(${red}, ${green}, 0)`;
    }
};


function GeoTIFFLayer({ url, bounds, selectedLegend, gradientValues }) {
    const map = useMap();
    const layerRef = useRef(null);
    const prevUrl = usePrevious(url);

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        }, [value]);
        return ref.current;
    }

    useEffect(() => {
        if (prevUrl && layerRef.current) {
            map.removeLayer(layerRef.current);
            layerRef.current = null;
        }

        const loadGeoTIFF = async () => {
            const arrayBuffer = await fetch(url).then(response => response.arrayBuffer());
            const georaster = await parseGeoraster(arrayBuffer);
            const pixelValuesToColorFn = selectedLegend === "PILOTO_AUTOMATICO" ||
            selectedLegend === "AUTO_TRACKET" ||
            selectedLegend === "MODO_CORTE_BASE" ?
                colorMappingBool : (values) => colorMappingGradient(values, gradientValues.min, gradientValues.mid, gradientValues.max);

            const layer = new GeoRasterLayer({
                georaster,
                opacity: 0.7,
                pixelValuesToColorFn,
                resolution: 64
            });

            layerRef.current = layer;
            layer.addTo(map);
            map.fitBounds(bounds);
        };

        if (url && bounds.length) {
            loadGeoTIFF();
        }

        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current);
                layerRef.current = null;
            }
        };
    }, [url, bounds, map, selectedLegend, prevUrl, gradientValues]); // Asegúrate de incluir gradientValues aquí

    return null;
}
const MyTimeline = () => {
    const [events, setEvents] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [currentGeoJson, setCurrentGeoJson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIdAnalisis, setSelectedIdAnalisis] = useState(null);
    const mapRef = useRef(null);
    const [mapKey, setMapKey] = useState(0);
    const geoJsonLayerRef = useRef(null);
    const [selectedLegend, setSelectedLegend] = useState("Velocidad");
    const [tiffData, setTiffData] = useState({ url: '', bounds: [] });
    const [idAnalisis, setIdAnalisis] = useState(0);
    const [farms, setFarms] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [analisisData, setAnalisisData] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [gradientMin, setGradientMin] = useState(1);
    const [gradientMid, setGradientMid] = useState(3);
    const [gradientMax, setGradientMax] = useState(6);


    const obtenerTiffData = async (nombreAnalisis, idAnalisis) => {

        const analisisId = idAnalisis != null ? idAnalisis : selectedIdAnalisis;

        setSelectedLegend(nombreAnalisis);
        const url = `${API_BASE_URL}historial/geojson/${nombreAnalisis}/${analisisId}`;

        try {
            const response = await axios.get(url);
            if (response.data) {
                const { url, bounds, urlAnalisis } = response.data;
                const analisisResponse = await axios.get(urlAnalisis);
                const analisisData = analisisResponse.data;
                setAnalisisData(analisisData);
                setTiffData({ url, bounds, urlAnalisis });
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error al obtener datos del TIFF: ", error);
        }
    };


    // Modificar Legend para usar selectedIdAnalisis
    const Legend = ({ idAnalisis }) => (
        <div className="leyenda-container">
            {["VELOCIDAD_Km_H", "PILOTO_AUTOMATICO", "CALIDAD_DE_SENAL", "CONSUMOS_DE_COMBUSTIBLE", "AUTO_TRACKET", "RPM", "PRESION_DE_CORTADOR_BASE", "MODO_CORTE_BASE"].map(variable => (
                <div
                    key={variable}
                    className={`leyenda-item ${selectedLegend === variable ? "selected" : ""}`}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", variable)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => obtenerTiffData(variable, idAnalisis)}
                >
                    {variable}
                </div>
            ))}
        </div>
    );


    useEffect(() => {
        const fetchEvents = async () => {
            try {

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


    useEffect(() => {
        const uniqueFarms = [...new Set(events.map(event => event.farm))];
        setFarms(uniqueFarms);
    }, [events]);



    const [searchDate, setSearchDate] = useState('');
    const [searchActivity, setSearchActivity] = useState('');
    const [searchFarm, setSearchFarm] = useState('');
    const handleDateChange = (e) => setSearchDate(e.target.value);
    const handleActivityChange = (e) => setSearchActivity(e.target.value);
    const handleFarmChange = (e) => setSearchFarm(e.target.value);


    const filteredEvents = events.filter(event => {
        const eventDate = moment(event.date);
        const isValidStartDate = startDate ? eventDate.isSameOrAfter(moment(startDate), 'day') : true;
        const isValidEndDate = endDate ? eventDate.isSameOrBefore(moment(endDate), 'day') : true;

        return isValidStartDate &&
            isValidEndDate &&
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


    const renderMap = () => {
        if (!tiffData.url || tiffData.bounds.length === 0) return null;
        const inputStyle = {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '5px',
            padding: '5px',
            margin: 'normal',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.5)'
        };
        return (
                <MapContainer
                    center={[(tiffData.bounds[0][0] + tiffData.bounds[1][0]) / 2, (tiffData.bounds[0][1] + tiffData.bounds[1][1]) / 2]}
                    zoom={13}
                    style={{ height: 'calc(100% - 50px)', width: '100%' }}
                >
                    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                        {selectedLegend !== "PILOTO_AUTOMATICO" && selectedLegend !== "AUTO_TRACKET" && selectedLegend !== "MODO_CORTE_BASE" && (
                            <>
                                <TextField
                                    label="Min Value"
                                    type="number"
                                    value={gradientMin}
                                    onChange={(e) => setGradientMin(Number(e.target.value))}
                                    style={inputStyle}
                                />
                                <TextField
                                    label="Mid Value"
                                    type="number"
                                    value={gradientMid}
                                    onChange={(e) => setGradientMid(Number(e.target.value))}
                                    style={inputStyle}
                                />
                                <TextField
                                    label="Max Value"
                                    type="number"
                                    value={gradientMax}
                                    onChange={(e) => setGradientMax(Number(e.target.value))}
                                    style={inputStyle}
                                />
                            </>
                        )}
                    </div>
                    <TileLayer attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                               url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
                    <GeoTIFFLayer
                        url={tiffData.url}
                        bounds={tiffData.bounds}
                        selectedLegend={selectedLegend}
                        gradientValues={{ min: gradientMin, mid: gradientMid, max: gradientMax }}
                    />
                    <Legend idAnalisis={selectedIdAnalisis} />

                </MapContainer>

        );
    };


    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const validateData = (data) => {
        if (Array.isArray(data)) {
            return data.length > 0 ? data.join(", ") : "No disponible";
        }
        return data || "No disponible";
    };

    const drawerContent = (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <div className="analysis-detail-card">
                <h2 className="card-title">Detalle del Análisis</h2>
                <div className="card-content">

                    <div className="card-item">
                        <span className="card-item-title">Responsable:</span>
                        <span className="card-item-value">{validateData(analisisData.nombreResponsable)}</span>
                    </div>
                    <div className="card-item">
                        <span className="card-item-title">Fecha de Inicio:</span>
                        <span className="card-item-value">{moment(analisisData.fechaInicioCosecha).format('YYYY-MM-DD')}</span>
                    </div>


                    <div className="card-item">
                        <span className="card-item-title">Fecha de Fin:</span>
                        <span className="card-item-value">{moment(analisisData.fechaFinCosecha).format('YYYY-MM-DD')}</span>
                    </div>


                    <div className="card-item">
                        <span className="card-item-title">Finca:</span>
                        <span className="card-item-value"> {validateData(analisisData.nombreFinca)}</span>
                    </div>

                    <div className="card-item">
                        <span className="card-item-title">Código de Parcela:</span>
                        <span className="card-item-value"> {validateData(analisisData.codigoParcelaResponsable)}</span>
                    </div>

                    <div className="card-item">
                        <span className="card-item-title">Operador:</span>
                        <span className="card-item-value">{validateData(analisisData.nombreOperador)}</span>
                    </div>

                    <div className="card-item">
                        <span className="card-item-title">Máquina:</span>
                        <span className="card-item-value">{validateData(analisisData.nombreMaquina)}</span>
                    </div>

                    <div className="card-item">
                        <span className="card-item-title">Actividad:</span>
                        <span className="card-item-value">{validateData(analisisData.actividad)}</span>
                    </div>


                    <div className="card-item">
                        <span className="card-item-title">Hora de Inicio:</span>
                        <span className="card-item-value">{validateData(analisisData.horaInicio)}</span>
                    </div>
                    <div className="card-item">
                        <span className="card-item-title">Hora de Fin:</span>
                        <span className="card-item-value">{validateData(analisisData.horaFin)}</span>
                    </div>

                    <div className="card-item">
                        <span className="card-item-title">Tiempo Total de Actividad:</span>
                        <span className="card-item-value">{validateData(analisisData.tiempoTotalActividad)}</span>
                    </div>

                    <div className="card-item">
                        <span className="card-item-title">Calidad GPS:</span>
                        <span className="card-item-value"> {validateData(analisisData.calidadGps)}</span>
                    </div>

                    <div className="card-item">
                        <span className="card-item-title">Promedio de Velocidad:</span>
                        <span className="card-item-value"> {validateData(analisisData.promedioVelocidad)}</span>
                    </div>


                    <div className="card-item">
                        <span className="card-item-title">Consumo de Combustible:</span>
                        <span className="card-item-value">  {validateData(analisisData.consumoCombustible)}</span>
                    </div>


                    <div className="card-item">
                        <span className="card-item-title">Presión del Cortador Base:</span>
                        <span className="card-item-value">{validateData(analisisData.presionCortadorBase)}</span>
                    </div>
                    <div className="card-item">
                        <span className="card-item-title">TAH:</span>
                        <span className="card-item-value"> {validateData(analisisData.tah)}</span>
                    </div>

                    <div className="card-item">
                        <span className="card-item-title">RPM:</span>
                        <span className="card-item-value">  {validateData(analisisData.rpm)}</span>
                    </div>
                    <div className="card-item">
                        <span className="card-item-title">TCH:</span>
                        <span className="card-item-value">  {validateData(analisisData.tch)}</span>
                    </div>

                </div>
            </div>
        </div>
    );





    return (
        <div className="timeline-container">
            <h1>HISTORIAL</h1>
            <div className="filters">
                {/* Filtro de fecha de inicio usando moment */}
                <TextField
                    label="Fecha de inicio"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    sx={{ m: 1, minWidth: 120 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {/* Filtro de fecha de fin usando moment */}
                <TextField
                    label="Fecha de fin"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                        <MenuItem value="COSECHA_MECANICA">Cosecha Mecánica</MenuItem>
                        <MenuItem value="APS">APS</MenuItem>
                        <MenuItem value="FERTILIZACION">Fertilización</MenuItem>
                        <MenuItem value="HERBICIDAS">Herbicidas</MenuItem>

                    </Select>
                </FormControl>
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
                        {farms.map(farm => (
                            <MenuItem key={farm} value={farm}>{farm}</MenuItem>
                        ))}
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
                            onTimelineElementClick={() => {
                                setSelectedIdAnalisis(event.ID_ANALISIS);
                                obtenerTiffData("VELOCIDAD_Km_H", event.ID_ANALISIS);
                            }}
                        >
                            <div className="timeline-element-content">
                                <h3 className="vertical-timeline-element-title">{event.activity}</h3>
                                <p>Finca(s): {event.farm}</p>
                            </div>
                        </VerticalTimelineElement>
                    ))}
                </VerticalTimeline>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <Tooltip title="Ver análisis del mapa realizado previamente" placement="left">

                <Fab
                    color="primary"
                    aria-label="Abrir detalles del análisis"
                    style={{
                        position: 'absolute',
                        top: '30px',
                        left: '350px',
                        zIndex: 1000,
                    }}
                    onClick={toggleDrawer(true)}
                >
                    <InfoIcon />
                </Fab>
                </Tooltip>

                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    {drawerContent}
                </Drawer>

                {renderMap()}
            </Modal>
        </div>
    );
};

export default MyTimeline;
