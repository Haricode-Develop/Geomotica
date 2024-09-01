import { Polygon } from 'react-leaflet';
import L from 'leaflet';

export const getLoteId = (properties) => {
    try {
        if (!properties || typeof properties !== 'object') {
            return null;
        }

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
    } catch (error) {
        console.error('Error in getLoteId:', error);
        return null;
    }
};

export const memoizedPolygons = (localMapRef, polygonsData, activeLotes, onHoverLote, onLeaveLote, onSelectLote) => {
    try {
        if (!localMapRef?.current) {
            return null;
        }

        if (!Array.isArray(polygonsData) || polygonsData.length === 0) {
            return null;
        }

        const mapBounds = localMapRef.current.getBounds();

        return polygonsData
            .filter(polygon => {
                if (!polygon?.geometry?.coordinates?.[0] || !Array.isArray(polygon.geometry.coordinates[0])) {
                    return false;
                }

                try {
                    const positions = polygon.geometry.coordinates[0].map(coord => {
                        if (!Array.isArray(coord) || coord.length !== 2) {
                            throw new Error('Invalid coordinate pair');
                        }
                        return [coord[1], coord[0]];
                    });

                    const polygonBounds = L.polygon(positions).getBounds();
                    return mapBounds.intersects(polygonBounds);

                } catch (innerError) {
                    return false;
                }
            })
            .map((polygon, index) => {
                const loteId = getLoteId(polygon.properties);
                if (Array.isArray(activeLotes) && activeLotes.length > 0 && !activeLotes.includes(loteId)) {
                    return null;
                }

                try {
                    const positions = polygon.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                    return (
                        <Polygon
                            key={`polygon-${index}-${loteId}`}
                            positions={positions}
                            color={activeLotes.includes(loteId) ? 'red' : '#ffa033'}
                            weight={3}
                            renderer={L.canvas()}  // Asegurar que usa canvas
                            eventHandlers={{
                                mouseover: () => onHoverLote(loteId),
                                mouseout: onLeaveLote,
                                click: () => onSelectLote(loteId),
                            }}
                        />
                    );
                } catch (polygonError) {
                    console.error('Error rendering polygon:', polygonError, polygon);
                    return null;
                }
            })
            .filter(polygon => polygon !== null);
    } catch (error) {
        console.error('Error in memoizedPolygons:', error);
        return null;
    }
};

export const externalPolygons = (polygons, polygonProperties) => {
    try {
        if (!Array.isArray(polygons) || polygons.length === 0) {
            return null;
        }

        if (!Array.isArray(polygonProperties) || polygonProperties.length !== polygons.length) {
            console.error('externalPolygons: polygonProperties is invalid or does not match polygons length', polygonProperties);
            return null;
        }

        return polygons.map((polygonObj, index) => {
            const polygon = Object.values(polygonObj).filter(coord => Array.isArray(coord) && coord.length === 2);

            if (!polygon || !Array.isArray(polygon) || polygon.length === 0) {
                console.error(`externalPolygons: invalid positions at index ${index}`, polygon);
                return null;
            }

            const properties = polygonProperties[index];
            const color = properties?.color || 'green';
            const areCoordinatesValid = polygon.every(coord => {
                return Array.isArray(coord) && coord.length === 2 &&
                    typeof coord[0] === 'number' && typeof coord[1] === 'number' &&
                    !isNaN(coord[0]) && !isNaN(coord[1]);
            });

            if (!areCoordinatesValid) {
                console.error(`externalPolygons: invalid coordinates at index ${index}`, polygon);
                return null;
            }

            return (
                <Polygon
                    key={`external-polygon-${index}-${Date.now()}`}
                    positions={polygon.map(coord => [coord[1], coord[0]])}
                    color={color}
                    weight={3}
                    renderer={L.canvas()}  // Asegurar que usa canvas
                />
            );
        }).filter(polygon => polygon !== null);
    } catch (error) {
        console.error('Error in externalPolygons:', error);
        return null;
    }
};

export const memoizedMarkers = (points) => {
    try {
        if (!Array.isArray(points) || points.length === 0) {
            return [];
        }

        const renderer = L.canvas();

        return points
            .map(point => {
                const { coordinates } = point.geometry || {};
                const { color } = point;

                if (Array.isArray(coordinates) && coordinates.length >= 2) {
                    return L.circleMarker([coordinates[1], coordinates[0]], {
                        radius: 2,
                        fillColor: color,
                        color: color,
                        weight: 0.2,
                        opacity: 1,
                        fillOpacity: 1,
                        renderer: renderer,  // Asegurar que usa canvas
                    });
                } else {
                    return null;
                }
            })
            .filter(marker => marker !== null);
    } catch (error) {
        console.error('Error in memoizedMarkers:', error);
        return [];
    }
};
