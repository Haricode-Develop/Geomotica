import axios from "axios";
import { API_BASE_URL } from "./config";

// Función genérica para hacer peticiones GET y manejar errores
const fetchData = async (url) => {
    try {
        const response = await axios.get(url);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`Error en la petición a ${url}:`, error);
        return { success: false, error };
    }
};

/*======================================================
*  PETICIONES DE APS
* ======================================================*/
export const obtenerDatosCompletosAps = async (idAnalisisAps) => {
    const response = await fetchData(`${API_BASE_URL}dashboard/aps/completo/${idAnalisisAps}`);
    return response.success ? response.data : {};
};

/*======================================================
*  PETICIONES DE COSECHA_MECANICA
* ======================================================*/
export const obtenerDatosCompletosCm = async (idAnalisisCosechaMecanica) => {
    const result = await fetchData(`${API_BASE_URL}dashboard/cosechaMecanica/completo/${idAnalisisCosechaMecanica}`);
    return result.success ? result.data : {};
};
/*======================================================
*  PETICIONES DE FERTILIZACIÓN
* ======================================================*/
export const obtenerResponsableFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/responsableFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerFechaInicioFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/fechaInicioFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerFechaFinalFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/fechaFinalFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerNombreFincaFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/nombreFincaFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerOperadorFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/operadorFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerEquipoFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/equipoFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerActividadFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/actividadFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerAreaNetaFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/areaNetaFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerAreaBrutaFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/areaBrutaFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerDiferenciaAreaFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/diferenciaAreaFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerHoraInicioFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/horaInicioFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerHoraFinalFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/horaFinalFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerTiempoTotalFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/tiempoTotalFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerEficienciaFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/eficienciaFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerPromedioDosisRealFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/promedioDosisRealFertilizacion/${idAnalisisFertilizacion}`);
};

export const obtenerDosisTeoricaFertilizacion = (idAnalisisFertilizacion) => {
    return fetchData(`${API_BASE_URL}/dashboard/dosisTeoricaFertilizacion/${idAnalisisFertilizacion}`);
};

/*======================================================
*  PETICIONES DE HERBICIDAS
* ======================================================*/
export const obtenerResponsableHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/responsableHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerFechaHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/fechaHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerNombreFincaHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/nombreFincaHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerParcelaHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/parcelaHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerOperadorHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/operadorHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerEquipoHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/equipoHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerActividadHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/actividadHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerAreaNetaHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/areaNetaHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerAreaBrutaHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/areaBrutaHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerDiferenciaDeAreaHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/diferenciaDeAreaHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerHoraInicioHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/horaInicioHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerHoraFinalHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/horaFinalHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerTiempoTotalHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/tiempoTotalHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerEficienciaHerbicidas = (idAnalisisHerbicidas) => {
    return fetchData(`${API_BASE_URL}/dashboard/eficienciaHerbicidas/${idAnalisisHerbicidas}`);
};

export const obtenerPromedioVelocidadHerbicidas = async (idAnalisisHerbicidas) => {
    const result = await fetchData(`${API_BASE_URL}/dashboard/promedioVelocidadHerbicidas/${idAnalisisHerbicidas}`);
    return result.success ? `${parseFloat(result.data).toFixed(3)} Km/H` : null;
};

// Función para mostrar valores en la UI
export function displayValue(value) {
    if (value === undefined || value === null) {
        return '-';
    } else if (Array.isArray(value) && value.length > 1) {
        return (
            <div style={{ overflowY: 'auto', maxHeight: '100px', listStyle: 'none'}}>
                <ul>
                    {value.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    } else if (typeof value === 'object') {
        // Devolver solo los valores de las propiedades del objeto
        return Object.values(value).join(', ');
    } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
        // Formatear la cadena de fecha
        const date = new Date(value);
        return date.toLocaleDateString(); // Formatea la fecha a un formato legible
    } else {
        return value;
    }
}


// ID DE LOS ANALISIS

export const APLICACIONES_AEREAS = 1;
export const COSECHA_MECANICA = 2;
export const HERBICIDAS = 3;
export const FERTILIZACION = 4;
export const CONTEO_PALMA = 5;