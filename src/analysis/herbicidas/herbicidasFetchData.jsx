import {
    obtenerResponsableHerbicidas,
    obtenerFechaHerbicidas,
    obtenerNombreFincaHerbicidas,
    obtenerParcelaHerbicidas,
    obtenerOperadorHerbicidas,
    obtenerEquipoHerbicidas,
    obtenerActividadHerbicidas,
    obtenerAreaNetaHerbicidas,
    obtenerAreaBrutaHerbicidas,
    obtenerDiferenciaDeAreaHerbicidas,
    obtenerHoraInicioHerbicidas,
    obtenerHoraFinalHerbicidas,
    obtenerTiempoTotalHerbicidas,
    obtenerEficienciaHerbicidas,
    obtenerPromedioVelocidadHerbicidas
} from "../../utils/Constants";
import { ultimoAnalisis } from "../../utils/mapUtils";

export const fetchDataHerbicidas = async (idAnalisisHerbicidas, setDatosAnalisis) => {
    try {
        const dataFetchers = [
            await obtenerResponsableHerbicidas(idAnalisisHerbicidas),
            await obtenerFechaHerbicidas(idAnalisisHerbicidas),
            await obtenerNombreFincaHerbicidas(idAnalisisHerbicidas),
            await obtenerParcelaHerbicidas(idAnalisisHerbicidas),
            await obtenerOperadorHerbicidas(idAnalisisHerbicidas),
            await obtenerEquipoHerbicidas(idAnalisisHerbicidas),
            await obtenerActividadHerbicidas(idAnalisisHerbicidas),
            await obtenerAreaNetaHerbicidas(idAnalisisHerbicidas),
            await obtenerAreaBrutaHerbicidas(idAnalisisHerbicidas),
            await obtenerDiferenciaDeAreaHerbicidas(idAnalisisHerbicidas),
            await obtenerHoraInicioHerbicidas(idAnalisisHerbicidas),
            await obtenerHoraFinalHerbicidas(idAnalisisHerbicidas),
            await obtenerTiempoTotalHerbicidas(idAnalisisHerbicidas),
            await obtenerEficienciaHerbicidas(idAnalisisHerbicidas),
            await obtenerPromedioVelocidadHerbicidas(idAnalisisHerbicidas)
        ];

        const results = await Promise.allSettled(dataFetchers);

        const datos = results.reduce((acc, result, index) => {
            if (result.status === "fulfilled" && result.value !== null) {
                switch (index) {
                    case 0: acc.responsable = result.value; break;
                    case 1: acc.fecha = result.value; break;
                    case 2: acc.nombreFinca = result.value; break;
                    case 3: acc.parcela = result.value; break;
                    case 4: acc.operador = result.value; break;
                    case 5: acc.equipo = result.value; break;
                    case 6: acc.actividad = result.value; break;
                    case 7: acc.areaNeta = result.value; break;
                    case 8: acc.areaBruta = result.value; break;
                    case 9: acc.diferenciaDeArea = result.value; break;
                    case 10: acc.horaInicio = result.value; break;
                    case 11: acc.horaFinal = result.value; break;
                    case 12: acc.tiempoTotal = result.value; break;
                    case 13: acc.eficiencia = result.value; break;
                    case 14: acc.promedioVelocidad = result.value; break;
                    default: break;
                }
            }
            return acc;
        }, {});

        if (Object.keys(datos).length > 0) {
            setDatosAnalisis(datos);
        }

    } catch (error) {
        console.error("Error al cargar datos de Herbicidas:", error);
    }
};

export const shouldEnableExecBashHerbicidas = (selectedFile) => {
    return selectedFile !== null;
};

export const cargaDatosHerbicidas = async (userData, selectedAnalysisTypeRef, setIdAnalisisHerbicidas) => {
    if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
        try {
            const response = await ultimoAnalisis(selectedAnalysisTypeRef, userData.ID_USUARIO);
            if (response && response.data && response.data.ID_ANALISIS) {
                setIdAnalisisHerbicidas(response.data.ID_ANALISIS);
                return response;
            } else {
                console.error("Respuesta del último análisis no contiene datos esperados");
            }
        } catch (error) {
            console.error("Error al obtener último análisis:", error);
        }
    }
};
