import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { API_BASE_URL } from "../../utils/config";

const { BaseLayer } = LayersControl;

const MapComponent = () => {
    const [points, setPoints] = useState([]);
    const [filteredPoints, setFilteredPoints] = useState([]); // Estado para almacenar los puntos filtrados
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [filterAutoPilot, setFilterAutoPilot] = useState(false);
    const [mapKey, setMapKey] = useState(Date.now()); // Estado para la clave única del mapa
    const workerRef = useRef(null);

    useEffect(() => {
        workerRef.current = new Worker('dataWorker.js');

        workerRef.current.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                if (e.data.data && e.data.data.length > 0) {
                    setPoints(e.data.data);
                    setFilteredPoints(e.data.data); // Inicializamos los puntos filtrados

                    const polygon = L.polygon(e.data.data.map(point => {
                        const [longitude, latitude] = point.geometry.coordinates;
                        return [longitude, latitude];
                    }));

                    const center = polygon.getBounds().getCenter();
                    setMapCenter([center.lat, center.lng]);
                }
            }
        };

        const socket = io(API_BASE_URL);
        socket.on('updateGeoJSONLayer', (geojsonData) => {
            if (geojsonData) {
                workerRef.current.postMessage({ action: 'processGeoJsonData', geojsonData });
            }
        });

        return () => {
            workerRef.current.terminate();
            socket.off('updateGeoJSONLayer');
        };
    }, []);

    const toggleFilter = () => {
        setFilterAutoPilot(current => !current);
        // Actualizamos la clave del mapa para forzar la re-creación del mapa y todos sus hijos
        setMapKey(Date.now());
    };

    useEffect(() => {
        if (filterAutoPilot) {
            // Aplicar el filtro solo cuando esté activo
            setFilteredPoints(points); // Muestra todos los puntos pero con colores condicionales
        } else {
            // Sin filtro, todos los puntos son azules
            setFilteredPoints(points);
        }
    }, [filterAutoPilot, points]);

    return (
        <>
            <button onClick={toggleFilter}>
                {filterAutoPilot ? 'Mostrar Todos' : 'Filtrar por Piloto Automático'}
            </button>
            <MapContainer key={mapKey} center={mapCenter} zoom={2} style={{ height: '100vh', width: '100%' }}>
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
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}&y}.png"
                            maxZoom={19}
                        />
                    </BaseLayer>
                    {filteredPoints.map((point, idx) => {
                        const coordinates = point.geometry.coordinates;
                        console.log("CONDICION: " + filteredPoints + "&&" + point.properties.piloto_automatico === 1);
                        const fillColor = filterAutoPilot && point.properties.piloto_automatico === 1 ? 'red' : 'blue';

                        return (
                            <CircleMarker
                                key={idx}
                                center={[coordinates[0], coordinates[1]]}
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
