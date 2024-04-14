import React, { useEffect, useState } from 'react';
import './AplicacionesAreasStyle.css';
import { MapContainer, TileLayer, Polygon, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import { API_BASE_URL } from '../../utils/config';
import { polygon as turfPolygon, intersect as turfIntersect } from '@turf/turf';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField, Tooltip } from '@mui/material';

const { BaseLayer } = LayersControl;

const AplicacionesAreas = ({ idAnalisis, tipoAnalisis }) => {
    const [poligonos, setPoligonos] = useState([]);
    const [areasSuperpuestas, setAreasSuperpuestas] = useState([]);
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [zoom, setZoom] = useState(3);
    const [map, setMap] = useState(null);

    useEffect(() => {
        // Effect for socket and worker
        const worker = new Worker('dataWorker.js');
        const socket = io(API_BASE_URL);

        worker.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                const { polygons } = e.data.data;
                const formattedPolygons = polygons.map(poly => formatPolygon(poly.polygon[0]));
                setPoligonos(formattedPolygons);
            }
        };

        socket.on('updateGeoJSONLayer', (geojsonData) => {
            worker.postMessage({ action: 'processGeoJsonData', geojsonData, type: tipoAnalisis });
        });

        return () => {
            worker.terminate();
            socket.off('updateGeoJSONLayer');
            socket.disconnect();
        };
    }, [tipoAnalisis]);

    useEffect(() => {
        // Effect for handling map-related operations
        console.log("ESTE ES EL MAP: ", map);
        if (map && poligonos.length > 0) {
            const latLngCoords = poligonos.flatMap(polygon =>
                polygon.map(coordPair => [coordPair[1], coordPair[0]])
            );
            const mapBounds = L.latLngBounds(latLngCoords);
            if (mapBounds.isValid()) {
              //  map.fitBounds(mapBounds);
                findIntersections(poligonos);
            }
        }
    }, [map, poligonos]);

    const formatPolygon = (polygon) => {
        if (polygon[0] !== polygon[polygon.length - 1]) {
            polygon.push(polygon[0]); // Ensure the polygon is closed by appending the first coordinate at the end
        }
        return polygon;
    };

    const findIntersections = (polygons) => {
        let intersections = [];
        polygons.forEach((poly1, i) => {
            polygons.slice(i + 1).forEach(poly2 => {
                const intersection = turfIntersect(turfPolygon([poly1]), turfPolygon([poly2]));
                if (intersection) {
                    if (intersection.geometry.type === 'MultiPolygon') {
                        intersection.geometry.coordinates.forEach(coords => {
                            intersections.push(coords[0]); // Assume the first ring defines the outer boundary
                        });
                    } else if (intersection.geometry.type === 'Polygon') {
                        intersections.push(intersection.geometry.coordinates[0]); // Directly use the coordinates
                    }
                }
            });
        });
        setAreasSuperpuestas(intersections);
    };

    if (!mapCenter) return <div>Cargando mapa...</div>;

    return (
        
        <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100vh', width: '100%' }}
            whenReady={setMap}
        >
            <LayersControl position="topright">
                <BaseLayer checked name="Satellite View">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        minZoom={3}
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
                {poligonos.map((polygon, index) => (
                    <Polygon key={index} positions={polygon} color="magenta" weight={3} />
                ))}
                {areasSuperpuestas.map((area, index) => (
                    <Polygon key={`intersection-${index}`} positions={area} color="red" weight={3} />
                ))}
            </LayersControl>
        </MapContainer>
    );
};

export default AplicacionesAreas;
