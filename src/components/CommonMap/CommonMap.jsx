import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, Polyline, Popup, useMap } from 'react-leaflet';
import { Box } from '@mui/material';
import { handleZoom, throttledHandleMoveEnd, fitBoundsIfValid } from '../../analysis/AnalysisMapping/MappingGeneral';
import { getLoteId, memoizedPolygons, externalPolygons, memoizedMarkers } from '../../analysis/AnalysisMapping/CosechaMecanicaMapping';
import { addImageOverlay } from '../../analysis/AnalysisMapping/ConteoPalmasMapping';
import { getBufferedLines, getBufferedIntersections, getShowIntersections, getNonIntersectedAreas } from '../../analysis/AnalysisMapping/AplicacionesAereasMapping';
import L from 'leaflet';
import throttle from 'lodash/throttle';  // Asegúrate de importar throttle desde lodash
import { useAddImageOverlay } from "../../analysis/AnalysisMapping/ConteoPalmasMapping";

const { BaseLayer } = LayersControl;

const CommonMap = (props) => {
    const {
        center = [14.634915, -90.506882],
        zoom = 8,
        polygons = [],
        lines = [],
        points = [],
        areasSuperpuestas = [],
        nonIntersectedAreas = [],
        bufferedLines = [],
        bufferedIntersections = [],
        onLineHover = () => {},
        onLineMouseOut = () => {},
        onLineClick = () => {},
        polygonProperties = [],
        showIntersections = true,
        mapRef = { current: null },
        stretchPoints = [],
        lineasNoFiltradas = [],
        polygonsData = [],
        highlightedLote = null,
        activeLotes = [],
        onSelectLote = () => {},
        onHoverLote = () => {},
        onLeaveLote = () => {},
        setImgLaflet = () => {},
        popupInfo = null,
        setPopupInfo = () => {},
        imageUrl = '',
        northWestCoords = [0, 0],
        southEastCoords = [0, 0]
    } = props;

    const localMapRef = useRef(null);
    const [mapCenter, setMapCenter] = useState(center);
    const [mapZoom, setMapZoom] = useState(zoom);
    const [initialBoundsSet, setInitialBoundsSet] = useState(false);
    const [mapKey, setMapKey] = useState(Date.now());
    const [shouldFitBounds, setShouldFitBounds] = useState(true);
    const [isFirstPolygons, setIsFirstPolygons] = useState(true);
    const markersRef = useRef([]);
    const previousPointsRef = useRef(points || []);
    const imageOverlayRef = useRef(null);

    const throttledHandleZoom = throttle(() => handleZoom(localMapRef, setMapZoom), 100);

    const MapEffect = () => {
        const map = useMap();

        useEffect(() => {
            if (map) {
                localMapRef.current = map;
                mapRef.current = map;
                map.on('moveend', () => throttledHandleMoveEnd(localMapRef, setMapCenter));
            }
            return () => {
                if (map) {
                    map.off('moveend', throttledHandleMoveEnd);
                }
            };
        }, [map]);

        return null;
    };

    useEffect(() => {
        try {
            addImageOverlay(mapRef, imageUrl, northWestCoords, southEastCoords, imageOverlayRef, setInitialBoundsSet, initialBoundsSet);
        } catch (error) {
            console.error("Error in useEffect [addImageOverlay]:", error);
        }
    }, [localMapRef, imageUrl, northWestCoords, southEastCoords]);

    useEffect(() => {
        try {
            if (localMapRef.current && !initialBoundsSet) {
                mapRef.current = localMapRef.current;
                const bounds = new L.LatLngBounds();

                if (Array.isArray(points) && points.length > 0) {
                    points.forEach(point => {
                        const coordinates = point.geometry?.coordinates;
                        if (Array.isArray(coordinates) && coordinates.length >= 2) {
                            bounds.extend([coordinates[1], coordinates[0]]);
                        }
                    });
                }

                if (Array.isArray(lines) && lines.length > 0) {
                    lines.forEach(line => {
                        if (line.polyline && Array.isArray(line.polyline._latlngs)) {
                            line.polyline._latlngs.forEach(latlng => {
                                bounds.extend([latlng.lat, latlng.lng]);
                            });
                        }
                    });
                }

                if (Array.isArray(polygons) && polygons.length > 0) {
                    polygons.forEach(polygon => {
                        polygon.forEach(coord => {
                            if (Array.isArray(coord) && coord.length >= 2) {
                                bounds.extend([coord[1], coord[0]]);
                            }
                        });
                    });
                }

                fitBoundsIfValid(localMapRef.current, bounds);
                fitBoundsIfValid(mapRef.current, bounds);

                localMapRef.current.on('moveend', () => throttledHandleMoveEnd(localMapRef, setMapCenter));

                mapRef.current.on('moveend', () => throttledHandleMoveEnd(localMapRef, setMapCenter));

                setInitialBoundsSet(true);
                setShouldFitBounds(true);
            }

            return () => {
                try {
                    if (localMapRef.current) {
                        localMapRef.current.off('zoomend', throttledHandleZoom);
                        localMapRef.current.off('moveend', throttledHandleMoveEnd);
                    }
                    if (mapRef.current) {
                        mapRef.current.off('zoomend', throttledHandleZoom);
                        mapRef.current.off('moveend', throttledHandleMoveEnd);
                    }
                } catch (error) {
                    console.error("Error in cleanup [useEffect]:", error);
                }
            };
        } catch (error) {
            console.error("Error in useEffect [initialBoundsSet]:", error);
        }
    }, [points, lines, polygons, initialBoundsSet, throttledHandleZoom]);

    useEffect(() => {
        try {
            if (localMapRef.current) {
                const map = localMapRef.current;
                if (!map._loaded) {
                    console.error('El mapa aún no se ha cargado completamente.');
                    return;
                }

                const currentPoints = points || [];
                const previousPoints = previousPointsRef.current || [];

                const pointsHaveChanged =
                    previousPoints.length !== currentPoints.length ||
                    currentPoints.some(
                        (point, index) =>
                            point.geometry?.coordinates[0] !== previousPoints[index]?.geometry.coordinates[0] ||
                            point.geometry?.coordinates[1] !== previousPoints[index]?.geometry.coordinates[1] ||
                            point.color !== previousPoints[index]?.color
                    );

                if (pointsHaveChanged) {
                    markersRef.current.forEach((marker) => map.removeLayer(marker));
                    markersRef.current = [];

                    previousPointsRef.current = currentPoints;
                    markersRef.current = memoizedMarkers(points);
                    let bounds = new L.LatLngBounds();

                    markersRef.current.forEach((marker) => {
                        marker.addTo(map);
                        const latLng = marker.getLatLng();
                        if (latLng && latLng.lat && latLng.lng) {
                            bounds.extend(latLng);
                        } else {
                            console.error('El marcador tiene coordenadas no válidas:', latLng);
                        }
                    });

                    if (shouldFitBounds && bounds.isValid()) {
                        map.fitBounds(bounds);
                        setShouldFitBounds(false);
                        setInitialBoundsSet(true);
                    }
                }

                map.eachLayer((layer) => {
                    if (
                        layer instanceof L.Polygon ||
                        layer instanceof L.Polyline ||
                        layer instanceof L.LayerGroup
                    ) {
                        map.removeLayer(layer);
                    }
                });

                const filteredPolygons =
                    Array.isArray(activeLotes) && activeLotes.length > 0
                        ? polygonsData.filter((feature) =>
                            activeLotes.includes(getLoteId(feature.properties))
                        )
                        : polygonsData;

                const geojsonLayer = L.geoJSON(filteredPolygons, {
                    style: (feature) => ({
                        color: activeLotes.includes(getLoteId(feature.properties)) ? 'red' : '#ffa033',
                        weight: highlightedLote === getLoteId(feature.properties) ? 3 : 1,
                    }),
                    renderer: L.canvas(),  // Asegurar que usa canvas
                });
                geojsonLayer.addTo(map);

                let bounds = new L.LatLngBounds();

                if (Array.isArray(activeLotes) && activeLotes.length > 0) {
                    const boundsPolygons = geojsonLayer.getBounds();
                    if (boundsPolygons.isValid()) {
                        bounds.extend(boundsPolygons);
                    } else {
                        console.error('Los límites calculados para los polígonos no son válidos.');
                    }
                }

                if (Array.isArray(polygons) && polygons.length > 0) {
                    polygons.forEach((polygon, index) => {
                        const positions = polygon.map(coord => [coord[1], coord[0]]);
                        const polygonColor = polygonProperties[index]?.color || 'green';
                        const polygonLayer = L.polygon(positions, {
                            color: polygonColor,
                            weight: 3,
                            renderer: L.canvas(),  // Asegurar que usa canvas
                        }).addTo(map);
                        bounds.extend(polygonLayer.getBounds());
                    });
                }
                if (Array.isArray(areasSuperpuestas) && areasSuperpuestas.length > 0) {
                    areasSuperpuestas.forEach((area) => {
                        const positions = area.map(coord => [coord[1], coord[0]]);
                        const areaLayer = L.polygon(positions, {
                            color: 'red',
                            weight: 3,
                            renderer: L.canvas()  // Asegurar que usa canvas
                        }).addTo(map);
                        bounds.extend(areaLayer.getBounds());
                    });
                }

                if (Array.isArray(lineasNoFiltradas) && lineasNoFiltradas.length > 0) {
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

                if (Array.isArray(lines) && lines.length > 0) {
                    lines.forEach((line) => {
                        if (line && Array.isArray(line.polyline._latlngs)) {
                            const positions = line.polyline._latlngs.map((coord) => [
                                coord.lat,
                                coord.lng,
                            ]);
                            const lineLayer = L.polyline(positions, {
                                color: 'red',
                                weight: 3,
                            })
                                .on('mouseover', (e) => {
                                    onLineHover(e, line.id);
                                    e.target.bringToFront();
                                })
                                .on('mouseout', (e) => {
                                    onLineMouseOut(e, line.id);
                                    e.target.bringToBack();
                                })
                                .on('click', (e) => onLineClick(line.polyline._latlngs, e))
                                .addTo(map);


                            bounds.extend(lineLayer.getBounds());
                        }
                    });
                }


                // Añadir líneas buffer al mapa
                if (Array.isArray(bufferedLines)) {
                    const layers = getBufferedLines(bufferedLines);
                    layers.forEach(layer => {
                        if (layer) {
                            layer.addTo(map); // Añadir cada capa al mapa
                        }
                    });
                }
                // Añadir intersecciones buffer al mapa
                if (Array.isArray(bufferedIntersections)) {
                    const layers = getBufferedIntersections(bufferedIntersections);
                    layers.forEach(layer => {
                        if (layer) {
                            layer.addTo(map); // Añadir cada capa al mapa
                        }
                    });
                }

                // Añadir áreas superpuestas al mapa
                if (Array.isArray(areasSuperpuestas)) {
                    const layers = getShowIntersections(areasSuperpuestas);
                    layers.forEach(layer => {
                        if (layer) {
                            layer.addTo(map); // Añadir cada capa al mapa
                        }
                    });
                }

                // Añadir áreas no intersectadas al mapa
                if (Array.isArray(nonIntersectedAreas)) {
                    const layers = getNonIntersectedAreas(nonIntersectedAreas);
                    layers.forEach(layer => {
                        if (layer) {
                            layer.addTo(map); // Añadir cada capa al mapa
                        }
                    });
                }
                if (isFirstPolygons && Array.isArray(polygonsData) && polygonsData.length > 0) {
                    mapRef.current = localMapRef.current;
                    map.fitBounds(L.geoJSON(polygonsData).getBounds());
                    setIsFirstPolygons(false);
                }

                if (stretchPoints) {
                    stretchPoints.forEach((marker) => {
                        marker.addTo(map);
                        bounds.extend(marker.getLatLng());
                    });
                }

                if (!initialBoundsSet && shouldFitBounds && bounds.isValid()) {
                    map.fitBounds(bounds);
                    setShouldFitBounds(false);
                }
            }
        } catch (error) {
            console.error("Error in useEffect [map manipulation]:", error);
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
        polygonProperties,
    ]);





    return (
        <Box position="relative">
            <MapContainer
                center={Array.isArray(mapCenter) && mapCenter.length === 2 ? mapCenter : [0, 0]}
                zoom={typeof mapZoom === 'number' ? mapZoom : 8}
                key={mapKey}
                style={{ height: '65vh', width: '100%' }}
                ref={localMapRef}
                whenReady={(map) => {
                    if (map) {
                        localMapRef.current = map;
                        mapRef.current = map;
                        setInitialBoundsSet(true);
                    }
                }}
            >
                <MapEffect />

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
                </LayersControl>

                {popupInfo?.position && (
                    <Popup position={popupInfo.position} onClose={() => setPopupInfo(null)}>
                        <div dangerouslySetInnerHTML={{ __html: popupInfo.content }} />
                    </Popup>
                )}


            </MapContainer>
        </Box>
    );
};

export default React.memo(CommonMap);