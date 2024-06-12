
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
    const {action, geojsonData, type} = e.data;

    switch (action) {
        case 'processGeoJsonData':
            if (geojsonData) {
                const loadedGeoJson = await loadGeoJsonFromUrl(geojsonData);
                if (loadedGeoJson) {
                    let processedData;


                    if(type === 'COSECHA_MECANICA'){
                        processedData = processGeoJsonData(loadedGeoJson);
                    }else if(type === 'APLICACIONES_AEREAS'){
                        const isKMLType = loadedGeoJson.features.some(feature => feature.properties && feature.properties.type === 'KML');
                        if (isKMLType) {
                            processedData = processLineStringData(loadedGeoJson);
                        } else {
                            processedData = processAplicacionesAreasData(loadedGeoJson);
                        }
                    }

                    self.postMessage({action: 'geoJsonDataProcessed', data: processedData});
                }
            }
            break;

        default:
            console.error('Acción no reconocida en el worker:', action);
            break;
    }
};

function extractCoordinates(feature) {
    let coordinates = feature.geometry.coordinates;

    if (coordinates.length && coordinates[0].length && typeof coordinates[0][0][0] !== 'number') {
        coordinates = coordinates[0];
    }

    return coordinates.map(ring =>
        ring.map(coord => {
            if (Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                return [coord[1], coord[0]];
            } else {
                console.error('Coordenada no válida encontrada:', coord);
                return null;
            }
        }).filter(coord => coord != null)
    );
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
    console.log("ESTOS ES EL GEOJSON: ", geojsonData);

    // Filtrar las características que tienen el tipo 'KML' en sus propiedades
    let kmlFeatures = geojsonData.features.filter(feature => feature.properties && feature.properties.type === 'KML');
    console.log("FEATURES: ", kmlFeatures);

    let lineFeatures = [];
    let polygonFeatures = [];

    // Separar las características de líneas y polígonos
    kmlFeatures.forEach(feature => {
        if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
            lineFeatures.push(feature);
        } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            polygonFeatures.push(feature);
        }
    });

    // Procesar las líneas y convertir las coordenadas
    let lines = lineFeatures.map(feature => {
        // Si la geometría es 'LineString', encapsular sus coordenadas en un array para tratarlo de manera uniforme
        const coordinates = feature.geometry.type === 'LineString'
            ? [feature.geometry.coordinates]
            : feature.geometry.coordinates;

        // Convertir las coordenadas y filtrar las inválidas
        const paths = coordinates.map(line => {
            return line.map(coord => {
                if (Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                    return [coord[1], coord[0]]; // Invertir las coordenadas
                }
                console.error('Coordenada no válida encontrada:', coord);
                return null;
            }).filter(coord => coord != null); // Filtrar coordenadas inválidas
        });

        return {
            id: feature.id,
            properties: feature.properties,
            paths: paths
        };
    });

    // Procesar los polígonos y convertir las coordenadas
    let polygons = polygonFeatures.map(feature => {
        const coordinates = feature.geometry.type === 'Polygon'
            ? [feature.geometry.coordinates]
            : feature.geometry.coordinates;

        const rings = coordinates.map(polygon => {
            return polygon.map(ring => {
                return ring.map(coord => {
                    if (Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                        return [coord[1], coord[0]]; // Invertir las coordenadas
                    }
                    console.error('Coordenada no válida encontrada:', coord);
                    return null;
                }).filter(coord => coord != null); // Filtrar coordenadas inválidas
            });
        });

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
