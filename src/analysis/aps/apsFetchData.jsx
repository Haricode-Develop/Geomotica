import { API_BASE_URL } from "../../utils/Constants";
import { ultimoAnalisis } from "../../utils/mapUtils";
import {obtenerDatosCompletosAps} from "../../utils/Constants";
import {API_BASE_URL_DASHBOARD} from "../../utils/config";

export const fetchDataAps = async (idAnalisisAps, setDatosAnalisis) => {
    try {
        const data = await obtenerDatosCompletosAps(idAnalisisAps);
        const datos = {
            nombreResponsable: data.nombreResponsable || '',
            fechaInicio: data.fechaInicio || '',
            fechaFin: data.fechaFin || '',
            nombreFinca: data.nombreFinca || '',
            codigoFinca: data.codigoFinca || '',
            codigoLote: data.codigoLote || '',
            nombreOperador: data.nombreOperador || '',
            codigoEquipo: data.codigoEquipo || '',
            horaInicio: data.horaInicio || '',
            horaFinal: data.horaFinal || '',
            eficiencia: data.eficiencia || '',
            dosisTeorica: data.dosisTeorica || '',
            humedadDelCultivo: data.humedadDelCultivo || '',
            tchEstimado: data.tchEstimado || '',
            tiempoTotal: data.tiempoTotal || 0,
            productoAps: data.productoAps || ''
        };

        setDatosAnalisis(datos);
    } catch (error) {
        console.error("Error al cargar datos de APS:", error);
        setDatosAnalisis({});
    }
};

export const shouldEnableExecBashAps = (selectedZipFile) => {
    return selectedZipFile !== null;
};

export const cargaDatosAps = async (userData, selectedAnalysisTypeRef, setIdAnalisisAps) => {
    if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
        try {
            const response = await ultimoAnalisis(selectedAnalysisTypeRef, userData.ID_USUARIO);
            if (response && response.data && response.data.ID_ANALISIS) {
                setIdAnalisisAps(response.data.ID_ANALISIS);
                return response;
            } else {
                console.error("Respuesta del último análisis no contiene datos esperados");
            }
        } catch (error) {
            console.error("Error al obtener último análisis:", error);
        }
    }
};


export const processApsData = (datosAnalisis, indicadores) => ({
    analisis: "APLICACIONES_AEREAS",
    ...datosAnalisis,
    indicadores: {
        ...indicadores
    }
});


export const fetchDataApsIndicators = async () => {
    const response = await fetch(`${API_BASE_URL_DASHBOARD}api/indicators/aplicaciones-aereas`);
    const data = await response.json();
    return data.map(item => ({
        title: item.indicatorName,
        value: item.indicatorValue,
    }));
};