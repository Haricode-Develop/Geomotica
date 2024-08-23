import { API_BASE_URL } from "../../utils/Constants";
import { ultimoAnalisis } from "../../utils/mapUtils";
import {obtenerDatosCompletosAps} from "../../utils/Constants";

// Función para obtener todos los datos de APS de una sola vez
export const fetchDataAps = async (idAnalisisAps, setDatosAnalisis) => {
    try {
        const data = await obtenerDatosCompletosAps(idAnalisisAps);
        const datos = {
            responsable: data.nombreResponsable || '',
            fechaInicio: data.fechaInicio || '',
            fechaFin: data.fechaFinal || '',
            nombreFinca: data.nombreFinca || '',
            codigoFincaResponsable: data.codigoFincaResponsable || '',
            nombreOperador: data.nombreOperador || '',
            codigoEquipo: data.codigoEquipo || '',
            horaInicio: data.horaInicio || '',
            horaFinal: data.horaFinal || '',
            eficiencia: data.eficiencia || '',
            codigoLote: data.codigoLote || '',
            dosisTeorica: data.dosisTeorica || '',
            humedadDelCultivo: data.humedadDelCultivo || '',
            tchEstimado: data.tchEstimado || '',
            tiempoTotal: data.tiempoTotal || 0,
            productoAps: data.productoAps || ''
        };

        setDatosAnalisis(datos);
    } catch (error) {
        console.error("Error al cargar datos de APS:", error);
        // Opcional: setear datos vacíos en caso de error
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
