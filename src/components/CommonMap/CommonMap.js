import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, LayersControl, CircleMarker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';
import { Box, Card, CardContent, Typography, CircularProgress, Paper, TextField } from '@mui/material';
import { styled } from '@mui/system';
import Draggable from 'react-draggable';

const { BaseLayer } = LayersControl;

const FloatingPanel = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    zIndex: 1000,
    padding: theme.spacing(2),
    maxHeight: '400px',
    overflowY: 'auto',
    cursor: 'grab',
}));

const LotCard = styled(Card)(({ theme, highlighted, selected }) => ({
    marginBottom: theme.spacing(1),
    backgroundColor: selected ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
    border: selected ? '1px solid red' : 'none',
    transition: 'transform 0.2s ease-in-out',
    transform: highlighted ? 'scale(1.05)' : 'scale(1)',
    cursor: 'pointer',
}));

const CommonMap = ({
                       center = [14.634915, -90.506882],
                       zoom = 8,
                       polygons,
                       lines,
                       points,
                       hullPolygon,
                       areasSuperpuestas,
                       nonIntersectedAreas,
                       bufferedLines,
                       bufferedIntersections,
                       onLineHover,
                       onLineMouseOut,
                       onLineClick,
                       activeFilter,
                       filterValues,
                       polygonProperties,
                       showIntersections,
                       mapRef,
                       userId
                   }) => {
    const localMapRef = useRef(null);
    const [popupInfo, setPopupInfo] = useState(null);
    const [mapCenter, setMapCenter] = useState(center);
    const [mapZoom, setMapZoom] = useState(zoom);
    const [initialBoundsSet, setInitialBoundsSet] = useState(false);
    const [highlightedLote, setHighlightedLote] = useState(null);
    const [activeLotes, setActiveLotes] = useState([]);
    const [polygonsData, setPolygonsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');  // Estado para el término de búsqueda

    useEffect(() => {
        if (localMapRef.current && !initialBoundsSet) {
            mapRef.current = localMapRef.current;

            const bounds = new L.LatLngBounds();

            if (points && points.length > 0) {
                points.forEach(point => {
                    const coordinates = point.geometry.coordinates;
                    if (coordinates.length >= 2 && coordinates.every(coord => typeof coord === 'number')) {
                        bounds.extend([coordinates[1], coordinates[0]]);
                    }
                });
            }

            if (lines && lines.length > 0) {
                lines.forEach(line => {
                    line.polyline._latlngs.forEach(latlng => {
                        bounds.extend([latlng.lat, latlng.lng]);
                    });
                });
            }

            if (bounds.isValid()) {
                localMapRef.current.fitBounds(bounds);
            } else {
                obtenerLoteMasReciente();
            }

            localMapRef.current.on('zoomend', handleZoom);
            localMapRef.current.on('moveend', handleMoveEnd);

            setInitialBoundsSet(true);
        }

        return () => {
            if (localMapRef.current) {
                localMapRef.current.off('zoomend', handleZoom);
                localMapRef.current.off('moveend', handleMoveEnd);
            }
        };
    }, [points, lines, initialBoundsSet]);

    useEffect(() => {
        obtenerLoteMasReciente();
    }, [userId]);

    const handleZoom = () => {
        if (localMapRef.current) {
            const zoomLevel = localMapRef.current.getZoom();
            setMapZoom(zoomLevel);
            addCircleMarkersToMap(zoomLevel);
        }
    };

    const handleMoveEnd = () => {
        if (localMapRef.current) {
            const center = localMapRef.current.getCenter();
            setMapCenter([center.lat, center.lng]);
        }
    };

    const createCircleMarkers = (zoomLevel) => {
        if (!points) return [];
        return points.map((point, idx) => {
            const coordinates = point.geometry.coordinates;
            let fillColor = "blue";
            if (activeFilter) {
                fillColor = getPolygonColor(point.properties);
            }
            if (coordinates.length >= 2) {
                const radius = Math.max(1.5 * (zoomLevel / 20), 0.5);
                return L.circleMarker([coordinates[1], coordinates[0]], {
                    radius: radius,
                    fillColor: fillColor,
                    color: fillColor,
                    weight: 0.2,
                    opacity: 1,
                    fillOpacity: 1,
                });
            }
            return null;
        }).filter(marker => marker !== null);
    };

    const addCircleMarkersToMap = (zoomLevel) => {
        if (!localMapRef.current) return;
        const map = localMapRef.current;
        const markers = createCircleMarkers(zoomLevel);
        markers.forEach(marker => {
            if (marker && typeof marker.addTo === 'function') {
                marker.addTo(map);
            } else {
                console.error("Marker no es válido o no tiene la función addTo", marker);
            }
        });
    };

    const getPolygonColor = (properties) => {
        if (!activeFilter || !properties || !filterValues[activeFilter]) {
            return 'green';
        }

        const key = activeFilter;
        const value = properties[key];

        if (activeFilter === 'AUTO_TRACKET' || activeFilter === 'PILOTO_AUTOMATICO') {
            if (value && value.toLowerCase() === 'engaged') {
                return 'green';
            } else {
                return 'blue';
            }
        } else if (activeFilter === 'MODO_CORTE_BASE') {
            if (value && value.toLowerCase() === 'automatic') {
                return 'green';
            } else {
                return 'blue';
            }
        }

        if (value === undefined) {
            return 'transparent';
        }

        const { low, medium, high } = filterValues[activeFilter];

        if (value < low) return 'green';
        if (value >= low && value < medium) return 'yellow';
        if (value >= medium && value <= high) return 'orange';
        return 'red';
    };

    useEffect(() => {
        if (localMapRef.current) {
            const zoomLevel = localMapRef.current.getZoom();
            addCircleMarkersToMap(zoomLevel);
        }
    }, [points, activeFilter, filterValues]);

    const obtenerLoteMasReciente = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}configuration/lotesIniciales/masReciente/${userId}`);
            const geojson = response.data.content;
            setPolygonsData(geojson.features);

            if (localMapRef.current) {
                const map = localMapRef.current;
                const bounds = L.geoJSON(geojson.features).getBounds();
                map.fitBounds(bounds);
            }
        } catch (error) {
            console.error("Error al obtener el archivo más reciente", error);
        } finally {
            setLoading(false);
        }
    };

    const onHoverLote = (loteId) => {
        setHighlightedLote(loteId);
    };

    const onLeaveLote = () => {
        setHighlightedLote(null);
    };

    const onSelectLote = (loteId) => {
        setActiveLotes((prevActiveLotes) =>
            prevActiveLotes.includes(loteId)
                ? prevActiveLotes.filter((id) => id !== loteId)
                : [...prevActiveLotes, loteId]
        );
    };

    useEffect(() => {
        if (localMapRef.current) {
            const map = localMapRef.current;

            map.eachLayer((layer) => {
                if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                    map.removeLayer(layer);
                }
            });

            const filteredPolygons = activeLotes.length > 0
                ? polygonsData.filter((feature) => activeLotes.includes(feature.properties.Lote))
                : polygonsData;

            const geojsonLayer = L.geoJSON(filteredPolygons, {
                style: (feature) => ({
                    color: activeLotes.includes(feature.properties.Lote) ? 'red' : '#ffa033',
                    weight: highlightedLote === feature.properties.Lote ? 3 : 1,
                }),
            });
            geojsonLayer.addTo(map);

            if (activeLotes.length > 0) {
                const bounds = L.geoJSON(filteredPolygons).getBounds();
                map.fitBounds(bounds);
            }

            const zoomLevel = map.getZoom();
            addCircleMarkersToMap(zoomLevel);
        }
    }, [activeLotes, highlightedLote, polygonsData]);

    // Filtrar lotes según el término de búsqueda
    const filteredLotes = Object.entries(polygonsData.reduce((acc, feature) => {
        const loteId = feature.properties.Lote;
        if (!acc[loteId]) {
            acc[loteId] = [];
        }
        acc[loteId].push(feature);
        return acc;
    }, {})).filter(([loteId]) => loteId.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="65vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box position="relative">
            <Draggable>
                <FloatingPanel>
                    <TextField
                        label="Buscar Lote"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <Box display="flex" flexDirection="column">
                        {filteredLotes.map(([loteId, features]) => (
                            <LotCard
                                key={loteId}
                                highlighted={highlightedLote === loteId}
                                selected={activeLotes.includes(loteId)}
                                onMouseEnter={() => onHoverLote(loteId)}
                                onMouseLeave={onLeaveLote}
                                onClick={() => onSelectLote(loteId)}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        Lote ID: {loteId}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Número de polígonos: {features.length}
                                    </Typography>
                                </CardContent>
                            </LotCard>
                        ))}
                    </Box>
                </FloatingPanel>
            </Draggable>
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '65vh', width: '100%', borderRadius: '20px' }}
                ref={localMapRef}
            >
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
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maxZoom={19}
                        />
                    </BaseLayer>

                    {polygonsData.map((polygon, index) => {
                        const loteId = polygon.properties.Lote;
                        if (activeLotes.length > 0 && !activeLotes.includes(loteId)) {
                            return null;
                        }
                        const positions = polygon.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);

                        return (
                            <Polygon
                                key={index}
                                positions={positions}
                                color={activeLotes.includes(loteId) ? 'red' : '#ffa033'}
                                weight={3}
                                onMouseOver={() => onHoverLote(loteId)}
                                onMouseOut={onLeaveLote}
                                onClick={() => onSelectLote(loteId)}
                            />
                        );
                    })}

                    {lines && lines.map((line, index) => (
                        <Polyline
                            key={`line-${index}`}
                            positions={line.polyline._latlngs}
                            color="red"
                            onMouseOver={(e) => onLineHover(e, line.id)}
                            onMouseOut={(e) => onLineMouseOut(e, line.id)}
                            onClick={(e) => onLineClick(line.polyline._latlngs, e)}
                        />
                    ))}

                    {bufferedLines && bufferedLines.map((bufferedLine, index) => (
                        <Polygon key={`buffered-${index}`} positions={bufferedLine.geometry.coordinates[0].map(coord => [coord[1], coord[0]])} color="purple" weight={3} />
                    ))}
                    {bufferedIntersections && bufferedIntersections.map((intersection, index) => (
                        <Polygon key={`buffered-intersection-${index}`} positions={intersection.map(coord => [coord[1], coord[0]])} color="blue" weight={3} />
                    ))}

                    {showIntersections && areasSuperpuestas.map((area, index) => {
                        if (!Array.isArray(area) || area.length === 0) {
                            console.error(`Área inválida en el índice ${index}:`, area);
                            return null;
                        }

                        const positions = area.map(coord => {
                            if (Array.isArray(coord) && coord.length === 2) {
                                return { lat: coord[1], lng: coord[0] };
                            }
                            console.error(`Coordenada inválida en el área ${index}:`, coord);
                            return null;
                        }).filter(coord => coord !== null);

                        return (
                            <Polygon
                                key={`intersection-${index}`}
                                positions={positions}
                                color="red"
                                weight={3}
                            />
                        );
                    })}

                    {nonIntersectedAreas && nonIntersectedAreas.map((nonIntersected, index) => {
                        const positions = nonIntersected.map(coords => [coords[1], coords[0]]);
                        return (
                            <Polygon
                                key={`nonIntersectedArea-${index}`}
                                positions={positions}
                                color="yellow"
                                weight={3}
                            />
                        );
                    })}

                    {popupInfo && (
                        <Popup position={popupInfo.position} onClose={() => setPopupInfo(null)}>
                            <div dangerouslySetInnerHTML={{ __html: popupInfo.content }} />
                        </Popup>
                    )}
                </LayersControl>
            </MapContainer>
        </Box>
    );
};

export default CommonMap;