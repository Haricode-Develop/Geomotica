import React, { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import Papa from 'papaparse';
import { styled } from '@mui/system';
import './DashboardStyle.css';
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from '../../components/LayoutSide';
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MapSection from './MapSection/MapSection';
import DataSection from './DataSection/DataSection';
import UploadButtons from './UploadButtons/UploadButtons';
import AnalysisControls from './AnalysisControls/AnalysisControls';
import Tutorial from '../../components/Tutorial/Tutorial';
import { Link, Button, Tooltip, IconButton } from '@mui/material';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import GetAppIcon from '@mui/icons-material/GetApp';
import JSZip from 'jszip';

import {
    // Cosecha mecánica
    obtenerRpmCm,
    obtenerActividadCm,
    obtenerCalidadGpsCm,
    obtenerConsumoCombustibleCm,
    obtenerFechaFinCosechaCm,
    obtenerCodigoParcelaResponsableCm,
    obtenerFechaInicioCosechaCm,
    obtenerHoraFinalCm,
    obtenerHoraInicioCm,
    obtenerNombreFincaCm,
    obtenerNombreMaquinaCm,
    obtenerNombreResponsableCm,
    obtenerNombreOperadorCm,
    obtenerPromedioVelocidadCm,
    obtenerTiempoTotalActividadCm,
    obtenerTahCm,
    obtenerPresionCortadorBaseCm,
    obtenerTchCm,
    // Fertilización
    obtenerNombreFincaFertilizacion,
    obtenerAreaBrutaFertilizacion,
    obtenerResponsableFertilizacion,
    obtenerAreaNetaFertilizacion,
    obtenerDiferenciaAreaFertilizacion,
    obtenerActividadFertilizacion,
    obtenerDosisTeoricaFertilizacion,
    obtenerEficienciaFertilizacion,
    obtenerEquipoFertilizacion,
    obtenerFechaFinalFertilizacion,
    obtenerFechaInicioFertilizacion,
    obtenerHoraInicioFertilizacion,
    obtenerOperadorFertilizacion,
    obtenerTiempoTotalFertilizacion,
    obtenerHoraFinalFertilizacion,
    obtenerPromedioDosisRealFertilizacion,
    // APS
    obtenerCodigoParcelasAps,
    obtenerEficienciaAps,
    obtenerEquipoAps,
    obtenerFechaInicioCosechaAps,
    obtenerFechaFinCosechaAps,
    obtenerHoraInicioAps,
    obtenerHoraFinalAps,
    obtenerNombreFincaAps,
    obtenerNombreOperadorAps,
    obtenerResponsableAps,
    obtenerCodigoLotesAps,
    obtenerDosisTeoricaAps,
    obtenerHumedadDelCultivoAps,
    obtenerTchEstimado,
    // HERBICIDAS
    obtenerAreaBrutaHerbicidas,
    obtenerEficienciaHerbicidas,
    obtenerHoraFinalHerbicidas,
    obtenerActividadHerbicidas,
    obtenerAreaNetaHerbicidas,
    obtenerHoraInicioHerbicidas,
    obtenerDiferenciaDeAreaHerbicidas,
    obtenerNombreFincaHerbicidas,
    obtenerPromedioVelocidadHerbicidas,
    obtenerTiempoTotalHerbicidas,
    obtenerEquipoHerbicidas,
    obtenerFechaHerbicidas,
    obtenerOperadorHerbicidas,
    obtenerParcelaHerbicidas,
    obtenerResponsableHerbicidas,
    displayValue,
    obtenerTiempoTotalAps,
    obtenerProductoAps
} from "../../utils/Constants";
const StyledButton = styled(Button)(({ theme }) => ({
    margin: 1,
    borderRadius: 25, // Más redondeado
    backgroundColor: '#f5f5f5',
    color: '#333',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
}));

const StyledButtonRealizarAnalisis = styled(Button)(({ theme }) => ({
    margin: 1,
    borderRadius: 25, // Más redondeado
    backgroundColor: '#2F88C9',
    color: '#fff',
}));


function Dashboard({ isSidebarOpen }) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [runTutorial, setRunTutorial] = useState(false);
    const [tutorialKey, setTutorialKey] = useState(0);
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [idMax, setIdMax] = useState(null);
    const [progressIteracion, setProgressIteracion] = useState(null);
    const [processingFinished, setProcessingFinished] = useState(false);
    const [titleLoader, setTitleLoader] = useState("");
    const [idAnalisisAps, setIdAnalisisAps] = useState(null);
    const [idAnalisisCosechaMecanica, setIdAnalisisCosechaMecanica] = useState(null);
    const [idAnalisisFertilizacion, setIdAnalisisFertilizacion] = useState(null);
    const [idAnalisisHerbicidas, setIdAnalisisHerbicidas] = useState(null);
    const [idAnalisisBash, setIdAnalisisBash] = useState(null);
    const selectedAnalysisTypeRef = useRef();
    const [socket, setSocket] = useState(null);
    const [progressMessage, setProgressMessage] = useState("");
    const [selectedZipFile, setSelectedZipFile] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [datosMapeo, setDatosMapeo] = useState([]);
    const [ResponsableAps, setResponsableAps] = useState(null);
    const [tiempoTotalAps, setTiempoTotalAps] = useState(null);
    const [fechaInicioCosechaAps, setFechaInicioCosechaAps] = useState(null);
    const [fechaFinCosechaAps, setFechaFinCosechaAps] = useState(null);
    const [nombreOperadorAps, setNombreOperadorAps] = useState(null);
    const [equipoAps, setEquipoAps] = useState(null);
    const [horaInicioAps, setHoraInicioAps] = useState(null);
    const [horaFinalAps, setHoraFinalAps] = useState(null);
    const [eficienciaAps, setEficienciaAps] = useState(null);
    const [nombreFincaAps, setNombreFincaAps] = useState(null);
    const [codigoParcelasAps, setCodigoParcelasAps] = useState(null);
    const [codigoLotesAps, setCodigoLotesAps] = useState(null);
    const [dosisTeorica, setDosisTeoricaAps] = useState(null);
    const [humedadDelCultivoAps, setHumedadDelCultivoAps] = useState(null);
    const [tchEstimado, setTchEstimadoAps] = useState(null);
    const [areaAplicada, setAreaAplicada] = useState(0);
    const [porcentajeVariacion, setPorcentajeVariacion] = useState(0);
    const [areaNoAplicada, setAreaNoAplicada] = useState(0);
    const [promedioVelocidad, setPromedioVelocidad] = useState(0);
    const [promedioAltura, setPromedioAltura] = useState(0);
    const [promedioDosisReal, setDosisReal] = useState(0);
    const [productoAps, setProductoAps] = useState(null);
    const [nombreResponsableCm, setNombreResponsableCm] = useState(null);
    const [fechaInicioCosechaCm, setFechaInicioCosechaCm] = useState(null);
    const [fechaFinCosechaCm, setFechaFinCosechaCm] = useState(null);
    const [nombreFincaCm, setNombreFincaCm] = useState(null);
    const [codigoParcelaResponsableCm, setCodigoParcelaResponsableCm] = useState(null);
    const [nombreOperadorCm, setNombreOperadorCm] = useState(null);
    const [nombreMaquinaCm, setNombreMaquinaCm] = useState(null);
    const [actividadCm, setActividadCm] = useState(null);
    const [areaNetaCm, setAreaNetaCm] = useState(null);
    const [areaBrutaCm, setAreaBrutaCm] = useState(null);
    const [diferenciaDeAreaCm, setDiferenciaDeAreaCm] = useState(null);
    const [horaInicioCm, setHoraInicioCm] = useState(null);
    const [horaFinalCm, setHoraFinalCm] = useState(null);
    const [tiempoTotalActividadCm, setTiempoTotalActividadCm] = useState(null);
    const [eficienciaCm, setEficienciaCm] = useState(null);
    const [promedioVelocidadCm, setPromedioVelocidadCm] = useState(null);
    const [porcentajeAreaPilotoCm, setPorcentajeAreaPilotoCm] = useState(null);
    const [consumoCombustibleCm, setConsumoCombustibleCm] = useState(null);
    const [areaSobreAplicada, setAreaSobreAplicada] = useState(0);

    const [calidadGpsCm, setCalidadGpsCm] = useState(null);
    const [rpmCm, setRpmCm] = useState(null);
    const [tchCm, setTchCm] = useState(null);
    const [tahCm, setTahCm] = useState(null);
    const [presionCortadorBase, setPresionCortadorBase] = useState(null);
    const [porcentajeAreaAutoTrackerCm, setPorcentajeAreaAutoTrackerCm] = useState(null);
    const [porcentajeModoCortadorBaseCm, setPorcentajeModoCortadorBaseCm] = useState(null);
    const [responsableFertilizacion, setResponsableFertilizacion] = useState(null);
    const [fechaInicioFertilizacion, setFechaInicioFertilizacion] = useState(null);
    const [fechaFinalFertilizacion, setFechaFinalFertilizacion] = useState(null);
    const [nombreFincaFertilizacion, setNombreFincaFertilizacion] = useState(null);
    const [operadorFertilizacion, setOperadorFertilizacion] = useState(null);
    const [equipoFertilizacion, setEquipoFertilizacion] = useState(null);
    const [actividadFertilizacion, setActividadFertilizacion] = useState(null);
    const [areaNetaFertilizacion, setAreaNetaFertilizacion] = useState(null);
    const [areaBrutaFertilizacion, setAreaBrutaFertilizacion] = useState(null);
    const [diferenciaAreaFertilizacion, setDiferenciaAreaFertilizacion] = useState(null);
    const [horaInicioFertilizacion, setHoraInicioFertilizacion] = useState(null);
    const [horaFinalFertilizacion, setHoraFinalFertilizacion] = useState(null);
    const [tiempoTotalFertilizacion, setTiempoTotalFertilizacion] = useState(null);
    const [eficienciaFertilizacion, setEficienciaFertilizacion] = useState(null);
    const [promedioDosisRealFertilizacion, setPromedioDosisRealFertilizacion] = useState(null);
    const [dosisTeoricaFertilizacion, setDosisTeoricaFertilizacion] = useState(null);
    const [responsableHerbicidas, setResponsableHerbicidas] = useState(null);
    const [fechaHerbicidas, setFechaHerbicidas] = useState(null);
    const [nombreFincaHerbicidas, setNombreFincaHerbicidas] = useState(null);
    const [parcelaHerbicidas, setParcelaHerbicidas] = useState(null);
    const [operadorHerbicidas, setOperadorHerbicidas] = useState(null);
    const [equipoHerbicidas, setEquipoHerbicidas] = useState(null);
    const [actividadHerbicidas, setActividadHerbicidas] = useState(null);
    const [areaNetaHerbicidas, setAreaNetaHerbicidas] = useState(null);
    const [areaBrutaHerbicidas, setAreaBrutaHerbicidas] = useState(null);
    const [diferenciaDeAreaHerbicidas, setDiferenciaDeAreaHerbicidas] = useState(null);
    const [horaInicioHerbicidas, setHoraInicioHerbicidas] = useState(null);
    const [horaFinalHerbicidas, setHoraFinalHerbicidas] = useState(null);
    const [tiempoTotalHerbicidas, setTiempoTotalHerbicidas] = useState(null);
    const [eficienciaHerbicidas, setEficienciaHerbicidas] = useState(null);
    const [promedioVelocidadHerbicidas, setPromedioVelocidadHerbicidas] = useState(null);
    const [datosCosechaMecanica, setDatosCosechaMecanica] = useState({});
    const [isKMLFile, setIsKMLFile] = useState(false);
    const [activarEdicionInteractiva, setActivarEdicionInteractiva] = useState(false);
    const [selectedAnalysisType, setSelectedAnalysisType] = useState('');
    const [datosCargadosAps, setDatosCargadosAps] = useState(false);
    const [datosCargadosCosechaMecanica, setDatosCargadosCosechaMecanica] = useState(false);
    const [datosCargadosFertilizacion, setDatosCargadosFertilizacion] = useState(false);
    const [datosCargadosHerbicidas, setDatosCargadosHerbicidas] = useState(false);
    const dashboardRef = useRef();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [uploadedCsvFileName, setUploadedCsvFileName] = useState('');
    const [uploadedZipFileName, setUploadedZipFileName] = useState('');
    const [limpiarMapa, setLimpiarMapa] = useState(false);

    const analysisTemplates = {
        APLICACIONES_AEREAS: "/templates/APLICACIONES_AEREAS.csv",
        COSECHA_MECANICA: "/templates/COSECHA_MECANICA.csv",
        FERTILIZACION: "/templates/FERTILIZACION.csv",
        HERBICIDAS: "/templates/HERBICIDAS.csv"
    };
    const CancelToken = axios.CancelToken;
    let cancel;


    const resetData = () => {
        setDatosMapeo([]);
        setSelectedFile(null);
        setSelectedZipFile(null);
        setProcessingFinished(false);
        setIdAnalisisBash(null);
        setUploadedCsvFileName('');
        setUploadedZipFileName('');
    };





    useEffect(() => {
        let isMounted = true;
        const fetchDataHerbicidas = async () => {
            if (!idAnalisisHerbicidas) return;
            try {
                const responses = await Promise.all([
                    obtenerResponsableHerbicidas(idAnalisisHerbicidas),
                    obtenerFechaHerbicidas(idAnalisisHerbicidas),
                    obtenerNombreFincaHerbicidas(idAnalisisHerbicidas),
                    obtenerParcelaHerbicidas(idAnalisisHerbicidas),
                    obtenerOperadorHerbicidas(idAnalisisHerbicidas),
                    obtenerEquipoHerbicidas(idAnalisisHerbicidas),
                    obtenerActividadHerbicidas(idAnalisisHerbicidas),
                    obtenerAreaNetaHerbicidas(idAnalisisHerbicidas),
                    obtenerAreaBrutaHerbicidas(idAnalisisHerbicidas),
                    obtenerDiferenciaDeAreaHerbicidas(idAnalisisHerbicidas),
                    obtenerHoraInicioHerbicidas(idAnalisisHerbicidas),
                    obtenerHoraFinalHerbicidas(idAnalisisHerbicidas),
                    obtenerTiempoTotalHerbicidas(idAnalisisHerbicidas),
                    obtenerEficienciaHerbicidas(idAnalisisHerbicidas),
                    obtenerPromedioVelocidadHerbicidas(idAnalisisHerbicidas)
                ]);
                if (isMounted) {
                    setDatosCargadosHerbicidas(true);
                }
            } catch (error) {
                console.error("Error al cargar datos de Herbicidas:", error);
            }
        };
        fetchDataHerbicidas();
        return () => {
            isMounted = false;
        };
    }, [idAnalisisHerbicidas]);

    useEffect(() => {
        const fetchDataFertilizacion = async () => {
            if (idAnalisisFertilizacion) {
                try {
                    await Promise.all([
                        obtenerResponsableFertilizacion(idAnalisisFertilizacion),
                        obtenerFechaInicioFertilizacion(idAnalisisFertilizacion),
                        obtenerFechaFinalFertilizacion(idAnalisisFertilizacion),
                        obtenerNombreFincaFertilizacion(idAnalisisFertilizacion),
                        obtenerOperadorFertilizacion(idAnalisisFertilizacion),
                        obtenerEquipoFertilizacion(idAnalisisFertilizacion),
                        obtenerActividadFertilizacion(idAnalisisFertilizacion),
                        obtenerAreaNetaFertilizacion(idAnalisisFertilizacion),
                        obtenerAreaBrutaFertilizacion(idAnalisisFertilizacion),
                        obtenerDiferenciaAreaFertilizacion(idAnalisisFertilizacion),
                        obtenerHoraInicioFertilizacion(idAnalisisFertilizacion),
                        obtenerHoraFinalFertilizacion(idAnalisisFertilizacion),
                        obtenerTiempoTotalFertilizacion(idAnalisisFertilizacion),
                        obtenerEficienciaFertilizacion(idAnalisisFertilizacion),
                        obtenerPromedioDosisRealFertilizacion(idAnalisisFertilizacion),
                        obtenerDosisTeoricaFertilizacion(idAnalisisFertilizacion)
                    ]);
                    setDatosCargadosFertilizacion(true);
                } catch (error) {
                    console.error("Error al cargar datos de Fertilización:", error);
                }
            }
        };
        fetchDataFertilizacion();
    }, [idAnalisisFertilizacion]);

    useEffect(() => {
        const fetchDataCosechaMecanica = async () => {
            try {
                const datos = await Promise.all([
                    obtenerNombreResponsableCm(idAnalisisCosechaMecanica, setNombreResponsableCm),
                    obtenerFechaInicioCosechaCm(idAnalisisCosechaMecanica, setFechaInicioCosechaCm),
                    obtenerFechaFinCosechaCm(idAnalisisCosechaMecanica, setFechaFinCosechaCm),
                    obtenerNombreFincaCm(idAnalisisCosechaMecanica, setNombreFincaCm),
                    obtenerCodigoParcelaResponsableCm(idAnalisisCosechaMecanica, setCodigoParcelaResponsableCm),
                    obtenerNombreOperadorCm(idAnalisisCosechaMecanica, setNombreOperadorCm),
                    obtenerNombreMaquinaCm(idAnalisisCosechaMecanica, setNombreMaquinaCm),
                    obtenerActividadCm(idAnalisisCosechaMecanica, setActividadCm),
                    obtenerHoraInicioCm(idAnalisisCosechaMecanica, setHoraInicioCm),
                    obtenerHoraFinalCm(idAnalisisCosechaMecanica, setHoraFinalCm),
                    obtenerTiempoTotalActividadCm(idAnalisisCosechaMecanica, setTiempoTotalActividadCm),
                    obtenerCalidadGpsCm(idAnalisisCosechaMecanica, setCalidadGpsCm),
                    obtenerPromedioVelocidadCm(idAnalisisCosechaMecanica, setPromedioVelocidadCm),
                    obtenerConsumoCombustibleCm(idAnalisisCosechaMecanica, setConsumoCombustibleCm),
                    obtenerPresionCortadorBaseCm(idAnalisisCosechaMecanica, setPresionCortadorBase),
                    obtenerTahCm(idAnalisisCosechaMecanica, setTahCm),
                    obtenerRpmCm(idAnalisisCosechaMecanica, setRpmCm),
                    obtenerTchCm(idAnalisisCosechaMecanica, setTchCm)
                ]).then(results => ({
                    nombreResponsable: results[0],
                    fechaInicioCosecha: results[1],
                    fechaFinCosecha: results[2],
                    nombreFinca: results[3],
                    codigoParcelaResponsable: results[4],
                    nombreOperador: results[5],
                    nombreMaquina: results[6],
                    actividad: results[7],
                    horaInicio: results[8],
                    horaFin: results[9],
                    tiempoTotalActividad: results[10],
                    calidadGps: results[11],
                    promedioVelocidad: results[12],
                    consumoCombustible: results[13],
                    presionCortadorBase: results[14],
                    tah: results[15],
                    rpm: results[16],
                    tch: results[17]
                }));
                setDatosCosechaMecanica(datos);
                setDatosCargadosCosechaMecanica(true);
                axios.post(`${API_BASE_URL}dashboard/cosecha_mecanica_analisis/${idAnalisisCosechaMecanica}`, { datos: datos })
                    .then(response => {

                    })
                    .catch(error => {
                        console.error("Error al enviar datos de cosecha mecánica", error);
                    });
                setDatosCargadosCosechaMecanica(true);
            } catch (error) {
                console.error("Error al cargar datos de Cosecha:", error);
            }
        };
        if (idAnalisisCosechaMecanica) {
            fetchDataCosechaMecanica();
        }
    }, [idAnalisisCosechaMecanica]);

    useEffect(() => {
        if (!idAnalisisAps) return;
        const fetchDataAps = async () => {
            try {
                await Promise.all([
                    obtenerResponsableAps(idAnalisisAps, setResponsableAps),
                    obtenerFechaInicioCosechaAps(idAnalisisAps, setFechaInicioCosechaAps),
                    obtenerTiempoTotalAps(idAnalisisAps, setTiempoTotalAps),
                    obtenerFechaFinCosechaAps(idAnalisisAps, setFechaFinCosechaAps),
                    obtenerHoraInicioAps(idAnalisisAps, setHoraInicioAps),
                    obtenerHoraFinalAps(idAnalisisAps, setHoraFinalAps),
                    obtenerNombreOperadorAps(idAnalisisAps, setNombreOperadorAps),
                    obtenerEquipoAps(idAnalisisAps, setEquipoAps),
                    obtenerEficienciaAps(idAnalisisAps, setEficienciaAps),
                    obtenerNombreFincaAps(idAnalisisAps, setNombreFincaAps),
                    obtenerCodigoParcelasAps(idAnalisisAps, setCodigoParcelasAps),
                    obtenerCodigoLotesAps(idAnalisisAps, setCodigoLotesAps),
                    obtenerDosisTeoricaAps(idAnalisisAps, setDosisTeoricaAps),
                    obtenerHumedadDelCultivoAps(idAnalisisAps, setHumedadDelCultivoAps),
                    obtenerTchEstimado(idAnalisisAps, setTchEstimadoAps),
                    obtenerProductoAps(idAnalisisAps, setProductoAps)
                ]);
                setDatosCargadosAps(true);
            } catch (error) {
                console.error("Error al cargar datos de APS:", error);
            }
        };
        fetchDataAps();
    }, [idAnalisisAps]);

    useEffect(() => {
        const newSocket = io(API_BASE_URL);
        setSocket(newSocket);
        newSocket.on('progressUpdate', (data) => {
            const progressNumber = Number(data.progress);
            const message = data.message;
            setProgress(progressNumber);
            setProgressMessage(message);
            setShowProgressBar(progressNumber < 100);
            if (progressNumber === 80) {
                newSocket.emit('progressUpdate', { progress: 100, message: "Finalizado" });
                setShowProgressBar(false);
            }
        });
        return () => {
            newSocket.off('progressUpdate');
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            const handleDatosInsertados = async () => {
                switch (selectedAnalysisTypeRef.current) {
                    case 'APLICACIONES_AEREAS':
                        await cargaDatosAps();
                        break;
                    case 'COSECHA_MECANICA':
                        await cargaDatosCosechaMecanica();
                        break;
                    case 'FERTILIZACION':
                        await cargaDatosFertilizacion();
                        break;
                    case 'HERBICIDAS':
                        await cargaDatosHerbicidas();
                        break;
                    default:
                        toast.warn('Debes seleccionar un tipo de análisis.', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        break;
                }
            };
            socket.on('datosInsertados', handleDatosInsertados);
            return () => {
                if (socket) {
                    socket.off('datosInsertados', handleDatosInsertados);
                }
            };
        }
    }, [socket]);

    const cargaDatosHerbicidas = async () => {
        if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
            try {
                const response = await ultimoAnalisis();
                if (response && response.data && response.data.ID_ANALISIS) {
                    setIdAnalisisHerbicidas(response.data.ID_ANALISIS);
                } else {
                    console.error("Respuesta del último análisis no contiene datos esperados");
                }
            } catch (error) {
                console.error("Error al obtener último análisis:", error);
            }
        }
    };

    const cargaDatosFertilizacion = async () => {
        if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
            try {
                const response = await ultimoAnalisis();
                if (response && response.data && response.data.ID_ANALISIS) {
                    setIdAnalisisFertilizacion(response.data.ID_ANALISIS);
                } else {
                    console.error("Respuesta del último análisis no contiene datos esperados");
                }
            } catch (error) {
                console.error("Error al obtener último análisis:", error);
            }
        }
    };

    const cargaDatosCosechaMecanica = async () => {
        if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
            try {
                const response = await ultimoAnalisis();

                if (response && response.data && response.data.ID_ANALISIS) {
                    setIdAnalisisCosechaMecanica(response.data.ID_ANALISIS);
                } else {
                    console.error("Respuesta del último análisis no contiene datos esperados");
                }
            } catch (error) {
                console.error("Error al obtener último análisis:", error);
            }
        }
    };

    const cargaDatosAps = async () => {

        if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
            try {
                const response = await ultimoAnalisis();

                if (response && response.data && response.data.ID_ANALISIS) {
                    setIdAnalisisAps(response.data.ID_ANALISIS);
                } else {
                    console.error("Respuesta del último análisis no contiene datos esperados");
                }
            } catch (error) {
                console.error("Error al obtener último análisis:", error);
            }
        }
    };

    const insertarUltimoAnalisis = async () => {
        if (selectedAnalysisTypeRef.current !== null || selectedAnalysisTypeRef.current !== '') {
            return await axios.post(`${API_BASE_URL}dashboard/insert_analisis/${nombreAnalisis(idAnalisisBash)}/${userData.ID_USUARIO}`)
        } else {
            toast.warn('No se pudo insertar el análisis', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };


    const ultimoAnalisis = async () => {
        if (selectedAnalysisTypeRef.current !== null && selectedAnalysisTypeRef.current !== '') {
            try {
                const response = await axios.get(`${API_BASE_URL}dashboard/ultimo_analisis/${selectedAnalysisTypeRef.current}/${userData.ID_USUARIO}`);
                const { data } = response;

                const { _id, ...rest } = data;
                const updatedData = {
                    ...rest,
                    ID_ANALISIS: _id
                };

                return { ...response, data: updatedData };
            } catch (error) {
                toast.error('Error al obtener el último análisis.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                throw error;
            }
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
    };

    useEffect(() => {
        setProgressIteracion(true);
        return () => {
            if (cancel) cancel();
        };
    }, []);

    useEffect(() => {
        return () => {
            setDatosMapeo([]);
            setSelectedFile(null);
        };
    }, [setDatosMapeo, setSelectedFile]);

    useEffect(() => {
        selectedAnalysisTypeRef.current = selectedAnalysisType;
        let id;
        switch (selectedAnalysisType) {
            case 'APLICACIONES_AEREAS':
                id = 1;
                break;
            case 'COSECHA_MECANICA':
                id = 2;
                break;
            case 'HERBICIDAS':
                id = 3;
                break;
            case 'FERTILIZACION':
                id = 4;
                break;
            default:
                id = null;
        }
        setIdAnalisisBash(id);
    }, [selectedAnalysisType, userData.ID_USUARIO]);

    function nombreAnalisis(idAnalisis) {
        switch (idAnalisis) {
            case 1:
                return "APLICACIONES_AEREAS";
            case 2:
                return "COSECHA_MECANICA";
            case 3:
                return "HERBICIDAS";
            case 4:
                return "FERTILIZACION";
            default:
                return "";
        }
    }


    const manejarSubidaArchivo = async (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            console.error("No se seleccionó ningún archivo");
            return;
        }

        setTitleLoader("Subiendo Datos");
        let archivo = event.target.files[0];
        setOpenSnackbar(true);
        setUploadedCsvFileName(archivo.name);

        try {
            const idAnalisis = await insertarUltimoAnalisis();
            setIdMax(idAnalisis.data.idAnalisis);
            const isExcel = archivo.name.endsWith('.xlsx') || archivo.name.endsWith('.xls');
            let formData = new FormData();
            formData.append('csv', archivo);
            formData.append('idTipoAnalisis', idAnalisis.data.idAnalisis);
            formData.append('tipoAnalisis', nombreAnalisis(idAnalisisBash));
            formData.append('isExcel', isExcel);

            setShowProgressBar(true);
            setProgress(30);
            setProgressMessage("Procesando los datos ingresados");
            archivo = null;

            const response = await axios.post(`${API_BASE_URL}dashboard/procesarCsv/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                }),
            });

            setProgress(50);
            formData = null;

            const data = response.data;
            setProgress(70);
            const csvBlob = new Blob([Papa.unparse(data)], { type: 'text/csv' });
            const csvFile = new File([csvBlob], 'procesado.csv');
            setSelectedFile(csvFile);
            setDatosMapeo(data.data);
            setProgress(100);
            setShowProgressBar(false);
        } catch (error) {
            console.error('Se produjo un error al intentar subir el archivo:', error);

            if (error.response) {
                console.error('Respuesta del servidor:', error.response);
                console.error('Headers:', error.response.headers);
                console.error('Status:', error.response.status);
                toast.warn(`Error en fila ${error.response.data.fila}: ${error.response.data.error}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else if (error.request) {
                console.error('No se recibió respuesta del servidor:', error.request);
                toast.warn('Se produjo un error al enviar el archivo. No se recibió respuesta del servidor.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                console.error('Error al configurar la solicitud:', error.message);
                toast.warn('Se produjo un error al procesar el archivo.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

            setShowProgressBar(false);
            console.error('Configuración de la solicitud:', error.config);
        }
    };

    const execBash = async () => {
        setTitleLoader("Cargando Análisis");
        let validar = "ok";
        if (socket) {
            socket.emit('progressUpdate', { progress: 0, message: "Iniciando proceso" });
        }
        console.log("ESTE ES EL ID DEL ANALISIS: ", idAnalisisBash);
        if (!idAnalisisBash) {
            toast.error('Debe seleccionar un análisis antes de continuar', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                hideProgressBar: true,
            });
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            if (idAnalisisBash === 2) {
                const lines = content.split(/\r\n|\n/).length - 1;
                const tamanoLote = 10000;
                let offset = 0;
                let esPrimeraIteracion = true;
                while (offset < lines) {
                    const formData = new FormData();
                    formData.append('csv', selectedFile);
                    formData.append('polygon', selectedZipFile);
                    formData.append('esPrimeraIteracion', esPrimeraIteracion ? 'true' : 'false');

                    try {
                        const response = await axios.post(`${API_BASE_URL}dashboard/execBash/${userData.ID_USUARIO}/${idAnalisisBash}/${idMax}/${offset}/${validar}/${lines}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        offset += tamanoLote;
                        esPrimeraIteracion = false;
                    } catch (error) {
                        console.error("Error al procesar el lote:", error);
                        break;
                    }
                }
                setProcessingFinished(true);
            } else {
                let esPrimeraIteracion = true;
                const formData = new FormData();
                formData.append('csv', selectedFile);
                formData.append('polygon', selectedZipFile);
                formData.append('esPrimeraIteracion', esPrimeraIteracion ? 'true' : 'false');
                formData.append('esKmlInteractivo', activarEdicionInteractiva ? 'true' : 'false');
                const lines = content.split(/\r\n|\n/).length - 1;
                let offset = 0;
                try {
                    const response = await axios.post(`${API_BASE_URL}dashboard/execBash/${userData.ID_USUARIO}/${idAnalisisBash}/${idMax}/${offset}/${validar}/${lines}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } catch (error) {
                    console.error("Error al procesar el lote de Aplicaciones Áreas");
                }
            }
            setProcessingFinished(true);
        };
        reader.onerror = (error) => console.log(error);
        reader.readAsText(selectedFile);
    };


    const manejarSubidaZip = async (event) => {
        const file = event.target.files[0];
        setSelectedZipFile(file);
        if (file) {
            setUploadedZipFileName(file.name);
            setOpenSnackbar(true);
            try {
                const zip = new JSZip();
                const zipContent = await zip.loadAsync(file);
                let foundKML = false;
                zipContent.forEach((relativePath, zipEntry) => {
                    if (zipEntry.name.endsWith('.kml')) {
                        foundKML = true;
                    }
                });
                setIsKMLFile(foundKML);
            } catch (error) {
                console.error('Error al procesar el archivo ZIP:', error);
                setIsKMLFile(false);
            }
        }
    };

    const handleAnalysisTypeChange = (event) => {
        setSelectedAnalysisType(event.target.value);
    };

    const esValorValido = (valor) => {
        return valor !== '' && valor !== 0 && valor !== null && valor !== undefined;
    };

    const toggleEdicionInteractiva = () => {
        setActivarEdicionInteractiva(prev => !prev);
    };

    return (
        <div className="dashboard">
            <Tutorial key={tutorialKey} isActive={runTutorial} onClose={() => setRunTutorial(false)} />
            <ProgressBar progress={progress} message={progressMessage} show={showProgressBar} title={titleLoader} />
            <main className={`main-content ${!isSidebarOpen ? 'expand' : ''}`}>
                <div className="dashboard-main">
                    <div className="dashboard-controls">
                        <h1 className="dashboard-title">Mapeo de maquinaria</h1>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <AnalysisControls
                                selectedAnalysisType={selectedAnalysisType}
                                handleAnalysisTypeChange={handleAnalysisTypeChange}
                                execBash={execBash}
                                analysisTemplates={analysisTemplates}
                                activarEdicionInteractiva={activarEdicionInteractiva}
                                toggleEdicionInteractiva={toggleEdicionInteractiva}
                                isKMLFile={isKMLFile}
                                setRunTutorial={setRunTutorial}
                            />
                            <Tooltip title={!selectedAnalysisType ? "Selecciona un análisis antes de comenzar" : 'Selecciona tu CSV'}>
                                <Link
                                    href={selectedAnalysisType ? analysisTemplates[selectedAnalysisType] : "#"}
                                    download
                                    underline="none"
                                >
                                    <StyledButton
                                        variant="contained"
                                        disabled={!selectedAnalysisType}
                                        startIcon={<GetAppIcon />}
                                    >
                                        Descargar Plantilla
                                    </StyledButton>
                                </Link>
                            </Tooltip>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <UploadButtons
                                selectedAnalysisType={selectedAnalysisType}
                                manejarSubidaArchivo={manejarSubidaArchivo}
                                manejarSubidaZip={manejarSubidaZip}
                                uploadedCsvFileName={uploadedCsvFileName}
                                uploadedZipFileName={uploadedZipFileName}
                            />

                            {isKMLFile && (
                                <Tooltip title={activarEdicionInteractiva ? "Desactivar Edición Interactiva" : "Activar Edición Interactiva"}>
                                    <IconButton
                                        color={activarEdicionInteractiva ? "primary" : "default"}
                                        sx={{ margin: 1, padding: 0 }}
                                        onClick={toggleEdicionInteractiva}
                                    >
                                        <AutoModeIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

                            <StyledButtonRealizarAnalisis
                                variant="contained"
                                onClick={execBash}
                            >
                                Realizar Análisis
                            </StyledButtonRealizarAnalisis>
                        </div>
                    </div>
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
                        limpiarMapa={limpiarMapa}
                        userId={userData.ID_USUARIO}
                    />
                    <div className="seccion-analisis" ref={dashboardRef}>
                        <DataSection
                            selectedAnalysisType={selectedAnalysisType}
                            datosCargadosAps={datosCargadosAps}
                            ResponsableAps={ResponsableAps}
                            fechaInicioCosechaAps={fechaInicioCosechaAps}
                            fechaFinCosechaAps={fechaFinCosechaAps}
                            horaInicioAps={horaInicioAps}
                            horaFinalAps={horaFinalAps}
                            tiempoTotalAps={tiempoTotalAps}
                            nombreOperadorAps={nombreOperadorAps}
                            equipoAps={equipoAps}
                            eficienciaAps={eficienciaAps}
                            nombreFincaAps={nombreFincaAps}
                            codigoParcelasAps={codigoParcelasAps}
                            codigoLotesAps={codigoLotesAps}
                            dosisTeorica={dosisTeorica}
                            productoAps={productoAps}
                            humedadDelCultivoAps={humedadDelCultivoAps}
                            tchEstimado={tchEstimado}
                            promedioAltura={promedioAltura}
                            areaSobreAplicada={areaSobreAplicada}
                            areaAplicada={areaAplicada}
                            porcentajeVariacion={porcentajeVariacion}
                            promedioDosisReal={promedioDosisReal}
                            promedioVelocidad={promedioVelocidad}
                            datosCargadosCosechaMecanica={datosCargadosCosechaMecanica}
                            nombreResponsableCm={nombreResponsableCm}
                            fechaInicioCosechaCm={fechaInicioCosechaCm}
                            fechaFinCosechaCm={fechaFinCosechaCm}
                            nombreFincaCm={nombreFincaCm}
                            codigoParcelaResponsableCm={codigoParcelaResponsableCm}
                            nombreOperadorCm={nombreOperadorCm}
                            nombreMaquinaCm={nombreMaquinaCm}
                            actividadCm={actividadCm}
                            areaBrutaCm={areaBrutaCm}
                            horaInicioCm={horaInicioCm}
                            horaFinalCm={horaFinalCm}
                            tiempoTotalActividadCm={tiempoTotalActividadCm}
                            consumoCombustibleCm={consumoCombustibleCm}
                            calidadGpsCm={calidadGpsCm}
                            eficienciaCm={eficienciaCm}
                            promedioVelocidadCm={promedioVelocidadCm}
                            rpmCm={rpmCm}
                            tchCm={tchCm}
                            tahCm={tahCm}
                            presionCortadorBase={presionCortadorBase}
                            porcentajeAreaPilotoCm={porcentajeAreaPilotoCm}
                            porcentajeAreaAutoTrackerCm={porcentajeAreaAutoTrackerCm}
                            porcentajeModoCortadorBaseCm={porcentajeModoCortadorBaseCm}
                            datosCargadosFertilizacion={datosCargadosFertilizacion}
                            responsableFertilizacion={responsableFertilizacion}
                            fechaInicioFertilizacion={fechaInicioFertilizacion}
                            fechaFinalFertilizacion={fechaFinalFertilizacion}
                            nombreFincaFertilizacion={nombreFincaFertilizacion}
                            operadorFertilizacion={operadorFertilizacion}
                            equipoFertilizacion={equipoFertilizacion}
                            actividadFertilizacion={actividadFertilizacion}
                            areaNetaFertilizacion={areaNetaFertilizacion}
                            areaBrutaFertilizacion={areaBrutaFertilizacion}
                            diferenciaAreaFertilizacion={diferenciaAreaFertilizacion}
                            horaInicioFertilizacion={horaInicioFertilizacion}
                            horaFinalFertilizacion={horaFinalFertilizacion}
                            tiempoTotalFertilizacion={tiempoTotalFertilizacion}
                            eficienciaFertilizacion={eficienciaFertilizacion}
                            promedioDosisRealFertilizacion={promedioDosisRealFertilizacion}
                            dosisTeoricaFertilizacion={dosisTeoricaFertilizacion}
                            datosCargadosHerbicidas={datosCargadosHerbicidas}
                            responsableHerbicidas={responsableHerbicidas}
                            fechaHerbicidas={fechaHerbicidas}
                            nombreFincaHerbicidas={nombreFincaHerbicidas}
                            parcelaHerbicidas={parcelaHerbicidas}
                            operadorHerbicidas={operadorHerbicidas}
                            equipoHerbicidas={equipoHerbicidas}
                            actividadHerbicidas={actividadHerbicidas}
                            areaNetaHerbicidas={areaNetaHerbicidas}
                            areaBrutaHerbicidas={areaBrutaHerbicidas}
                            diferenciaDeAreaHerbicidas={diferenciaDeAreaHerbicidas}
                            horaInicioHerbicidas={horaInicioHerbicidas}
                            horaFinalHerbicidas={horaFinalHerbicidas}
                            tiempoTotalHerbicidas={tiempoTotalHerbicidas}
                            eficienciaHerbicidas={eficienciaHerbicidas}
                            promedioVelocidadHerbicidas={promedioVelocidadHerbicidas}
                            esValorValido={esValorValido}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;