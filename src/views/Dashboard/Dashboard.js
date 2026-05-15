import React, {useEffect, useState, useRef, useCallback  } from 'react';
import io from 'socket.io-client';
import Papa from 'papaparse';
import './DashboardStyle.css';
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from '../../components/LayoutSide';
import profilePicture from '../../assets/img/user.png';
import axios from "axios";
import {API_BASE_URL} from "../../utils/config";
import { useAuth } from '../../context/AuthContext';
import {toast } from 'react-toastify';
import MapComponent from "../MapeoGenerador/mapeo";
import DataCard from "../../components/CardData/cardData";
import html2canvas from 'html2canvas';
import Tutorial from "../../components/Tutorial/Tutorial";
import jsPDF from 'jspdf';

import L from 'leaflet';
import {
    //Cosecha mecánica
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
    obtenerTchCm,
    //Fertilización
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
    //APS
    obtenerAreaBrutaAps,
    obtenerCodigoParcelasAps,
    obtenerAreaNetaAps,
    obtenerDiferenciaEntreAreasAps,
    obtenerActividadAps,
    obtenerEficienciaAps,
    obtenerEquipoAps,
    obtenerFechaInicioCosechaAps,
    obtenerFechaFinCosechaAps,
    obtenerHoraInicioAps,
    obtenerHoraFinalAps,
    obtenerPromedioVelocidadAps,
    obtenerNombreFincaAps,
    obtenerNombreOperadorAps,
    obtenerTiempoTotalActividadesAps,
    obtenerResponsableAps,
    obtenerDatosCompletosAps,
    //HERBICIDAS
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
    displayValue


} from "../../utils/Constants";
// Componente del Mapa

