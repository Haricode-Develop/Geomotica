import React, {useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

import './DashboardStyle.css';
import logo from '../../assets/logo.png';
import axios from "axios";
import {API_BASE_URL} from "../../utils/config";
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
    const { userData } = useAuth();
    const [activeMenu, setActiveMenu] = useState(null);
    const [promedioVelResult, setPromedioVelResult] = useState(null);
    const [promedioFertilizacionResult, setPromedioFertilizacionResult] = useState(null);
    const [promedioAlturaResult, setPromedioAlturaResult] = useState(null);
    const [tiempoActividadResult, setTiempoActividadResult] = useState(null);
    const [eficienciaAnalisisResult, setEficienciaAnalisisResult] = useState(null);
    const [presionContBaseResult, setPresionContBaseResult] = useState(null);
    const [promedioTchResult, setPromedioTchResult] = useState(null);
    const [operadorResult, setOperadorResult] = useState(null);
    const [fechaActividAdResult, setFechaActividAdResult] = useState(null);
    const [file, setFile] = useState(null);
    const [nombreTabla, setNombreTabla] = useState(null);
    const [idAnalisis, setIdAnalisis] = useState(null);
    const [idAnalisisBash, setIdAnalisisBash] = useState(null);
    const [mapUrl, setMapUrl] = useState(null);
    const selectedAnalysisTypeRef = useRef(); // Creando la referencia
    const [socket, setSocket] = useState(null);

    const [selectedAnalysisType, setSelectedAnalysisType] = useState('');
    const analysisTemplates = {
        APS: "/templates/APS.csv",
        COSECHA_MECANICA: "/templates/COSECHA_MECANICA.csv",
        FERTILIZACION: "/templates/FERTILIZACION.csv",
        HERBICIDAS: "/templates/HERBICIDAS.csv"
    };

    const ultimoAnalisis = async() => {
        return await axios.get(`${API_BASE_URL}/dashboard/ultimo_analisis/${selectedAnalysisTypeRef.current}/${userData.ID_USUARIO}`);
    };

    useEffect(() => {

        const socket = io(API_BASE_URL);
        setSocket(socket);
        // Escuchar el evento 'datosInsertados'
        socket.on('datosInsertados', async () => {
            console.log("SE EJECUTA DATOS INSERTADOS =====");
            console.log(nombreTabla);
            console.log("SE EJECUTA DATOS INSERTADOS ID=====");
            console.log(idAnalisis);
            await promedioVelocidad();
            await promedioFertilizacionDosisReal();
            await promedioAlturaGps();
            await tiempoTotalActividad();
            await eficiencia();
            await presionContadorBase();
            await promedioTch();
            await operador();
            await fechaActividad();
        });

        return () => {
            // Desconectar el socket cuando el componente se desmonte
            socket.disconnect();
        };

    }, [nombreTabla, idAnalisis]);
    useEffect(() => {
        selectedAnalysisTypeRef.current = selectedAnalysisType;
        console.log( selectedAnalysisTypeRef.current);
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
        console.log("ESTO ES AFUERA=====");
        console.log(nombreTabla);
        console.log("ESTO ES AFUERA=====");
        console.log(idAnalisis);
    }, [selectedAnalysisType]);
    const simulateEvent = () => {
        if(socket) {
            socket.emit('datosInsertados', { data: "mi data" });
        console.log("Entre al socket");
        }else{

        }
    };
    const promedioVelocidad = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/dashboard/promedio_velocidad/${nombreTabla}/${idAnalisis}`);
            setPromedioVelResult(response.data);
        } catch (error) {
            console.error("Error en promedioVelocidad:", error);
        }
    };

    const promedioFertilizacionDosisReal = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/promedio_fertilizacion_dosis_real/${idAnalisis}`);
            setPromedioFertilizacionResult(response.data);
        }catch (error) {
            console.error("Error en promedioVelocidad:", error);
        }

    };

    const promedioAlturaGps = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/dashboard/promedio_altura_m/${idAnalisis}`);
        setPromedioAlturaResult(response.data);
    }catch (error) {
        console.error("Error en promedioVelocidad:", error);
    }
    };

    const tiempoTotalActividad = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/dashboard/tiempo_total_actividad/${nombreTabla}/${idAnalisis}`);
        setTiempoActividadResult(response.data);
    }catch (error) {
        console.error("Error en promedioVelocidad:", error);
    }
    };

    const eficiencia = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/dashboard/eficiencia/${nombreTabla}/${idAnalisis}`);
        setEficienciaAnalisisResult(response.data);
    }catch (error) {
        console.error("Error en promedioVelocidad:", error);
    }
    };

    const presionContadorBase = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/dashboard/presion_contador/${idAnalisis}`);
        setPresionContBaseResult(response.data);
    }catch (error) {
        console.error("Error en promedioVelocidad:", error);
    }
    };

    const promedioTch = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/dashboard/promedio_tch/${nombreTabla}/${idAnalisis}`);
        setPromedioTchResult(response.data);
    }catch (error) {
        console.error("Error en promedioVelocidad:", error);
    }

    };

    const operador = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/dashboard/operador/${nombreTabla}/${idAnalisis}`);
        setOperadorResult(response.data);
    }catch (error) {
        console.error("Error en promedioVelocidad:", error);
    }
    };

    const fechaActividad = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/dashboard/fecha_actividad/${nombreTabla}/${idAnalisis}`);
       setFechaActividAdResult(response.data);
    }catch (error) {
        console.error("Error en promedioVelocidad:", error);
    }
    };
    function displayValue(value) {
        return value !== null ? value : 'N/A';
    }


    const execBash = async () => {
        try {
            await axios.get(`${API_BASE_URL}/dashboard/execBash/${userData.ID_USUARIO}/${idAnalisisBash}`);
        } catch (error) {
            console.error("Error al ejecutar execBash:", error);
        }
    };

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <img src={logo} alt="Logo de la empresa" className="logo-sidebar" />
                <div className="user-info">
                    <img src="path_to_profile_picture.jpg" alt="Foto del usuario" className="user-picture" />
                    <p className="user-name">Nombre del Usuario</p>
                </div>
                <div className="menu">
                    <button className="menu-item" onClick={() => setActiveMenu('analisis')}>
                        Análisis
                    </button>
                    {activeMenu === 'analisis' && (
                        <ul className="submenu">
                            <li>analisis1</li>
                            <li>analisis2</li>
                            <li>analisis3</li>
                            <li>analisis4</li>
                        </ul>
                    )}
                    <button className="menu-item" onClick={() => setActiveMenu('historicos')}>
                        Históricos
                    </button>
                    {activeMenu === 'historicos' && (
                        <ul className="submenu">
                            <li>Historico1</li>
                        </ul>
                    )}
                </div>
            </aside>
            <main className="main-content">
                <h1 className="dashboard-title">Resumen de Análisis</h1>
                <section className="map-section">
                    <h2>Mapeo</h2>
                    <iframe
                        src={mapUrl}
                        title="Mapeo"
                        width="100%"
                        height="400px"
                        frameBorder="0"
                        style={{border: '1px solid #ccc'}}
                    ></iframe>
                </section>

                <section className="data-section">
                    <div className="data-card">
                        <h3>Promedio Velocidad</h3>
                    <div className="data-value">
                        {
                            promedioVelResult &&
                            (
                                promedioVelResult.Promedio_Velocidad_Km_H
                                    ? displayValue(promedioVelResult.Promedio_Velocidad_Km_H)
                                    : displayValue(promedioVelResult.Promedio_Velocidad_m_s)
                            )
                        }
                    </div>

                    </div>
                    <div className="data-card">
                        <h3>Promedio Fertilización</h3>
                        <div className="data-value">
                            <span>Dosis Real Kg/Ha: </span>{displayValue(promedioFertilizacionResult?.Promedio_Dosis_Real_Kg_Ha)}
                        </div>
                        <div className="data-value">
                            <span>Altura (m): </span>{displayValue(promedioAlturaResult?.Promedio_Altura_m)}
                        </div>
                    </div>

                    <div className="data-card">
                        <h3>Tiempo Total Actividad</h3>
                        <div className="data-value">{displayValue(tiempoActividadResult?.Tiempo_Total_Horas)}</div>
                    </div>
                    <div className="data-card">
                        <h3>Eficiencia</h3>
                        <div className="data-value">{displayValue(eficienciaAnalisisResult?.Eficiencia)}</div>
                    </div>
                    <div className="data-card">
                        <h3>presionContadorBase</h3>
                        <div className="data-value">{displayValue(presionContBaseResult?.Promedio_Presion_Cortador_Base_Bar)}</div>
                    </div>
                    <div className="data-card">
                        <h3>promedioTch</h3>
                        <div className="data-value">{displayValue(promedioTchResult?.Promedio_TCH_herbicidas)}</div>
                    </div>
                    <div className="data-card">
                        <h3>operador</h3>
                        <div className="data-value">{displayValue(operadorResult?.Operadores)}</div>
                    </div>
                    <div className="data-card">
                        <h3>fechaActividad</h3>



                        <div className="data-value">
                            {displayValue(fechaActividAdResult?.Fecha_Inicio)}

                        </div>
                        <div className="data-value">
                        {displayValue(fechaActividAdResult?.Fecha_Final)}
                        </div>
                    </div>
                </section>

                <section className="advanced-section">
                    <div className="advanced-card">
                        <h3>Proceso</h3>
                        <div className="advanced-output">/* Salida de execPython() */</div>
                    </div>
                </section>
                <div className="analysis-controls">
                    <div>
                        <label htmlFor="file-upload" className="custom-file-upload">
                            Subir CSV
                        </label>
                        <input id="file-upload" type="file" accept=".csv" onChange={e => setFile(e.target.files[0])}/>
                    </div>
                    <a href={selectedAnalysisType ? analysisTemplates[selectedAnalysisType] : "#"} download>
                        Descargar plantilla
                    </a>

                    <select value={selectedAnalysisType} onChange={e => setSelectedAnalysisType(e.target.value)}>
                        <option value="">Seleccionar tipo de análisis</option>
                        {Object.keys(analysisTemplates).map(type => (
                            <option value={type} key={type}>{type}</option>
                        ))}
                    </select>

                    <button onClick={execBash}>Realizar análisis</button>
                    <button onClick={simulateEvent}>Emitir evento de prueba</button>

                </div>
            </main>
        </div>
    );

}

export default Dashboard;
