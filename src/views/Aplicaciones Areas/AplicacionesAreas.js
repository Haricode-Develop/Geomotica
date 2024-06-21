import React, { useEffect, useState, useRef } from 'react';
import './AplicacionesAreasStyle.css';
import { MapContainer, TileLayer, Polygon, LayersControl, useMap, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import { API_BASE_URL } from '../../utils/config';
import {
    polygon as turfPolygon,
    area as turfArea,
    union as turfUnion,
    difference as turfDifference,
    intersect as turfIntersect,
    buffer as turfBuffer,
    lineSplit as turfLineSplit,
    lineString as turfLineString,
    lineIntersect as turfLineIntersect,
    length as turfLength,
    nearestPointOnLine as turfNearestPointOnLine,
    distance as turfDistance,
    point as turfPoint
} from '@turf/turf';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField, Tooltip, IconButton } from '@mui/material';
import { FaMap, FaCut, FaDrawPolygon, FaTrash, FaBuffer } from 'react-icons/fa';
import BarIndicator from "../../components/BarIndicator/BarIndicator";
import { v4 as uuidv4 } from 'uuid';

const { BaseLayer } = LayersControl;

const AplicacionesAreas = ({ idAnalisis, tipoAnalisis, onAreasCalculated, onPromediosCalculated, activarEdicionInteractiva  }) => {
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
    const [isKml, setIsKml] = useState(false);
    const [isDrawingLine, setIsDrawingLine] = useState(false);
    const [activeTool, setActiveTool] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);
    const [popupInfo, setPopupInfo] = useState(null);
    const [isPrimeraCarga, setIsPrimeraCarga] = useState(true);
    const [isFiltrandoLineas, setIsFiltrandoLineas] = useState(true); // Nueva bandera

    const DISTANCE_THRESHOLD = 0.01; // Puedes ajustar este valor según tus necesidades
    const [bufferValue, setBufferValue] = useState(0);
    const [isBufferActive, setIsBufferActive] = useState(false);

    const workerRef = useRef(null); // useRef para mantener la referencia del worker

    useEffect(() => {
        workerRef.current = new Worker('dataWorker.js');
        const socket = io(API_BASE_URL);

        workerRef.current.onmessage = (e) => {
            if (e.data.action === 'geoJsonDataProcessed') {
                if (!e.data.data.lines && e.data.data.polygons) {
                    const { polygons } = e.data.data;
                    const formattedPolygons = polygons.map(poly => formatPolygon(poly.polygon[0]));
                    setPoligonosPropiedades(polygons.map(poly => poly.properties));
                    setPoligonos(formattedPolygons);
                }
                if (e.data.data.lines && e.data.data.polygons) {

                    const { lines, polygons } = e.data.data;
                    const formattedLines = lines.map(line => line.paths);
                    let unifiedLines;

                    if (e.data.activarEdicionInteractiva) {
                        unifiedLines = formattedLines;
                    } else {
                        unifiedLines = formattedLines;
                    }

                    const linesWithEvents = unifiedLines.flatMap(line => {
                        const lineId = uuidv4();
                        return line.map(segment => {
                            const latLngArray = segment.map(coord => ({ lat: coord[0], lng: coord[1] }));
                            const polyline = L.polyline(latLngArray, { color: 'red' });
                            polyline.on('mouseover', (e) => handleLineHover(e, lineId));
                            polyline.on('mouseout', (e) => handleLineMouseOut(e, lineId));
                            polyline.on('click', (e) => handleLineClick(latLngArray, e));
                            return { polyline, id: lineId };
                        });
                    });

                    setLineas(linesWithEvents);
                    setIsKml(true);
                    setPoligonosKML(polygons);
                    setIsFiltrandoLineas(true);
                }
            }
        };

        socket.on('updateGeoJSONLayer', (geojsonData) => {
            workerRef.current.postMessage({ action: 'processGeoJsonData', geojsonData, type: tipoAnalisis, activarEdicionInteractiva });
        });

        return () => {
            workerRef.current.terminate();
            socket.off('updateGeoJSONLayer');
            socket.disconnect();
        };
    }, [tipoAnalisis]);

    // Enviar valor de activarEdicionInteractiva al worker cada vez que cambie
    useEffect(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({ action: 'setActivarEdicionInteractiva', activarEdicionInteractiva });
        }
    }, [activarEdicionInteractiva]);


    useEffect(() => {
        if (isFiltrandoLineas && lineas.length > 0) {
            const filteredLines = filterConsistentPatterns(lineas);
            setLineas(filteredLines);
            setIsFiltrandoLineas(false);
        }
    }, [isFiltrandoLineas, lineas]);

    const calculateLineAngle = (coord1, coord2) => {
        const dy = coord2.lat - coord1.lat;
        const dx = coord2.lng - coord1.lng;
        const radians = Math.atan2(dy, dx);
        const degrees = radians * (180 / Math.PI);
        return degrees < 0 ? degrees + 360 : degrees;
    };

    const clusterLinesByOrientation = (lines, angleThreshold = 10) => {
        const clusters = [];

        lines.forEach(line => {
            const coords = line.polyline._latlngs;
            if (coords.length < 2) return;

            const angle = calculateLineAngle(coords[0], coords[coords.length - 1]);
            let addedToCluster = false;

            for (const cluster of clusters) {
                const clusterAngle = cluster.averageAngle;
                if (Math.abs(clusterAngle - angle) < angleThreshold) {
                    cluster.lines.push(line);
                    cluster.averageAngle = (cluster.averageAngle * cluster.lines.length + angle) / (cluster.lines.length + 1);
                    addedToCluster = true;
                    break;
                }
            }

            if (!addedToCluster) {
                clusters.push({
                    lines: [line],
                    averageAngle: angle
                });
            }
        });

        return clusters;
    };

    const filterLargestClusters = (clusters, numClusters = 2) => {
        clusters.sort((a, b) => b.lines.length - a.lines.length);
        return clusters.slice(0, numClusters).flatMap(cluster => cluster.lines);
    };

    const filterConsistentPatterns = (lines) => {
        const clusters = clusterLinesByOrientation(lines);
        return filterLargestClusters(clusters);
    };


    const addBufferToLine = (line, width) => {
        const coordinates = line.map(coord => {
            // Convertir a formato [lng, lat] asegurando la precisión de los números
            if (coord.lat !== undefined && coord.lng !== undefined) {
                return [coord.lng, coord.lat];
            }
            throw new Error("Invalid coordinates format in line data");
        });

        const lineString = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: coordinates
            }
        };

        return turfBuffer(lineString, width, { units: 'meters' });
    };


    const handleToggleBuffer = () => {
        try {
            if (isBufferActive) {
                // Quitar el buffer
                setBufferedLines([]);
            } else {
                // Aplicar el buffer
                const newBufferedLines = lineas.map(linea => {
                    if (linea.polyline && linea.polyline._latlngs) {
                        return addBufferToLine(linea.polyline._latlngs, parseFloat(bufferValue));
                    }
                    throw new Error("Invalid line data: missing polyline or latlngs");
                });
                setBufferedLines(newBufferedLines);
            }
            setIsBufferActive(!isBufferActive);
        } catch (error) {
            console.error("Error applying buffer:", error);
        }
    };






    // Este useEffect se ejecutará cada vez que los polígonos cambien
    useEffect(() => {
        const adjustMapBounds = (entities, entityType) => {
            if (mapRef.current != null && entities.length > 0) {
                const map = mapRef.current;

                // Aplanar los datos de `_latlngs` para calcular bounds
                const validCoordinates = entities.flatMap(entity => {
                    if (entity.polyline && Array.isArray(entity.polyline._latlngs)) {
                        // Manejar LineString
                        return entity.polyline._latlngs.flatMap(coord => {
                            // Verifica si el objeto tiene las propiedades lat y lng
                            if (coord.lat !== undefined && coord.lng !== undefined) {
                                return [coord];
                            }
                            // Si coord es un array anidado, desanidar
                            return Array.isArray(coord) ? coord : [];
                        });
                    }
                    return [];
                });


                if (validCoordinates.length > 0) {
                    const bounds = L.latLngBounds(validCoordinates);
                    map.fitBounds(bounds);
                    setTimeout(() => {
                        map.invalidateSize();
                    }, 100);
                } else {
                    console.log(`No se encontraron ${entityType.toLowerCase()} válidos.`);
                }
            }
        };

        if (lineas.length > 0 && !isFiltrandoLineas) {
            lineas.forEach(linea => {
                if (linea.polyline) {
                    linea.polyline.off();
                    linea.polyline.on('mouseover', (e) => handleLineHover(e, linea.id));
                    linea.polyline.on('mouseout', (e) => handleLineMouseOut(e, linea.id));
                    linea.polyline.on('click', (e) => handleLineClick(linea.polyline._latlngs, e));
                }
            });
        }

        if(isPrimeraCarga && !isFiltrandoLineas){

            adjustMapBounds(poligonos, "POLIGONOS");
            adjustMapBounds(lineas, "LINEAS");
        }
    }, [poligonos, lineas, isFiltrandoLineas]);

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



    /*===============Información de la linea================*/


    const handleLineHover = (e, lineId) => {
        e.target.setStyle({
            color: 'cyan',
            weight: 5,
        });
        setSelectedLine(lineId);
    };

    const handleLineMouseOut = (e, lineId) => {
        e.target.setStyle({
            color: 'red',
            weight: 2,
        });
        setSelectedLine(null);
    };

    const handleLineClick = (line, e) => {
        const coordinates = line.map(coord => [coord.lng, coord.lat]);
        const lineString = turfLineString(coordinates);
        const lengthKm = turfLength(lineString, { units: 'kilometers' });
        const lengthMiles = turfLength(lineString, { units: 'miles' });
        const lengthMeters = lengthKm * 1000;

        setPopupInfo({
            position: e.latlng,
            content: `
                Longitud de la línea:
                <br>- ${lengthKm.toFixed(3)} km
                <br>- ${lengthMiles.toFixed(3)} mi
                <br>- ${lengthMeters.toFixed(3)} m
            `
        });
    };


    /*===============Información de la linea================*/

    function unifyLines(lines) {
        if (lines.length === 0) return [];

        console.log("ESTAS SON LAS LINEAS COMPLETAS: ", lines);

        // Aplanar y validar las líneas de entrada
        const validLines = lines.map(line =>
            line.flat().filter(coord => isValidCoordinate(coord))
        ).filter(line => line.length >= 2);

        console.log("ESTAS SON LAS LINEAS VALIDAS: ", validLines);

        if (validLines.length === 0) return [];

        // Crear un arreglo para las nuevas líneas unificadas
        let unifiedLines = [];

        // Marcar líneas que ya han sido combinadas
        let visited = new Array(validLines.length).fill(false);

        for (let i = 0; i < validLines.length; i++) {
            if (visited[i]) continue;

            // Crear una nueva línea unificada inicializando con la línea actual
            let unifiedLine = [...validLines[i]];
            visited[i] = true;

            for (let j = i + 1; j < validLines.length; j++) {
                if (visited[j]) continue;


                const lineA = turfLineString(validLines[i]);
                const lineB = turfLineString(validLines[j]);

                // Verificar si las líneas están cerca o son paralelas
                if (areLinesClose(lineA, lineB)) {
                    // Combinar las líneas
                    unifiedLine = combineLines(unifiedLine, validLines[j]);
                    visited[j] = true;
                }
            }

            unifiedLines.push(unifiedLine);
        }

        return unifiedLines;
    }

    function areLinesClose(lineA, lineB) {
        const options = { units: 'kilometers' };
        for (const point of lineA.geometry.coordinates) {
            const nearest = turfNearestPointOnLine(lineB, turfPoint(point));
            const distance = turfDistance(turfPoint(point), nearest, options);
            if (distance < DISTANCE_THRESHOLD) {
                return true;
            }
        }
        return false;
    }

    function combineLines(line1, line2) {
        // Combinar las coordenadas de ambas líneas y remover duplicados
        const combined = [...line1, ...line2].filter(
            (value, index, self) => index === self.findIndex((t) => (
                t[0] === value[0] && t[1] === value[1]
            ))
        );
        return combined;
    }

    function isValidCoordinate(coord) {
        return Array.isArray(coord) && coord.length === 2 &&
            typeof coord[0] === 'number' && typeof coord[1] === 'number' &&
            !isNaN(coord[0]) && !isNaN(coord[1]);
    }



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


    const isClosedPolygon = (line) => {
        if (line.length < 4) {
            return false;
        }
        const firstPoint = line[0];
        const lastPoint = line[line.length - 1];

        const result = firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1];

        return result;
    };


    const formatPolygon = (polygon) => {
        if (polygon.length > 0) {
            if (polygon[0][0] !== polygon[polygon.length - 1][0] || polygon[0][1] !== polygon[polygon.length - 1][1]) {
                polygon.push([polygon[0][0], polygon[0][1]]);
            }
        }
        return polygon.map(coordPair => [coordPair[1], coordPair[0]]); // Asegúrate de que devuelva un array de pares (lat, lng)
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

    useEffect(() => {
        if (isDrawingLine && mapRef.current) {
            const map = mapRef.current;
            const drawnLine = [];

            const onClickMap = (e) => {
                drawnLine.push([e.latlng.lat, e.latlng.lng]);
                if (drawnLine.length > 1) {
                    setIsPrimeraCarga(false);
                    setLineas([...lineas, drawnLine]);
                    setIsDrawingLine(false);
                    map.off('click', onClickMap);
                }
            };

            map.on('click', onClickMap);

            return () => {
                map.off('click', onClickMap);
            };
        }
    }, [isDrawingLine, lineas]);


    const handleCutLine = () => {
        setActiveTool('cut');
        setIsPrimeraCarga(false);

        if (mapRef.current && lineas.length > 0) {
            const map = mapRef.current;
            let previewLine = [];
            let previewLayer;

            const onMove = (e) => {
                if (previewLine.length === 1) {
                    previewLine[1] = [e.latlng.lat, e.latlng.lng];
                    previewLayer.setLatLngs(previewLine);
                }
            };

            const onCutClick = (e) => {
                if (previewLine.length === 0) {
                    previewLine.push([e.latlng.lat, e.latlng.lng]);
                    previewLayer = L.polyline(previewLine, { color: 'blue', dashArray: '5, 10' }).addTo(map);
                } else {
                    previewLine.push([e.latlng.lat, e.latlng.lng]);
                    previewLayer.setLatLngs(previewLine);

                    // Validar que previewLine tenga al menos dos puntos antes de crear un LineString
                    if (previewLine.length < 2) {
                        console.warn('Debe haber al menos dos puntos para crear un LineString');
                        map.removeLayer(previewLayer);
                        return;
                    }

                    // Crear el cutLineString si previewLine es válido
                    const cutLineString = turfLineString(previewLine.map(coord => [coord[1], coord[0]]));
                    const newLineas = [];
                    let cutSuccessful = false;

                    lineas.forEach(linea => {
                        const latlngs = linea.polyline?._latlngs;
                        if (!latlngs || latlngs.length < 2) {
                            newLineas.push(linea);
                            return;
                        }

                        const lineString = turfLineString(latlngs.map(coord => [coord.lng, coord.lat]));
                        const intersections = turfLineIntersect(lineString, cutLineString);

                        if (intersections.features.length > 0) {
                            cutSuccessful = true;
                            const splitResult = turfLineSplit(lineString, cutLineString);

                            splitResult.features.forEach(f => {
                                const newLine = f.geometry.coordinates.map(coord => new L.LatLng(coord[1], coord[0])); // Convertir a L.LatLng
                                const polyline = L.polyline(newLine, { color: 'red' }).addTo(map);

                                polyline.on('mouseover', handleLineHover);
                                polyline.on('mouseout', handleLineMouseOut);
                                polyline.on('click', (event) => handleLineClick(newLine, event));

                                newLineas.push({ polyline, id: uuidv4() });
                            });
                        } else {
                            newLineas.push(linea);
                        }
                    });

                    if (cutSuccessful) {
                        setLineas(newLineas);
                    }

                    map.off('mousemove', onMove);
                    map.off('click', onCutClick);
                    map.removeLayer(previewLayer);
                }
            };

            map.on('mousemove', onMove);
            map.on('click', onCutClick);
        }
    };


    const handleDrawLine = () => {
        setActiveTool('draw');
        setIsPrimeraCarga(false);

        if (mapRef.current) {
            const map = mapRef.current;
            let newLine = [];
            let polyline = L.polyline([], { color: 'red' }).addTo(map);

            const onMove = (e) => {
                if (newLine.length > 0) {
                    const currentLine = [...newLine, { lat: e.latlng.lat, lng: e.latlng.lng }];
                    polyline.setLatLngs(currentLine);
                }
            };

            const onClick = (e) => {
                newLine.push({ lat: e.latlng.lat, lng: e.latlng.lng });
                polyline.addLatLng(e.latlng);
            };

            const onRightClick = () => {
                if (newLine.length < 2) {
                    console.error("La línea debe tener al menos dos puntos");
                    map.off('click', onClick);
                    map.off('mousemove', onMove);
                    map.off('contextmenu', onRightClick);
                    map.removeLayer(polyline);
                    return;
                }

                polyline.on('mouseover', handleLineHover);
                polyline.on('mouseout', handleLineMouseOut);
                polyline.on('click', (event) => handleLineClick(newLine, event));

                const lineId = uuidv4(); // Generar identificador único

                setLineas([...lineas, { _latlngs: newLine, id: lineId }]); // Añadir identificador único a la línea

                map.off('click', onClick);
                map.off('mousemove', onMove);
                map.off('contextmenu', onRightClick);
            };

            map.on('click', onClick);
            map.on('mousemove', onMove);
            map.once('contextmenu', onRightClick);
        }
    };



    const handleDeleteLine = () => {
        setActiveTool('delete');
        setIsPrimeraCarga(false);

        if (mapRef.current) {
            const map = mapRef.current;

            const onLineClick = (e) => {
                const clickedLine = e.target;
                const clickedLatLngs = clickedLine.getLatLngs();

                // Encuentra la línea en el estado
                const lineInState = lineas.find(linea => {
                    if (!linea.polyline || !linea.polyline._latlngs) {
                        return false;
                    }
                    const stateLatLngs = linea.polyline._latlngs;
                    return clickedLatLngs.every((latLng, index) => {
                        const coord = stateLatLngs[index];
                        return coord && coord.lat === latLng.lat && coord.lng === latLng.lng;
                    });
                });

                if (lineInState) {
                    // Elimina la línea del estado y del mapa
                    setLineas(prevLineas => prevLineas.filter(linea => linea.id !== lineInState.id));
                    map.removeLayer(clickedLine);
                }

                map.off('click', onLineClick);
            };

            // Limpiar eventos previos en las líneas
            map.eachLayer(layer => {
                if (layer instanceof L.Polyline) {
                    layer.off('click', onLineClick);
                }
            });

            // Agregar evento de clic a cada línea en el mapa
            lineas.forEach(linea => {
                if (linea.polyline && linea.polyline._latlngs) {
                    const polyline = L.polyline(linea.polyline._latlngs, { color: 'red' }).addTo(map);
                    polyline.on('click', onLineClick);
                }
            });
        }
    };



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
                {isKml && (
                    <div className="floating-buttons">
                        <Tooltip title="Cortar línea">
                            <IconButton
                                onClick={handleCutLine}
                                className={`icon-button ${activeTool === 'cut' ? 'active' : 'default'}`}
                            >
                                <FaCut />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Dibujar línea">
                            <IconButton
                                onClick={handleDrawLine}
                                className={`icon-button ${activeTool === 'draw' ? 'active' : 'default'}`}
                            >
                                <FaDrawPolygon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Borrar líneas">
                            <IconButton
                                onClick={handleDeleteLine}
                                className={`icon-button ${activeTool === 'delete' ? 'active' : 'default'}`}
                            >
                                <FaTrash />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Buffer de línea">
                            <IconButton
                                onClick={handleToggleBuffer}
                                className={`icon-button ${isBufferActive ? 'active' : 'default'}`}
                            >
                                <FaBuffer />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}

                {isBufferActive && (
                    <div className="buffer-input">
                        <TextField
                            label="Buffer en metros"
                            type="number"
                            value={bufferValue}
                            onChange={(e) => setBufferValue(e.target.value)}
                            variant="outlined"
                            size="small"
                            margin="normal"
                        />
                    </div>
                )}
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
                    {lineas.map((linea, index) => {
                        if (!linea.polyline || !Array.isArray(linea.polyline._latlngs)) {
                            console.warn(`Línea en el índice ${index} no es válida.`);
                            return null;
                        }
                        return (
                            <Polyline
                                key={`line-${index}`}
                                positions={linea.polyline._latlngs}
                                color="red"
                            />
                        );
                    })}

                    {poligonos.map((polygon, index) => {
                        // Verificación de la estructura del polígono
                        if (!Array.isArray(polygon) || polygon.length === 0) {
                            console.error(`Polígono inválido en el índice ${index}:`, polygon);
                            return null; // Saltar polígonos inválidos
                        }

                        // Verificación de las propiedades del polígono
                        const propiedades = poligonosPropiedades[index];
                        if (!propiedades) {
                            console.error(`Propiedades faltantes para el polígono en el índice ${index}`);
                            return null; // Saltar si faltan propiedades
                        }
                        

                        // Configuración de los datos para el polígono
                        const positions = polygon.map(coord => {
                            if (Array.isArray(coord) && coord.length === 2) {
                                return { lat: coord[1], lng: coord[0] }; // Asegura que los valores estén en el orden correcto
                            }
                            console.error(`Coordenada inválida en el polígono ${index}:`, coord);
                            return null;
                        }).filter(coord => coord !== null); // Filtra coordenadas inválidas

                        return (
                            <Polygon
                                key={`${activeFilter}-${index}-${filterValues[activeFilter]?.low}-${filterValues[activeFilter]?.medium}-${filterValues[activeFilter]?.high}`} // Cambia la clave para forzar la re-renderización
                                positions={positions}
                                color={getPolygonColor(propiedades)}
                                weight={3}
                            />
                        );
                    })}



                    {bufferedLines.map((bufferedLine, index) => (
                        <Polygon key={`buffered-${index}`} positions={bufferedLine.geometry.coordinates[0].map(coord => [coord[1], coord[0]])} color="purple" weight={3} />
                    ))}
                    {bufferedIntersections.map((intersection, index) => (
                        <Polygon key={`buffered-intersection-${index}`} positions={intersection.map(coord => [coord[1], coord[0]])} color="blue" weight={3} />
                    ))}



                    {showIntersections && areasSuperpuestas.map((area, index) => (
                        <Polygon key={`intersection-${index}-${intersectionsKey}`} positions={area} color="red" weight={3} />
                    ))}



                    {
                        nonIntersectedAreas.map((nonIntersected, index) => {
                            const positions = nonIntersected.map(coords => [coords[1], coords[0]]);
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

                    {
                        popupInfo && (
                            <Popup position={popupInfo.position} onClose={() => setPopupInfo(null)}>
                                <div dangerouslySetInnerHTML={{ __html: popupInfo.content }} />
                            </Popup>
                        )
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
