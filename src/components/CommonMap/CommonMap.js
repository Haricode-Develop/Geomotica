import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, LayersControl, Polyline, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box} from '@mui/material';
import { throttle } from 'lodash';
import ReactDOM from 'react-dom';

const { BaseLayer } = LayersControl;

const CommonMap = ({
                       center = [14.634915, -90.506882],
                       zoom = 8,
                       polygons = [],
                       lines = [],
                       points = [],
                       areasSuperpuestas,
                       nonIntersectedAreas,
                       bufferedLines,
                       bufferedIntersections,
                       onLineHover,
                       onLineMouseOut,
                       onLineClick,
                       polygonProperties,
                       showIntersections = true,
                       mapRef,
                       stretchPoints = [],
                       lineasNoFiltradas = [],
                       polygonsData = [],
                       highlightedLote,
                       activeLotes,
                       onSelectLote,
                       onHoverLote,
                       onLeaveLote
                   }) => {
    const localMapRef = useRef(null); // Crear una referencia para el mapa
    const [popupInfo, setPopupInfo] = useState(null);
    const [mapCenter, setMapCenter] = useState(center);
    const [mapZoom, setMapZoom] = useState(zoom);
    const [initialBoundsSet, setInitialBoundsSet] = useState(false);
    const [mapKey, setMapKey] = useState(Date.now());
    const [shouldFitBounds, setShouldFitBounds] = useState(true);
    const [isFirstPolygons, setIsFirstPolygons] = useState(true);
    const markersRef = useRef([]);
    const previousPointsRef = useRef(points || []);

    // Hook para inicializar el mapa
    useEffect(() => {
        if (localMapRef.current && !initialBoundsSet) {

            mapRef.current = localMapRef.current; // Asigna la referencia del mapa

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
            setShouldFitBounds(true); // Habilitar el ajuste de límites solo una vez
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
                    // Batching de actualizaciones
                    ReactDOM.unstable_batchedUpdates(() => {
                        setMapCenter([center.lat, center.lng]);
                    });
                }
            }
        }
    }, []);


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

    const memoizedPolygons = useMemo(() => {
        if (!localMapRef.current) {
            return null;
        }

        const mapBounds = localMapRef.current.getBounds();

        return polygonsData
            .filter((polygon) => {
                const positions = polygon.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]);
                const polygonBounds = L.polygon(positions).getBounds();
                return mapBounds.intersects(polygonBounds);
            })
            .map((polygon, index) => {
                const loteId = getLoteId(polygon.properties);
                if (activeLotes.length > 0 && !activeLotes.includes(loteId)) {
                    return null;
                }
                const positions = polygon.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]);
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
    }, [polygonsData, activeLotes]);

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

    const memoizedMarkers = useMemo(() => {
        // Validación para verificar que points no es null o undefined
        if (!points || points.length === 0) {
            console.warn('No hay puntos para mostrar en el mapa.');
            return [];
        }

        const renderer = L.canvas();

        return points
            .map((point) => {
                const { coordinates } = point.geometry;
                const { color } = point;

                if (coordinates.length >= 2) {
                    return L.circleMarker([coordinates[1], coordinates[0]], {
                        radius: 2,
                        fillColor: color,
                        color: color,
                        weight: 0.2,
                        opacity: 1,
                        fillOpacity: 1,
                        renderer: renderer,
                    });
                }

                return null;
            })
            .filter((marker) => marker !== null); // Filtrar cualquier marcador que no sea válido
    }, [points]);

    useEffect(() => {
        if (localMapRef.current) {
            const map = localMapRef.current;

            // Verificar que el mapa esté cargado antes de proceder
            if (!map._loaded) {
                console.error('El mapa aún no se ha cargado completamente.');
                return;
            }

            // Inicializar los puntos como un array vacío si son null o undefined
            const currentPoints = points || [];

            // Obtener los puntos anteriores
            const previousPoints = previousPointsRef.current || [];

            // Validar que ambos previousPoints y currentPoints son arrays
            if (!Array.isArray(currentPoints)) {
                console.error('Los puntos no son un array válido.');
            } else if (!Array.isArray(previousPoints)) {
                console.error('Los puntos anteriores no son un array válido.');
            }

            // Calcular si los puntos han cambiado
            const pointsHaveChanged =
                previousPoints.length !== currentPoints.length ||
                currentPoints.some(
                    (point, index) =>
                        point.geometry.coordinates[0] !== previousPoints[index]?.geometry.coordinates[0] ||
                        point.geometry.coordinates[1] !== previousPoints[index]?.geometry.coordinates[1] ||
                        point.color !== previousPoints[index]?.color
                );

            if (pointsHaveChanged) {
                // Remover marcadores previos
                markersRef.current.forEach((marker) => map.removeLayer(marker));
                markersRef.current = [];

                // Actualizar la referencia de los puntos anteriores
                previousPointsRef.current = currentPoints;

                // Añadir marcadores optimizados y extender límites
                markersRef.current = memoizedMarkers;
                let bounds = new L.LatLngBounds();

                markersRef.current.forEach((marker) => {
                    marker.addTo(map);
                    const latLng = marker.getLatLng();
                    if (latLng && latLng.lat && latLng.lng) {
                        bounds.extend(latLng); // Extender solo si latLng es válido
                    } else {
                        console.error('El marcador tiene coordenadas no válidas:', latLng);
                    }
                });

                if (shouldFitBounds && bounds.isValid()) {
                    map.fitBounds(bounds);
                    setShouldFitBounds(false);
                }
            }

            // Remover polígonos, polilíneas y otros elementos
            map.eachLayer((layer) => {
                if (
                    layer instanceof L.Polygon ||
                    layer instanceof L.Polyline ||
                    layer instanceof L.LayerGroup
                ) {
                    map.removeLayer(layer);
                }
            });

            // Filtrar polígonos activos
            const filteredPolygons =
                activeLotes.length > 0
                    ? polygonsData.filter((feature) =>
                        activeLotes.includes(getLoteId(feature.properties))
                    )
                    : polygonsData;

            // Crear capa GeoJSON para los polígonos
            const geojsonLayer = L.geoJSON(filteredPolygons, {
                style: (feature) => ({
                    color: activeLotes.includes(getLoteId(feature.properties)) ? 'red' : '#ffa033',
                    weight: highlightedLote === getLoteId(feature.properties) ? 3 : 1,
                }),
            });
            geojsonLayer.addTo(map);

            // Inicializar límites
            let bounds = new L.LatLngBounds();

            // Ajustar límites del mapa si hay lotes activos
            if (activeLotes.length > 0) {
                const boundsPolygons = geojsonLayer.getBounds();
                if (boundsPolygons.isValid()) {
                    bounds.extend(boundsPolygons); // Extender con límites de polígonos si son válidos
                } else {
                    console.error('Los límites calculados para los polígonos no son válidos.');
                }
            }

            // Añadir polígonos desde props si están definidos
            if (polygons && polygons.length > 0) {
                polygons.forEach((polygon) => {
                    const positions = polygon.map((coord) => [coord[1], coord[0]]);
                    const polygonLayer = L.polygon(positions, {
                        color: 'green',
                        weight: 3,
                    }).addTo(map);
                    bounds.extend(polygonLayer.getBounds());
                });
            }

            // Añadir líneas no filtradas
            if (lineasNoFiltradas && lineasNoFiltradas.length > 0) {
                lineasNoFiltradas.forEach((linea) => {
                    if (linea.polyline && Array.isArray(linea.polyline._latlngs)) {
                        const positions = linea.polyline._latlngs.map((coord) => [
                            coord.lat,
                            coord.lng,
                        ]);
                        const polyline = L.polyline(positions, {
                            color: 'rgb(192, 192, 192)',
                            weight: 3,
                            opacity: 0.8,
                        }).addTo(map);
                        bounds.extend(polyline.getBounds());
                    }
                });
            }

            // Añadir líneas desde props
            if (lines && lines.length > 0) {
                lines.forEach((line) => {
                    if (line && Array.isArray(line.polyline._latlngs)) {
                        const positions = line.polyline._latlngs.map((coord) => [
                            coord.lat,
                            coord.lng,
                        ]);
                        const lineLayer = L.polyline(positions, {
                            color: 'red',
                            weight: 3,
                        }).addTo(map);
                        bounds.extend(lineLayer.getBounds());
                    }
                });
            }

            // ** Añadir bufferLines ** //
            if (bufferedLines && bufferedLines.length > 0) {
                bufferedLines.forEach((bufferedLine, index) => {
                    const positions = bufferedLine.geometry.coordinates[0].map(
                        (coord) => [coord[1], coord[0]]
                    );

                    const bufferLayer = L.polygon(positions, {
                        color: 'purple',
                    }).addTo(map);

                    bounds.extend(bufferLayer.getBounds());
                });
            }
            // ** Añadir bufferedIntersections ** //
            if (bufferedIntersections && bufferedIntersections.length > 0) {
                bufferedIntersections.forEach((intersection, index) => {
                    const positions = intersection.map(
                        (coord) => [coord[1], coord[0]]
                    );

                    const intersectionLayer = L.polygon([positions], {
                        color: 'blue',
                        weight: 3,
                    }).addTo(map);

                    bounds.extend(intersectionLayer.getBounds());
                });
            }

            if (isFirstPolygons) {
                mapRef.current = localMapRef.current;
                map.fitBounds(L.geoJSON(polygonsData).getBounds());
                setIsFirstPolygons(false);
            }

            // Añadir stretchPoints al mapa
            stretchPoints.forEach((marker) => {
                marker.addTo(map);
                bounds.extend(marker.getLatLng());
            });

            // Ajustar límites del mapa basados en los marcadores solo si shouldFitBounds es true y bounds es válido
            if (shouldFitBounds && bounds.isValid()) {
                map.fitBounds(bounds);
                setShouldFitBounds(false);
            }
        }
    }, [
        activeLotes,
        highlightedLote,
        polygonsData,
        polygons,
        bufferedIntersections,
        bufferedLines,
        lines,
        memoizedMarkers,
        shouldFitBounds,
        stretchPoints,
        lineasNoFiltradas,
    ]);




    return (
        <Box position="relative">

            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                key={mapKey}
                style={{ height: '65vh', width: '100%' }}
                ref={localMapRef}
                whenReady={(map) => {
                    localMapRef.current = map;
                    setInitialBoundsSet(true);
                }}
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

                    {memoizedPolygons}

                    {/** Luego renderizamos las líneas rojas */}
                    {lines && lines.map((line, index) => {

                        return (
                            <Polyline
                                key={`line-${index}`}
                                positions={line.polyline._latlngs}
                                color="red" // Puede ajustar el color aquí si es necesario
                                onMouseOver={(e) => onLineHover(e, line.id)}
                                onMouseOut={(e) => onLineMouseOut(e, line.id)}
                                onClick={(e) => onLineClick(line.polyline._latlngs, e)}
                            />
                        );
                    })}

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