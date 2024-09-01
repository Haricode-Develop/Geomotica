import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { useSocket } from '../../context/SocketContext';
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
    pointToLineDistance as turfPointToLineDistance,
    distance as turfDistance,
    point as turfPoint,
    destination as turfDestination,
    bearing as turfBearing,
} from '@turf/turf';
import BarIndicator from "../../components/BarIndicator/BarIndicator";
import { v4 as uuidv4 } from 'uuid';
import CommonMap from '../../components/CommonMap/CommonMap';
import MapDialog from '../../components/MapDialog/MapDialog';
import FloatingToolsAerialApplications
    from "../../components/FloatingToolsAerialApplications/FloatingToolsAerialApplications";

const AerialApplications = ({
                                idAnalisis,
                                tipoAnalisis,
                                onAreasCalculated,
                                onPromediosCalculated,
                                activarEdicionInteractiva,
                                highlightedLote,
                                activeLotes,
                                polygonsData,
                                onSelectLote,
                                onLeaveLote,
                                onHoverLote,
                                isFilterDialogOpen,
                                closeFilterDialog,
                                setImgLaflet,
                                mapRef
                            }) => {

    const userData = JSON.parse(localStorage.getItem("userData"));

    const [polygons, setPolygons] = useState([]);
    const [areasSuperpuestas, setAreasSuperpuestas] = useState([]);
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [zoom, setZoom] = useState(3);
    const [activeFilter, setActiveFilter] = useState(null);
    const [speedFilterActivated, setSpeedFilterActivated] = useState(false);
    const [altitudeFilterActivated, setAltitudeFilterActivated] = useState(false);
    const [realDoseFilterActivated, setRealDoseFilterActivated] = useState(false);
    const [isMapCreated, setIsMapCreated] = useState(new Date());
    const [nonIntersectedAreas, setNonIntersectedAreas] = useState([]);
    const [polygonsProperties, setPolygonsProperties] = useState([]);
    const [intersectionsKey, setIntersectionsKey] = useState(Date.now());
    const [showIntersections, setShowIntersections] = useState(true);
    const [overAppliedArea, setOverAppliedArea] = useState(0);
    const [appliedArea, setAppliedArea] = useState(0);
    const [lines, setLines] = useState([]);
    const [lineasNoFiltradas, setLineasNoFiltradas] = useState([]);
    const [onClickLinea, setOnClickLinea] = useState(false);
    const [onClickCuteLine, setOnClickCuteLine] = useState(false);
    const [onClickDrawLine, setOnClickDrawLine] = useState(false);
    const [onClickLineaStrech, setOnClickLineaStrech] = useState(false);

    const [bufferedLines, setBufferedLines] = useState([]);
    const [formData, setFormData] = useState({idAnalisis});
    const [bufferedIntersections, setBufferedIntersections] = useState([]);
    const [kmlPolygons, setKmlPolygons] = useState([]);
    const [isKml, setIsKml] = useState(false);
    const [isDrawingLine, setIsDrawingLine] = useState(false);
    const [activeTool, setActiveTool] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);
    const [popupInfo, setPopupInfo] = useState(null);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isFilteringLines, setIsFilteringLines] = useState(true);
    const [actionHistory, setActionHistory] = useState([]);
    const DISTANCE_THRESHOLD = 0.005;
    const ANGLE_THRESHOLD = 1;
    const [bufferValue, setBufferValue] = useState(0);
    const [isBufferActive, setIsBufferActive] = useState(false);
    const [stretchPoints, setStretchPoints] = useState([]);
    const [showUnfilteredLines, setShowUnfilteredLines] = useState(true);

    const workerRef = useRef(null);

    const [filterValues, setFilterValues] = useState({
        VELOCIDAD: {low: 0, medium: 0, high: 0},
        ALTURA: {low: 0, medium: 0, high: 0},
        DOSISREAL: {low: 0, medium: 0, high: 0}
    });

    const [availableFilters, setAvailableFilters] = useState({
        speed: false,
        altitude: false,
        realDose: false
    });

    const [filterSpeed, setFilterSpeed] = useState(false);
    const [filterAltitude, setFilterAltitude] = useState(false);
    const [filterRealDose, setFilterRealDose] = useState(false);

    const [lowSpeed, setLowSpeed] = useState(0);
    const [medSpeed, setMedSpeed] = useState(0);
    const [highSpeed, setHighSpeed] = useState(0);

    const [lowAltitude, setLowAltitude] = useState(0);
    const [medAltitude, setMedAltitude] = useState(0);
    const [highAltitude, setHighAltitude] = useState(0);

    const [lowRealDose, setLowRealDose] = useState(0);
    const [medRealDose, setMedRealDose] = useState(0);
    const [highRealDose, setHighRealDose] = useState(0);
    const socketContext = useSocket();
    const {socket, socketSessionID} = socketContext;

    const handleToggleFilter = (filterName) => {
        switch (filterName) {
            case 'VELOCIDAD':
                setFilterSpeed(prev => !prev);
                setActiveFilter('speed');
                break;
            case 'ALTURA':
                setFilterAltitude(prev => !prev);
                setActiveFilter('altura');
                break;
            case 'DOSISREAL':
                setFilterRealDose(prev => !prev);
                setActiveFilter('dosisReal');

                break;
            default:
                break;
        }
    };

    useEffect(() => {
        applyFilters();
    }, [filterSpeed, filterAltitude, filterRealDose]);

    const applyFilters = () => {
        const filtered = polygonsProperties.map(prop => {
            let color = 'green';
            if (filterSpeed) {
                const speed = prop.VELOCIDAD;
                if (speed < lowSpeed) {
                    color = 'green';
                } else if (speed >= lowSpeed && speed < medSpeed) {
                    color = 'yellow';
                } else if (speed >= medSpeed && speed <= highSpeed) {
                    color = 'orange';
                } else {
                    color = 'red';
                }
            }
            if (filterAltitude) {
                const altitude = prop.ALTURA;
                if (altitude < lowAltitude) {
                    color = 'green';
                } else if (altitude >= lowAltitude && altitude < medAltitude) {
                    color = 'yellow';
                } else if (altitude >= medAltitude && altitude <= highAltitude) {
                    color = 'orange';
                } else {
                    color = 'red';
                }
            }
            if (filterRealDose) {
                const realDose = prop.DOSISREAL;
                if (realDose < lowRealDose) {
                    color = 'green';
                } else if (realDose >= lowRealDose && realDose < medRealDose) {
                    color = 'yellow';
                } else if (realDose >= medRealDose && realDose <= highRealDose) {
                    color = 'orange';
                } else {
                    color = 'red';
                }
            }

            return {...prop, color};
        });

        setPolygonsProperties(filtered);
    };

    useEffect(() => {
        workerRef.current = new Worker("Workers/dataWorker.js");

        workerRef.current.onmessage = (e) => {
            if (e.data.action === "geoJsonDataProcessed") {
                const createLatLngArray = (segment) => {
                    return segment.map((coords) => {
                        if (coords.length !== 2) {
                            return null;
                        }
                        const [lat, lng] = coords;
                        return {lat, lng};
                    }).filter(coord => coord !== null);
                };

                // Verifica si tenemos líneas filtradas
                if (e.data.data.filtradas && e.data.data.filtradas.lines) {
                    const {lines: filtradasLines, polygons: filtradasPolygons} = e.data.data.filtradas;

                    const filtradasLinesWithEvents = filtradasLines.map((line) => {
                        const lineId = line.id; // Usamos el id proporcionado

                        const latLngArray = createLatLngArray(line.paths);

                        if (latLngArray.length < 2) {
                            console.error("Segmento con menos de 2 puntos:", latLngArray);
                            return null;
                        }

                        const polyline = L.polyline(latLngArray, {
                            color: "red",
                        });

                        const bounds = L.latLngBounds(latLngArray);
                        polyline._bounds = bounds;

                        // Añade eventos a la polilínea
                        polyline.on("mouseover", (e) => handleLineHover(e, lineId));
                        polyline.on("mouseout", (e) => handleLineMouseOut(e, lineId));
                        polyline.on("click", (e) => handleLineClick(latLngArray, e));

                        return {polyline, id: lineId};
                    }).filter((line) => line !== null);

                    setLines(filtradasLinesWithEvents);
                    setIsKml(true);
                    setKmlPolygons(filtradasPolygons);
                    setIsFilteringLines(true);
                }

                if (e.data.data.noFiltradas && e.data.data.noFiltradas.lines) {
                    const {lines: noFiltradasLines, polygons: noFiltradasPolygons} = e.data.data.noFiltradas;
                    const noFiltradasLinesWithEvents = noFiltradasLines.map((line) => {
                        const lineId = line.id;

                        const latLngArray = createLatLngArray(line.paths);

                        if (latLngArray.length < 2) {
                            console.error("Segmento con menos de 2 puntos:", latLngArray);
                            return null;
                        }

                        const polyline = L.polyline(latLngArray, {
                            color: "blue", // Azul para no filtradas
                        });

                        const bounds = L.latLngBounds(latLngArray);
                        polyline._bounds = bounds;

                        // Añade eventos a la polilínea
                        polyline.on("mouseover", (e) => handleLineHover(e, lineId));
                        polyline.on("mouseout", (e) => handleLineMouseOut(e, lineId));
                        polyline.on("click", (e) => handleLineClick(latLngArray, e));

                        return {polyline, id: lineId};
                    }).filter((line) => line !== null);
                    setLineasNoFiltradas(noFiltradasLinesWithEvents);
                    setIsKml(true);
                    setKmlPolygons(noFiltradasPolygons);
                }

                if (e.data.data.lines && !e.data.data.noFiltradas) {
                    const {lines, polygons} = e.data.data;

                    const linesWithEvents = lines.map((line) => {
                        const lineId = line.id;

                        const latLngArray = createLatLngArray(line.paths);

                        if (latLngArray.length < 2) {
                            console.error("Segmento con menos de 2 puntos:", latLngArray);
                            return null;
                        }

                        const polyline = L.polyline(latLngArray, {
                            color: "green",
                        });

                        const bounds = L.latLngBounds(latLngArray);
                        polyline._bounds = bounds;

                        polyline.on("mouseover", (e) => handleLineHover(e, lineId));
                        polyline.on("mouseout", (e) => handleLineMouseOut(e, lineId));
                        polyline.on("click", (e) => handleLineClick(latLngArray, e));

                        return {polyline, id: lineId};
                    }).filter((line) => line !== null);

                    setLines(linesWithEvents);
                    setIsKml(true);
                    setKmlPolygons(polygons);
                    setIsFilteringLines(false);
                }

                // Verifica si solo tenemos polígonos
                if (!e.data.data.lines && e.data.data.polygons) {
                    const {polygons} = e.data.data;
                    const formattedPolygons = polygons.map((poly) => formatPolygon(poly.polygon[0]));
                    setPolygonsProperties(polygons.map((poly) => poly.properties));
                    setPolygons(formattedPolygons);
                    setIsFilteringLines(false);
                }
            }
        };

        if (socket) {
            socket.on(`${socketSessionID}:updateGeoJSONLayer`, (geojsonData) => {
                workerRef.current.postMessage({
                    action: "processGeoJsonData",
                    geojsonData,
                    type: tipoAnalisis,
                    activarEdicionInteractiva,
                });
            });

            return () => {
                workerRef.current.terminate();
                socket.off(`${socketSessionID}:updateGeoJSONLayer`);
            };
        }

    }, [tipoAnalisis, socket]);


    useEffect(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({action: 'setActivarEdicionInteractiva', activarEdicionInteractiva});
        }
    }, [activarEdicionInteractiva]);

    useEffect(() => {
        if (isFilteringLines && lines.length > 0 && activarEdicionInteractiva) {
            // Filtrar y procesar las líneas
            const filteredLines = filterConsistentPatterns(lines);
            const unifiedLines = unifyParallelLines(filteredLines, ANGLE_THRESHOLD, DISTANCE_THRESHOLD);
            const completeLines = unifiedLines.map(line => generateCompleteLine(line));

            const maxDistance = 0.005;
            const filteredCompleteLines = filterParallelLines(completeLines, maxDistance);

            // Integrar removeSmallerIntersectingLines
            const cleanedCompleteLines = removeSmallerIntersectingLines(filteredCompleteLines);

            setLines(cleanedCompleteLines);

            setIsFilteringLines(false);
        }
    }, [isFilteringLines, lines]);


    function removeSmallerIntersectingLines(lines) {
        const linesToRemove = new Set();

        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                const lineA = lines[i];
                const lineB = lines[j];

                const intersectPoints = turfLineIntersect(turfLineString(lineA.polyline._latlngs.map(coord => [coord.lng, coord.lat])), turfLineString(lineB.polyline._latlngs.map(coord => [coord.lng, coord.lat])));
                if (intersectPoints.features.length > 0) {
                    const lengthA = turfLength(turfLineString(lineA.polyline._latlngs.map(coord => [coord.lng, coord.lat])));
                    const lengthB = turfLength(turfLineString(lineB.polyline._latlngs.map(coord => [coord.lng, coord.lat])));
                    if (lengthA < lengthB) {
                        linesToRemove.add(lineA.id);
                    } else {
                        linesToRemove.add(lineB.id);
                    }
                }
            }
        }

        return lines.filter(line => !linesToRemove.has(line.id));
    }

// Generar GeoJSON para las líneas filtradas y no filtradas
    const generateGeoJSON = (lines, isUnfiltered = false) => {
        const features = lines.map(line => {
            // Determinar si estamos procesando líneas no filtradas
            const coordinates = isUnfiltered
                ? line.polyline._latlngs.map(coord => [coord.lng, coord.lat]) // para lineasNoFiltradas
                : line.polyline._latlngs.map(coord => [coord.lng, coord.lat]); // para lines

            return {
                type: 'Feature',
                properties: {id: line.id, length: line.length},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            };
        });

        return {
            type: 'FeatureCollection',
            features: features
        };
    };


    const downloadGeoJSON = (geoJson, filename) => {
        const blob = new Blob([JSON.stringify(geoJson)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateLineAngle = (coord1, coord2) => {
        const dy = coord2.lat - coord1.lat;
        const dx = coord2.lng - coord1.lng;
        const radians = Math.atan2(dy, dx);
        const degrees = radians * (180 / Math.PI);
        return degrees < 0 ? degrees + 360 : degrees;
    };

    const clusterLinesByOrientation = (lines, angleThreshold = 1) => {
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

    const normalizeCoordinates = (coordinates) => {
        return coordinates.map(coord => {
            if (coord.lat !== undefined && coord.lng !== undefined) {
                return [coord.lng, coord.lat];
            }
            throw new Error("Invalid coordinates format in line data");
        });
    };

    const addBufferToLine = (line, width) => {
        try {
            const coordinates = normalizeCoordinates(line);

            const lineString = {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: coordinates
                }
            };

            const bufferWidth = width > 0 ? width : 1;

            const bufferedLine = turfBuffer(lineString, bufferWidth, {units: 'meters'});

            if (!bufferedLine || !bufferedLine.geometry || !Array.isArray(bufferedLine.geometry.coordinates) || bufferedLine.geometry.coordinates.length === 0) {
                throw new Error("Buffer result is invalid.");
            }

            return bufferedLine;
        } catch (error) {
            console.error("Error in addBufferToLine:", error);
            return null;
        }
    };

    useEffect(() => {
        if (lines) {
            const newBufferedLines = lines.map(line => {
                if (line.polyline && Array.isArray(line.polyline._latlngs) && line.polyline._latlngs.length > 0) {
                    const bufferedLine = addBufferToLine(line.polyline._latlngs, parseFloat(bufferValue));
                    if (bufferedLine) {
                        return bufferedLine;
                    } else {
                        console.warn("Buffer result is invalid for line: ", line);
                        return null;
                    }
                }
                console.error("Invalid line data: missing or incorrect polyline or latlngs");
                return null;
            }).filter(bufferedLine => bufferedLine !== null);

            setBufferedLines(newBufferedLines);
        }
    }, [bufferValue]);


    const handleToggleBuffer = () => {
        try {
            if (isBufferActive) {
                setBufferedLines([]);
                setBufferedIntersections([]);
            } else {
                const newBufferedLines = lines.map(line => {
                    if (line.polyline && Array.isArray(line.polyline._latlngs) && line.polyline._latlngs.length > 0) {
                        const bufferedLine = addBufferToLine(line.polyline._latlngs, parseFloat(bufferValue));
                        if (bufferedLine) {
                            return bufferedLine;
                        } else {
                            console.warn("Buffer result is invalid for line: ", line);
                            return null;
                        }
                    }
                    console.error("Invalid line data: missing or incorrect polyline or latlngs");
                    return null;
                }).filter(bufferedLine => bufferedLine !== null);
                setBufferedLines(newBufferedLines);
            }
            setIsBufferActive(!isBufferActive);
        } catch (error) {
            console.error("Error applying buffer:", error);
        }
    };



    useEffect(() => {
        const adjustMapBounds = (entities, entityType) => {
            if (mapRef.current != null && entities.length > 0) {
                const map = mapRef.current;

                let validCoordinates = [];
                if (entityType === "POLYGONS") {
                    validCoordinates = entities.flatMap(polygon => {
                        if (Array.isArray(polygon) && polygon.length > 0) {
                            return polygon.map(coord => {
                                if (Array.isArray(coord) && coord.length === 2) {
                                    return L.latLng(coord[1], coord[0]);
                                }
                                console.error(`Invalid coordinate in polygon:`, coord);
                                return null;
                            }).filter(coord => coord !== null);
                        }
                        return [];
                    });
                } else {
                    validCoordinates = entities.flatMap(entity => {
                        if (entity.polyline && Array.isArray(entity.polyline._latlngs)) {
                            return entity.polyline._latlngs.flatMap(coord => {
                                if (coord.lat !== undefined && coord.lng !== undefined) {
                                    return [coord];
                                }
                                return Array.isArray(coord) ? coord : [];
                            });
                        }
                        return [];
                    });
                }

                if (validCoordinates.length > 0) {
                    const bounds = L.latLngBounds(validCoordinates);
                    map.fitBounds(bounds);
                    setTimeout(() => {
                        map.invalidateSize();
                    }, 100);
                }
            }
        };

        if (lines.length > 0 && !isFilteringLines) {
            lines.forEach(line => {
                if (line.polyline) {
                    line.polyline.off('mouseover mouseout click');
                    line.polyline.on('mouseover', (e) => handleLineHover(e, line.id));
                    line.polyline.on('mouseout', (e) => handleLineMouseOut(e, line.id));
                    line.polyline.on('click', (e) => handleLineClick(line.polyline._latlngs, e));
                }
            });
        }

        if (isFirstLoad && !isFilteringLines) {
            adjustMapBounds(polygons, "POLYGONS");
            adjustMapBounds(lines, "LINES");
            setIsFirstLoad(false);
        }
    }, [polygons, lines, isFilteringLines]);

    useEffect(() => {
        if (mapRef.current && polygons.length > 0) {
            const latLngCoords = polygons.flatMap(polygon =>
                polygon.map(coordPair => [coordPair[1], coordPair[0]])
            );
            const mapBounds = L.latLngBounds(latLngCoords);

            if (mapBounds.isValid() || activeFilter) {
                setIntersectionsKey(Date.now());
                findIntersections(polygons);
            }
        }
    }, [polygons, lines, activeFilter, mapRef]);


    useEffect(() => {
        const checkAvailableFilters = () => {
            const hasSpeed = polygonsProperties.some(prop => prop.VELOCIDAD != null && prop.VELOCIDAD !== "");
            const hasAltitude = polygonsProperties.some(prop => prop.ALTURA != null && prop.ALTURA !== "");
            const hasRealDose = polygonsProperties.some(prop => prop.DOSISREAL != null && prop.DOSISREAL !== "");

            setAvailableFilters({
                speed: hasSpeed,
                altitude: hasAltitude,
                realDose: hasRealDose,
            });
        };

        checkAvailableFilters();
    }, [polygonsProperties]);

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
        if (activeTool === 'delete') {
            const clickedLatLngs = line.map(coord => [coord.lng, coord.lat]);
            const lineString = turfLineString(clickedLatLngs);

            // Encuentra la línea en el estado y elimínala
            const lineInState = lines.find(l => {
                const stateLatLngs = l.polyline.getLatLngs().map(coord => [coord.lng, coord.lat]);
                return JSON.stringify(stateLatLngs) === JSON.stringify(clickedLatLngs);
            });

            if (lineInState) {
                setLines(lines.filter(l => l.id !== lineInState.id));
                setActionHistory([...actionHistory, { type: 'delete', line: lineInState }]);
            }
        } else {
            // Lógica original para manejar el clic en la línea (no eliminar)
            const coordinates = line.map(coord => [coord.lng, coord.lat]);
            const lineString = turfLineString(coordinates);
            const lengthKm = turfLength(lineString, { units: 'kilometers' });
            const lengthMiles = turfLength(lineString, { units: 'miles' });
            const lengthMeters = lengthKm * 1000;

            setPopupInfo({
                position: e.latlng,
                content: `
                Line length:
                <br>- ${lengthKm.toFixed(3)} km
                <br>- ${lengthMiles.toFixed(3)} mi
                <br>- ${lengthMeters.toFixed(3)} m
            `,
            });
        }
    };


    const unifyParallelLines = (lines, angleThreshold, distanceThreshold) => {
        const areLinesClose = (lineA, lineB, threshold) => {
            for (const point of lineA.geometry.coordinates) {
                const nearest = turfNearestPointOnLine(lineB, turfPoint(point));
                const distance = turfDistance(turfPoint(point), nearest, {units: 'kilometers'});
                if (distance < threshold) {
                    return true;
                }
            }
            return false;
        };

        const combineLines = (line1, line2) => {
            const combined = [...line1, ...line2].filter(
                (value, index, self) => index === self.findIndex((t) => (
                    t.lat === value.lat && t.lng === value.lng
                ))
            );
            return combined;
        };

        const clusters = lines.reduce((acc, line) => {
            const coords = line.polyline._latlngs;
            if (coords.length < 2) return acc;

            const angle = calculateLineAngle(coords[0], coords[coords.length - 1]);
            let addedToCluster = false;

            for (const cluster of acc) {
                const clusterAngle = cluster.averageAngle;
                if (Math.abs(clusterAngle - angle) < angleThreshold) {
                    cluster.lines.push(line);
                    cluster.averageAngle = (cluster.averageAngle * cluster.lines.length + angle) / (cluster.lines.length + 1);
                    addedToCluster = true;
                    break;
                }
            }

            if (!addedToCluster) {
                acc.push({
                    lines: [line],
                    averageAngle: angle
                });
            }

            return acc;
        }, []);

        const unifiedLines = clusters.flatMap(cluster => {
            const lines = cluster.lines;
            const validLines = lines.map(line => turfLineString(line.polyline._latlngs.map(coord => [coord.lng, coord.lat])));
            const visited = new Array(validLines.length).fill(false);
            let unifiedLines = [];

            for (let i = 0; i < validLines.length; i++) {
                if (visited[i]) continue;
                let unifiedLine = [...lines[i].polyline._latlngs];
                let maxLength = turfLength(validLines[i]);
                visited[i] = true;

                for (let j = i + 1; j < validLines.length; j++) {
                    if (visited[j]) continue;
                    if (areLinesClose(validLines[i], validLines[j], distanceThreshold)) {
                        unifiedLine = combineLines(unifiedLine, lines[j].polyline._latlngs);
                        const lineLength = turfLength(validLines[j]);
                        if (lineLength > maxLength) {
                            maxLength = lineLength;
                        }
                        visited[j] = true;
                    }
                }

                const newPolyline = L.polyline(unifiedLine, {color: 'red'});
                newPolyline.on('mouseover', (e) => handleLineHover(e, uuidv4()));
                newPolyline.on('mouseout', (e) => handleLineMouseOut(e, uuidv4()));
                newPolyline.on('click', (event) => handleLineClick(unifiedLine, event));
                unifiedLines.push({polyline: newPolyline, id: uuidv4(), length: maxLength});
            }

            return unifiedLines;
        });

        return unifiedLines;
    };

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
                if (resolvedId && resolvedId.data) {
                    const actualId = resolvedId.data.ID_ANALISIS;
                    setFormData(currentData => ({
                        ...currentData,
                        idAnalisis: actualId
                    }));
                } else {
                    // Maneja el caso cuando resolvedId es null o no tiene la propiedad data
                    console.error("resolvedId es null o no tiene la propiedad 'data'");
                }
            })
            .catch(error => {
                // Maneja cualquier error que ocurra durante la promesa
                console.error("Error al resolver idAnalisis:", error);
            });
    }, [idAnalisis]);

    const isClosedPolygon = (line) => {
        if (line.length < 4) {
            return false;
        }
        const firstPoint = line[0];
        const lastPoint = line[line.length - 1];
        return firstPoint[0] === lastPoint[0] && lastPoint[1] === firstPoint[1];
    };

    const formatPolygon = (polygon) => {
        if (polygon.length >= 3) {
            if (polygon[0][0] !== polygon[polygon.length - 1][0] || polygon[0][1] !== polygon[polygon.length - 1][1]) {
                polygon.push([polygon[0][0], polygon[0][1]]);
            }
            return polygon.map(coordPair => [coordPair[1], coordPair[0]]);
        }
        return [];
    };


    const findIntersections = (polygons) => {
        let intersections = [];
        polygons.forEach((poly1, i) => {
            polygons.slice(i + 1).forEach(poly2 => {
                if (poly1.length > 0 && poly2.length > 0) {
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
                }
            });
        });
        setAreasSuperpuestas(intersections);
    };

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
            nonIntersectedAreas.push(polygons[0]);
        }

        return nonIntersectedAreas;
    };

    useEffect(() => {
        if (polygons.length > 0) {
            const newNonIntersectedAreas = calculateNonIntersectedAreas(polygons);
            setNonIntersectedAreas(newNonIntersectedAreas);
        }
    }, [polygons]);

    const handleFilterChange = (e, filterType) => {
        const {checked} = e.target;
        if (filterType === "VELOCIDAD") setSpeedFilterActivated(checked);
        if (filterType === "ALTURA") setAltitudeFilterActivated(checked);
        if (filterType === "DOSISREAL") setRealDoseFilterActivated(checked);
        if (checked) {
            setActiveFilter(filterType);
        } else {
            setActiveFilter(null);
            setIntersectionsKey(Date.now());
        }
    };

    useEffect(() => {
        if (activeFilter) {
            setPolygons(polygons.map(polygon => [...polygon]));
        }
    }, [activeFilter, filterValues]);

    const correctionFactor = 1.014;
    const correctionFactorIntersections = 1.98;

    useEffect(() => {
        if (polygons.length === 0) return;

        const correctPolygons = polygons.map(polygon => {
            const correctedPolygon = polygon.map(coord => [coord[1], coord[0]]);
            if (correctedPolygon[0] !== correctedPolygon[correctedPolygon.length - 1]) {
                correctedPolygon.push(correctedPolygon[0]);
            }
            return correctedPolygon;
        });

        const turfPolygons = correctPolygons.map(polygon => turfPolygon([polygon]));

        let unionPolygons = turfPolygons[0];
        for (let i = 1; i < turfPolygons.length; i++) {
            unionPolygons = turfUnion(unionPolygons, turfPolygons[i]);
        }

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

        setAppliedArea(totalUnionArea.toFixed(3));
        setOverAppliedArea(totalIntersectedArea.toFixed(3));


        if (onAreasCalculated) {
            onAreasCalculated({
                areaSobreAplicada: totalIntersectedArea.toFixed(3),
                areaAplicada: (totalUnionArea.toFixed(3) - totalIntersectedArea.toFixed(3)).toFixed(3),
                porcentajeDeVariacion: (((totalIntersectedArea.toFixed(3) / (totalUnionArea.toFixed(3) - totalIntersectedArea.toFixed(3)).toFixed(3))) * 100).toFixed(3)
            });
        }

    }, [polygons, onAreasCalculated, areasSuperpuestas]);

    useEffect(() => {
        if (polygons.length === 0 || polygonsProperties.length === 0) return;
        const totalSpeed = polygonsProperties.reduce((acc, curr) => acc + (curr.VELOCIDAD || 0), 0);
        const totalAltitude = polygonsProperties.reduce((acc, curr) => acc + (curr.ALTURA || 0), 0);
        const totalRealDose = polygonsProperties.reduce((acc, curr) => acc + (curr.DOSISREAL || 0), 0);

        const promedioVelocidad = (totalSpeed / polygonsProperties.length).toFixed(3);
        const promedioAltura = (totalAltitude / polygonsProperties.length).toFixed(3);
        const promedioDosisReal = (totalRealDose / polygonsProperties.length).toFixed(3);

        if (onPromediosCalculated) {
            onPromediosCalculated({
                promedioVelocidad,
                promedioAltura,
                promedioDosisReal
            });
        }
    }, [polygons, polygonsProperties, onPromediosCalculated]);

    useEffect(() => {
        if (bufferedLines.length > 0) {
            const totalIntersectionArea = calculateBufferedIntersections(bufferedLines);

            const totalBufferedArea = bufferedLines.reduce((acc, buffer) =>
                acc + turfArea(turfPolygon([buffer.geometry.coordinates[0]])) / 10000, 0);

            const appliedArea = totalBufferedArea - totalIntersectionArea;

            if (onAreasCalculated) {
                const areaSobreAplicada = totalIntersectionArea.toFixed(3);
                const areaAplicada = appliedArea.toFixed(3);
                const porcentajeDeVariacion = (areaSobreAplicada / areaAplicada * 100).toFixed(3);

                onAreasCalculated({
                    areaSobreAplicada,
                    areaAplicada,
                    porcentajeDeVariacion
                });
            }
        }
    }, [bufferedLines]);

    const isValidPolygon = ({ type, coordinates }) =>
        type === 'Polygon' &&
        Array.isArray(coordinates) &&
        coordinates.length > 0 &&
        coordinates.every(
            ring =>
                Array.isArray(ring) &&
                ring.length >= 4 && // Un polígono debe tener al menos 4 puntos (incluyendo el cierre del anillo)
                ring.every(point => Array.isArray(point) && point.length === 2)
        );


    const areValidGeometries = (buffer1, buffer2) => {
        if (!buffer1?.geometry || !buffer2?.geometry) return false;
        const geom1 = buffer1.geometry;
        const geom2 = buffer2.geometry;

        if (
            !isValidPolygon(geom1) ||
            !isValidPolygon(geom2) ||
            JSON.stringify(geom1.coordinates) === JSON.stringify(geom2.coordinates)
        ) return false;

        return true;
    };

    const calculateBufferedIntersections = (bufferedLines) => {
        const intersections = [];

        bufferedLines.forEach((buffer1, i) => {
            bufferedLines.slice(i + 1).forEach(buffer2 => {
                if (areValidGeometries(buffer1, buffer2)) {
                    try {
                        const intersection = turfIntersect(buffer1, buffer2);
                        if (intersection && isValidPolygon(intersection.geometry)) {
                            const coords = intersection.geometry.coordinates;
                            if (intersection.geometry.type === 'MultiPolygon') {
                                coords.forEach(coord => intersections.push(coord[0]));
                            } else {
                                intersections.push(coords[0]);
                            }
                        }
                    } catch (error) {
                    }
                }
            });
        });
        setBufferedIntersections(intersections);

        const totalIntersectionArea = intersections.reduce((acc, intersection) =>
            acc + turfArea(turfPolygon([intersection])) / 10000, 0);

        return totalIntersectionArea;
    };




    useEffect(() => {
        if (isDrawingLine && mapRef.current) {
            const map = mapRef.current;
            const drawnLine = [];

            const onClickMap = (e) => {
                drawnLine.push([e.latlng.lat, e.latlng.lng]);
                if (drawnLine.length > 1) {
                    setIsFirstLoad(false);
                    setLines([...lines, drawnLine]);
                    setIsDrawingLine(false);
                    map.off('click', onClickMap);
                }
            };

            map.on('click', onClickMap);

            return () => {
                map.off('click', onClickMap);
            };
        }
    }, [isDrawingLine, lines]);

    const handleUndo = () => {
        if (actionHistory.length > 0) {
            const lastAction = actionHistory[actionHistory.length - 1];
            let newLines = [...lines];

            switch (lastAction.type) {
                case 'cut':
                    newLines = lastAction.originalLines;
                    break;
                case 'draw':
                    newLines = newLines.filter(line => line.id !== lastAction.line.id);
                    break;
                case 'delete':
                    newLines = [...newLines, lastAction.line];
                    break;
                default:
                    break;
            }
            if (activeTool === 'delete') {
                handleDeleteLine();
            }

            setLines(newLines);
            setActionHistory(actionHistory.slice(0, -1));
        }
    };

    const handleCutLine = () => {
        setActiveTool('cut');
        setIsFirstLoad(false);

        if (mapRef.current && lines.length > 0) {
            const map = mapRef.current;
            let previewLine = [];
            let previewLayer = null;
            let isCutting = false; // Estado para controlar si estamos en medio de un corte

            const onMove = (e) => {
                if (!isCutting) return; // No hacer nada si no estamos cortando


                if (previewLine.length === 1) {
                    previewLine[1] = [e.latlng.lat, e.latlng.lng];
                } else {
                    previewLine[1] = [e.latlng.lat, e.latlng.lng];
                }

                if (previewLayer) {
                    previewLayer.setLatLngs(previewLine);
                } else {
                    previewLayer = L.polyline(previewLine, {color: 'blue', dashArray: '5, 10'}).addTo(map);
                }
            };

            const onCutClick = (e) => {

                if (isCutting) {
                    // Completa el corte
                    if (previewLine.length === 2) {
                        const cutLineString = turfLineString(previewLine.map(coord => [coord[1], coord[0]]));

                        const newLines = [];
                        let cutSuccessful = false;
                        const originalLines = [...lines];

                        lines.forEach(line => {
                            const latlngs = line.polyline?._latlngs;
                            if (!latlngs || latlngs.length < 2) {
                                newLines.push(line);
                                return;
                            }

                            const lineString = turfLineString(latlngs.map(coord => [coord.lng, coord.lat]));
                            const intersections = turfLineIntersect(lineString, cutLineString);

                            if (intersections.features.length > 0) {
                                cutSuccessful = true;
                                const splitResult = turfLineSplit(lineString, cutLineString);

                                splitResult.features.forEach(f => {
                                    const newLine = f.geometry.coordinates.map(coord => new L.LatLng(coord[1], coord[0]));
                                    const polyline = L.polyline(newLine, {color: 'red'}).addTo(map);

                                    polyline.on('mouseover', handleLineHover);
                                    polyline.on('mouseout', handleLineMouseOut);
                                    polyline.on('click', (event) => handleLineClick(newLine, event));

                                    newLines.push({polyline, id: uuidv4()});
                                });
                            } else {
                                newLines.push(line);
                            }
                        });

                        if (cutSuccessful) {
                            setLines(newLines);
                            setActionHistory([...actionHistory, {type: 'cut', originalLines}]);
                        }

                        map.off('mousemove', onMove);
                        map.off('click', onCutClick);
                        map.removeLayer(previewLayer);

                        isCutting = false; // Terminar el corte
                        setOnClickCuteLine(true);
                    }
                } else {
                    // Inicia un nuevo corte
                    isCutting = true;
                    if (previewLayer) {
                        map.removeLayer(previewLayer);
                    }

                    previewLine = [[e.latlng.lat, e.latlng.lng]];

                    previewLayer = L.polyline(previewLine, {color: 'blue', dashArray: '5, 10'}).addTo(map);

                    map.on('mousemove', onMove); // Register move event
                }
            };

            map.off('click');
            map.on('click', onCutClick); // Register click event
        } else {
            console.warn("handleCutLine: No map reference or lines available.");
        }
    };


    const handleDrawLine = () => {
        setActiveTool('draw');
        setIsFirstLoad(false);

        if (mapRef.current && mapRef.current._loaded) {  // Verificación adicional
            const map = mapRef.current;
            let newLine = [];
            let polyline = L.polyline([], {color: 'red', pane: 'overlayPane'}).addTo(map);

            const onMove = (e) => {
                if (newLine.length > 0) {
                    const currentLine = [...newLine, {lat: e.latlng.lat, lng: e.latlng.lng}];
                    polyline.setLatLngs(currentLine);
                }
            };

            const onClick = (e) => {
                newLine.push({lat: e.latlng.lat, lng: e.latlng.lng});
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

                const lineId = uuidv4();

                setLines([...lines, {polyline: polyline, _latlngs: newLine, id: lineId}]);
                setActionHistory([...actionHistory, {
                    type: 'draw',
                    line: {polyline: polyline, _latlngs: newLine, id: lineId}
                }]);

                map.off('click', onClick);
                map.off('mousemove', onMove);
                map.off('contextmenu', onRightClick);
                setOnClickDrawLine(true);
            };

            map.on('click', onClick);
            map.on('mousemove', onMove);
            map.once('contextmenu', onRightClick);
        } else {
            console.error("Map not ready or reference is null");
        }
    };

// Definir onLineClick fuera de handleDeleteLine para mantener el nombre
    const onLineClick = (e) => {
        const clickedLine = e.target;
        const clickedLatLngs = clickedLine.getLatLngs();

        const lineInState = lines.find(line => {
            if (!line.polyline || !line.polyline._latlngs) {
                return false;
            }
            const stateLatLngs = line.polyline._latlngs;
            const isMatch = clickedLatLngs.every((latLng, index) => {
                const coord = stateLatLngs[index];
                const match = coord && coord.lat === latLng.lat && coord.lng === latLng.lng;
                return match;
            });
            return isMatch;
        });

        if (lineInState) {
            setLines(prevLines => {
                const newLines = prevLines.filter(line => line.id !== lineInState.id);
                return newLines;
            });
            setActionHistory(prevActionHistory => {
                const newActionHistory = [...prevActionHistory, {type: 'delete', line: lineInState}];
                return newActionHistory;
            });
            setOnClickLinea(true);
            reassignLineClickListeners(mapRef.current, onLineClick);
        } else {
        }
    };


    useEffect(() => {
        if (onClickLinea) {
            handleDeleteLine();
            setOnClickLinea(false);
        }
    }, [onClickLinea]);


    useEffect(() => {
        if (onClickDrawLine) {
            handleDrawLine();
            setOnClickDrawLine(false);
        }
    }, [onClickDrawLine]);

    useEffect(() => {
        if (onClickCuteLine) {
            handleCutLine();
            setOnClickCuteLine(false);
        }
    }, [onClickCuteLine]);

// Función para reasignar los eventos de clic a todas las líneas
    const reassignLineClickListeners = (map, onLineClick) => {
        // Eliminar los listeners de clic anteriores
        map.eachLayer(layer => {
            if (layer instanceof L.Polyline) {
                layer.off('click');
                layer.on('click', onLineClick);
            }
        });

        // Agregar nuevos listeners de clic
        lines.forEach(line => {
            if (line.polyline && line.polyline._latlngs) {
                line.polyline.off('click');
                line.polyline.on('click', onLineClick);
            }
        });
    };

    const handleDeleteLine = () => {
        setActiveTool('delete');
        if (mapRef.current) {
            const map = mapRef.current;
            map.eachLayer(layer => {
                if (layer instanceof L.Polyline) {
                    layer.off('click');
                    layer.on('click', (e) => handleLineClick(layer.getLatLngs(), e));
                }
            });
        }
    };


    useEffect(() => {
        if (onClickLineaStrech) {
            handleStretchLine();
        }

    }, [onClickLineaStrech]);

    const handleStretchLine = () => {
        setActiveTool('stretch');
        console.log("Active tool set to 'stretch'");

        if (mapRef.current) {
            const map = mapRef.current;
            console.log("Map reference found");

            const onLineClick = (e) => {
                console.log("Line clicked", e);
                const clickedLine = e.target;
                const clickedLatLngs = clickedLine.getLatLngs();
                console.log("Clicked line LatLngs:", clickedLatLngs);

                // Limpiar puntos extremos anteriores
                stretchPoints.forEach(marker => {
                    console.log("Removing stretch point:", marker);
                    map.removeLayer(marker);
                });
                setStretchPoints([]);
                console.log("Previous stretch points removed");

                setSelectedLine(clickedLine);
                console.log("Selected line set");

                // Resaltar los extremos de la línea
                const startMarker = L.circleMarker(clickedLatLngs[0], {
                    color: 'blue',
                    radius: 5,
                    draggable: true
                }).addTo(map);
                const endMarker = L.circleMarker(clickedLatLngs[clickedLatLngs.length - 1], {
                    color: 'blue',
                    radius: 5,
                    draggable: true
                }).addTo(map);
                console.log("Start and end markers added to map:", startMarker, endMarker);
                setStretchPoints([startMarker, endMarker]);
                console.log("Stretch points set");

                const onDrag = (isStart, e) => {
                    console.log(`Dragging ${isStart ? 'start' : 'end'} point`, e);
                    const updatedLatLngs = [...clickedLatLngs];
                    const updatedPoint = {lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng};

                    if (isStart) {
                        updatedLatLngs[0] = updatedPoint;
                    } else {
                        updatedLatLngs[updatedLatLngs.length - 1] = updatedPoint;
                    }

                    clickedLine.setLatLngs(updatedLatLngs);
                    console.log("Clicked line LatLngs updated:", updatedLatLngs);
                };

                const onDragEnd = (isStart, e) => {
                    console.log(`Drag end detected for ${isStart ? 'start' : 'end'} point`, e);
                    map.dragging.enable(); // Habilitar interacción del mapa

                    const updatedLatLngs = [...clickedLatLngs];
                    const updatedPoint = {lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng};

                    if (isStart) {
                        updatedLatLngs[0] = updatedPoint;
                    } else {
                        updatedLatLngs[updatedLatLngs.length - 1] = updatedPoint;
                    }

                    clickedLine.setLatLngs(updatedLatLngs);
                    setLines(lines.map(line => {
                        if (line.polyline === clickedLine) {
                            console.log("Updating line in state", line);
                            return {...line, polyline: clickedLine, _latlngs: clickedLine.getLatLngs()};
                        }
                        return line;
                    }));
                    console.log("Lines state updated");
                };

                const enableDragging = () => {
                    console.log("Dragging enabled");
                    map.dragging.enable();
                };

                startMarker.on('drag', (e) => onDrag(true, e));
                endMarker.on('drag', (e) => onDrag(false, e));
                startMarker.on('dragstart', () => {
                    console.log("Start marker drag started");
                    map.dragging.disable(); // Deshabilitar interacción del mapa
                });
                endMarker.on('dragstart', () => {
                    console.log("End marker drag started");
                    map.dragging.disable(); // Deshabilitar interacción del mapa
                });
                startMarker.on('dragend', (e) => {
                    onDragEnd(true, e);
                    enableDragging();
                });
                endMarker.on('dragend', (e) => {
                    onDragEnd(false, e);
                    enableDragging();
                });

                console.log("Drag listeners added to markers");
            };

            // Eliminar los listeners de clic anteriores
            map.eachLayer(layer => {
                if (layer instanceof L.Polyline) {
                    console.log("Removing previous click listener from polyline layer", layer);
                    layer.off('click');
                    layer.on('click', onLineClick);
                }
            });

            // Agregar nuevos listeners de clic
            lines.forEach(line => {
                if (line.polyline && line.polyline._latlngs) {
                    console.log("Adding click listener to line", line);
                    line.polyline.off('click');
                    line.polyline.on('click', onLineClick);
                }
            });
        } else {
            console.error("Map reference not found");
        }
    };
    const calculateExtremePoints = (coordinates) => {
        let maxDistance = 0;
        let extremePoints = [coordinates[0], coordinates[1]];

        for (let i = 0; i < coordinates.length; i++) {
            for (let j = i + 1; j < coordinates.length; j++) {
                const point1 = turfPoint(coordinates[i]);
                const point2 = turfPoint(coordinates[j]);
                const distance = turfDistance(point1, point2, {units: 'meters'});

                if (distance > maxDistance) {
                    maxDistance = distance;
                    extremePoints = [coordinates[i], coordinates[j]];
                }
            }
        }

        return extremePoints;
    };

    const calculateTotalLength = (coordinates) => {
        const [startPoint, endPoint] = calculateExtremePoints(coordinates);
        return turfDistance(turfPoint(startPoint), turfPoint(endPoint), {units: 'meters'});
    };

    const calculateDominantOrientation = (coordinates) => {
        const [startPoint, endPoint] = calculateExtremePoints(coordinates);
        return turfBearing(turfPoint(startPoint), turfPoint(endPoint));
    };

    const generateCompleteLine = (line) => {
        const coordinates = line.polyline._latlngs.map(coord => [coord.lng, coord.lat]);
        const totalLength = calculateTotalLength(coordinates);
        const dominantOrientation = calculateDominantOrientation(coordinates);

        const [startLng, startLat] = calculateExtremePoints(coordinates)[0];
        const destination = turfDestination(turfPoint([startLng, startLat]), totalLength / 1000, dominantOrientation, {units: 'kilometers'});

        const updatedLatLngs = [
            {lat: startLat, lng: startLng},
            {lat: destination.geometry.coordinates[1], lng: destination.geometry.coordinates[0]}
        ];

        const newPolyline = L.polyline(updatedLatLngs, line.polyline.options);

        newPolyline.on('mouseover', (e) => handleLineHover(e, line.id));
        newPolyline.on('mouseout', (e) => handleLineMouseOut(e, line.id));
        newPolyline.on('click', (e) => handleLineClick(updatedLatLngs, e));

        return {
            ...line,
            polyline: newPolyline
        };
    };

    const areLinesParallel = (line1, line2, tolerance = 1) => {
        const coords1 = line1.map(coord => [coord.lng, coord.lat]);
        const coords2 = line2.map(coord => [coord.lng, coord.lat]);
        const bearing1 = turfBearing(turfPoint(coords1[0]), turfPoint(coords1[1]));
        const bearing2 = turfBearing(turfPoint(coords2[0]), turfPoint(coords2[1]));
        return Math.abs(bearing1 - bearing2) < tolerance || Math.abs(Math.abs(bearing1 - bearing2) - 180) < tolerance;
    };

    const isLineClose = (line1, line2, maxDistance) => {
        const coords1 = line1.map(coord => [coord.lng, coord.lat]);
        const coords2 = line2.map(coord => [coord.lng, coord.lat]);
        const lineString1 = turfLineString(coords1);
        for (let coord of coords2) {
            const point = turfPoint(coord);
            const distance = turfPointToLineDistance(point, lineString1, {units: 'kilometers'});
            if (distance > maxDistance) {
                return false;
            }
        }
        return true;
    };

    const filterParallelLines = (lines, maxDistance) => {
        const linesToRemove = new Set();

        lines.forEach((line1, index) => {
            if (!line1.polyline || !line1.polyline._latlngs) {
                console.error(`Line 1 (index ${index}) does not have valid latlngs:`, line1);
                return;
            }

            const coords1 = line1.polyline._latlngs.map(coord => [coord.lng, coord.lat]);
            const line1Length = turfLength(turfLineString(coords1));

            lines.forEach((line2, idx) => {
                if (index !== idx) {
                    if (!line2.polyline || !line2.polyline._latlngs) {
                        console.error(`Line 2 (index ${idx}) does not have valid latlngs:`, line2);
                        return;
                    }

                    const coords2 = line2.polyline._latlngs.map(coord => [coord.lng, coord.lat]);
                    const line2Length = turfLength(turfLineString(coords2));
                    const parallel = areLinesParallel(line1.polyline._latlngs, line2.polyline._latlngs);
                    const close = isLineClose(line1.polyline._latlngs, line2.polyline._latlngs, maxDistance);
                    if (line2Length < line1Length && parallel && close) {
                        linesToRemove.add(idx);
                    }
                }
            });
        });

        return lines.filter((_, index) => !linesToRemove.has(index));
    };
    const handleLabelClick = (filterLabel) => {

    };

    const toggleUnfilteredLines = () => setShowUnfilteredLines(prevState => !prevState);

    return (
        <>


            <CommonMap
                center={mapCenter}
                zoom={zoom}
                polygons={polygons}
                lines={lines}
                points={null}
                hullPolygon={null}
                nonIntersectedAreas={nonIntersectedAreas}
                bufferedLines={bufferedLines}
                bufferedIntersections={bufferedIntersections}
                onLineHover={handleLineHover}
                onLineMouseOut={handleLineMouseOut}
                onLineClick={handleLineClick}
                activeFilter={activeFilter}
                filterValues={filterValues}
                polygonProperties={polygonsProperties}
                popupInfo={popupInfo}
                setPopupInfo={setPopupInfo}
                showIntersections={showIntersections}
                mapRef={mapRef}
                userId={userData.ID_USUARIO}
                stretchPoints={stretchPoints}
                lineasNoFiltradas={showUnfilteredLines ? lineasNoFiltradas : []}
                highlightedLote={highlightedLote}
                polygonsData={polygonsData}
                activeLotes={activeLotes}
                onLeaveLote={onLeaveLote}
                onSelectLote={onSelectLote}
                onHoverLote={onHoverLote}
                areasSuperpuestas={areasSuperpuestas}
                setImgLaflet={setImgLaflet}
            />
            {isKml && (
                <FloatingToolsAerialApplications
                    handleCutLine={handleCutLine}
                    handleDrawLine={handleDrawLine}
                    handleDeleteLine={handleDeleteLine}
                    handleToggleBuffer={handleToggleBuffer}
                    handleUndo={handleUndo}
                    handleStretchLine={handleStretchLine}
                    activeTool={activeTool}
                    isBufferActive={isBufferActive}
                    bufferValue={bufferValue}
                    setBufferValue={setBufferValue}
                    showUnfilteredLines={showUnfilteredLines}
                    toggleUnfilteredLines={toggleUnfilteredLines}
                />

            )}

            {polygons.length > 0 && lines.length === 0 && (
                <BarIndicator filterType={activeFilter ? activeFilter : "aerialApplicationsTraslape"} isHistory={false}
                              onLabelClick={handleLabelClick}/>
            )}

            <MapDialog
                isOpen={isFilterDialogOpen}
                onClose={closeFilterDialog}
                availableFilters={availableFilters}
                handleToggleFilter={handleToggleFilter}
                filterSpeed={filterSpeed}
                filterAltitude={filterAltitude}
                filterRealDose={filterRealDose}
                lowSpeed={lowSpeed}
                medSpeed={medSpeed}
                highSpeed={highSpeed}
                setLowSpeed={setLowSpeed}
                setMedSpeed={setMedSpeed}
                setHighSpeed={setHighSpeed}
                lowAltitude={lowAltitude}
                medAltitude={medAltitude}
                highAltitude={highAltitude}
                setLowAltitude={setLowAltitude}
                setMedAltitude={setMedAltitude}
                setHighAltitude={setHighAltitude}
                lowRealDose={lowRealDose}
                medRealDose={medRealDose}
                highRealDose={highRealDose}
                setLowRealDose={setLowRealDose}
                setMedRealDose={setMedRealDose}
                setHighRealDose={setHighRealDose}
            />
        </>
    );
};

export default AerialApplications;