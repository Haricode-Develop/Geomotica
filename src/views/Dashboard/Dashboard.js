import React, {useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

import './DashboardStyle.css';
import Sidebar from '../../components/LayoutSide';
import profilePicture from './img/user.png';
import axios from "axios";
import {API_BASE_URL} from "../../utils/config";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import DataCard from "../../components/CardData/cardData";
function Dashboard() {
    const { userData } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedPolygonFile, setSelectedPolygonFile] = useState(null);
    const [uploadResponse, setUploadResponse] = useState('');
    const [nombreTabla, setNombreTabla] = useState(null);
    const [idAnalisis, setIdAnalisis] = useState(null);
    const [idAnalisisBash, setIdAnalisisBash] = useState(null);
    const selectedAnalysisTypeRef = useRef(); // Creando la referencia
    const [socket, setSocket] = useState(null);
    const [analysisData, setAnalysisData] = useState({});
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedZipFile, setSelectedZipFile] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    //COSECHA APS

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
//COSECHA MECANICA

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
    const [porcentajeAreaAutoTrackerCm, setPorcentajeAreaAutoTrackerCm] = useState(null);

    //FERTILIZACIÓN
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

    //Herbicidas
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

    const [selectedAnalysisType, setSelectedAnalysisType] = useState('');
    const menuItems = ['Dashboard', 'Administrador', 'Configuración', 'Ayuda'];

    const analysisTemplates = {
        APS: "/templates/APS.csv",
        COSECHA_MECANICA: "/templates/COSECHA_MECANICA.csv",
        FERTILIZACION: "/templates/FERTILIZACION.csv",
        HERBICIDAS: "/templates/HERBICIDAS.csv"
    };

    const handlePolygonChange = (e) => {
        setSelectedPolygonFile(e.target.files[0]);
    };

    const ultimoAnalisis = async() => {
        if(selectedAnalysisTypeRef.current !== null || selectedAnalysisTypeRef.current !== ''){
            return await axios.get(`${API_BASE_URL}/dashboard/ultimo_analisis/${selectedAnalysisTypeRef.current}/${userData.ID_USUARIO}`);
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
    useEffect(() => {
        if (socket) {
            socket.on('sendMap', (receivedHtmlContent) => {
                setHtmlContent(receivedHtmlContent);
            });

            return () => {
                socket.off('sendMap');
            };
        }
    }, [socket]);

    useEffect(() => {

        const socket = io(API_BASE_URL);
        setSocket(socket);
        // Escuchar el evento 'datosInsertados'
        socket.on('datosInsertados', async () => {

            switch (selectedAnalysisTypeRef.current) {
                case 'APS':
                    await obtenerResponsableAps();
                    await obtenerFechaInicioCosechaAps();
                    await obtenerFechaFinCosechaAps();
                    await obtenerNombreFincaAps();
                    await obtenerCodigoParcelasAps();
                    await obtenerNombreOperadorAps();
                    await obtenerEquipoAps();
                    await obtenerActividadAps();
                    await obtenerAreaNetaAps();
                    await obtenerAreaBrutaAps();
                    await obtenerDiferenciaEntreAreasAps();
                    await obtenerHoraInicioAps();
                    await obtenerHoraFinalAps();
                    await obtenerTiempoTotalActividadesAps();
                    await obtenerEficienciaAps();
                    await obtenerPromedioVelocidadAps();

                    break;
                case 'COSECHA_MECANICA':
                    await obtenerNombreResponsableCm();
                    await obtenerFechaInicioCosechaCm();
                    await obtenerFechaFinCosechaCm();
                    await obtenerNombreFincaCm();
                    await obtenerCodigoParcelaResponsableCm();
                    await obtenerNombreOperadorCm();
                    await obtenerNombreMaquinaCm();
                    await obtenerActividadCm();
                    await obtenerAreaNetaCm();
                    await obtenerAreaBrutaCm();
                    await obtenerDiferenciaDeAreaCm();
                    await obtenerHoraInicioCm();
                    await obtenerHoraFinalCm();
                    await obtenerTiempoTotalActividadCm();
                    await obtenerEficienciaCm();
                    await obtenerPromedioVelocidadCm();
                    await obtenerPorcentajeAreaPilotoCm();
                    await obtenerPorcentajeAreaAutoTrackerCm();
                    break;
                case 'FERTILIZACION':
                    await obtenerResponsableFertilizacion();
                    await obtenerFechaInicioFertilizacion();
                    await obtenerFechaFinalFertilizacion();
                    await obtenerNombreFincaFertilizacion();
                    await obtenerOperadorFertilizacion();
                    await obtenerEquipoFertilizacion();
                    await obtenerActividadFertilizacion();
                    await obtenerAreaNetaFertilizacion();
                    await obtenerAreaBrutaFertilizacion();
                    await obtenerDiferenciaAreaFertilizacion();
                    await obtenerHoraInicioFertilizacion();
                    await obtenerHoraFinalFertilizacion();
                    await obtenerTiempoTotalFertilizacion();
                    await obtenerEficienciaFertilizacion();
                    await obtenerPromedioDosisRealFertilizacion();
                    await obtenerDosisTeoricaFertilizacion();

                    break;
                case 'HERBICIDAS':
                    await obtenerResponsableHerbicidas();
                    await obtenerFechaHerbicidas();
                    await obtenerNombreFincaHerbicidas();
                    await obtenerParcelaHerbicidas();
                    await obtenerOperadorHerbicidas();
                    await obtenerEquipoHerbicidas();
                    await obtenerActividadHerbicidas();
                    await obtenerAreaNetaHerbicidas();
                    await obtenerAreaBrutaHerbicidas();
                    await obtenerDiferenciaDeAreaHerbicidas();
                    await obtenerHoraInicioHerbicidas();
                    await obtenerHoraFinalHerbicidas();
                    await obtenerTiempoTotalHerbicidas();
                    await obtenerEficienciaHerbicidas();
                    await obtenerPromedioVelocidadHerbicidas();
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
        });

        return () => {
            // Desconectar el socket cuando el componente se desmonte
            socket.disconnect();
        };

    }, [nombreTabla, idAnalisis]);
    useEffect(() => {
        selectedAnalysisTypeRef.current = selectedAnalysisType;
        switch (selectedAnalysisType) {
            case 'APS':
                setNombreTabla('APS');
                setIdAnalisisBash(1);
                break;
            case 'COSECHA_MECANICA':
                setNombreTabla('COSECHA_MECANICA');
                setIdAnalisisBash(2);
                break;
            case 'HERBICIDAS':
                setNombreTabla('HERBICIDAS');
                setIdAnalisisBash(3);
                break;
            case 'FERTILIZACION':
                setNombreTabla('FERTILIZACION');
                setIdAnalisisBash(4);
                break;
            default:
                break;
        }

        if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
            ultimoAnalisis().then(response => {
                setIdAnalisis(response.data.ID_ANALISIS);
            }).catch(error => {
                console.error("Error al obtener último análisis:", error);
            });
        }

    }, [selectedAnalysisType]);
    const simulateEvent = () => {
        if(socket) {
            socket.emit('datosInsertados', { data: "mi data" });
        }else{

        }
    };
  /*======================================================
  *  PETICIONES DE APS
  * ======================================================*/
    const obtenerResponsableAps = async () => {
        try {
            console.log("ESTE ES EL ULTIMO ID ANALISIS =======");
            console.log(idAnalisis);
            const response = await axios.get(`${API_BASE_URL}/dashboard/responsableAps/${idAnalisis}`);
            setResponsableAps(response.data);
        } catch (error) {
            console.error("Error en obtenerResponsableAps:", error);
        }
    };

    const obtenerFechaInicioCosechaAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/fechaInicioCosechaAps/${idAnalisis}`);
            setFechaInicioCosechaAps(response.data);
        } catch (error) {
            console.error("Error en obtenerFechaInicioCosechaAps:", error);
        }
    };

    const obtenerFechaFinCosechaAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/fechaFinCosechaAps/${idAnalisis}`);
            setFechaFinCosechaAps(response.data);
        } catch (error) {
            console.error("Error en obtenerFechaFinCosechaAps:", error);
        }
    };

    const obtenerNombreFincaAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/nombreFincaAps/${idAnalisis}`);
            setNombreFincaAps(response.data);
        } catch (error) {
            console.error("Error en obtenerNombreFincaAps:", error);
        }
    };

    const obtenerCodigoParcelasAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/codigoParcelasAps/${idAnalisis}`);
            setCodigoParcelasAps(response.data);
        } catch (error) {
            console.error("Error en obtenerCodigoParcelasAps:", error);
        }
    };

    const obtenerNombreOperadorAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/nombreOperadorAps/${idAnalisis}`);
            setNombreOperadorAps(response.data);
        } catch (error) {
            console.error("Error en obtenerNombreOperadorAps:", error);
        }
    };

    const obtenerEquipoAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/equipoAps/${idAnalisis}`);
            setEquipoAps(response.data);
        } catch (error) {
            console.error("Error en obtenerEquipoAps:", error);
        }
    };

    const obtenerActividadAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/actividadAps/${idAnalisis}`);
            setActividadAps(response.data);
        } catch (error) {
            console.error("Error en obtenerActividadAps:", error);
        }
    };

    const obtenerAreaNetaAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/areaNetaAps/${idAnalisis}`);
            setAreaNetaAps(response.data);
        } catch (error) {
            console.error("Error en obtenerAreaNetaAps:", error);
        }
    };

    const obtenerAreaBrutaAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/areaBrutaAps/${idAnalisis}`);
            setAreaBrutaAps(response.data);
        } catch (error) {
            console.error("Error en obtenerAreaBrutaAps:", error);
        }
    };

    const obtenerDiferenciaEntreAreasAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/diferenciaEntreAreasAps/${idAnalisis}`);
            setDiferenciaEntreAreasAps(response.data);
        } catch (error) {
            console.error("Error en obtenerDiferenciaEntreAreasAps:", error);
        }
    };

    const obtenerHoraInicioAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/horaInicioAps/${idAnalisis}`);
            setHoraInicioAps(response.data);
        } catch (error) {
            console.error("Error en obtenerHoraInicioAps:", error);
        }
    };

    const obtenerHoraFinalAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/horaFinalAps/${idAnalisis}`);
            setHoraFinalAps(response.data);
        } catch (error) {
            console.error("Error en obtenerHoraFinalAps:", error);
        }
    };

    const obtenerTiempoTotalActividadesAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/tiempoTotalActividadesAps/${idAnalisis}`);
            setTiempoTotalActividadesAps(response.data);
        } catch (error) {
            console.error("Error en obtenerTiempoTotalActividadesAps:", error);
        }
    };

    const obtenerEficienciaAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/eficienciaAps/${idAnalisis}`);
            setEficienciaAps(response.data);
        } catch (error) {
            console.error("Error en obtenerEficienciaAps:", error);
        }
    };

    const obtenerPromedioVelocidadAps = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/promedioVelocidadAps/${idAnalisis}`);
            setPromedioVelocidadAps(response.data);
        } catch (error) {
            console.error("Error en obtenerPromedioVelocidadAps:", error);
        }
    };
    /*======================================================
 *  PETICIONES DE COSECHA_MECANICA
 * ======================================================*/

    const obtenerNombreResponsableCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/nombreResponsableCm/${idAnalisis}`);
            setNombreResponsableCm(response.data);
        } catch (error) {
            console.error("Error en obtenerNombreResponsableCm:", error);
        }
    };

    const obtenerFechaInicioCosechaCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/fechaInicioCosechaCm/${idAnalisis}`);
            setFechaInicioCosechaCm(response.data);
        } catch (error) {
            console.error("Error en obtenerFechaInicioCosechaCm:", error);
        }
    };

    const obtenerFechaFinCosechaCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/fechaFinCosechaCm/${idAnalisis}`);
            setFechaFinCosechaCm(response.data);
        } catch (error) {
            console.error("Error en obtenerFechaFinCosechaCm:", error);
        }
    };

    const obtenerNombreFincaCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/nombreFincaCm/${idAnalisis}`);
            setNombreFincaCm(response.data);
        } catch (error) {
            console.error("Error en obtenerNombreFincaCm:", error);
        }
    };

    const obtenerCodigoParcelaResponsableCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/codigoParcelaResponsableCm/${idAnalisis}`);
            setCodigoParcelaResponsableCm(response.data);
        } catch (error) {
            console.error("Error en obtenerCodigoParcelaResponsableCm:", error);
        }
    };

    const obtenerNombreOperadorCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/nombreOperadorCm/${idAnalisis}`);
            setNombreOperadorCm(response.data);
        } catch (error) {
            console.error("Error en obtenerNombreOperadorCm:", error);
        }
    };

    const obtenerNombreMaquinaCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/nombreMaquinaCm/${idAnalisis}`);
            setNombreMaquinaCm(response.data);
        } catch (error) {
            console.error("Error en obtenerNombreMaquinaCm:", error);
        }
    };

    const obtenerActividadCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/actividadCm/${idAnalisis}`);
            setActividadCm(response.data);
        } catch (error) {
            console.error("Error en obtenerActividadCm:", error);
        }
    };

    const obtenerAreaNetaCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/areaNetaCm/${idAnalisis}`);
            setAreaNetaCm(response.data);
        } catch (error) {
            console.error("Error en obtenerAreaNetaCm:", error);
        }
    };

    const obtenerAreaBrutaCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/areaBrutaCm/${idAnalisis}`);
            setAreaBrutaCm(response.data);
        } catch (error) {
            console.error("Error en obtenerAreaBrutaCm:", error);
        }
    };

    const obtenerDiferenciaDeAreaCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/diferenciaDeAreaCm/${idAnalisis}`);
            setDiferenciaDeAreaCm(response.data);
        } catch (error) {
            console.error("Error en obtenerDiferenciaDeAreaCm:", error);
        }
    };

    const obtenerHoraInicioCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/horaInicioCm/${idAnalisis}`);
            setHoraInicioCm(response.data);
        } catch (error) {
            console.error("Error en obtenerHoraInicioCm:", error);
        }
    };

    const obtenerHoraFinalCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/horaFinalCm/${idAnalisis}`);
            setHoraFinalCm(response.data);
        } catch (error) {
            console.error("Error en obtenerHoraFinalCm:", error);
        }
    };

    const obtenerTiempoTotalActividadCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/tiempoTotalActividadCm/${idAnalisis}`);
            setTiempoTotalActividadCm(response.data);
        } catch (error) {
            console.error("Error en obtenerTiempoTotalActividadCm:", error);
        }
    };

    const obtenerEficienciaCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/eficienciaCm/${idAnalisis}`);
            setEficienciaCm(response.data);
        } catch (error) {
            console.error("Error en obtenerEficienciaCm:", error);
        }
    };

    const obtenerPromedioVelocidadCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/promedioVelocidadCm/${idAnalisis}`);
            setPromedioVelocidadCm(response.data);
        } catch (error) {
            console.error("Error en obtenerPromedioVelocidadCm:", error);
        }
    };

    const obtenerPorcentajeAreaPilotoCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/porcentajeAreaPilotoCm/${idAnalisis}`);
            setPorcentajeAreaPilotoCm(response.data);
        } catch (error) {
            console.error("Error en obtenerPorcentajeAreaPilotoCm:", error);
        }
    };

    const obtenerPorcentajeAreaAutoTrackerCm = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/porcentajeAreaAutoTrackerCm/${idAnalisis}`);
            setPorcentajeAreaAutoTrackerCm(response.data);
        } catch (error) {
            console.error("Error en obtenerPorcentajeAreaAutoTrackerCm:", error);
        }
    };


    /*======================================================
*  PETICIONES DE FERTILIZACIÓN
* ======================================================*/
    const obtenerResponsableFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/responsableFertilizacion/${idAnalisis}`);
            setResponsableFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerResponsableFertilizacion:", error);
        }
    };

    const obtenerFechaInicioFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/fechaInicioFertilizacion/${idAnalisis}`);
            setFechaInicioFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerFechaInicioFertilizacion:", error);
        }
    };

    const obtenerFechaFinalFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/fechaFinalFertilizacion/${idAnalisis}`);
            setFechaFinalFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerFechaFinalFertilizacion:", error);
        }
    };

    const obtenerNombreFincaFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/nombreFincaFertilizacion/${idAnalisis}`);
            setNombreFincaFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerNombreFincaFertilizacion:", error);
        }
    };

    const obtenerOperadorFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/operadorFertilizacion/${idAnalisis}`);
            setOperadorFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerOperadorFertilizacion:", error);
        }
    };

    const obtenerEquipoFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/equipoFertilizacion/${idAnalisis}`);
            setEquipoFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerEquipoFertilizacion:", error);
        }
    };

    const obtenerActividadFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/actividadFertilizacion/${idAnalisis}`);
            setActividadFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerActividadFertilizacion:", error);
        }
    };

    const obtenerAreaNetaFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/areaNetaFertilizacion/${idAnalisis}`);
            setAreaNetaFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerAreaNetaFertilizacion:", error);
        }
    };

    const obtenerAreaBrutaFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/areaBrutaFertilizacion/${idAnalisis}`);
            setAreaBrutaFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerAreaBrutaFertilizacion:", error);
        }
    };

    const obtenerDiferenciaAreaFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/diferenciaAreaFertilizacion/${idAnalisis}`);
            setDiferenciaAreaFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerDiferenciaAreaFertilizacion:", error);
        }
    };

    const obtenerHoraInicioFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/horaInicioFertilizacion/${idAnalisis}`);
            setHoraInicioFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerHoraInicioFertilizacion:", error);
        }
    };

    const obtenerHoraFinalFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/horaFinalFertilizacion/${idAnalisis}`);
            setHoraFinalFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerHoraFinalFertilizacion:", error);
        }
    };

    const obtenerTiempoTotalFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/tiempoTotalFertilizacion/${idAnalisis}`);
            setTiempoTotalFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerTiempoTotalFertilizacion:", error);
        }
    };

    const obtenerEficienciaFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/eficienciaFertilizacion/${idAnalisis}`);
            setEficienciaFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerEficienciaFertilizacion:", error);
        }
    };

    const obtenerPromedioDosisRealFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/promedioDosisRealFertilizacion/${idAnalisis}`);
            setPromedioDosisRealFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerPromedioDosisRealFertilizacion:", error);
        }
    };

    const obtenerDosisTeoricaFertilizacion = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/dosisTeoricaFertilizacion/${idAnalisis}`);
            setDosisTeoricaFertilizacion(response.data);
        } catch (error) {
            console.error("Error en obtenerDosisTeoricaFertilizacion:", error);
        }
    };
    function displayValue(value) {
        console.log("ESTO ES LO QUE DEVUELVE =======");
        console.log(value);
        return value !== null ? value : 'N/A';
    }

    /*======================================================
*  PETICIONES DE HERBICIDAS
* ======================================================*/

    const obtenerResponsableHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/responsableHerbicidas/${idAnalisis}`);
            setResponsableHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerResponsableHerbicidas:", error);
        }
    };

    const obtenerFechaHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/fechaHerbicidas/${idAnalisis}`);
            setFechaHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerFechaHerbicidas:", error);
        }
    };

    const obtenerNombreFincaHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/nombreFincaHerbicidas/${idAnalisis}`);
            setNombreFincaHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerNombreFincaHerbicidas:", error);
        }
    };

    const obtenerParcelaHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/parcelaHerbicidas/${idAnalisis}`);
            setParcelaHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerParcelaHerbicidas:", error);
        }
    };

    const obtenerOperadorHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/operadorHerbicidas/${idAnalisis}`);
            setOperadorHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerOperadorHerbicidas:", error);
        }
    };

    const obtenerEquipoHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/equipoHerbicidas/${idAnalisis}`);
            setEquipoHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerEquipoHerbicidas:", error);
        }
    };

    const obtenerActividadHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/actividadHerbicidas/${idAnalisis}`);
            setActividadHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerActividadHerbicidas:", error);
        }
    };

    const obtenerAreaNetaHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/areaNetaHerbicidas/${idAnalisis}`);
            setAreaNetaHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerAreaNetaHerbicidas:", error);
        }
    };

    const obtenerAreaBrutaHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/areaBrutaHerbicidas/${idAnalisis}`);
            setAreaBrutaHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerAreaBrutaHerbicidas:", error);
        }
    };

    const obtenerDiferenciaDeAreaHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/diferenciaDeAreaHerbicidas/${idAnalisis}`);
            setDiferenciaDeAreaHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerDiferenciaDeAreaHerbicidas:", error);
        }
    };

    const obtenerHoraInicioHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/horaInicioHerbicidas/${idAnalisis}`);
            setHoraInicioHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerHoraInicioHerbicidas:", error);
        }
    };

    const obtenerHoraFinalHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/horaFinalHerbicidas/${idAnalisis}`);
            setHoraFinalHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerHoraFinalHerbicidas:", error);
        }
    };

    const obtenerTiempoTotalHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/tiempoTotalHerbicidas/${idAnalisis}`);
            setTiempoTotalHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerTiempoTotalHerbicidas:", error);
        }
    };

    const obtenerEficienciaHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/eficienciaHerbicidas/${idAnalisis}`);
            setEficienciaHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerEficienciaHerbicidas:", error);
        }
    };

    const obtenerPromedioVelocidadHerbicidas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/promedioVelocidadHerbicidas/${idAnalisis}`);
            setPromedioVelocidadHerbicidas(response.data);
        } catch (error) {
            console.error("Error en obtenerPromedioVelocidadHerbicidas:", error);
        }
    };

    const execBash = async () => {

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

        }
        const formData = new FormData();
        formData.append('csv', selectedFile);
        formData.append('polygon', selectedZipFile);
        try {
            const response = await axios.post(`${API_BASE_URL}dashboard/execBash/${userData.ID_USUARIO}/${idAnalisisBash}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadResponse(response.data);

        } catch (error) {
            console.error('Error al ejecutar el análisis:', error);
            setUploadResponse('Error al ejecutar el análisis');
        }
    };

    return (
        <div className="dashboard">
            <Sidebar
                profileImage={profilePicture}
                name={userData.NOMBRE}
                apellido={userData.APELLIDO}
                menuItems={menuItems}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />
            <main  className={`main-content ${!sidebarOpen ? 'expand' : ''}`}>
                <h1 className="dashboard-title">Resumen de Análisis</h1>
                <section className="map-section">

                    <iframe
                        src={htmlContent}
                        title="Mapeo"
                        width="100%"
                        height="700px"
                        frameBorder="0"
                        style={{border: '1px solid #ccc'}}
                    ></iframe>
                </section>

                <section className="data-section">
                    {
                        selectedAnalysisType === 'APS' && (
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
                        selectedAnalysisType === 'COSECHA_MECANICA' && (
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
                                <DataCard title="Codigo Parsela">
                                    {displayValue(codigoParcelaResponsableCm)}
                                </DataCard>
                                <DataCard title="Nombre Operador">
                                    {displayValue(nombreOperadorCm)}
                                </DataCard>
                                <DataCard title="Nombre Maquina">
                                    {displayValue(nombreMaquinaCm)}
                                </DataCard>
                                <DataCard title="Actividad">
                                    {displayValue(actividadCm)}
                                </DataCard>
                                <DataCard title="Area Neta">
                                    {displayValue(areaNetaCm)}
                                </DataCard>
                                <DataCard title="Area Bruta">
                                    {displayValue(areaBrutaCm)}
                                </DataCard>
                                <DataCard title="Diferencia de Area">
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
                                <DataCard title="Eficiencia">
                                    {displayValue(eficienciaCm)}
                                </DataCard>
                                <DataCard title="Promedio Velocidad">
                                    {displayValue(promedioVelocidadCm)}
                                </DataCard>
                                <DataCard title="Porcentaje Area Piloto">
                                    {displayValue(porcentajeAreaPilotoCm)}
                                </DataCard>
                                <DataCard title="Porcentaje Area AutoTracker">
                                    {displayValue(porcentajeAreaAutoTrackerCm)}
                                </DataCard>
                            </>
                        )
                    }
                    {
                        selectedAnalysisType === 'FERTILIZACION' && (
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
                                <DataCard title="Area Neta">
                                    {displayValue(areaNetaFertilizacion)}
                                </DataCard>
                                <DataCard title="Area Bruta">
                                    {displayValue(areaBrutaFertilizacion)}
                                </DataCard>
                                <DataCard title="Diferencia Area">
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
                        selectedAnalysisType === 'HERBICIDAS' && (
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
                        <input id="csv-file" type="file" accept=".csv" onChange={e => setSelectedFile(e.target.files[0])}/>
                        Selecciona tu CSV
                    </label>
                    <label htmlFor="zip-file" className="custom-file-upload">
                        <input id="zip-file" type="file" onChange={e => setSelectedZipFile(e.target.files[0])} accept=".zip" />
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
            </main>
        </div>
    );

}

export default Dashboard;
