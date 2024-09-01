import L from 'leaflet';

const createPolygonLayer = (coordinates, color) => {
    const positions = coordinates.map(coord => [coord[1], coord[0]]);
    return L.polygon(positions, {
        color: color,
        weight: 3,
    });
};

export const getBufferedLines = (bufferedLines) => {
    if (!Array.isArray(bufferedLines)) return [];
    return bufferedLines.map((bufferedLine, index) => {
        const coordinates = bufferedLine.geometry?.coordinates[0];
        if (!Array.isArray(coordinates)) return null;
        return createPolygonLayer(coordinates, 'purple');
    }).filter(layer => layer !== null);
};

export const getBufferedIntersections = (bufferedIntersections) => {
    if (!Array.isArray(bufferedIntersections)) return [];
    return bufferedIntersections.map(intersection => {
        if (!Array.isArray(intersection)) return null;
        return createPolygonLayer(intersection, 'blue');
    }).filter(layer => layer !== null);
};

export const getShowIntersections = (areasSuperpuestas) => {
    if (!Array.isArray(areasSuperpuestas)) return [];
    return areasSuperpuestas.map(area => {
        if (!Array.isArray(area)) return null;
        return createPolygonLayer(area, 'red');
    }).filter(layer => layer !== null);
};

export const getNonIntersectedAreas = (nonIntersectedAreas) => {
    if (!Array.isArray(nonIntersectedAreas)) return [];
    return nonIntersectedAreas.map(nonIntersected => {
        if (!Array.isArray(nonIntersected)) return null;
        return createPolygonLayer(nonIntersected, 'yellow');
    }).filter(layer => layer !== null);
};
