// Este script se ejecuta en un contexto de Web Worker

self.onmessage = function(e) {
    const { action, geojsonData } = e.data;

    switch (action) {
        case 'processGeoJsonData':
            const processedData = processGeoJsonData(geojsonData);
            self.postMessage({ action: 'geoJsonDataProcessed', data: processedData });
            break;

        default:
            console.error('Acción no reconocida en el worker:', action);
            break;
    }
};

function processGeoJsonData(geojsonData) {
    // Filtra las features que no tienen una geometría definida
    const validFeatures = geojsonData.features.filter(feature => feature.geometry && feature.geometry.coordinates);

    // Busca y extrae el polígono si está presente
    const polygonFeature = geojsonData.features.find(feature => feature.geometry.type === 'Polygon');
    const polygonCoordinates = polygonFeature ? polygonFeature.geometry.coordinates : [];

    return { points: validFeatures, polygon: polygonCoordinates.flat() };
}