function Dashboard() {

    //====================== INICIO DE SESIÓN
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [runTutorial, setRunTutorial] = useState(false);
    const [tutorialKey, setTutorialKey] = useState(0);


    //=========================================

    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [idMax, setIdMax] = useState(null);
    const [progressIteracion, setProgressIteracion] = useState(null);
    const [processingFinished, setProcessingFinished] = useState(false);

    //======================= id del análisis por realizar
    const [idAnalisisAps, setIdAnalisisAps] = useState(null);
    const [idAnalisisCosechaMecanica, setIdAnalisisCosechaMecanica] = useState(null);
    const [idAnalisisFertilizacion, setIdAnalisisFertilizacion] = useState(null);
    const [idAnalisisHerbicidas, setIdAnalisisHerbicidas] = useState(null);
    //======================= id del análisis por realizar




    const [idAnalisisBash, setIdAnalisisBash] = useState(null);
    const selectedAnalysisTypeRef = useRef(); // Creando la referencia
    const [socket, setSocket] = useState(null);
    const [progressMessage, setProgressMessage] = useState("");
    const [selectedZipFile, setSelectedZipFile] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [datosMapeo, setDatosMapeo] = useState([]);



    //================= Variables para análisis de aps
    const [ResponsableAps,setResponsableAps] = useState(null);
    const [fechaInicioCosechaAps, setFechaInicioCosechaAps] = useState(null);
    const [fechaFinCosechaAps, setFechaFinCosechaAps] = useState(null);
    const [nombreFincaAps, setNombreFincaAps] = useState(null);
    const [codigoParcelasAps, setCodigoParcelasAps] = useState(null);
    const [nombreOperadorAps, setNombreOperadorAps] = useState(null);
    const [equipoAps, setEquipoAps] = useState(null);
    const [actividadAps, setActividadAps] = useState(null);
    const [areaNetaAps, setAreaNetaAps] = useState(null);
    const [areaBrutaAps, setAreaBrutaAps] = useState(null);
    const [diferenciaEntreAreasAps, setDiferenciaEntreAreasAps] = useState(null);
    const [horaInicioAps, setHoraInicioAps] = useState(null);
    const [horaFinalAps, setHoraFinalAps] = useState(null);
    const [tiempoTotalActividadesAps, setTiempoTotalActividadesAps] = useState(null);
    const [eficienciaAps, setEficienciaAps] = useState(null);
    const [promedioVelocidadAps, setPromedioVelocidadAps] = useState(null);

    //=================================================



    //================= Variables para análisis de cosecha mecánica

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
    const [calidadGpsCm, setCalidadGpsCm] = useState(null);
    const [rpmCm, setRpmCm] = useState(null);
    const [tchCm, setTchCm] = useState(null);
    const [tah, setTahCm] = useState(null);
    const [porcentajeAreaAutoTrackerCm, setPorcentajeAreaAutoTrackerCm] = useState(null);
    const [porcentajeModoCortadorBaseCm, setPorcentajeModoCortadorBaseCm] = useState(null);

    //=============================================================




    //============================ Variables para análisis de Fertilización
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


    //===============================================================


    //======================= Variables para análisis de Herbicidas

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

    //===============================================================


    // ============================ Use Effect para carga de indicadores

    // Indicadores Herbicidas
    useEffect(() => {
        let isMounted = true; // Variable para controlar si el componente está montado

        const fetchData = async () => {
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

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [idAnalisisHerbicidas]);

    useEffect(() => {
        // Define una función asíncrona dentro del efecto
        const fetchData = async () => {
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
                    // Actualiza el estado después de completar todas las promesas
                    setDatosCargadosFertilizacion(true);
                } catch (error) {
                    console.error("Error al cargar datos de Fertilización:", error);
                }
            }
        };

        // Invoca la función asíncrona
        fetchData();
    }, [idAnalisisFertilizacion]); // Asegúrate de incluir todas las dependencias externas necesarias aquí

    // Indicadores Cosecha Mecánica
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
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
                    obtenerTahCm(idAnalisisCosechaMecanica, setTahCm),
                    obtenerRpmCm(idAnalisisCosechaMecanica, setRpmCm),
                    obtenerTchCm(idAnalisisCosechaMecanica, setTchCm)
                ]);
                setDatosCargadosCosechaMecanica(true);
            } catch (error) {
                console.error("Error al cargar datos de Cosecha:", error);
            }
        };
        // Llamamos a fetchData solo si idAnalisisCosechaMecanica está disponible
        if (idAnalisisCosechaMecanica) {
            fetchData();
        }
    }, [idAnalisisCosechaMecanica]);

    // Indicadores APS
    useEffect(() => {
        if (!idAnalisisAps) return;

        const formatListValue = (value) => {
            if (Array.isArray(value)) return value.filter(Boolean).join(', ');
            return value || null;
        };

        const fetchData = async () => {
            try {
                const data = await obtenerDatosCompletosAps(idAnalisisAps);
                if (!data) return;

                setResponsableAps(data.nombreResponsable);
                setFechaInicioCosechaAps(data.fechaInicio);
                setFechaFinCosechaAps(data.fechaFin);
                setNombreFincaAps(formatListValue(data.nombresFincaLista) || data.nombreFinca);
                setCodigoParcelasAps(formatListValue(data.codigosLoteLista) || formatListValue(data.lotesLista) || data.codigoLote);
                setNombreOperadorAps(data.nombreOperador);
                setEquipoAps(data.equipo || data.codigoEquipo);
                setActividadAps(data.actividad);
                setAreaNetaAps(data.areaNeta || data.areaAplicada || data.areaAplicadaConUnidad);
                setAreaBrutaAps(data.areaBruta || data.areaTotal || data.areaTotalConUnidad);
                setDiferenciaEntreAreasAps(data.diferenciaEntreAreas || data.areaNoAplicada || data.areaNoAplicadaConUnidad);
                setHoraInicioAps(data.horaInicio);
                setHoraFinalAps(data.horaFin);
                setTiempoTotalActividadesAps(data.tiempoTotal);
                setEficienciaAps(data.eficiencia);
                setPromedioVelocidadAps(data.velocidadConUnidad || data.velocidad);
                setDatosCargadosAps(true);
            } catch (error) {
                console.error("Error al cargar datos de APS:", error);
            }
        };

        fetchData();
    }, [idAnalisisAps]);


    // Evento que muestra el progreso del análisis
    useEffect(() => {
        const newSocket = io(API_BASE_URL);
        setSocket(newSocket);

        // Escuchar por actualizaciones de progreso
        newSocket.on('progressUpdate', (data) => {
            const progressNumber = Number(data.progress);
            const message = data.message;

            // Actualizar el estado basado en el progreso
            setProgress(progressNumber);
            setProgressMessage(message);
                // Controlar la visibilidad de la barra de progreso
            setShowProgressBar(progressNumber < 100); // Esto reemplaza las dos llamadas anteriores



            // Si el progreso alcanza el 80%, enviar un evento para finalizar
            if (progressNumber === 80) {
                newSocket.emit('progressUpdate', { progress: 100, message: "Finalizado" });
                setShowProgressBar(false); // Esto podría ser redundante dependiendo de tu lógica
            }
        });

        return () => {
            newSocket.off('progressUpdate');
            newSocket.disconnect();
        };
    }, []);



    // Carga de datos para indicadores
    useEffect(() => {

        if (socket) {

            const handleDatosInsertados = async () => {
                switch (selectedAnalysisTypeRef.current) {
                    case 'APS':
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
                // socket.disconnect();
            };

            socket.on('datosInsertados', handleDatosInsertados);

            return () => {
                if (socket) {
                    socket.off('datosInsertados', handleDatosInsertados);
                }
            };
        }
    }, [socket]);


    //====================================================================

    //=========================================== Carga del ultimo análisis

    const cargaDatosHerbicidas = async() =>{
        if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
            try {
                const response = await ultimoAnalisis();


                if (response && response.data && response.data.ID_ANALISIS) {
                    setIdAnalisisHerbicidas(response.data.ID_ANALISIS);

                } else {
                    console.error("Respuesta del último análisis no contiene datos esperados");
                }


            }catch (error) {
                console.error("Error al obtener último análisis:", error);
            }

        }

    }
    const cargaDatosFertilizacion = async() =>{
        if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
            try {
                const response = await ultimoAnalisis();


                if (response && response.data && response.data.ID_ANALISIS) {
                    setIdAnalisisFertilizacion(response.data.ID_ANALISIS);

                } else {
                    console.error("Respuesta del último análisis no contiene datos esperados");
                }

            }catch (error) {
                console.error("Error al obtener último análisis:", error);
            }

        }
    }

    const cargaDatosCosechaMecanica = async () =>{
        if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
            try {
                const response = await ultimoAnalisis();

                if (response && response.data && response.data.ID_ANALISIS) {
                    setIdAnalisisCosechaMecanica(response.data.ID_ANALISIS);

                } else {
                    console.error("Respuesta del último análisis no contiene datos esperados");
                }


            }catch (error) {
                console.error("Error al obtener último análisis:", error);
            }
        }

    }


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

    const insertarUltimoAnalisis = async(detalles = null) =>{

        if(selectedAnalysisTypeRef.current){
            const payload = detalles ? { detalles } : {};

            return await axios.post(
                `${API_BASE_URL}dashboard/insert_analisis/${nombreAnalisis(idAnalisisBash)}/${userData.ID_USUARIO}`,
                payload
            )
        }else{
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

    }

    const ultimoAnalisis = async() => {
        if(selectedAnalysisTypeRef.current !== null || selectedAnalysisTypeRef.current !== ''){

            return await axios.get(`${API_BASE_URL}dashboard/ultimo_analisis/${selectedAnalysisTypeRef.current}/${userData.ID_USUARIO}`);
        }else{
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

    //=============================================================

    //============================= Calculo de areas y porcentajes

    const handleAreaCalculation = (polygonArea, outsidePolygonArea, areaDifference, pilotAutoPercentage, autoTracketPercentage) => {

        setAreaNetaCm(`${outsidePolygonArea.toFixed(2)} H`);
        setAreaBrutaCm(`${polygonArea.toFixed(2)} H`);
        setDiferenciaDeAreaCm(`${areaDifference.toFixed(2)} H`);

    };

    const handlePercentageCalculation = (autoTracket, autoPilot, modoCorteBase,  totalEfficiency) => {

        setPorcentajeAreaPilotoCm(`${autoPilot.toFixed(2)}%`);
        setPorcentajeAreaAutoTrackerCm(`${autoTracket.toFixed(2)}%`);
        setPorcentajeModoCortadorBaseCm(`${modoCorteBase.toFixed(2)}%`);
        setEficienciaCm(`${totalEfficiency.toFixed(5)} Ha/Hora`);

    };

    //=============================================================


    const [selectedAnalysisType, setSelectedAnalysisType] = useState('');
    const [datosCargadosAps, setDatosCargadosAps] = useState(false);
    const [datosCargadosCosechaMecanica, setDatosCargadosCosechaMecanica] = useState(false);

    const [datosCargadosFertilizacion, setDatosCargadosFertilizacion] = useState(false);
    const [datosCargadosHerbicidas, setDatosCargadosHerbicidas] = useState(false);

    const dashboardRef = useRef();

    // Templates de los csv para el ingreso de cada uno de los análisis

    const analysisTemplates = {
        APS: "/templates/APS.csv",
        COSECHA_MECANICA: "/templates/COSECHA_MECANICA.csv",
        FERTILIZACION: "/templates/FERTILIZACION.csv",
        HERBICIDAS: "/templates/HERBICIDAS.csv"
    };

    const isApsAnalysis = selectedAnalysisType === 'APS';
    const [apsManualData, setApsManualData] = useState({
        plataforma: 'DRONE',
        responsable: '',
        nombreOperador: '',
        nombreFinca: '',
        codigoLotes: '',
        fechaInicio: '',
        fechaFinal: '',
        horaInicio: '',
        horaFin: '',
        codigoMaquina: '',
        eficiencia: '',
        dosisTeorica: '',
        volumenAgua: '',
        dosisProducto: '',
        producto: '',
        humedadCultivo: '',
        tchEstimado: ''
    });

    const handleApsManualChange = (field, value) => {
        setApsManualData(prev => ({ ...prev, [field]: value }));
    };

    const splitLotes = (value) => String(value || '')
        .split(/[;,|]/g)
        .map(item => item.trim())
        .filter(Boolean);

    const buildApsDetalles = () => {
        const lotes = splitLotes(apsManualData.codigoLotes);
        return {
            NOMBRE_FINCA: apsManualData.nombreFinca.trim(),
            NOMBRES_FINCA: apsManualData.nombreFinca.trim() ? [apsManualData.nombreFinca.trim()] : [],
            CODIGO_LOTE: lotes.join(', '),
            CODIGOS_LOTE: lotes,
            LOTE: lotes.join(', '),
            PLATAFORMA: apsManualData.plataforma,
            RESPONSABLE: apsManualData.responsable.trim(),
            NOMBRE_DE_OPERADOR: apsManualData.nombreOperador.trim(),
            FECHA_INICIO: apsManualData.fechaInicio,
            FECHA_FINAL: apsManualData.fechaFinal,
            PRODUCTO: apsManualData.producto.trim()
        };
    };

    const formatDateForCsv = (value) => {
        if (!value) return '';
        const [year, month, day] = value.split('-');
        return year && month && day ? `${day}/${month}/${year}` : value;
    };

    const buildApsManualCsvFile = (idAnalisisActual) => {
        const headers = [
            'RESPONSABLE',
            'NOMBRE_DE_OPERADOR',
            'FECHA_INICIO',
            'FECHA_FINAL',
            'HORA_INICIO',
            'HORA_FIN',
            'CODIGO_DE_MAQUINA',
            'EFICIENCIA',
            'DOSIS_TEORICA',
            'VOLUMEN_DE_AGUA',
            'DOSIS_DE_PRODUCTO',
            'PRODUCTO',
            'HUMEDAD_DEL_CULTIVO',
            'TCH_ESTIMADO',
            'TIEMPO_TOTAL',
            'ID_ANALISIS'
        ];
        const row = [
            apsManualData.responsable || 'N/A',
            apsManualData.nombreOperador || 'N/A',
            formatDateForCsv(apsManualData.fechaInicio),
            formatDateForCsv(apsManualData.fechaFinal || apsManualData.fechaInicio),
            apsManualData.horaInicio || '00:00:00',
            apsManualData.horaFin || apsManualData.horaInicio || '00:00:00',
            apsManualData.codigoMaquina || apsManualData.plataforma,
            apsManualData.eficiencia || '0',
            apsManualData.dosisTeorica || '0',
            apsManualData.volumenAgua || '0',
            apsManualData.dosisProducto || '0',
            apsManualData.producto || 'N/A',
            apsManualData.humedadCultivo || '0',
            apsManualData.tchEstimado || '0',
            '00:00:00',
            idAnalisisActual
        ];
        const csv = Papa.unparse({ fields: headers, data: [row] });
        return new File([new Blob([csv], { type: 'text/csv' })], 'aps_datos_manuales.csv', { type: 'text/csv' });
    };

    const handleAnalysisTypeChange = (value) => {
        setSelectedAnalysisType(value);
        setSelectedFile(null);
        setDatosMapeo([]);
        setIdMax(null);
        setProcessingFinished(false);
    };

    const CancelToken = axios.CancelToken;
    let cancel;

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
            case 'APS':
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
                id = null; // Asumiendo que quieres resetear o manejar el caso por defecto
        }
        setIdAnalisisBash(id);
    }, [selectedAnalysisType, userData.ID_USUARIO]);

    function nombreAnalisis(idAnalisis){
        switch (idAnalisis) {
            case 1:
                return "APS";
                break;
            case 2:
                return "COSECHA_MECANICA";
                break;
            case 3:
                return "HERBICIDAS";
                break;
            case 4:
                return "FERTILIZACION";
                break;
            default:
                break;
        }
    }
    const generatePDF = useCallback(async () => {
        if (dashboardRef.current) {
            dashboardRef.current.style.opacity = '0.99';
            await new Promise(resolve => setTimeout(resolve, 1));
            dashboardRef.current.style.opacity = '';

            // Retrasar la captura para permitir la carga de fuentes e imágenes
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                const canvas = await html2canvas(dashboardRef.current, {
                    scale: window.devicePixelRatio,
                    useCORS: true,
                    scrollY: -window.scrollY,
                    scrollX: 0,
                    windowHeight: dashboardRef.current.scrollHeight,
                    windowWidth: dashboardRef.current.scrollWidth
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save('dashboard.pdf');
            } catch (error) {
                console.error("Error al generar el PDF: ", error);
            }
        }
    }, []);


    async function manejarSubidaArchivo(event) {

        if (!event.target.files || event.target.files.length === 0) {
            console.error("No se seleccionó ningún archivo");
            return;
        }

        let archivo = event.target.files[0];


        const idAnalisis = await insertarUltimoAnalisis();

        setIdMax(idAnalisis.data.idAnalisis);

        // Aquí la la petición del end point para procesar el Csv:
        //
        let formData = new FormData();
        formData.append('csv', archivo);
        formData.append('idTipoAnalisis', idAnalisis.data.idAnalisis);
        setShowProgressBar(true);
        setProgress(30);
        setProgressMessage("Procesando los datos ingresados");

        archivo = null;
        try {

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

            // Genera un nuevo Blob y File para setSelectedFile

            const csvBlob = new Blob([Papa.unparse(data)], { type: 'text/csv' });

            const csvFile = new File([csvBlob], 'procesado.csv');

            setSelectedFile(csvFile);
            setDatosMapeo(data.data);
            setProgress(100);
            setShowProgressBar(false);

        }catch (error) {
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
                toast.warn(`Se produjo un error al enviar el archivo. No se recibió respuesta del servidor.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            } else {
                toast.warn(`Se produjo un error al procesar el archivo.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            }
            console.error('Configuración de la solicitud:', error.config);
        }
    }


    const execBash = async () => {
        let validar = "ok";

        if (!idAnalisisBash) {
            toast.error('Debe seleccionar un análisis antes de continuar', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                hideProgressBar: true,
            });
            return;
        }

        if (!selectedZipFile) {
            toast.warn('Por favor, selecciona tu archivo geoespacial.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        let csvFileToProcess = selectedFile;
        let idAnalisisActual = idMax;

        if (isApsAnalysis) {
            if (!apsManualData.nombreFinca.trim() || splitLotes(apsManualData.codigoLotes).length === 0) {
                toast.warn('Para aplicaciones aéreas debes ingresar nombre de finca y código(s) de lote.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            if (!idAnalisisActual) {
                const response = await insertarUltimoAnalisis(buildApsDetalles());
                idAnalisisActual = response?.data?.idAnalisis;
                setIdMax(idAnalisisActual);
            }

            csvFileToProcess = buildApsManualCsvFile(idAnalisisActual);
            setSelectedFile(csvFileToProcess);
        } else if (!csvFileToProcess) {
            toast.warn('Por favor, selecciona tu CSV y tu archivo geoespacial.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        const processCsvFile = (file) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result || '';
                const lines = Math.max(content.split(/\r\n|\n/).filter(line => line.trim() !== '').length - 1, 1);

                const tamanoLote = 10000;
                let offset = 0;
                let esPrimeraIteracion = true;
                setShowProgressBar(true);
                setProgress(10);
                setProgressMessage('Iniciando análisis');

                while (offset < lines) {
                    const formData = new FormData();
                    formData.append('csv', file);
                    formData.append('polygon', selectedZipFile);
                    formData.append('esPrimeraIteracion', esPrimeraIteracion ? 'true' : 'false');

                    try {
                        await axios.post(`${API_BASE_URL}dashboard/execBash/${userData.ID_USUARIO}/${idAnalisisBash}/${idAnalisisActual}/${offset}/${validar}/${lines}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        offset += tamanoLote;
                        esPrimeraIteracion = false;
                    } catch (error) {
                        console.error("Error al procesar el lote:", error);
                        setShowProgressBar(false);
                        break;
                    }
                }
                setProcessingFinished(true);
            };
            reader.onerror = (error) => console.log(error);
            reader.readAsText(file);
        };

        processCsvFile(csvFileToProcess);
    };

    const handleOpenTutorial = () => {
        setRunTutorial(true);
        setTutorialKey(prevKey => prevKey + 1);
    };
    return (
        <div className="dashboard">
            <Tutorial
                key={tutorialKey}
                isActive={runTutorial}
                onClose={() => setRunTutorial(false)}
            />
            <ProgressBar progress={progress} message={progressMessage} show={showProgressBar} />

            <main  className={`main-content ${!sidebarOpen ? 'expand' : ''}`} >
                <div className={`dashboard-main`}>

                    <div>
                        <h1 className="dashboard-title">Resumen de Análisis</h1>
                        <section className="map-section">
                            {selectedZipFile && (selectedFile || isApsAnalysis) && <MapComponent csvData={datosMapeo} zipFile={selectedZipFile} onAreaCalculated={handleAreaCalculation} percentageAutoPilot={handlePercentageCalculation} progressFinish={processingFinished}/>}

                        </section>
                    </div>
                    <div className="seccion-analisis" ref={dashboardRef}>
                        <section className="data-section" >
                            {
                                datosCargadosAps && selectedAnalysisType === 'APS' && (
                                    <>
                                        <DataCard title="Responsable">
                                            {displayValue(ResponsableAps)}
                                        </DataCard>
                                        <DataCard title="Fecha Inicio">
                                            {displayValue(fechaInicioCosechaAps)}
                                        </DataCard>
                                        <DataCard title="Fecha Fin">
                                            {displayValue(fechaFinCosechaAps)}
                                        </DataCard>
                                        <DataCard title="Nombre Finca">
                                            {displayValue(nombreFincaAps)}
                                        </DataCard>
                                        <DataCard title="Código(s) de lote">
                                            {displayValue(codigoParcelasAps)}
                                        </DataCard>
                                        <DataCard title="Nombre operador">
                                            {displayValue(nombreOperadorAps)}
                                        </DataCard>
                                        <DataCard title="Equipo">
                                            {displayValue(equipoAps)}
                                        </DataCard>
                                        <DataCard title="Actividad">
                                            {displayValue(actividadAps)}
                                        </DataCard>
                                        <DataCard title="Area Neta">
                                            {displayValue(areaNetaAps)}
                                        </DataCard>
                                        <DataCard title="Area Bruta">
                                            {displayValue(areaBrutaAps)}
                                        </DataCard>
                                        <DataCard title="Diferencia Entre Areas">
                                            {displayValue(diferenciaEntreAreasAps)}
                                        </DataCard>
                                        <DataCard title="Hora Inicio APS">
                                            {displayValue(horaInicioAps)}
                                        </DataCard>
                                        <DataCard title="Hora Final APS">
                                            {displayValue(horaFinalAps)}
                                        </DataCard>
                                        <DataCard title="Tiempo Total Actividades">
                                            {displayValue(tiempoTotalActividadesAps)}
                                        </DataCard>
                                        <DataCard title="Eficiancia">
                                            {displayValue(eficienciaAps)}
                                        </DataCard>
                                        <DataCard title="Promedio Velocidad">
                                            {displayValue(promedioVelocidadAps)}
                                        </DataCard>
                                    </>
                                )
                            }
                            {
                                datosCargadosCosechaMecanica  && selectedAnalysisType === 'COSECHA_MECANICA' && (
                                    <>
                                        <DataCard title="Responsable">
                                            {displayValue(nombreResponsableCm)}
                                        </DataCard>
                                        <DataCard title="Fecha Inicio">
                                            {displayValue(fechaInicioCosechaCm)}
                                        </DataCard>
                                        <DataCard title="Fecha Fin">
                                            {displayValue(fechaFinCosechaCm)}
                                        </DataCard>
                                        <DataCard title="Nombre Finca">
                                            {displayValue(nombreFincaCm)}
                                        </DataCard>
                                        <DataCard title="Codigo Finca">
                                            {displayValue(codigoParcelaResponsableCm)}
                                        </DataCard>
                                        <DataCard title="Operador">
                                            {displayValue(nombreOperadorCm)}
                                        </DataCard>
                                        <DataCard title="Equipo">
                                            {displayValue(nombreMaquinaCm)}
                                        </DataCard>
                                        <DataCard title="Actividad">
                                            {displayValue(actividadCm)}
                                        </DataCard>
                                        <DataCard title="Área Neta">
                                            {displayValue(areaNetaCm)}
                                        </DataCard>
                                        <DataCard title="Área Bruta">
                                            {displayValue(areaBrutaCm)}
                                        </DataCard>
                                        <DataCard title="Diferencia de Área">
                                            {displayValue(diferenciaDeAreaCm)}
                                        </DataCard>
                                        <DataCard title="Hora Inicio (H)">
                                            {displayValue(horaInicioCm)}
                                        </DataCard>
                                        <DataCard title="Hora Fin (H)">
                                            {displayValue(horaFinalCm)}
                                        </DataCard>
                                        <DataCard title="Tiempo total (H)">
                                            {displayValue(tiempoTotalActividadCm)}
                                        </DataCard>
                                        <DataCard title="Combustible Gal/H">
                                            {displayValue(consumoCombustibleCm)}
                                        </DataCard>

                                        <DataCard title="Calidad GPS">
                                            {displayValue(calidadGpsCm)}
                                        </DataCard>
                                        <DataCard title="Eficiencia Ha/Hora">
                                            {displayValue(eficienciaCm)}
                                        </DataCard>
                                        <DataCard title="Velocidad Km/H">
                                            {displayValue(promedioVelocidadCm)}
                                        </DataCard>
                                        <DataCard title="RPM">
                                            {displayValue(rpmCm)}
                                        </DataCard>
                                        <DataCard title="TCH">
                                            {displayValue(tchCm)}
                                        </DataCard>
                                        <DataCard title="TAH">
                                            {displayValue(tah)}
                                        </DataCard>
                                        <DataCard title="Piloto Automático">
                                            {displayValue(porcentajeAreaPilotoCm)}
                                        </DataCard>
                                        <DataCard title="Auto Tracket">
                                            {displayValue(porcentajeAreaAutoTrackerCm)}
                                        </DataCard>
                                        <DataCard title="Corte Base">
                                            {displayValue(porcentajeModoCortadorBaseCm)}
                                        </DataCard>


                                    </>
                                )
                            }
                            {
                                datosCargadosFertilizacion && selectedAnalysisType === 'FERTILIZACION' && (
                                    <>
                                        <DataCard title="Responsable">
                                            {displayValue(responsableFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Fecha Inicio Fertilización">
                                            {displayValue(fechaInicioFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Fecha Final Fertilización">
                                            {displayValue(fechaFinalFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Nombre Finca">
                                            {displayValue(nombreFincaFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Operador">
                                            {displayValue(operadorFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Equipo">
                                            {displayValue(equipoFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Actividad">
                                            {displayValue(actividadFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Área Neta">
                                            {displayValue(areaNetaFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Área Bruta">
                                            {displayValue(areaBrutaFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Diferencia Área">
                                            {displayValue(diferenciaAreaFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Hora Inicio">
                                            {displayValue(horaInicioFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Hora Fin">
                                            {displayValue(horaFinalFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Tiempo Total">
                                            {displayValue(tiempoTotalFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Eficiencia">
                                            {displayValue(eficienciaFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Promedio Dosis Real">
                                            {displayValue(promedioDosisRealFertilizacion)}
                                        </DataCard>
                                        <DataCard title="Dosis Teorica">
                                            {displayValue(dosisTeoricaFertilizacion)}
                                        </DataCard>
                                    </>
                                )
                            }
                            {
                                datosCargadosHerbicidas && selectedAnalysisType === 'HERBICIDAS' && (
                                    <>
                                        <DataCard title="Responsable">
                                            {displayValue(responsableHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Herbicidas">
                                            {displayValue(fechaHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Nombre Finca">
                                            {displayValue(nombreFincaHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Parcela">
                                            {displayValue(parcelaHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Operador">
                                            {displayValue(operadorHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Equipo">
                                            {displayValue(equipoHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Actividad">
                                            {displayValue(actividadHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Area Neta">
                                            {displayValue(areaNetaHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Area Bruta">
                                            {displayValue(areaBrutaHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Diferencia De Area">
                                            {displayValue(diferenciaDeAreaHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Hora Inicio">
                                            {displayValue(horaInicioHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Hora Final">
                                            {displayValue(horaFinalHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Tiempo Total">
                                            {displayValue(tiempoTotalHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Eficiencia">
                                            {displayValue(eficienciaHerbicidas)}
                                        </DataCard>
                                        <DataCard title="Promedio Velocidad">
                                            {displayValue(promedioVelocidadHerbicidas)}
                                        </DataCard>
                                    </>
                                )
                            }
                        </section>

                        <div className="analysis-controls">
                            {!isApsAnalysis && selectedAnalysisType && (
                                <label htmlFor="csv-file" className="custom-file-upload subir-csv">
                                    <input
                                        id="csv-file"
                                        type="file"
                                        accept=".csv"
                                        onChange={manejarSubidaArchivo}
                                    />
                                    Selecciona tu CSV
                                </label>
                            )}
                            <label htmlFor="zip-file" className="custom-file-upload subir-zip">
                                <input
                                    id="zip-file"
                                    type="file"
                                    onChange={e => {
                                        setSelectedZipFile(e.target.files[0]);
                                    }}
                                    accept=".zip"
                                />
                                Subir Shape File
                            </label>
                            {!isApsAnalysis && selectedAnalysisType && (
                                <a href={analysisTemplates[selectedAnalysisType]} download className="download-template descargar-plantilla">
                                    Descargar plantilla
                                </a>
                            )}
                            <select value={selectedAnalysisType} onChange={e => handleAnalysisTypeChange(e.target.value)} className="type-selector tipo-analisis">
                                <option value="">Seleccionar tipo de análisis</option>
                                {Object.keys(analysisTemplates).map(type => (
                                    <option value={type} key={type}>{type.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                            {isApsAnalysis && (
                                <div className="aps-manual-panel">
                                    <h3>Datos manuales de Aplicaciones Aéreas</h3>
                                    <p>Estos datos se usan para drone, avioneta o helicóptero cuando el archivo no trae la finca o los lotes.</p>
                                    <select value={apsManualData.plataforma} onChange={e => handleApsManualChange('plataforma', e.target.value)}>
                                        <option value="DRONE">Drone</option>
                                        <option value="AIRPLANE">Avioneta</option>
                                        <option value="HELICOPTER">Helicóptero</option>
                                    </select>
                                    <input placeholder="Nombre finca" value={apsManualData.nombreFinca} onChange={e => handleApsManualChange('nombreFinca', e.target.value)} />
                                    <input placeholder="Código(s) de lote separados por coma" value={apsManualData.codigoLotes} onChange={e => handleApsManualChange('codigoLotes', e.target.value)} />
                                    <input placeholder="Responsable" value={apsManualData.responsable} onChange={e => handleApsManualChange('responsable', e.target.value)} />
                                    <input placeholder="Nombre operador" value={apsManualData.nombreOperador} onChange={e => handleApsManualChange('nombreOperador', e.target.value)} />
                                    <input type="date" value={apsManualData.fechaInicio} onChange={e => handleApsManualChange('fechaInicio', e.target.value)} />
                                    <input type="date" value={apsManualData.fechaFinal} onChange={e => handleApsManualChange('fechaFinal', e.target.value)} />
                                    <input type="time" value={apsManualData.horaInicio} onChange={e => handleApsManualChange('horaInicio', e.target.value)} />
                                    <input type="time" value={apsManualData.horaFin} onChange={e => handleApsManualChange('horaFin', e.target.value)} />
                                    <input placeholder="Equipo / código de máquina" value={apsManualData.codigoMaquina} onChange={e => handleApsManualChange('codigoMaquina', e.target.value)} />
                                    <input placeholder="Producto" value={apsManualData.producto} onChange={e => handleApsManualChange('producto', e.target.value)} />
                                    <input type="number" step="any" placeholder="Eficiencia" value={apsManualData.eficiencia} onChange={e => handleApsManualChange('eficiencia', e.target.value)} />
                                    <input type="number" step="any" placeholder="Dosis teórica" value={apsManualData.dosisTeorica} onChange={e => handleApsManualChange('dosisTeorica', e.target.value)} />
                                    <input type="number" step="any" placeholder="Volumen de agua" value={apsManualData.volumenAgua} onChange={e => handleApsManualChange('volumenAgua', e.target.value)} />
                                    <input type="number" step="any" placeholder="Dosis de producto" value={apsManualData.dosisProducto} onChange={e => handleApsManualChange('dosisProducto', e.target.value)} />
                                    <input type="number" step="any" placeholder="Humedad del cultivo" value={apsManualData.humedadCultivo} onChange={e => handleApsManualChange('humedadCultivo', e.target.value)} />
                                    <input type="number" step="any" placeholder="TCH estimado" value={apsManualData.tchEstimado} onChange={e => handleApsManualChange('tchEstimado', e.target.value)} />
                                </div>
                            )}
                            <button onClick={execBash} className="action-button realizar-analisis">
                                Realizar análisis
                            </button>
                        </div>

                    </div>

                </div>
                <button className="help-button" onClick={handleOpenTutorial}>
                    ?
                </button>
            </main>
        </div>
    );

}

export default Dashboard;