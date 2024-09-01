import { API_BASE_URL } from "../../utils/Constants";
import {API_BASE_URL_DASHBOARD} from "../../utils/config";
import { ultimoAnalisis } from "../../utils/mapUtils";
import {obtenerDatosCompletosCm} from "../../utils/Constants";

// Función para obtener todos los datos de cosecha mecánica de una sola vez
export const fetchDataCosechaMecanica = async (idAnalisisCosechaMecanica, setDatosAnalisis) => {
    try {
        const data = await obtenerDatosCompletosCm(idAnalisisCosechaMecanica);
        console.log("ESTE ES EL DATA: ", data);
        const datos = {
            nombreResponsable: data.nombreResponsable || '',
            fechaInicio: data.fechaInicio || '',
            fechaFin: data.fechaFin || '',
            nombreFinca: data.nombreFinca || '',
            codigoParcelaResponsable: data.codigoParcelaResponsable || '',
            nombreOperador: data.nombreOperador || '',
            nombreMaquina: data.nombreMaquina || '',
            actividad: data.actividad || '',
            horaInicio: data.horaInicio || '',
            horaFinal: data.horaFinal || '',
            tiempoTotalActividad: data.tiempoTotalActividad || 0,
            calidadGps: data.calidadGps !== undefined ? parseFloat(data.calidadGps).toFixed(3) : null,
            promedioVelocidad: data.promedioVelocidad !== undefined ? `${parseFloat(data.promedioVelocidad).toFixed(3)} Km/H` : null,
            consumoCombustible: data.consumoCombustible !== undefined ? parseFloat(data.consumoCombustible).toFixed(3) : null,
            presionCortadorBase: data.presionCortadorBase !== undefined ? parseFloat(data.presionCortadorBase).toFixed(3) : null,
            tah: data.tah || 0,
            rpm: data.rpm !== undefined ? parseFloat(data.rpm).toFixed(3) : null,
            tch: data.tch !== undefined ? parseFloat(data.tch).toFixed(3) : null
        };

        // Setear los datos obtenidos
        setDatosAnalisis(datos);
    } catch (error) {
        console.error("Error general al cargar datos de Cosecha Mecánica:", error);
        // Opcional: setear datos vacíos en caso de error
        setDatosAnalisis({});
    }
};

export const shouldEnableExecBashCosechaMecanica = (selectedFile) => {
    return selectedFile !== null;
};

export const cargaDatosCosechaMecanica = async (userData, selectedAnalysisTypeRef, setIdAnalisisCosechaMecanica) => {
    if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
        try {
            const response = await ultimoAnalisis(selectedAnalysisTypeRef, userData.ID_USUARIO);
            if (response && response.data && response.data.ID_ANALISIS) {
                setIdAnalisisCosechaMecanica(response.data.ID_ANALISIS);
                return response;
            } else {
            }
        } catch (error) {
            console.error("Error al obtener último análisis:", error);
        }
    }
};

export const processCosechaMecanicaData = (datosAnalisis, indicadores) => ({
    analisis: "COSECHA_MECANICA",
    ...datosAnalisis,
    indicadores: {
        ...indicadores,
        nombreMaquina: datosAnalisis.nombreMaquina,
        areaBrutaCm: datosAnalisis.areaBrutaCm,
        horaInicio: datosAnalisis.horaInicio,
        horaFin: datosAnalisis.horaFin,
        tiempoTotalActividad: datosAnalisis.tiempoTotalActividad,
        consumoCombustible: datosAnalisis.consumoCombustible,
        calidadGps: datosAnalisis.calidadGps,
        eficienciaCm: datosAnalisis.eficienciaCm,
        promedioVelocidad: datosAnalisis.promedioVelocidad,
        rpm: datosAnalisis.rpm,
        tch: datosAnalisis.tch,
        tah: datosAnalisis.tah,
        presionCortadorBase: datosAnalisis.presionCortadorBase,
        porcentajeAreaPilotoCm: datosAnalisis.porcentajeAreaPilotoCm,
        porcentajeAreaAutoTrackerCm: datosAnalisis.porcentajeAreaAutoTrackerCm,
        porcentajeModoCortadorBaseCm: datosAnalisis.porcentajeModoCortadorBaseCm,
        codigoParcelaResponsable: datosAnalisis.codigoParcelaResponsable
    }
});


export const fetchDataCosechaMecanicaIndicators = async () => {
    const response = await fetch(`${API_BASE_URL_DASHBOARD}api/indicators/cosecha-mecanica`);
    const data = await response.json();
    return data.map(item => ({
        title: item.indicatorName,
        value: item.indicatorValue,
    }));
};