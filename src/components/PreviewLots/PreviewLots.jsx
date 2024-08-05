import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import JSZip from 'jszip';
import shp from 'shpjs';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { Root, InfoPanel, MapPanel, CustomPaper, LoaderOverlay } from './PreviewLotsStyle';
import L from 'leaflet';
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { toast } from 'react-toastify';

const { BaseLayer } = LayersControl;

const PreviewLots = ({ userId }) => {
    const [polygons, setPolygons] = useState([]);
    const [area, setArea] = useState(0);
    const [historial, setHistorial] = useState([]);
    const [selectedLote, setSelectedLote] = useState('');
    const [loading, setLoading] = useState(true);
    const [highlightedLote, setHighlightedLote] = useState(null);
    const [activeLote, setActiveLote] = useState(null);
    const mapRef = useRef();

    useEffect(() => {
        const obtenerLoteMasReciente = async () => {
            setLoading(true); // Mostrar loader
            try {
                const response = await axios.get(`${API_BASE_URL}configuration/lotesIniciales/masReciente/${userId}`);
                const geojson = response.data.content;
                setPolygons(geojson.features);
                const totalArea = geojson.features.reduce((sum, feature) => {
                    const polygonArea = feature.properties.area || 0;
                    return sum + polygonArea;
                }, 0);

                setArea(totalArea);

                if (mapRef.current) {
                    const map = mapRef.current;
                    const bounds = L.geoJSON(geojson.features).getBounds();
                    map.fitBounds(bounds);
                }
            } catch (error) {
                console.error("Error al obtener el archivo más reciente", error);
            } finally {
                setLoading(false); // Ocultar loader
            }
        };

        obtenerLoteMasReciente();
    }, [userId]);

    useEffect(() => {
        const obtenerHistorial = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}configuration/lotesIniciales/historial/${userId}`);
                setHistorial(response.data);
            } catch (error) {
                console.error("Error al obtener el historial de archivos", error);
            }
        };

        obtenerHistorial();
    }, [userId]);

    const handleLoteSelect = async (event) => {
        const selectedFile = event.target.value;
        setSelectedLote(selectedFile);
        setLoading(true); // Mostrar loader

        try {
            const response = await axios.get(`${API_BASE_URL}configuration/lotesIniciales/${selectedFile}`);
            const geojson = response.data.content;
            setPolygons(geojson.features);

            const totalArea = geojson.features.reduce((sum, feature) => {
                const polygonArea = feature.properties.area || 0;
                return sum + polygonArea;
            }, 0);

            setArea(totalArea);

            if (mapRef.current) {
                const map = mapRef.current;
                const bounds = L.geoJSON(geojson.features).getBounds();
                map.fitBounds(bounds);
            }
        } catch (error) {
            console.error("Error al obtener el archivo seleccionado", error);
        } finally {
            setLoading(false); // Ocultar loader
        }
    };

    const handleZipUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const zip = new JSZip();
                const content = await zip.loadAsync(file);
                const shapefileBuffers = [];

                for (const filename of Object.keys(content.files)) {
                    if (filename.endsWith('.shp') || filename.endsWith('.shx') || filename.endsWith('.dbf') || filename.endsWith('.prj')) {
                        const arrayBuffer = await content.files[filename].async('arraybuffer');
                        shapefileBuffers.push({ filename, arrayBuffer });
                    }
                }

                const shapefileArrayBuffers = {};
                shapefileBuffers.forEach(({ filename, arrayBuffer }) => {
                    const extension = filename.split('.').pop();
                    shapefileArrayBuffers[extension] = arrayBuffer;
                });

                const geojson = await shp(shapefileArrayBuffers);
                setPolygons(geojson.features);

                const totalArea = geojson.features.reduce((sum, feature) => {
                    const polygonArea = feature.properties.area || 0;
                    return sum + polygonArea;
                }, 0);

                setArea(totalArea);

                // Fit map to polygons
                if (mapRef.current) {
                    const map = mapRef.current;
                    const bounds = L.geoJSON(geojson.features).getBounds();
                    map.fitBounds(bounds);
                }

                const data = {
                    userId: userId,
                    geojson: geojson
                };

                await axios.post(`${API_BASE_URL}configuration/lotesIniciales`, data);
                toast.success('Lote subido y mapeado correctamente');

                // Actualizar el historial después de subir el archivo
                const response = await axios.get(`${API_BASE_URL}configuration/lotesIniciales/historial/${userId}`);
                setHistorial(response.data);
                setSelectedLote(''); // Limpiar la selección

            } catch (error) {
                console.error("Error processing shapefile: ", error);
                toast.error('Error al subir el lote');
            }
        }
    };

    useEffect(() => {
        if (!loading && mapRef.current) {
            mapRef.current.invalidateSize();
        }
    }, [loading]);

    const getLoteId = (properties) => {
        const keys = Object.keys(properties).map(key => key.toLowerCase());
        const idLoteIndex = keys.indexOf('id_lote');
        const idIndex = keys.indexOf('id');

        if (idLoteIndex !== -1) {
            return properties[Object.keys(properties)[idLoteIndex]];
        } else if (idIndex !== -1) {
            return properties[Object.keys(properties)[idIndex]];
        } else {
            return null;
        }
    };


    const onHoverLote = (loteId) => {
        setHighlightedLote(loteId);
    };

    const onLeaveLote = () => {
        setHighlightedLote(null);
    };

    const onSelectLote = (loteId) => {
        if (activeLote === loteId) {
            setActiveLote(null);
        } else {
            setActiveLote(loteId);
            if (mapRef.current) {
                const map = mapRef.current;
                const lotePolygons = polygons.filter(feature => getLoteId(feature.properties) === loteId);
                const bounds = L.geoJSON(lotePolygons).getBounds();
                map.fitBounds(bounds);
            }
        }
    };

    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current;
            map.eachLayer((layer) => {
                if (layer.options && layer.options.pane === "overlayPane") {
                    map.removeLayer(layer);
                }
            });
            const geojsonLayer = L.geoJSON(polygons, {
                style: (feature) => ({
                    color: getLoteId(feature.properties) === activeLote ? 'red' : '#3388ff',
                    weight: getLoteId(feature.properties) === highlightedLote ? 3 : 1,
                }),
            });
            geojsonLayer.addTo(map);
        }
    }, [activeLote, highlightedLote, polygons]);

    return (
        <Root>
            <InfoPanel>
                <CustomPaper>
                    <Typography variant="h6">Información del Lote</Typography>
                    <Typography>Área total: {area.toFixed(2)} m²</Typography>
                    <List style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {Object.entries(polygons.reduce((acc, feature) => {
                            const loteId = getLoteId(feature.properties);
                            if (!acc[loteId]) {
                                acc[loteId] = [];
                            }
                            acc[loteId].push(feature);
                            return acc;
                        }, {})).map(([loteId, features]) => (
                            <ListItem
                                key={loteId}
                                onMouseEnter={() => onHoverLote(loteId)}
                                onMouseLeave={onLeaveLote}
                                onClick={() => onSelectLote(loteId)}
                                style={{
                                    backgroundColor: activeLote === loteId ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                                    border: activeLote === loteId ? '1px solid red' : 'none'
                                }}
                            >
                                <ListItemText
                                    primary={`Lote ID: ${loteId}`}
                                    secondary={`Número de polígonos: ${features.length}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <FormControl fullWidth>
                        <InputLabel id="select-lote-label">Seleccionar Lote</InputLabel>
                        <Select
                            labelId="select-lote-label"
                            value={selectedLote}
                            onChange={handleLoteSelect}
                        >
                            {historial.map((file, index) => (
                                <MenuItem key={index} value={file.name}>
                                    {new Date(file.created).toLocaleString()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CustomPaper>
                <Button variant="contained" component="label" style={{ marginTop: '16px' }}>
                    Subir Lotes
                    <input type="file" hidden onChange={handleZipUpload} />
                </Button>
            </InfoPanel>
            <MapPanel>
                {loading && (
                    <LoaderOverlay>
                        <CircularProgress />
                    </LoaderOverlay>
                )}
                <MapContainer
                    center={[0, 0]}
                    zoom={2}
                    minZoom={2}
                    maxZoom={18}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                    worldCopyJump={false}
                >
                    <LayersControl position="topright">
                        <BaseLayer checked name="Satélite">
                            <TileLayer
                                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                attribution='&copy; <a href="https://www.google.com/intl/es/permissions/geoguidelines.html">Google</a>'
                                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                            />
                        </BaseLayer>
                        <BaseLayer name="Mapas de calles">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </BaseLayer>
                    </LayersControl>
                </MapContainer>
            </MapPanel>
        </Root>
    );
};

export default PreviewLots;