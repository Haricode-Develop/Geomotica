
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
            if (coord.length >= 2) {
                return [coord[1], coord[0]];
            } else {
                return null;
            }
        }).filter(coord => coord != null)
    );
}

function processGeoJsonData(geojsonData) {
    console.log("ESTO ES EL GEOJSON PURO: ", geojsonData);
    const validFeatures = geojsonData.features.filter(feature => {
        const hasCoordinates = feature.geometry && feature.geometry.coordinates;
        return hasCoordinates;
    });

    const polygonFeatures = geojsonData.features.filter(feature => feature.geometry.type === 'Polygon');

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
    let lineFeatures = geojsonData.features.filter(feature => feature.properties && feature.properties.type === 'KML');
    lineFeatures.forEach(feature => {
        if (feature.geometry.type !== 'LineString') {
            feature.geometry.type = 'LineString';
        }
    });
    return {
        lines: lineFeatures.map(feature => {
            const path = feature.geometry.coordinates.map(coord => {
                if (coord.length >= 2) {
                    return [coord[1], coord[0]];
                }
                return null;
            }).filter(coord => coord != null);
            return {
                id: feature.id,
                properties: feature.properties,
                path: path
            };
        })
    };
}



