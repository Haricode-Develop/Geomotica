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
    return validFeatures.map(feature => feature.geometry.coordinates);
}