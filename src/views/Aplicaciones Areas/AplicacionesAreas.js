import React, { useEffect, useState } from 'react';
import './AplicacionesAreasStyle.css';
import { MapContainer, TileLayer, Polygon, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import { API_BASE_URL } from '../../utils/config';
import { polygon as turfPolygon, intersect as turfIntersect } from '@turf/turf';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField, Tooltip } from '@mui/material';
import { FaMap } from "react-icons/fa";

const { BaseLayer } = LayersControl;

const AplicacionesAreas = ({ idAnalisis, tipoAnalisis }) => {
    const [poligonos, setPoligonos] = useState([]);
    const [areasSuperpuestas, setAreasSuperpuestas] = useState([]);
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [zoom, setZoom] = useState(3);
    const [map, setMap] = useState(null);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [filterValues, setFilterValues] = useState({
        VELOCIDAD: { low: 10, medium: 30, high: 50 },
        ALTURA: { low: 5, medium: 10, high: 15 },
        DOSISREAL: { low: 0.5, medium: 1.5, high: 2.5 }  // Añadido valor medio para tener tres niveles
    });
    const [poligonosPropiedades, setPoligonosPropiedades] = useState([]);
    const [intersectionsKey, setIntersectionsKey] = useState(Date.now());
    const [showIntersections, setShowIntersections] = useState(true);
    useEffect(() => {
        const worker = new Worker('dataWorker.js');
        const socket = io(API_BASE_URL);

        worker.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                const { polygons } = e.data.data;
                const formattedPolygons = polygons.map(poly => formatPolygon(poly.polygon[0]));
                setPoligonosPropiedades(polygons.map(poly => poly.properties));
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
        if (map && poligonos.length > 0) {
            const latLngCoords = poligonos.flatMap(polygon =>
                polygon.map(coordPair => [coordPair[1], coordPair[0]])
            );
            const mapBounds = L.latLngBounds(latLngCoords);
            if (mapBounds.isValid() || activeFilter) {
                console.log("ENTRE A LAS INSERCTION");
                setIntersectionsKey(Date.now());

                findIntersections(poligonos);
            }
        }
    }, [map, poligonos, activeFilter]);

    const formatPolygon = (polygon) => {
        if (polygon[0] !== polygon[polygon.length - 1]) {
            polygon.push(polygon[0]);
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
                            intersections.push(coords[0]);
                        });
                    } else if (intersection.geometry.type === 'Polygon') {
                        intersections.push(intersection.geometry.coordinates[0]);
                    }
                }
            });
        });
        setAreasSuperpuestas(intersections);
    };

    const handleFilterChange = (e, filterType) => {
        const { checked } = e.target;
        if (checked) {
            setActiveFilter(filterType);
        } else {
            setActiveFilter(null);
            setIntersectionsKey(Date.now());

        }
    };

    const getPolygonColor = (properties) => {
        if (!activeFilter || !properties || !filterValues[activeFilter]) {
            return 'green';
            setIntersectionsKey(Date.now());
        }

        const key = activeFilter.toUpperCase();
        const value = properties[key];

        if (value === undefined) {
            return 'transparent';  // Manejar caso donde la propiedad no existe
        }

        const { low, medium, high } = filterValues[activeFilter];
        if (value < low) return 'green';
        if (value >= low && value < medium) return 'yellow';
        if (value >= medium && value <= high) return 'orange';
        return 'red';
    };

    useEffect(() => {
        if (activeFilter) {
            setPoligonos(poligonos.map(polygon => [...polygon]));
        }
    }, [activeFilter, filterValues]);

    const openFilterDialog = () => setIsFilterDialogOpen(true);
    const closeFilterDialog = () => setIsFilterDialogOpen(false);

    return (
        <>
            <div className="floating-filter-button">
                <Tooltip title="Configurar filtros">
                    <Button variant="contained" color="primary" onClick={openFilterDialog}>
                        <FaMap />
                    </Button>
                </Tooltip>
            </div>

            <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100vh', width: '100%' }} whenReady={setMap}>
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
                        <Polygon
                            key={`${activeFilter}-${index}-${filterValues[activeFilter]?.low}-${filterValues[activeFilter]?.medium}-${filterValues[activeFilter]?.high}`} // Cambia la clave para forzar la re-renderización
                            positions={polygon}
                            color={getPolygonColor(poligonosPropiedades[index])}
                            weight={3}
                        />
                    ))}

                    {showIntersections && areasSuperpuestas.map((area, index) => (
                        <Polygon key={`intersection-${index}-${intersectionsKey}`} positions={area} color="red" weight={3} />
                    ))}
                </LayersControl>
            </MapContainer>

            <Dialog open={isFilterDialogOpen} onClose={closeFilterDialog} aria-labelledby="draggable-dialog-title">
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Configuración de Filtros</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showIntersections}
                                    onChange={(e) => setShowIntersections(e.target.checked)}
                                    name="showIntersections"
                                />
                            }
                            label="Mostrar Intersecciones"
                        />
                        {Object.keys(filterValues).map(filterKey => (
                            <React.Fragment key={filterKey}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={activeFilter === filterKey}
                                            onChange={(e) => handleFilterChange(e, filterKey)}
                                            name={filterKey}
                                        />
                                    }
                                    label={`Activar Filtro de ${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`}
                                />
                                {Object.keys(filterValues[filterKey]).map(valueKey => (
                                    <TextField
                                        key={valueKey}
                                        label={`${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)} ${valueKey.charAt(0).toUpperCase() + valueKey.slice(1)}`}
                                        type="number"
                                        name={valueKey}
                                        value={filterValues[filterKey][valueKey]}
                                        onChange={(e) => {
                                            const newValues = {...filterValues};
                                            newValues[filterKey][valueKey] = parseFloat(e.target.value);
                                            setFilterValues(newValues);
                                        }}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeFilterDialog} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AplicacionesAreas;