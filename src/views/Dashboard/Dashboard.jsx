import React, { useEffect, useState, useRef, useContext } from 'react';
import { useSocket } from '../../context/SocketContext';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import axios from 'axios';
import JSZip from 'jszip';
import pako from 'pako';
import { API_BASE_PYTHON_SERVICE, API_BASE_URL } from '../../utils/config';
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import MapSection from './MapSection/MapSection';
import DataSection from './DataSection/DataSection';
import Tutorial from '../../components/Tutorial/Tutorial';
import ToolbarComponent from "../../components/ToolbarComponent/ToolbarComponent";
import FilterToolbar from "../../components/FilterToolbar/FilterToolbar";
import { Box, CircularProgress } from '@mui/material';
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import {
    DashboardContainer,
    MainContent,
    DashboardControls,
    MapSectionContainer,
    AnalysisSection,
} from './DashboardStyle';
import { sendDashboardData } from '../../utils/DashboardUtils';
import { SidebarContext } from "../../context/SidebarContext";
import analysisConfig from "../../utils/analysisConfig";
import sidebarOptionsConfig from "../../utils/sidebarOptionsConfig";
import { manejarSubidaArchivo } from "../../utils/fileHandler";
import { insertarUltimoAnalisis, obtenerLoteMasReciente } from "../../utils/mapUtils";
import { ejecutarProcesoCosechaMecanica, ejecutarProcesoSinArchivoCosechaMecanica } from "../../analysis/cosechaMecanica/cosechaMecanicaProcess";
import { ejecutarProcesoAps, ejecutarProcesoSinArchivoAps } from "../../analysis/aps/apsProcess";
import { ejecutarProcesoHerbicidas, ejecutarProcesoSinArchivoHerbicidas } from "../../analysis/herbicidas/herbicidasProcess";
import { ejecutarProcesoFertilizacion, ejecutarProcesoSinArchivoFertilizacion } from "../../analysis/fertilizacion/fertilizacionProcess";
import { ejecutarProcesoConteoPalmas } from "../../analysis/conteoPalmas/conteoPalmasProcess";
import { APLICACIONES_AEREAS, COSECHA_MECANICA, HERBICIDAS, FERTILIZACION, CONTEO_PALMA } from "../../utils/Constants";
import {CompanyContext} from "../../context/CompanyContext";

