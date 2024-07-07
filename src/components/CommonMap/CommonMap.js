import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Popup, LayersControl, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const { BaseLayer } = LayersControl;

const CommonMap = ({
                       center,
                       zoom,
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
                   }) => {
    const localMapRef = useRef(null);
    const [popupInfo, setPopupInfo] = useState(null);

    useEffect(() => {
        if (localMapRef.current) {
            mapRef.current = localMapRef.current;

            if (points && points.length > 0) {
                const validLatLngs = points
                    .map(point => {
                        const coordinates = point.geometry.coordinates;
                        if (coordinates.length >= 2 && coordinates.every(coord => typeof coord === 'number')) {
                            return [coordinates[1], coordinates[0]];
                        }
                        return null;
                    })
                    .filter(coord => coord !== null);
                if (validLatLngs.length > 0) {
                    const bounds = L.latLngBounds(validLatLngs);
                    localMapRef.current.fitBounds(bounds);
                }
            }
        }

    }, [localMapRef, mapRef, polygons, lines, points]);

    const getPolygonColor = (properties) => {
        if (!activeFilter || !properties || !filterValues[activeFilter]) {
            return 'green';
        }

        const key = activeFilter;
        const value = properties[key];

        if(activeFilter === 'AUTO_TRACKET' || activeFilter === 'PILOTO_AUTOMATICO'){
            if(value && value.toLowerCase() === 'engaged'){
                return 'blue';
            }else{
                return 'green';
            }
        }else if(activeFilter === 'MODO_CORTE_BASE'){
            if(value && value.toLowerCase() === 'automatic'){
                return 'green';
            }else{
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

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '65vh', width: '100%', borderRadius: '20px' }} ref={localMapRef}>
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

                {points && points.map((point, idx) => {
                    const coordinates = point.geometry.coordinates;
                    let fillColor = "blue";
                    if (activeFilter) {
                        fillColor = getPolygonColor(point.properties);
                    }
                    if (coordinates.length >= 2) {
                        return (
                            <CircleMarker
                                key={idx}
                                center={[coordinates[1], coordinates[0]]}
                                radius={5}
                                fillColor={fillColor}
                                color={fillColor}
                                weight={0.2}
                                opacity={1}
                                fillOpacity={1}
                            />
                        );
                    }
                    return null;
                })}

                {polygons && polygons.map((polygon, index) => {
                    if (!Array.isArray(polygon) || polygon.length === 0) {
                        return null;
                    }

                    const propiedades = polygonProperties[index];
                    if (!propiedades) {
                        console.error(`Propiedades faltantes para el polígono en el índice ${index}`);
                        return null;
                    }

                    const positions = polygon.map(coord => {
                        if (Array.isArray(coord) && coord.length === 2) {
                            return { lat: coord[1], lng: coord[0] };
                        }
                        console.error(`Coordenada inválida en el polígono ${index}:`, coord);
                        return null;
                    }).filter(coord => coord !== null);

                    return (
                        <Polygon
                            key={`${activeFilter}-${index}-${filterValues[activeFilter]?.low}-${filterValues[activeFilter]?.medium}-${filterValues[activeFilter]?.high}`}
                            positions={positions}
                            color={getPolygonColor(propiedades)}
                            weight={3}
                        />
                    );
                })}

                {lines && lines.map((line, index) => (
                    <Polyline
                        key={`line-${index}`}
                        positions={line.polyline._latlngs}
                        color="red"
                        onmouseover={(e) => onLineHover(e, line.id)}
                        onmouseout={(e) => onLineMouseOut(e, line.id)}
                        onclick={(e) => onLineClick(line.polyline._latlngs, e)}
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
    );
};

export default CommonMap;