import React, { useEffect, useState, useRef } from 'react';
import './AplicacionesAreasStyle.css';
import { MapContainer, TileLayer, Polygon, LayersControl, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import { API_BASE_URL } from '../../utils/config';
import { points as turfPoints, polygon as turfPolygon, area as turfArea, convex as turfConvex, union as turfUnion, difference as turfDifference, intersect as turfIntersect, buffer as turfBuffer } from '@turf/turf';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField, Tooltip } from '@mui/material';
import { FaMap } from "react-icons/fa";
import BarIndicator from "../../components/BarIndicator/BarIndicator";

const { BaseLayer } = LayersControl;

const AplicacionesAreas = ({ idAnalisis, tipoAnalisis, onAreasCalculated, onPromediosCalculated }) => {
    const [poligonos, setPoligonos] = useState([]);
    const [areasSuperpuestas, setAreasSuperpuestas] = useState([]);
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [map, setMap] = useState(null);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [velocidadFiltroActivado, setVelocidadFiltroActivado] = useState(false);
    const [alturaFiltroActivado, setAlturaFiltroActivado] = useState(false);
    const [dosisRealFiltroActivado, setDosisRealFiltroActivado] = useState(false);
    const [isMapaCreated, setIsMapaCreated] = useState(new Date());
    const [nonIntersectedAreas, setNonIntersectedAreas] = useState([]);
    const [poligonosPropiedades, setPoligonosPropiedades] = useState([]);
    const [intersectionsKey, setIntersectionsKey] = useState(Date.now());
    const [showIntersections, setShowIntersections] = useState(true);
    const [areaSobreAplicada, setAreaSobreAplicada] = useState(0);
    const [areaAplicada, setAreaAplicada] = useState(0);
    const [lineas, setLineas] = useState([]);
    const [bufferedLines, setBufferedLines] = useState([]);

    const [formData, setFormData] = useState({ idAnalisis: idAnalisis, });
    const mapRef = useRef();
    const [bufferedIntersections, setBufferedIntersections] = useState([]);
    const [poligonosKML, setPoligonosKML] = useState([]);

    useEffect(() => {
        const worker = new Worker('dataWorker.js');
        const socket = io(API_BASE_URL);

        worker.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                if (!e.data.data.lines && e.data.data.polygons) {
                    const { polygons } = e.data.data;
                    const formattedPolygons = polygons.map(poly => formatPolygon(poly.polygon[0]));
                    setPoligonosPropiedades(polygons.map(poly => poly.properties));
                    setPoligonos(formattedPolygons);
                }
                if (e.data.data.lines && e.data.data.polygons) {
                    const { lines, polygons } = e.data.data;
                    console.log("ESTAS SON LAS LINEAS: ", lines);
                    console.log("ESTOS SON LOS POLIGONOS: ", polygons);

                    const formattedLines = lines.map(line => line.paths);
                    setLineas(formattedLines);


                    setPoligonosKML(polygons);
                }
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

    // Este useEffect se ejecutará cada vez que los polígonos cambien
    useEffect(() => {
        if (mapRef.current != null && poligonos.length > 0) {
            const map = mapRef.current;
            const bounds = L.latLngBounds(poligonos.flat());
            map.fitBounds(bounds);
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }

        if (mapRef.current != null && lineas.length > 0) {
            const map = mapRef.current;
            const bounds = L.latLngBounds(lineas.flat());
            map.fitBounds(bounds);
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    }, [poligonos, lineas]);

    useEffect(() => {
        if (map && poligonos.length > 0) {
            const latLngCoords = poligonos.flatMap(polygon =>
                polygon.map(coordPair => [coordPair[1], coordPair[0]])
            );
            const mapBounds = L.latLngBounds(latLngCoords);
            if (mapBounds.isValid() || activeFilter) {
                setIntersectionsKey(Date.now());
                findIntersections(poligonos);
            }
        }
    }, [map, poligonos, lineas, activeFilter]);

    const [filterValues, setFilterValues] = useState({
        VELOCIDAD: { low: 0, medium: 0, high: 0 },
        ALTURA: { low: 0, medium: 0, high: 0 },
        DOSISREAL: { low: 0, medium: 0, high: 0 }
    });

    useEffect(() => {
        if (activeFilter) {
            const newData = {
                ...formData,
                [activeFilter]: filterValues[activeFilter]
            };
            setFormData(newData);
        }
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [filterValues, activeFilter, idAnalisis]);

    useEffect(() => {
        Promise.resolve(idAnalisis)
            .then(resolvedId => {
                const actualId = resolvedId.data?.ID_ANALISIS;
                setFormData(currentData => ({
                    ...currentData,
                    idAnalisis: actualId
                }));
            });
    }, [idAnalisis]);

    const addBufferToLine = (line, width) => {
        const lineString = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: line.map(coord => [coord[1], coord[0]])
            }
        };
        return turfBuffer(lineString, width, { units: 'meters' });
    };

    const isClosedPolygon = (line) => {
        if (line.length < 4) {
            return false;
        }
        const firstPoint = line[0];
        const lastPoint = line[line.length - 1];

        const result = firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1];

        return result;
    };

    const processLine = (line) => {
        const result = isClosedPolygon(line);
        if (result) {
            console.log("Resultado verdadero: La línea es un polígono cerrado.", line);
        } else {
            console.log("Resultado falso: La línea no es un polígono cerrado.", line);
        }
        return result;
    };

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

    // Calcular la unión de todos los polígonos menos el actual
    const calculateNonIntersectedAreas = (polygons) => {
        let nonIntersectedAreas = [];

        if (polygons.length > 1) {
            const unionOfAllPolygons = polygons.slice(1).reduce((acc, polygon) => {
                return turfUnion(acc, turfPolygon([polygon]));
            }, turfPolygon([polygons[0]]));

            polygons.forEach(polygon => {
                const difference = turfDifference(turfPolygon([polygon]), unionOfAllPolygons);
                if (difference) {
                    nonIntersectedAreas.push(difference.geometry.coordinates);
                }
            });
        } else {
            // Si sólo hay un polígono, no hay intersección que considerar
            nonIntersectedAreas.push(polygons[0]);
        }

        return nonIntersectedAreas;
    };

    useEffect(() => {
        // Utiliza el useEffect para calcular las áreas no intersectadas y actualizar el estado
        if (poligonos.length > 0) {
            const newNonIntersectedAreas = calculateNonIntersectedAreas(poligonos);
            setNonIntersectedAreas(newNonIntersectedAreas);
        }
    }, [poligonos]);

    const handleFilterChange = (e, filterType) => {
        const { checked } = e.target;
        if (filterType === "VELOCIDAD") setVelocidadFiltroActivado(true);
        if (filterType === "ALTURA") setAlturaFiltroActivado(true);
        if (filterType === "DOSISREAL") setDosisRealFiltroActivado(true);
        if (checked) {
            setActiveFilter(filterType);
        } else {
            setActiveFilter(null);
            setIntersectionsKey(Date.now());
        }
        verificarYEnviarDatos();
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

    const correctionFactor = 1.014;
    const correctionFactorIntersections = 1.98;

    useEffect(() => {
        if (poligonos.length === 0) return;

        const correctPoligons = poligonos.map(polygon => {
            const correctedPolygon = polygon.map(coord => [coord[1], coord[0]]);
            if (correctedPolygon[0] !== correctedPolygon[correctedPolygon.length - 1]) {
                correctedPolygon.push(correctedPolygon[0]);
            }
            return correctedPolygon;
        });

        const turfPolygons = correctPoligons.map(polygon => turfPolygon([polygon]));

        let unionPolygons = turfPolygons[0];
        for (let i = 1; i < turfPolygons.length; i++) {
            unionPolygons = turfUnion(unionPolygons, turfPolygons[i]);
        }

        // Área total de la unión de polígonos en hectáreas con factor de corrección
        const totalUnionArea = (turfArea(unionPolygons) / 10000) * correctionFactor;

        let totalIntersectedArea = 0;
        const correctedIntersections = areasSuperpuestas.map(intersection => {
            const correctedIntersection = intersection.map(coord => [coord[1], coord[0]]);
            if (correctedIntersection[0] !== correctedIntersection[correctedIntersection.length - 1]) {
                correctedIntersection.push(correctedIntersection[0]);
            }
            return correctedIntersection;
        });

        correctedIntersections.forEach(intersected => {
            totalIntersectedArea += (turfArea(turfPolygon([intersected])) / 10000) * correctionFactorIntersections;
        });

        setAreaAplicada(totalUnionArea.toFixed(3));
        setAreaSobreAplicada(totalIntersectedArea.toFixed(3));


        if (onAreasCalculated) {
            onAreasCalculated({
                areaSobreAplicada: totalIntersectedArea.toFixed(3),
                areaAplicada: (totalUnionArea.toFixed(3) - totalIntersectedArea.toFixed(3)).toFixed(3),
                porcentajeDeVariacion: (((totalIntersectedArea.toFixed(3) / (totalUnionArea.toFixed(3) - totalIntersectedArea.toFixed(3)).toFixed(3))) * 100).toFixed(3)
            });
        }

    }, [poligonos, onAreasCalculated, areasSuperpuestas]);

    useEffect(() => {

        if (poligonos.length === 0 || poligonosPropiedades.length === 0) return;
        const totalVelocidad = poligonosPropiedades.reduce((acc, curr) => acc + (curr.VELOCIDAD || 0), 0);
        const totalAltura = poligonosPropiedades.reduce((acc, curr) => acc + (curr.ALTURA || 0), 0);
        const totalDosisReal = poligonosPropiedades.reduce((acc, curr) => acc + (curr.DOSISREAL || 0), 0);

        const promedioVelocidad = (totalVelocidad / poligonosPropiedades.length).toFixed(3);
        const promedioAltura = (totalAltura / poligonosPropiedades.length).toFixed(3);
        const promedioDosisReal = (totalDosisReal / poligonosPropiedades.length).toFixed(3);

        if (onPromediosCalculated) {
            onPromediosCalculated({
                promedioVelocidad: promedioVelocidad,
                promedioAltura: promedioAltura,
                promedioDosisReal: promedioDosisReal
            });
        }
    }, [poligonos, poligonosPropiedades, onPromediosCalculated]);



    useEffect(() => {
        if (bufferedLines.length > 0) {
            calculateBufferedIntersections(bufferedLines);
            const correctedBufferedPolygons = bufferedLines.map(buffer => {
                const coordinates = buffer.geometry.coordinates[0];
                return coordinates.map(coord => [coord[0], coord[1]]);
            });

            const bufferedTurfPolygons = correctedBufferedPolygons.map(polygon => turfPolygon([polygon]));

            let totalBufferedArea = 0;
            bufferedTurfPolygons.forEach(polygon => {
                totalBufferedArea += turfArea(polygon) / 10000;
            });


            if (onAreasCalculated) {
                onAreasCalculated({
                    areaSobreAplicada: 0,
                    areaAplicada: totalBufferedArea.toFixed(3)
                });
            }
        }
    }, [bufferedLines]);

    const calculateBufferedIntersections = (bufferedLines) => {
        let intersections = [];
        bufferedLines.forEach((buffer1, i) => {
            bufferedLines.slice(i + 1).forEach(buffer2 => {
                const intersection = turfIntersect(buffer1, buffer2);
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
        setBufferedIntersections(intersections);
    };

    const verificarYEnviarDatos = () => {
        if (Object.keys(formData).length > 0) {
            enviarDatosFormulario(formData).then(() => {
                console.log("Datos enviados exitosamente");
            }).catch(error => {
                console.error('Error al enviar datos', error);
            });
        }
    };

    const enviarDatosFormulario = async () => {
        const dataParaEnviar = {
            idAnalisis: formData.idAnalisis || 0,
            velocidadFiltro: velocidadFiltroActivado ? 1 : 0,
            velocidadBajo: formData.VELOCIDAD?.low || 0,
            velocidadMedio: formData.VELOCIDAD?.medium || 0,
            velocidadAlto: formData.VELOCIDAD?.high || 0,
            alturaFiltro: alturaFiltroActivado ? 1 : 0,
            alturaBajo: formData.ALTURA?.low || 0,
            alturaMedio: formData.ALTURA?.medium || 0,
            alturaAlto: formData.ALTURA?.high || 0,
            dosisRealFiltro: dosisRealFiltroActivado ? 1 : 0,
            dosisRealBajo: formData.DOSISREAL?.low || 0,
            dosisRealMedio: formData.DOSISREAL?.medium || 0,
            dosisRealAlto: formData.DOSISREAL?.high || 0
        };

        try {
            const response = await fetch(`${API_BASE_URL}dashboard/ultimosDatosIngresadosAps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataParaEnviar),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resultado = await response.json();
            return resultado;
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    const normalizeLabel = (key) => {
        if (key === 'DOSISREAL') return 'Dosis real';

        return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    };

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

            <MapContainer key={isMapaCreated} center={mapCenter} zoom={3} style={{ height: '100vh', width: '100%' }} whenReady={setMap} ref={mapRef}>
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

                    {bufferedLines.map((bufferedLine, index) => (
                        <Polygon key={`buffered-${index}`} positions={bufferedLine.geometry.coordinates[0].map(coord => [coord[1], coord[0]])} color="purple" weight={3} />
                    ))}
                    {bufferedIntersections.map((intersection, index) => (
                        <Polygon key={`buffered-intersection-${index}`} positions={intersection.map(coord => [coord[1], coord[0]])} color="blue" weight={3} />
                    ))}
                    {lineas.map((linea, index) => (
                        <Polyline key={`line-${index}`} positions={linea} color="red" />
                    ))}
                    {showIntersections && areasSuperpuestas.map((area, index) => (
                        <Polygon key={`intersection-${index}-${intersectionsKey}`} positions={area} color="red" weight={3} />
                    ))}

                    {poligonosKML.map((polygon, index) => (
                        polygon.rings && polygon.rings.length > 0 && polygon.rings[0].length > 0 && (
                            polygon.rings.map((ring, ringIndex) => (
                                <Polygon key={`kml-${index}-${ringIndex}`} positions={ring[0].map(coord => [coord[0], coord[1]])} color="green" weight={2} />
                            ))
                        )
                    ))}

                    {
                        nonIntersectedAreas.map((nonIntersected, index) => {
                            // Asumimos que cada área no intersectada ya está en formato de coordenadas de Leaflet
                            const positions = nonIntersected.map(coords => [coords[1], coords[0]]); // Invierte las coordenadas para Leaflet
                            return (
                                <Polygon
                                    key={`nonIntersectedArea-${index}`}
                                    positions={positions}
                                    color="yellow"
                                    weight={3}
                                />
                            );
                        })
                    }

                </LayersControl>
            </MapContainer>

            {poligonos.length > 0 && lineas.length === 0 && (
                <BarIndicator filterType={activeFilter ? activeFilter : "aplicacionesAreas"} isHistory={false} />
            )}

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
                                    label={normalizeLabel(filterKey)}
                                />

                                {Object.keys(filterValues[filterKey]).map(valueKey => (
                                    <TextField
                                        key={valueKey}
                                        label={`${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)} ${valueKey.charAt(0).toUpperCase() + valueKey.slice(1)}`}
                                        type="number"
                                        name={valueKey}
                                        value={filterValues[filterKey][valueKey]}
                                        onChange={(e) => {
                                            const newValues = { ...filterValues };
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