const Dashboard = React.memo(({ isSidebarOpen }) => {
    const { logo } = useContext(CompanyContext);

    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const [runTutorial, setRunTutorial] = useState(false);
    const [tutorialKey, setTutorialKey] = useState(0);
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [idMax, setIdMax] = useState(null);
    const [processingFinished, setProcessingFinished] = useState(false);
    const [titleLoader, setTitleLoader] = useState("");
    const [idAnalisisAps, setIdAnalisisAps] = useState(null);
    const [idAnalisisCosechaMecanica, setIdAnalisisCosechaMecanica] = useState(null);
    const [idAnalisisFertilizacion, setIdAnalisisFertilizacion] = useState(null);
    const [idAnalisisHerbicidas, setIdAnalisisHerbicidas] = useState(null);
    const [idAnalisisBash, setIdAnalisisBash] = useState(null);
    const [idAnalisisUltimoAnalisis, setIdAnalisisUltimoAnalisis] = useState(null);
    const selectedAnalysisTypeRef = useRef();
    const [progressMessage, setProgressMessage] = useState("");
    const [selectedZipFile, setSelectedZipFile] = useState(null);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [datosMapeo, setDatosMapeo] = useState([]);
    const [areaAplicada, setAreaAplicada] = useState(0);
    const [porcentajeVariacion, setPorcentajeVariacion] = useState(0);
    const [areaNoAplicada, setAreaNoAplicada] = useState(0);
    const [promedioVelocidad, setPromedioVelocidad] = useState(0);
    const [promedioAltura, setPromedioAltura] = useState(0);
    const [promedioDosisReal, setDosisReal] = useState(0);
    const [areaNetaCm, setAreaNetaCm] = useState(null);
    const [areaBrutaCm, setAreaBrutaCm] = useState(null);
    const [diferenciaDeAreaCm, setDiferenciaDeAreaCm] = useState(null);
    const [eficienciaCm, setEficienciaCm] = useState(null);
    const [promedioVelocidadCm, setPromedioVelocidadCm] = useState(null);
    const [porcentajeAreaPilotoCm, setPorcentajeAreaPilotoCm] = useState(null);
    const [areaSobreAplicada, setAreaSobreAplicada] = useState(0);
    const [porcentajeAreaAutoTrackerCm, setPorcentajeAreaAutoTrackerCm] = useState(null);
    const [porcentajeModoCortadorBaseCm, setPorcentajeModoCortadorBaseCm] = useState(null);

    const [datosAnalisis, setDatosAnalisis] = useState({});
    const [isKMLFile, setIsKMLFile] = useState(false);
    const [activarEdicionInteractiva, setActivarEdicionInteractiva] = useState(true);
    const [selectedAnalysisType, setSelectedAnalysisType] = useState('');
    const dashboardRef = useRef();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [uploadedCsvFileName, setUploadedCsvFileName] = useState('');
    const [uploadedZipFileName, setUploadedZipFileName] = useState('');
    const [execBashEnabled, setExecBashEnabled] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [polygonsData, setPolygonsData] = useState([]);
    const [activeLotes, setActiveLotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const socketContext = useSocket();
    const { socket, socketSessionID } = socketContext || {};
    const [indicadores, setIndicadores] = useState('');
    const [imgLaflet, setImgLaflet] = useState(null);
    const { selectedSidebarOption } = useContext(SidebarContext) || {};
    const [filterOptions, setFilterOptions] = useState([]);
    const [analysisOptions, setAnalysisOptions] = useState([]);
    const [ultimoAnalisis, setUltimoAnalisis] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [northWestCoords, setNorthWestCoords] = useState(null);
    const [southEastCoords, setSouthEastCoords] = useState(null);
    const [conteoPalmas, setConteoPalmas] = useState(0);
    const [highlightedLote, setHighlightedLote] = useState(null);
    const [isAnalysisPerformed, setIsAnalysisPerformed] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        try {
            obtenerLoteMasReciente(setLoading, setPolygonsData, userData.ID_USUARIO);
        } catch (error) {
            console.error("Error en obtenerLoteMasReciente:", error);
        }
    }, []);

    useEffect(() => {
        return () => {
            setDatosMapeo([]);
            setSelectedFile(null);
        };
    }, [setDatosMapeo, setSelectedFile]);

    useEffect(() => {
        if (socket) {
            socket.on(`${socketSessionID}:progressUpdate`, (data) => {
                try {
                    const progressNumber = Number(data.progress);
                    const message = data.message;
                    setProgress(progressNumber);
                    setProgressMessage(message);
                    setShowProgressBar(progressNumber < 100);
                    if (progressNumber === 80) {
                        socket.emit(`${socketSessionID}:progressUpdate`, { progress: 100, message: "Finalizado" });
                        setShowProgressBar(false);
                    }
                } catch (error) {
                    console.error("Error en el manejador de progressUpdate:", error);
                }
            });

            return () => {
                socket.off(`${socketSessionID}:progressUpdate`);
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket && socket.on) {
            socket.on(`${socketSessionID}:dataInsertion`, handleDatosInsertados);

            return () => {
                socket.off(`${socketSessionID}:dataInsertion`, handleDatosInsertados);
            };
        }
    }, [socket, socketSessionID]);

    useEffect(() => {
        console.log("ESTE ES EL SELECTED ANALYSIS TYPE: ", selectedAnalysisType);
        const config = analysisConfig[selectedAnalysisType];
        console.log("ESTE ES EL CONFIG: ", config);
        if (config && config.fetchData) {
            try {
                if (selectedAnalysisType === 'CONTEO_PALMA') {
                    config.fetchData(conteoPalmas, setDatosAnalisis); // Pasar conteoPalmas directamente
                } else {
                    config.fetchData(idAnalisisUltimoAnalisis, setDatosAnalisis);
                }
            } catch (error) {
                console.error("Error en config.fetchData:", error);
            }
        }
    }, [idAnalisisCosechaMecanica, idAnalisisAps, idAnalisisHerbicidas, idAnalisisFertilizacion, conteoPalmas]);


    useEffect(() => {
        const config = analysisConfig[selectedAnalysisType];
        try {
            if (config && config.shouldEnableExecBash) {
                setExecBashEnabled(config.shouldEnableExecBash(selectedFile || selectedZipFile));
            } else {
                setExecBashEnabled(false);
            }
        } catch (error) {
            console.error("Error en config.shouldEnableExecBash:", error);
            setExecBashEnabled(false);
        }
    }, [selectedAnalysisType, selectedFile, selectedZipFile]);

    useEffect(() => {
        selectedAnalysisTypeRef.current = selectedAnalysisType;

        const config = analysisConfig[selectedAnalysisType];
        const id = config ? config.id : null;
        setIdAnalisisBash(id);
    }, [selectedAnalysisType, userData.ID_USUARIO]);

    useEffect(() => {
        const config = sidebarOptionsConfig[selectedSidebarOption];
        try {
            if (config) {
                setAnalysisOptions(config.analysisOptions || []);
                setFilterOptions(config.filterOptions || []);
            }
        } catch (error) {
            console.error("Error en config de sidebarOptionsConfig:", error);
            setAnalysisOptions([]);
            setFilterOptions([]);
        }
    }, [selectedSidebarOption]);

    useEffect(() => {
        try {
            if (idAnalisisUltimoAnalisis) {
                setIdAnalisisAps(idAnalisisUltimoAnalisis);
                setIdAnalisisCosechaMecanica(idAnalisisUltimoAnalisis);
                setIdAnalisisFertilizacion(idAnalisisUltimoAnalisis);
                setIdAnalisisHerbicidas(idAnalisisUltimoAnalisis);
            }
        } catch (error) {
            console.error("Error en setIdAnalisis:", error);
        }
    }, [idAnalisisUltimoAnalisis]);

    const handleDatosInsertados = async () => {
        try {
            const config = analysisConfig[selectedAnalysisTypeRef.current];
            if (config && config.cargaDatos) {
                setUltimoAnalisis(await config.cargaDatos(userData, selectedAnalysisTypeRef, setIdAnalisisUltimoAnalisis));
            } else {
                toast.warn('Debes seleccionar un tipo de análisis.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Error en handleDatosInsertados:", error);
        }
    };

    function nombreAnalisis(idAnalisis) {
        try {
            const entry = Object.entries(analysisConfig).find(([, config]) => config.id === idAnalisis);
            return entry ? entry[0] : "";
        } catch (error) {
            console.error("Error en nombreAnalisis:", error);
            return "";
        }
    }

    const handleFileUpload = async (event) => {
        try {
            await manejarSubidaArchivo(
                event,
                setTitleLoader,
                setOpenSnackbar,
                setUploadedCsvFileName,
                selectedAnalysisTypeRef,
                idAnalisisBash,
                nombreAnalisis,
                userData.ID_USUARIO,
                setIdMax,
                setSelectedFile,
                setDatosMapeo,
                setProgress,
                setShowProgressBar
            );
        } catch (error) {
            console.error("Error en handleFileUpload:", error);
        }
    };

    const execBash = async () => {
        try {
            setIsAnalysisPerformed(true);
            setShowProgressBar(true);
            setTitleLoader("Cargando Análisis");
            const idUsuario = userData.ID_USUARIO;

            if (!idAnalisisBash) {
                toast.error('Debe seleccionar un análisis antes de continuar', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                    hideProgressBar: true,
                });
                return;
            }

            if (!selectedFile) {
                await ejecutarProcesoSinArchivo();
                return;
            }

            if (idAnalisisBash === APLICACIONES_AEREAS) {
                await ejecutarProcesoAps({
                    selectedFile, selectedZipFile, idMax, idUsuario, setProcessingFinished, socket, socketSessionID, activarEdicionInteractiva, setShowProgressBar, setProgress, setTitleLoader
                });
            } else if (idAnalisisBash === COSECHA_MECANICA) {
                await ejecutarProcesoCosechaMecanica({
                    selectedFile, selectedZipFile, idMax, idUsuario, setProcessingFinished, socket, socketSessionID, setShowProgressBar, setProgress, setTitleLoader, setLoadingProgress
                });
            } else if (idAnalisisBash === HERBICIDAS) {
                await ejecutarProcesoHerbicidas({
                    selectedFile, selectedZipFile, idMax, idUsuario, setProcessingFinished, socket, socketSessionID
                });
            } else if (idAnalisisBash === FERTILIZACION) {
                await ejecutarProcesoFertilizacion({
                    selectedFile, selectedZipFile, idMax, idUsuario, setProcessingFinished, socket, socketSessionID
                });
            }
        } catch (error) {
            console.error("Error en execBash:", error);
        }
    };

    const ejecutarProcesoSinArchivo = async () => {
        try {
            const idUsuario = userData.ID_USUARIO;

            if (idAnalisisBash === APLICACIONES_AEREAS) {
                await ejecutarProcesoSinArchivoAps({
                    idMax, idUsuario, setProcessingFinished
                });
            } else if (idAnalisisBash === COSECHA_MECANICA) {
                await ejecutarProcesoSinArchivoCosechaMecanica({
                    idMax, idUsuario, setProcessingFinished
                });
            } else if (idAnalisisBash === HERBICIDAS) {
                await ejecutarProcesoSinArchivoHerbicidas({
                    idMax, idUsuario, setProcessingFinished
                });
            } else if (idAnalisisBash === FERTILIZACION) {
                await ejecutarProcesoSinArchivoFertilizacion({
                    idMax, idUsuario, setProcessingFinished
                });
            } else if (idAnalisisBash === CONTEO_PALMA) {
                await ejecutarProcesoConteoPalmas({
                    selectedZipFile, setProcessingFinished, setImageUrl, setNorthWestCoords, setSouthEastCoords, setConteoPalmas, socket, socketSessionID, setProgress, setTitleLoader, setShowProgressBar
                });
            }
        } catch (error) {
            console.error("Error en ejecutarProcesoSinArchivo:", error);
        }
    };

    const handleAnalysisTypeChange = (event) => {
        try {
            setSelectedAnalysisType(event.target.value);
        } catch (error) {
            console.error("Error en handleAnalysisTypeChange:", error);
        }
    };

    const esValorValido = (valor) => {
        return valor !== '' && valor !== 0 && valor !== null && valor !== undefined;
    };

    const toggleEdicionInteractiva = () => {
        try {
            setActivarEdicionInteractiva(prev => !prev);
        } catch (error) {
            console.error("Error en toggleEdicionInteractiva:", error);
        }
    };

    const onHoverLote = (loteId) => {
        try {
            setHighlightedLote(loteId);
        } catch (error) {
            console.error("Error en onHoverLote:", error);
        }
    };

    const onLeaveLote = () => {
        try {
            setHighlightedLote(null);
        } catch (error) {
            console.error("Error en onLeaveLote:", error);
        }
    };

    const onSelectLote = (loteId) => {
        try {
            setActiveLotes((prevActiveLotes) =>
                prevActiveLotes.includes(loteId)
                    ? prevActiveLotes.filter((id) => id !== loteId)
                    : [...prevActiveLotes, loteId]
            );
        } catch (error) {
            console.error("Error en onSelectLote:", error);
        }
    };

    const clearAllLotes = () => {
        try {
            setActiveLotes([]);
        } catch (error) {
            console.error("Error en clearAllLotes:", error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="65vh">
                <CircularProgress />
            </Box>
        );
    }

    const handleSendDashboardData = async (imgData) => {
        try {
            if (imgData) {
                await sendDashboardData(imgData, indicadores, userData.ID_USUARIO, logo);
            } else {
                console.error("No se pudo capturar la imagen del mapa.");
            }
        } catch (error) {
            console.error("Error en handleSendDashboardData:", error);
        } finally {
            setIsGeneratingReport(false); // Finaliza el loader cuando termine el proceso
        }
    };



    const openFilterDialog = () => {
        try {
            setIsFilterDialogOpen(true);
        } catch (error) {
            console.error("Error en openFilterDialog:", error);
        }
    };

    const closeFilterDialog = () => {
        try {
            setIsFilterDialogOpen(false);
        } catch (error) {
            console.error("Error en closeFilterDialog:", error);
        }
    };

    return (
        <DashboardContainer>
            <Tutorial key={tutorialKey} isActive={runTutorial} onClose={() => setRunTutorial(false)} />
            <ProgressBar progress={progress} message={progressMessage} show={showProgressBar} title={titleLoader} />
            <MainContent isSidebarOpen={isSidebarOpen}>
                <div className="dashboard-main">
                    <DashboardControls>
                        <LoadingBar
                            progress={loadingProgress}
                            show={!processingFinished}
                        />
                        <ToolbarComponent
                            selectedAnalysisType={selectedAnalysisType}
                            handleAnalysisTypeChange={handleAnalysisTypeChange}
                            manejarSubidaArchivo={handleFileUpload}
                            uploadedCsvFileName={uploadedCsvFileName}
                            uploadedZipFileName={uploadedZipFileName}
                            execBash={execBash}
                            activarEdicionInteractiva={activarEdicionInteractiva}
                            setActivarEdicionInteractiva={setActivarEdicionInteractiva}
                            isKMLFile={isKMLFile}
                            execBashEnabled={execBashEnabled}
                            isSidebarOpen={isSidebarOpen}
                            polygonsData={polygonsData}
                            highlightedLote={highlightedLote}
                            activeLotes={activeLotes}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            onHoverLote={onHoverLote}
                            onLeaveLote={onLeaveLote}
                            onSelectLote={onSelectLote}
                            clearAllLotes={clearAllLotes}
                            openFilterDialog={openFilterDialog}
                            processingFinished={processingFinished}
                            handleSendDashboardData={handleSendDashboardData}
                            analysisOptions={analysisOptions}
                            setSelectedZipFile={setSelectedZipFile}
                            setUploadedZipFileName={setUploadedZipFileName}
                            setOpenSnackbar={setOpenSnackbar}
                            setIsKMLFile={setIsKMLFile}
                            mapRef={mapRef}
                            setImgLaflet={setImgLaflet}
                            isGeneratingReport={isGeneratingReport}
                            setIsGeneratingReport={setIsGeneratingReport}
                        />
                        <FilterToolbar isSidebarOpen={isSidebarOpen} isDashboardIndicators={false} filterOptions={filterOptions} />
                    </DashboardControls>
                    <MapSectionContainer>
                        <MapSection
                            selectedFile={selectedFile}
                            selectedAnalysisType={selectedAnalysisType}
                            datosMapeo={datosMapeo}
                            selectedZipFile={selectedZipFile}
                            processingFinished={processingFinished}
                            ultimoAnalisis={ultimoAnalisis}
                            nombreAnalisis={nombreAnalisis}
                            idAnalisisBash={idAnalisisBash}
                            activarEdicionInteractiva={activarEdicionInteractiva}
                            setAreaNetaCm={setAreaNetaCm}
                            setAreaBrutaCm={setAreaBrutaCm}
                            setDiferenciaDeAreaCm={setDiferenciaDeAreaCm}
                            setPorcentajeAreaPilotoCm={setPorcentajeAreaPilotoCm}
                            setPorcentajeAreaAutoTrackerCm={setPorcentajeAreaAutoTrackerCm}
                            setPorcentajeModoCortadorBaseCm={setPorcentajeModoCortadorBaseCm}
                            setEficienciaCm={setEficienciaCm}
                            setAreaSobreAplicada={setAreaSobreAplicada}
                            setAreaAplicada={setAreaAplicada}
                            setPorcentajeVariacion={setPorcentajeVariacion}
                            setAreaNoAplicada={setAreaNoAplicada}
                            setPromedioVelocidad={setPromedioVelocidad}
                            setPromedioAltura={setPromedioAltura}
                            setDosisReal={setDosisReal}
                            polygonsData={polygonsData}
                            highlightedLote={highlightedLote}
                            activeLotes={activeLotes}
                            onHoverLote={onHoverLote}
                            onLeaveLote={onLeaveLote}
                            onSelectLote={onSelectLote}
                            closeFilterDialog={closeFilterDialog}
                            isFilterDialogOpen={isFilterDialogOpen}
                            setImgLaflet={setImgLaflet}
                            imageUrl={imageUrl}
                            northWestCoords={northWestCoords}
                            southEastCoords={southEastCoords}
                            isAnalysisPerformed={isAnalysisPerformed}
                            mapRef={mapRef}
                        />
                    </MapSectionContainer>
                    <AnalysisSection ref={dashboardRef}>
                        <DataSection
                            selectedAnalysisType={selectedAnalysisType}
                            promedioAltura={promedioAltura}
                            areaSobreAplicada={areaSobreAplicada}
                            areaAplicada={areaAplicada}
                            porcentajeVariacion={porcentajeVariacion}
                            promedioDosisReal={promedioDosisReal}
                            promedioVelocidad={promedioVelocidad}
                            areaBrutaCm={areaBrutaCm}
                            eficienciaCm={eficienciaCm}
                            promedioVelocidadCm={promedioVelocidadCm}
                            porcentajeAreaPilotoCm={porcentajeAreaPilotoCm}
                            porcentajeAreaAutoTrackerCm={porcentajeAreaAutoTrackerCm}
                            porcentajeModoCortadorBaseCm={porcentajeModoCortadorBaseCm}
                            esValorValido={esValorValido}
                            setIndicadores={setIndicadores}
                            datosAnalisis={datosAnalisis}
                            conteoPalmas={conteoPalmas}
                        />
                    </AnalysisSection>
                </div>
            </MainContent>
        </DashboardContainer>
    );
});

export default Dashboard;