import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

import './DashboardStyle.css';
import logo from '../../assets/logo.png';
import axios from "axios";
import {API_BASE_URL} from "../../utils/config";

function Dashboard() {
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

    const [selectedAnalysisType, setSelectedAnalysisType] = useState('');

    const nombreTabla = '';
    const idAnalisis = '';
    const idAnalisisBash = '';
    const idUsuario = '';
    const tipoAnalisis = '';
    const mapUrl = '';
    const analysisTemplates = {
        APS: "/templates/APS.csv",
        COSECHA_MECANICA: "/templates/COSECHA_MECANICA.csv",
        FERTILIZACION: "/templates/FERTILIZACION.csv",
        HERBICIDAS: "/templates/HERBICIDAS.csv"
    };

    const ultimoAnalisis = async()=>{
        return await axios.get(`${API_BASE_URL}/ultimo_analisis/${tipoAnalisis}/${idUsuario}`);
    };
    useEffect(() => {
        // Conectarse al servidor Socket.io
        const socket = io(API_BASE_URL);

        // Escuchar el evento 'datosInsertados'
        socket.on('datosInsertados', async () => {
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
    }, []);

    const promedioVelocidad = async () => {
        const response = await axios.get(`${API_BASE_URL}/promedio_velocidad/${nombreTabla}/${idAnalisis}`);
        setPromedioVelResult(response.data);
    };

    const promedioFertilizacionDosisReal = async () => {
        const response = await axios.get(`${API_BASE_URL}/promedio_fertilizacion_dosis_real/${idAnalisis}`);
        setPromedioFertilizacionResult(response.data);
    };

    const promedioAlturaGps = async () => {
        const response = await axios.get(`${API_BASE_URL}/promedio_altura_m/${idAnalisis}`);
        setPromedioAlturaResult(response.data);
    };

    const tiempoTotalActividad = async () => {
        const response = await axios.get(`${API_BASE_URL}/tiempo_total_actividad/${nombreTabla}/${idAnalisis}`);
        setTiempoActividadResult(response.data);

    };

    const eficiencia = async () => {
        const response = await axios.get(`${API_BASE_URL}/eficiencia/${nombreTabla}/${idAnalisis}`);
        setEficienciaAnalisisResult(response.data);
    };

    const presionContadorBase = async () => {
        const response = await axios.get(`${API_BASE_URL}/presion_contador/${idAnalisis}`);
        setPresionContBaseResult(response.data);
    };

    const promedioTch = async () => {
        const response = await axios.get(`${API_BASE_URL}/promedio_tch/${nombreTabla}/${idAnalisis}`);
        setPromedioTchResult(response.data);

    };

    const operador = async () => {
        const response = await axios.get(`${API_BASE_URL}/operador/${nombreTabla}/${idAnalisis}`);
        setOperadorResult(response.data);
    };

    const fechaActividad = async () => {
        const response = await axios.get(`${API_BASE_URL}/fecha_actividad/${nombreTabla}/${idAnalisis}`);
       setFechaActividAdResult(response.data);
    };

    const execBash = async () => {
        try {
            await axios.get(`${API_BASE_URL}/execBash/${idUsuario}/${idAnalisisBash}`);
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
                        <div className="data-value">{promedioVelResult}</div>
                    </div>
                    <div className="data-card">
                        <h3>Promedio Fertilización</h3>
                        <div className="data-value">{promedioFertilizacionResult}</div>
                    </div>
                    <div className="data-card">
                        <h3>Promedio Altura GPS</h3>
                        <div className="data-value">{promedioAlturaResult}</div>
                    </div>

                    <div className="data-card">
                        <h3>Tiempo Total Actividad</h3>
                        <div className="data-value">{tiempoActividadResult}</div>
                    </div>
                    <div className="data-card">
                        <h3>Eficiencia</h3>
                        <div className="data-value">{eficienciaAnalisisResult}</div>
                    </div>
                    <div className="data-card">
                        <h3>presionContadorBase</h3>
                        <div className="data-value">{presionContBaseResult}</div>
                    </div>
                    <div className="data-card">
                        <h3>promedioTch</h3>
                        <div className="data-value">{promedioTchResult}</div>
                    </div>
                    <div className="data-card">
                        <h3>operador</h3>
                        <div className="data-value">{operadorResult}</div>
                    </div>
                    <div className="data-card">
                        <h3>fechaActividad</h3>
                        <div className="data-value">{fechaActividAdResult}</div>
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
                </div>
            </main>
        </div>
    );

}

export default Dashboard;
