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
    const workerRef = useRef(null);

    useEffect(() => {
        // Inicializar el worker
        workerRef.current = new Worker('dataWorker.js');

        workerRef.current.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                // Actualizar los puntos del estado con los datos procesados
                setPoints(e.data.data);

                if (e.data.data.length > 0) {
                    // Suponiendo que e.data.data contiene la geometría del polígono
                    const polygon = L.polygon(e.data.data.map(point => [point[0], point[1]]));
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

    return (
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
                {points.map((point, idx) => (
                    <CircleMarker
                        key={idx}
                        center={[point[0], point[1]]}
                        radius={5}
                        fillColor="blue"
                        color="blue"
                        weight={1}
                        opacity={1}
                        fillOpacity={0.8}
                    />
                ))}
            </LayersControl>
        </MapContainer>
    );
};

export default MapComponent;
