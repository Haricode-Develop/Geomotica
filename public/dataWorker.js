let activarEdicionInteractiva = false;

async function loadGeoJsonFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error al cargar GeoJSON desde URL:", error);
        return null;
    }
}

self.onmessage = async function (e) {
    const { action, geojsonData, type } = e.data;


    switch (action) {
        case 'processGeoJsonData':
            if (geojsonData) {
                const { geojsonDataFiltradas, geojsonDataNoFiltradas } = geojsonData;

                // Carga las URLs de forma condicional
                const loadedGeoJsonFiltradas = geojsonDataFiltradas ? await loadGeoJsonFromUrl(geojsonDataFiltradas) : null;

                const loadedGeoJsonNoFiltradas = geojsonDataNoFiltradas ? await loadGeoJsonFromUrl(geojsonDataNoFiltradas) : null;

                let processedData = null;
                if (type === 'COSECHA_MECANICA') {

                    processedData = processGeoJsonData(await loadGeoJsonFromUrl(geojsonData));
                } else if (type === 'APLICACIONES_AEREAS') {
                    if (loadedGeoJsonFiltradas && loadedGeoJsonNoFiltradas) {
                        processedData = processBothKMLData(loadedGeoJsonFiltradas, loadedGeoJsonNoFiltradas);
                    } else if (loadedGeoJsonNoFiltradas) {
                        const isKMLType = loadedGeoJsonNoFiltradas.features.some(feature => feature.properties && feature.properties.type === 'KML');
                        if (isKMLType) {
                            processedData = processLineStringData(loadedGeoJsonNoFiltradas);
                        } else {
                            processedData = processAplicacionesAreasData(loadedGeoJsonNoFiltradas);
                        }
                    }
                }

                self.postMessage({ action: 'geoJsonDataProcessed', data: processedData, activarEdicionInteractiva });
            } else {
                console.error("GeoJSONData es null o undefined.");
            }
            break;

        case 'setActivarEdicionInteractiva':
            activarEdicionInteractiva = e.data.activarEdicionInteractiva;
            break;

        default:
            break;
    }
};

function extractCoordinates(feature) {
    let coordinates = feature.geometry.coordinates;

    // Verificar si el tipo de geometría es Polygon o MultiPolygon
    if (
        feature.geometry.type === "Polygon" ||
        feature.geometry.type === "MultiPolygon"
    ) {
        // Si el primer elemento no es un número, probablemente sea una estructura de tipo [ [ [] ] ]
        if (coordinates.length && !Array.isArray(coordinates[0][0])) {
            coordinates = [coordinates];
        }

        return coordinates.map((ring) =>
            ring.map((coord) => {
                if (
                    Array.isArray(coord) &&
                    coord.length >= 2 &&
                    typeof coord[0] === "number" &&
                    typeof coord[1] === "number"
                ) {
                    return [coord[1], coord[0]]; // Lat, Lng
                } else {
                    return null;
                }
            }).filter((coord) => coord != null)
        );
    }

    // Para geometrías tipo LineString o MultiLineString
    if (
        feature.geometry.type === "LineString" ||
        feature.geometry.type === "MultiLineString"
    ) {
        const pathCoordinates = Array.isArray(coordinates[0])
            ? coordinates
            : [coordinates];

        return pathCoordinates.map((coord) => {
            if (
                Array.isArray(coord) &&
                coord.length >= 2 &&
                typeof coord[0] === "number" &&
                typeof coord[1] === "number"
            ) {
                return [coord[1], coord[0]]; // Lat, Lng
            } else {
                console.error("Coordenada no válida encontrada:", coord);
                return null;
            }
        }).filter((coord) => coord != null);
    }

    console.error("Tipo de geometría no manejado:", feature.geometry.type);
    return [];
}

