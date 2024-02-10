import React, {useEffect, useState, useRef, useCallback  } from 'react';
import io from 'socket.io-client';
import Papa from 'papaparse';
import './DashboardStyle.css';
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from '../../components/LayoutSide';
import profilePicture from './img/user.png';
import axios from "axios";
import {API_BASE_URL} from "../../utils/config";
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import MapComponent from "../MapeoGenerador/mapeo";
import DataCard from "../../components/CardData/cardData";
import html2canvas from 'html2canvas';
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
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    for (var clave in userData) {
        if (userData.hasOwnProperty(clave) && typeof userData[clave] === "string") {
            console.log(typeof userData[clave])
            userData[clave] = userData[clave].replace(/^"|"$/g, '');
        }
    }


    if (
        sessionStorage.getItem("Token") === null ||
        sessionStorage.getItem("Token") === "" ||
        sessionStorage.getItem("Token") === undefined ||
        sessionStorage.getItem("userData") === null ||
        sessionStorage.getItem("userData") === "" ||
        sessionStorage.getItem("userData") === undefined
    ) {
        window.location.href = "/login";
    }
    //=========================================

    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [idMax, setIdMax] = useState(null);

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
        if (idAnalisisHerbicidas) {
            Promise.all([
                obtenerResponsableHerbicidas(idAnalisisHerbicidas, setResponsableHerbicidas),
                obtenerFechaHerbicidas(idAnalisisHerbicidas, setFechaHerbicidas),
                obtenerNombreFincaHerbicidas(idAnalisisHerbicidas, setNombreFincaHerbicidas),
                obtenerParcelaHerbicidas(idAnalisisHerbicidas, setParcelaHerbicidas),
                obtenerOperadorHerbicidas(idAnalisisHerbicidas, setOperadorHerbicidas),
                obtenerEquipoHerbicidas(idAnalisisHerbicidas, setEquipoHerbicidas),
                obtenerActividadHerbicidas(idAnalisisHerbicidas, setActividadHerbicidas),
                obtenerAreaNetaHerbicidas(idAnalisisHerbicidas, setAreaNetaHerbicidas),
                obtenerAreaBrutaHerbicidas(idAnalisisHerbicidas, setAreaBrutaHerbicidas),
                obtenerDiferenciaDeAreaHerbicidas(idAnalisisHerbicidas, setDiferenciaDeAreaHerbicidas),
                obtenerHoraInicioHerbicidas(idAnalisisHerbicidas, setHoraInicioHerbicidas),
                obtenerHoraFinalHerbicidas(idAnalisisHerbicidas, setHoraFinalHerbicidas),
                obtenerTiempoTotalHerbicidas(idAnalisisHerbicidas, setTiempoTotalHerbicidas),
                obtenerEficienciaHerbicidas(idAnalisisHerbicidas, setEficienciaHerbicidas),
                obtenerPromedioVelocidadHerbicidas(idAnalisisHerbicidas, setPromedioVelocidadHerbicidas())
            ]).then(() => {
                setDatosCargadosHerbicidas(true);
            }).catch(error => {
                console.error("Error al cargar datos de APS:", error);
            });

        }
    }, [idAnalisisHerbicidas]);

    // Indicadores Fertilización
    useEffect(async () => {
        if (idAnalisisFertilizacion) {
            await Promise.all([
                obtenerResponsableFertilizacion(idAnalisisFertilizacion, setResponsableFertilizacion),
                obtenerFechaInicioFertilizacion(idAnalisisFertilizacion, setFechaInicioFertilizacion),
                obtenerFechaFinalFertilizacion(idAnalisisFertilizacion,setFechaFinalFertilizacion),
                obtenerNombreFincaFertilizacion(idAnalisisFertilizacion, setNombreFincaFertilizacion),
                obtenerOperadorFertilizacion(idAnalisisFertilizacion, setOperadorFertilizacion),
                obtenerEquipoFertilizacion(idAnalisisFertilizacion, setEquipoFertilizacion),
                obtenerActividadFertilizacion(idAnalisisFertilizacion, setActividadFertilizacion),
                obtenerAreaNetaFertilizacion(idAnalisisFertilizacion, setAreaNetaFertilizacion),
                obtenerAreaBrutaFertilizacion(idAnalisisFertilizacion, setAreaBrutaFertilizacion),
                obtenerDiferenciaAreaFertilizacion(idAnalisisFertilizacion, setDiferenciaAreaFertilizacion),
                obtenerHoraInicioFertilizacion(idAnalisisFertilizacion, setHoraInicioFertilizacion),
                obtenerHoraFinalFertilizacion(idAnalisisFertilizacion, setHoraFinalFertilizacion),
                obtenerTiempoTotalFertilizacion(idAnalisisFertilizacion, setTiempoTotalFertilizacion),
                obtenerEficienciaFertilizacion(idAnalisisFertilizacion, setEficienciaFertilizacion),
                obtenerPromedioDosisRealFertilizacion(idAnalisisFertilizacion, setPromedioDosisRealFertilizacion),
                obtenerDosisTeoricaFertilizacion(idAnalisisFertilizacion, setDosisTeoricaFertilizacion)

            ]).then(() => {
                setDatosCargadosFertilizacion(true);
            }).catch(error => {
                console.error("Error al cargar datos de APS:", error);
            });

        }
    }, [idAnalisisFertilizacion]);

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
        if (idAnalisisAps) {
            Promise.all([
                obtenerResponsableAps(idAnalisisAps, setResponsableAps),
                obtenerFechaInicioCosechaAps(idAnalisisAps, setFechaInicioCosechaAps),
                obtenerFechaFinCosechaAps(idAnalisisAps, setFechaFinCosechaAps),
                obtenerNombreFincaAps(idAnalisisAps, setNombreFincaAps),
                obtenerCodigoParcelasAps(idAnalisisAps, setCodigoParcelasAps),
                obtenerNombreOperadorAps(idAnalisisAps, setNombreOperadorAps),
                obtenerEquipoAps(idAnalisisAps, setEquipoAps),
                obtenerActividadAps(idAnalisisAps, setActividadAps),
                obtenerAreaNetaAps(idAnalisisAps, setAreaNetaAps),
                obtenerAreaBrutaAps(idAnalisisAps, setAreaBrutaAps),
                obtenerDiferenciaEntreAreasAps(idAnalisisAps, setDiferenciaEntreAreasAps),
                obtenerHoraInicioAps(idAnalisisAps, setHoraInicioAps),
                obtenerHoraFinalAps(idAnalisisAps, setHoraFinalAps),
                obtenerTiempoTotalActividadesAps(idAnalisisAps, setTiempoTotalActividadesAps),
                obtenerEficienciaAps(idAnalisisAps, setEficienciaAps),
                obtenerPromedioVelocidadAps(idAnalisisAps, setPromedioVelocidadAps),
            ]).then(() => {
                setDatosCargadosAps(true);
            }).catch(error => {
                console.error("Error al cargar datos de APS:", error);
            });

        }
    }, [idAnalisisAps]);


    // Evento que muestra el progreso del análisis
    useEffect(() => {
        const newSocket = io(API_BASE_URL);
        setSocket(newSocket);

        newSocket.on('progressUpdate', data => {
            const progressNumber = Number(data.progress);
            const message = data.message;

            setProgress(progressNumber);
            setProgressMessage(message);
            setShowProgressBar(true);
            setShowProgressBar(progressNumber < 100);

            if (progressNumber === 80) {
                newSocket.emit('progressUpdate', { progress: 100, message: "Finalizado"});
                setShowProgressBar(false);
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
            socket.on('datosInsertados', async () => {


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


                socket.disconnect();
            });

            return () => {
                socket.off('sendMap');
                socket.off('datosInsertados');
            };
        }else{
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

    const insertarUltimoAnalisis = async() =>{

        if(selectedAnalysisTypeRef.current !== null || selectedAnalysisTypeRef.current !== ''){
            return await axios.post(`${API_BASE_URL}dashboard/insert_analisis/${userData.ID_USUARIO}/${nombreAnalisis(idAnalisisBash)}`)
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

    const CancelToken = axios.CancelToken;
    let cancel;

    useEffect(() => {
        return () => {
            cancel && cancel();
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
        switch (selectedAnalysisType) {
            case 'APS':
                setIdAnalisisBash(1);
                break;
            case 'COSECHA_MECANICA':
                setIdAnalisisBash(2);
                break;
            case 'HERBICIDAS':
                setIdAnalisisBash(3);
                break;
            case 'FERTILIZACION':
                setIdAnalisisBash(4);
                break;
            default:
                break;
        }


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
            formData = null;
            const data = response.data;


            // Genera un nuevo Blob y File para setSelectedFile

            const csvBlob = new Blob([Papa.unparse(data)], { type: 'text/csv' });

            const csvFile = new File([csvBlob], 'procesado.csv');

            setSelectedFile(csvFile);
            setDatosMapeo(data.data);
        }catch (error) {
            console.error('Se produjo un error al intentar subir el archivo:', error);
            if (error.response) {
                console.error('Respuesta del servidor:', error.response);
                console.error('Headers:', error.response.headers);
                console.error('Status:', error.response.status);
                alert(`Error en fila ${error.response.data.fila}: ${error.response.data.error}`);
            } else if (error.request) {
                console.error('Error de solicitud:', error.request);
                alert('Se produjo un error al enviar el archivo. No se recibió respuesta del servidor.');
            } else {
                console.error('Error de configuración:', error.message);
                alert('Se produjo un error al procesar el archivo.');
            }
            console.error('Configuración de la solicitud:', error.config);
        }
    }


    const execBash = async () => {
        let validar = "ok";

        if (!selectedFile || !selectedZipFile) {
            toast.warn('Por favor, selecciona ambos archivos.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;

        }else if(!idAnalisisBash){
            toast.error('Debe seleccionar un análisis antes de continuar', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                hideProgressBar: true,
            });
        }
        const formData = new FormData();
        formData.append('csv', selectedFile);
        formData.append('polygon', selectedZipFile);
        const processBatch = async (offset) =>{
            try{
                const response = await axios.post(`${API_BASE_URL}dashboard/execBash/${userData.ID_USUARIO}/${idAnalisisBash}/${idMax}/${offset}/${validar}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response);
            }catch (error) {
                // Registro detallado del error
                console.error("Error al procesar el lote:");
                console.error("Mensaje de error:", error.message);
                console.error("Tipo de error:", error.name);
                if (error.response) {
                    // Detalles específicos cuando el error es de una respuesta HTTP
                    console.error("Datos de la respuesta del error:", error.response.data);
                    console.error("Estado de la respuesta del error:", error.response.status);
                    console.error("Encabezados de la respuesta del error:", error.response.headers);
                } else {
                    // En caso de que el error no sea una respuesta HTTP
                    console.error("Stack del error:", error.stack);
                }
            }
        }
        processBatch(0);
    };


    return (
        <div className="dashboard">
            <ProgressBar progress={progress} message={progressMessage} show={showProgressBar} />
            <Sidebar
                profileImage={profilePicture}
                name={userData.NOMBRE}
                apellido={userData.APELLIDO}
                isOpen={sidebarOpen}//
                setIsOpen={setSidebarOpen}
            />
            <main  className={`main-content ${!sidebarOpen ? 'expand' : ''}`} >
                <div className={`dashboard-main`}>

                    <div>
                        <h1 className="dashboard-title">Resumen de Análisis</h1>
                        <section className="map-section">
                            {selectedZipFile && selectedFile && <MapComponent csvData={datosMapeo} zipFile={selectedZipFile} onAreaCalculated={handleAreaCalculation} percentageAutoPilot={handlePercentageCalculation}/>}

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
                                        <DataCard title="Fecha Inicio Cosecha">
                                            {displayValue(fechaInicioCosechaAps)}
                                        </DataCard>
                                        <DataCard title="Fecha Fin Cosecha">
                                            {displayValue(fechaFinCosechaAps)}
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
                                        <DataCard title="Nombre Responsable">
                                            {displayValue(nombreResponsableCm)}
                                        </DataCard>
                                        <DataCard title="Fecha Inicio Cosecha">
                                            {displayValue(fechaInicioCosechaCm)}
                                        </DataCard>
                                        <DataCard title="Fecha Fin Cosecha">
                                            {displayValue(fechaFinCosechaCm)}
                                        </DataCard>
                                        <DataCard title="Nombre Finca">
                                            {displayValue(nombreFincaCm)}
                                        </DataCard>
                                        <DataCard title="Codigo Parcela">
                                            {displayValue(codigoParcelaResponsableCm)}
                                        </DataCard>
                                        <DataCard title="Nombre Operador">
                                            {displayValue(nombreOperadorCm)}
                                        </DataCard>
                                        <DataCard title="No. Maquina">
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
                                        <DataCard title="Hora Inicio">
                                            {displayValue(horaInicioCm)}
                                        </DataCard>
                                        <DataCard title="Hora Fin">
                                            {displayValue(horaFinalCm)}
                                        </DataCard>
                                        <DataCard title="Tiempo total Actividad">
                                            {displayValue(tiempoTotalActividadCm)}
                                        </DataCard>
                                        <DataCard title="Consumos de combustible">
                                            {displayValue(consumoCombustibleCm)}
                                        </DataCard>

                                        <DataCard title="Promedio Calidad de señal Gps">
                                            {displayValue(calidadGpsCm)}
                                        </DataCard>
                                        <DataCard title="Eficiencia">
                                            {displayValue(eficienciaCm)}
                                        </DataCard>
                                        <DataCard title="Promedio Velocidad">
                                            {displayValue(promedioVelocidadCm)}
                                        </DataCard>
                                        <DataCard title="Promedio RPM">
                                            {displayValue(rpmCm)}
                                        </DataCard>
                                        <DataCard title="Promedio TCH">
                                            {displayValue(tchCm)}
                                        </DataCard>
                                        <DataCard title="Promedio TAH">
                                            {displayValue(tah)}
                                        </DataCard>
                                        <DataCard title="Porcentaje Área Piloto">
                                            {displayValue(porcentajeAreaPilotoCm)}
                                        </DataCard>
                                        <DataCard title="Porcentaje Área AutoTracker">
                                            {displayValue(porcentajeAreaAutoTrackerCm)}
                                        </DataCard>
                                        <DataCard title="Porcentaje Modo Cortador Base">
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
                            <label htmlFor="csv-file" className="custom-file-upload">
                                <input
                                    id="csv-file"
                                    type="file"
                                    accept=".csv"
                                    onChange={manejarSubidaArchivo}
                                />
                                Selecciona tu CSV
                            </label>
                            <label htmlFor="zip-file" className="custom-file-upload">
                                <input
                                    id="zip-file"
                                    type="file"
                                    onChange={e => {
                                        setSelectedZipFile(e.target.files[0]);
                                    }}
                                    accept=".zip"
                                />
                                Selecciona tu ZIP
                            </label>
                            <a href={selectedAnalysisType ? analysisTemplates[selectedAnalysisType] : "#"} download className="download-template">
                                Descargar plantilla
                            </a>
                            <select value={selectedAnalysisType} onChange={e => setSelectedAnalysisType(e.target.value)} className="type-selector">
                                <option value="">Seleccionar tipo de análisis</option>
                                {Object.keys(analysisTemplates).map(type => (
                                    <option value={type} key={type}>{type.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                            <button onClick={execBash} className="action-button">
                                Realizar análisis
                            </button>
                        </div>
                        <button onClick={generatePDF} className="download-pdf-button">
                            Descargar PDF
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );

}

export default Dashboard;