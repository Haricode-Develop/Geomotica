import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, LayersControl, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';
import { Box, Card, CardContent, Typography, CircularProgress, Paper, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import Draggable from 'react-draggable';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { throttle } from 'lodash';

const { BaseLayer } = LayersControl;

const FloatingPanel = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    zIndex: 1000,
    padding: theme.spacing(2),
    maxHeight: '80vh',
    overflow: 'auto',
    resize: 'both',
    minHeight: '330px',
    width: '300px',
    height: '330px',
}));

const LotCard = styled(Card)(({ theme, highlighted, selected }) => ({
    marginBottom: theme.spacing(1),
    backgroundColor: selected ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
    border: selected ? '1px solid red' : 'none',
    transition: 'transform 0.2s ease-in-out',
    transform: highlighted ? 'scale(1.05)' : 'scale(1)',
    cursor: 'pointer',
}));

const DragHandle = styled('div')({
    cursor: 'grab',
    backgroundColor: '#e0e0e0',
    padding: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: '4px 4px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const CommonMap = ({
                       center = [14.634915, -90.506882],
                       zoom = 8,
                       polygons = [],
                       lines = [],
                       points = [],
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
                       showIntersections = true,
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
    const [searchTerm, setSearchTerm] = useState('');
    const [isMapReady, setIsMapReady] = useState(false);

    // Memoized markers to avoid re-rendering
    const markersRef = useRef([]);

    useEffect(() => {
        if (localMapRef.current && !initialBoundsSet) {
            mapRef.current = localMapRef.current;

            const bounds = new L.LatLngBounds();

            // Añadir puntos a los límites
            if (points && points.length > 0) {
                points.forEach(point => {
                    const coordinates = point.geometry.coordinates;
                    if (coordinates.length >= 2) {
                        bounds.extend([coordinates[1], coordinates[0]]);
                    }
                });
            }

            // Añadir líneas a los límites
            if (lines && lines.length > 0) {
                lines.forEach(line => {
                    if (line.polyline && line.polyline._latlngs) {
                        line.polyline._latlngs.forEach(latlng => {
                            bounds.extend([latlng.lat, latlng.lng]);
                        });
                    }
                });
            }

            // Añadir polígonos a los límites
            if (polygons && polygons.length > 0) {
                polygons.forEach(polygon => {
                    polygon.forEach(coord => {
                        if (coord.length >= 2) {
                            bounds.extend([coord[1], coord[0]]);
                        }
                    });
                });
            }

            if (bounds.isValid() && localMapRef.current) {
                localMapRef.current.fitBounds(bounds);
                if (mapRef.current) {
                    mapRef.current.fitBounds(bounds);
                }
            } else {
                obtenerLoteMasReciente();
            }

            const throttledHandleZoom = throttle(handleZoom, 100);
            if (localMapRef.current) {
                localMapRef.current.on('zoomend', throttledHandleZoom);
                localMapRef.current.on('moveend', throttledHandleMoveEnd);
            }

            if (mapRef.current) {
                mapRef.current.on('zoomend', throttledHandleZoom);
                mapRef.current.on('moveend', throttledHandleMoveEnd);
            }

            setInitialBoundsSet(true);
        }

        return () => {
            if (localMapRef.current) {
                localMapRef.current.off('zoomend', handleZoom);
                localMapRef.current.off('moveend', handleMoveEnd);
            }
            if (mapRef.current) {
                mapRef.current.off('zoomend', handleZoom);
                mapRef.current.off('moveend', handleMoveEnd);
            }
        };
    }, [points, lines, polygons, initialBoundsSet]);



    useEffect(() => {
        obtenerLoteMasReciente();
    }, [userId]);

    const handleTileLoad = useCallback(() => {
        setIsMapReady(true);
    }, []);

    const handleZoom = useCallback(() => {
        if (localMapRef.current) {
            const map = localMapRef.current;
            if (map && map.getZoom) {
                const zoomLevel = map.getZoom();
                if (zoomLevel !== undefined) {
                    setMapZoom(zoomLevel);
                }
            }
        }
    }, []);

    const throttledHandleMoveEnd = useCallback(throttle(() => {
        handleMoveEnd();
    }, 100), []);

    const handleMoveEnd = useCallback(() => {
        if (localMapRef.current) {
            const map = localMapRef.current;
            if (map && map.getCenter) {
                const center = map.getCenter();
                if (center) {
                    setMapCenter([center.lat, center.lng]);
                }
            }
        }
    }, []);


    const memoizedMarkers = useMemo(() => {
        if (!localMapRef.current) return [];

        const renderer = L.canvas();
        return Array.isArray(points) ? points.map(point => {
            const coordinates = point.geometry.coordinates;
            const fillColor = point.color;
            if (coordinates.length >= 2) {
                return L.circleMarker([coordinates[1], coordinates[0]], {
                    radius: 2,
                    fillColor: fillColor,
                    color: fillColor,
                    weight: 0.2,
                    opacity: 1,
                    fillOpacity: 1,
                    renderer: renderer,
                });
            }
            return null;
        }).filter(marker => marker !== null) : [];
    }, [points]);

    useEffect(() => {
        if (memoizedMarkers.length > 0 && localMapRef.current) {
            const map = localMapRef.current;
            if (map && map.removeLayer && map.addLayer) {
                markersRef.current.forEach(marker => map.removeLayer(marker));
                markersRef.current = memoizedMarkers;
                markersRef.current.forEach(marker => marker.addTo(map));
            }
        }
    }, [memoizedMarkers]);

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

    useEffect(() => {
        if (isMapReady && polygonsData.length > 0 && localMapRef.current) {
            const map = localMapRef.current;

            // Verificar que el mapa esté completamente cargado antes de proceder
            if (!map || !map._loaded || !map._container || !map.getCenter || !map.getZoom || !map.fitBounds) {
                console.error("El mapa aún no se ha cargado completamente o no está definido correctamente.");
                return;
            }

            try {
                const bounds = L.geoJSON(polygonsData).getBounds();
                if (bounds.isValid()) {
                    // Verificar que el contenedor del mapa tenga dimensiones válidas
                    if (map._container.clientWidth > 0 && map._container.clientHeight > 0) {
                        // Asegurarse de que el mapa es válido antes de invalidar el tamaño
                        if (map._sizeChanged) {
                            map.invalidateSize();
                        }

                        // Agregar validación adicional para el contenedor
                        const container = map._container;
                        console.log("ESTE ES EL CONTAINER: ", container);
                        if (!container || container.clientWidth <= 0 || container.clientHeight <= 0) {
                            console.error("El contenedor del mapa no tiene dimensiones válidas después de invalidar el tamaño.");
                            return;
                        }

                        console.log("ESTOS SON LOS BOUNDS: ", bounds);

                        // Usar setTimeout para retrasar la llamada a fitBounds
                        const tryFitBounds = () => {
                            if (map && map.fitBounds && map._container) {
                                try {
                                    map.fitBounds(bounds);
                                } catch (error) {
                                    setTimeout(tryFitBounds, 100);
                                }
                            } else {
                                setTimeout(tryFitBounds, 100);
                            }
                        };

                        setTimeout(tryFitBounds, 100);
                    } else {
                        console.error("El contenedor del mapa no tiene dimensiones válidas.");
                    }
                } else {
                    console.error("Los límites calculados no son válidos.");
                }
            } catch (error) {
            }
        }
    }, [isMapReady, polygonsData]);

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
        setActiveLotes((prevActiveLotes) =>
            prevActiveLotes.includes(loteId)
                ? prevActiveLotes.filter((id) => id !== loteId)
                : [...prevActiveLotes, loteId]
        );
    };

    const clearAllLotes = () => {
        setActiveLotes([]);
    };

    const memoizedPolygons = useMemo(() => {
        if (!isMapReady) {
            return null;
        }

        if (localMapRef.current) {
            const mapBounds = localMapRef.current.getBounds();

            return polygonsData
                .filter((polygon) => {
                    const positions = polygon.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                    const polygonBounds = L.polygon(positions).getBounds();
                    return mapBounds.intersects(polygonBounds);
                })
                .map((polygon, index) => {
                    const loteId = getLoteId(polygon.properties);
                    if (activeLotes.length > 0 && !activeLotes.includes(loteId)) {
                        return null;
                    }
                    const positions = polygon.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                    return (
                        <Polygon
                            key={`polygon-${index}-${loteId}`}
                            positions={positions}
                            color={activeLotes.includes(loteId) ? 'red' : '#ffa033'}
                            weight={3}
                            onMouseOver={() => onHoverLote(loteId)}
                            onMouseOut={onLeaveLote}
                            onClick={() => onSelectLote(loteId)}
                        />
                    );
                });
        } else {
            return null;
        }
    }, [polygonsData, activeLotes, mapCenter, mapZoom, isMapReady]);


    const externalPolygons = useMemo(() => {
        if (!polygons || polygons.length === 0 || !polygonProperties || polygonProperties.length === 0) {
            return null;
        }

        if (polygons.length !== polygonProperties.length) {
            console.error('Polygons and polygonProperties arrays have different lengths');
            return null;
        }


        return polygons.map((polygonObj, index) => {
            const polygon = Object.values(polygonObj).filter(coord => Array.isArray(coord) && coord.length === 2);

            if (!polygon || !Array.isArray(polygon) || polygon.length === 0) {
                console.error(`Polygon at index ${index} has invalid positions`, polygon);
                return null;
            }

            const properties = polygonProperties[index];
            const color = properties.color || 'green';
            const areCoordinatesValid = polygon.every(coord => {
                return Array.isArray(coord) && coord.length === 2 &&
                    typeof coord[0] === 'number' && typeof coord[1] === 'number' &&
                    !isNaN(coord[0]) && !isNaN(coord[1]);
            });

            if (!areCoordinatesValid) {
                console.error(`Polygon at index ${index} has invalid coordinates`, polygon);
                return null;
            }

            return (
                <Polygon
                    key={`external-polygon-${index}-${Date.now()}`}
                    positions={polygon.map(coord => [coord[1], coord[0]])}
                    color={color}
                    weight={3}
                />
            );
        }).filter(polygon => polygon !== null);
    }, [polygons, polygonProperties]);

    useEffect(() => {
        if (localMapRef.current) {
            const map = localMapRef.current;

            // Verificar que el mapa esté cargado antes de proceder
            if (!map._loaded) {
                console.error("El mapa aún no se ha cargado completamente.");
                return;
            }

            // Remover polígonos y polilíneas existentes
            map.eachLayer((layer) => {
                if (layer instanceof L.Polygon || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
                    map.removeLayer(layer);
                }
            });

            // Filtrar polígonos
            const filteredPolygons = activeLotes.length > 0
                ? polygonsData.filter((feature) => activeLotes.includes(getLoteId(feature.properties)))
                : polygonsData;

            // Crear capa GeoJSON
            const geojsonLayer = L.geoJSON(filteredPolygons, {
                style: (feature) => ({
                    color: activeLotes.includes(getLoteId(feature.properties)) ? 'red' : '#ffa033',
                    weight: highlightedLote === getLoteId(feature.properties) ? 3 : 1,
                }),
            });
            geojsonLayer.addTo(map);

            // Ajustar límites del mapa si hay lotes activos
            const bounds = new L.LatLngBounds();
            if (activeLotes.length > 0) {
                const boundsPolygons = L.geoJSON(filteredPolygons).getBounds();
                if (boundsPolygons.isValid()) {
                    bounds.extend(boundsPolygons);
                } else {
                    console.error("Los límites calculados no son válidos.");
                }
            }

            // Añadir polígonos desde props si están definidos
            if (polygons && polygons.length > 0) {
                polygons.forEach((polygon) => {
                    const positions = polygon.map(coord => [coord[1], coord[0]]);
                    const polygonLayer = L.polygon(positions, { color: 'green', weight: 3 }).addTo(map);
                    bounds.extend(polygonLayer.getBounds());
                });
            }

            // Añadir áreas superpuestas si están definidas
            if (areasSuperpuestas && areasSuperpuestas.length > 0) {
                areasSuperpuestas.forEach((area) => {
                    const positions = area.map(coord => [coord[1], coord[0]]);
                    const areaLayer = L.polygon(positions, { color: 'red', weight: 3 }).addTo(map);
                    bounds.extend(areaLayer.getBounds());
                });
            }

            // Añadir líneas desde props si están definidas y son un array
            if (Array.isArray(lines) && lines.length > 0) {
                lines.forEach((line) => {
                    if (line && Array.isArray(line.polyline._latlngs)) {
                        const positions = line.polyline._latlngs.map(coord => [coord.lat, coord.lng]);
                        const lineLayer = L.polyline(positions, { color: 'red', weight: 3 }).addTo(map);
                        bounds.extend(lineLayer.getBounds());
                    }
                });
            }

            // Añadir markers y ajustar límites del mapa
            const markerBounds = new L.LatLngBounds();
            markersRef.current.forEach(marker => {
                marker.addTo(map);
                markerBounds.extend(marker.getLatLng());
            });
            if (markerBounds.isValid()) {
                bounds.extend(markerBounds);
            }

            // Ajustar los límites del mapa si son válidos
            if (bounds.isValid()) {
                map.fitBounds(bounds);
            }

            // Forzar una actualización de manera segura
            setTimeout(() => {
                if (map && typeof map.invalidateSize === 'function' && map._container) {
                    const container = map._container;
                    if (container.clientHeight > 0 && container.clientWidth > 0) {
                        map.invalidateSize();
                    } else {
                        console.error("El contenedor del mapa no tiene dimensiones válidas.");
                    }
                } else {
                    console.error("El mapa o su contenedor no están definidos correctamente.");
                }
            }, 500);
        }
    }, [activeLotes, highlightedLote, polygonsData, polygons, areasSuperpuestas, lines, memoizedMarkers]);



    const filteredLotes = Object.entries(polygonsData.reduce((acc, feature) => {
        const loteId = getLoteId(feature.properties);
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
            <Draggable handle=".drag-handle">
                <FloatingPanel>
                    <DragHandle className="drag-handle">
                        <DragIndicatorIcon />
                        <Typography variant="body2" component="span" ml={1}>Mover</Typography>
                    </DragHandle>
                    <Box display="flex" alignItems="center" mb={1}>
                        <TextField
                            label="Buscar Lote"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <IconButton
                            color="secondary"
                            onClick={clearAllLotes}
                            disabled={activeLotes.length === 0}
                            style={{ marginLeft: '8px' }}
                        >
                            <CleaningServicesIcon />
                        </IconButton>
                    </Box>
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
                style={{ height: '75vh', width: '100%', borderRadius: '20px' }}
                ref={localMapRef}
                whenCreated={(mapInstance) => {
                    localMapRef.current = mapInstance;
                    setIsMapReady(true);
                }}
            >
                <LayersControl position="topright">
                    <BaseLayer checked name="Satellite View">
                        <TileLayer
                            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                            minZoom={3}
                            maxZoom={20}
                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                            eventHandlers={{
                                load: handleTileLoad
                            }}
                        />
                    </BaseLayer>
                    <BaseLayer name="Street Map">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maxZoom={19}
                            eventHandlers={{
                                load: handleTileLoad
                            }}
                        />
                    </BaseLayer>

                    {memoizedPolygons}

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

                    {showIntersections && areasSuperpuestas && areasSuperpuestas.map((area, index) => {
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

                    {externalPolygons}

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

export default React.memo(CommonMap);