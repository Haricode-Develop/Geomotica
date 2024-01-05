import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { API_BASE_URL } from "../../utils/config";

const { BaseLayer } = LayersControl;

const MapComponent = () => {
    const [points, setPoints] = useState([]);
    const [mapCenter, setMapCenter] = useState([0, 0]); // Estado para el centro del mapa
    const [filterAutoPilot, setFilterAutoPilot] = useState(false); // Estado para el filtro del piloto automático

    const workerRef = useRef(null);
    const isValidGeoJsonData = (data) => {
        return data && Array.isArray(data.features) && data.features.every(feature => feature.geometry && Array.isArray(feature.geometry.coordinates));
    };
    useEffect(() => {
        // Inicializar el worker
        workerRef.current = new Worker('dataWorker.js');

        workerRef.current.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                // Actualizar los puntos del estado con los datos procesados


                if(e.data.data === null){
                    console.log("Este es el data: ", e.data.data);
                    return;
                }else{
                    console.log("Este es el data lleno: ", e.data.data);
                }
                setPoints(e.data.data);
                if (e.data.data.length > 0) {
                    // Extraer las coordenadas de cada punto

                    const latLngs = e.data.data.map(feature => {
                        const [longitude, latitude] = feature.geometry.coordinates;
                        return [longitude, latitude]; // Invierte las coordenadas para LatLng
                    });
                    // Crear un polígono con las coordenadas extraídas

                    const polygon = L.polygon(latLngs);
                    console.log("Este es el poligono: ", polygon);

                    // Calcular el centro del polígono y actualizar el centro del mapa
                    const center = polygon.getBounds().getCenter();
                    setMapCenter([center.lat, center.lng]);
                }
            }
        };

        // Conectar al socket
        const socket = io(API_BASE_URL);
        socket.on('updateGeoJSONLayer', (geojsonData) => {
            if (!geojsonData) {
                console.log('Se recibieron datos GeoJSON nulos o indefinidos.');
                return;
            }
            console.log('Datos GeoJSON recibidos: ', geojsonData);
            // Enviar datos GeoJSON al worker para procesamiento
            workerRef.current.postMessage({ action: 'processGeoJsonData', geojsonData });
        });

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
            socket.off('updateGeoJSONLayer');
        };
    }, []);
    const toggleFilter = () => {
        setFilterAutoPilot(!filterAutoPilot);
    };

    return (
        <>
        <button onClick={toggleFilter}>
            {filterAutoPilot ? 'Mostrar Todos' : 'Filtrar por Piloto Automático'}
        </button>
        <MapContainer center={mapCenter} zoom={2} style={{ height: '100vh', width: '100%' }}>
            <LayersControl position="topright">
                <BaseLayer checked name="Satellite View">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
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
                {points.map((point, idx) => {
                    if (!point.geometry || !point.geometry.coordinates) {
                        console.log("Este es el punto que viene null: ", point);
                        return null;
                    }
                    const coordinates = point.geometry.coordinates;
                    const pilotoAutomatico = point.properties.piloto_automatico;

                    const fillColor = filterAutoPilot && pilotoAutomatico === 0 ? 'blue' : 'red';

                    return (
                        <CircleMarker
                            key={idx}
                            center={[coordinates[0], coordinates[1]]} // Latitud y Longitud invertidas
                            radius={5}
                            fillColor={fillColor}
                            color={fillColor}
                            weight={1}
                            opacity={1}
                            fillOpacity={0.8}
                        />
                    );
                })}

            </LayersControl>
        </MapContainer>
        </>

    );
};

export default MapComponent;