function processGeoJsonData(geojsonData) {
    const validFeatures = geojsonData.features.filter(feature => {
        const hasCoordinates = feature.geometry && feature.geometry.coordinates;
        return hasCoordinates;
    });

    const polygonFeatures = geojsonData.features.filter(feature => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon');
    let polygonCoordinates = [];
    let outsidePolygonCoordinates = [];

    if (polygonFeatures.length > 0) {
        // Asigna el primer polígono a polygonCoordinates
        polygonCoordinates = extractCoordinates(polygonFeatures[0]);

        // Si hay un segundo polígono, asignarlo a outsidePolygonCoordinates
        if (polygonFeatures.length > 1) {
            outsidePolygonCoordinates = extractCoordinates(polygonFeatures[1]);

        }
    }

    return {
        points: validFeatures,
        polygon: polygonCoordinates,
        outsidePolygon: outsidePolygonCoordinates
    };

}

function processAplicacionesAreasData(geojsonData) {
    const polygonFeatures = geojsonData.features.filter(feature => feature.geometry.type === 'Polygon');
    let polygons = polygonFeatures.map(feature => {
        const properties = feature.properties || {};
        return {
            id: feature.id,
            properties: properties,
            polygon: extractCoordinates(feature)
        };
    });
    return { polygons: polygons };
}

function processLineStringData(geojsonData) {
    let kmlFeatures = geojsonData.features.filter(feature => feature.properties && feature.properties.type === 'KML');

    let lineFeatures = [];
    let polygonFeatures = [];

    kmlFeatures.forEach(feature => {
        if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
            lineFeatures.push(feature);
        } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            polygonFeatures.push(feature);
        }
    });

    let lines = lineFeatures.map(feature => {
        const coordinates = feature.geometry.type === 'LineString'
            ? [feature.geometry.coordinates]
            : feature.geometry.coordinates;

        const paths = coordinates.map(line => line.map(coord => {
            if (Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                return [coord[1], coord[0]]; // Invertir las coordenadas
            }
            console.error('Coordenada no válida encontrada:', coord);
            return null;
        }).filter(coord => coord !== null));

        return {
            id: feature.id,
            properties: feature.properties,
            paths: paths
        };
    });

    let polygons = polygonFeatures.map(feature => {
        const coordinates = feature.geometry.type === 'Polygon'
            ? [feature.geometry.coordinates]
            : feature.geometry.coordinates;

        const rings = coordinates.map(polygon => polygon.map(ring => {
            return ring.map(coord => {
                if (Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                    return [coord[1], coord[0]]; // Invertir las coordenadas
                }
                console.error('Coordenada no válida encontrada:', coord);
                return null;
            }).filter(coord => coord !== null);
        }));

        return {
            id: feature.id,
            properties: feature.properties,
            rings: rings
        };
    });

    return {
        lines: lines,
        polygons: polygons
    };
}

function processBothKMLData(geojsonDataFiltradas, geojsonDataNoFiltradas) {
    // Procesar líneas no filtradas
    const kmlFeaturesNoFiltradas = geojsonDataNoFiltradas.features.filter(feature => feature.properties && feature.properties.type === 'KML');

    const lineFeaturesNoFiltradas = kmlFeaturesNoFiltradas.filter(feature => feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString');
    const polygonFeaturesNoFiltradas = kmlFeaturesNoFiltradas.filter(feature => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon');

    const linesNoFiltradas = lineFeaturesNoFiltradas.map(feature => ({
        id: feature.id,
        properties: feature.properties,
        paths: extractCoordinates(feature)
    }));

    const polygonsNoFiltradas = polygonFeaturesNoFiltradas.map(feature => ({
        id: feature.id,
        properties: feature.properties,
        rings: extractCoordinates(feature)
    }));

    // Procesar líneas filtradas
    const kmlFeaturesFiltradas = geojsonDataFiltradas.features.filter(feature => feature.properties && feature.properties.type === 'KML');

    const lineFeaturesFiltradas = kmlFeaturesFiltradas.filter(feature => feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString');
    const polygonFeaturesFiltradas = kmlFeaturesFiltradas.filter(feature => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon');

    const linesFiltradas = lineFeaturesFiltradas.map(feature => ({
        id: feature.id,
        properties: feature.properties,
        paths: extractCoordinates(feature)
    }));

    const polygonsFiltradas = polygonFeaturesFiltradas.map(feature => ({
        id: feature.id,
        properties: feature.properties,
        rings: extractCoordinates(feature)
    }));

    return {
        noFiltradas: {
            lines: linesNoFiltradas,
            polygons: polygonsNoFiltradas
        },
        filtradas: {
            lines: linesFiltradas,
            polygons: polygonsFiltradas
        }
    };
}