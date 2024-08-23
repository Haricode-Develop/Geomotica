import {
    obtenerResponsableFertilizacion,
    obtenerFechaInicioFertilizacion,
    obtenerFechaFinalFertilizacion,
    obtenerNombreFincaFertilizacion,
    obtenerOperadorFertilizacion,
    obtenerEquipoFertilizacion,
    obtenerActividadFertilizacion,
    obtenerAreaNetaFertilizacion,
    obtenerAreaBrutaFertilizacion,
    obtenerDiferenciaAreaFertilizacion,
    obtenerHoraInicioFertilizacion,
    obtenerHoraFinalFertilizacion,
    obtenerTiempoTotalFertilizacion,
    obtenerEficienciaFertilizacion,
    obtenerPromedioDosisRealFertilizacion,
    obtenerDosisTeoricaFertilizacion
} from "../../utils/Constants";
import { ultimoAnalisis } from "../../utils/mapUtils";

export const fetchDataFertilizacion = async (idAnalisisFertilizacion, setDatosAnalisis) => {
    try {
        const dataFetchers = [
            await obtenerResponsableFertilizacion(idAnalisisFertilizacion),
            await obtenerFechaInicioFertilizacion(idAnalisisFertilizacion),
            await obtenerFechaFinalFertilizacion(idAnalisisFertilizacion),
            await obtenerNombreFincaFertilizacion(idAnalisisFertilizacion),
            await obtenerOperadorFertilizacion(idAnalisisFertilizacion),
            await obtenerEquipoFertilizacion(idAnalisisFertilizacion),
            await obtenerActividadFertilizacion(idAnalisisFertilizacion),
            await obtenerAreaNetaFertilizacion(idAnalisisFertilizacion),
            await obtenerAreaBrutaFertilizacion(idAnalisisFertilizacion),
            await obtenerDiferenciaAreaFertilizacion(idAnalisisFertilizacion),
            await obtenerHoraInicioFertilizacion(idAnalisisFertilizacion),
            await obtenerHoraFinalFertilizacion(idAnalisisFertilizacion),
            await obtenerTiempoTotalFertilizacion(idAnalisisFertilizacion),
            await obtenerEficienciaFertilizacion(idAnalisisFertilizacion),
            await obtenerPromedioDosisRealFertilizacion(idAnalisisFertilizacion),
            await obtenerDosisTeoricaFertilizacion(idAnalisisFertilizacion)
        ];

        const results = await Promise.allSettled(dataFetchers);

        const datos = results.reduce((acc, result, index) => {
            if (result.status === "fulfilled" && result.value !== null) {
                switch (index) {
                    case 0: acc.responsable = result.value; break;
                    case 1: acc.fechaInicio = result.value; break;
                    case 2: acc.fechaFinal = result.value; break;
                    case 3: acc.nombreFinca = result.value; break;
                    case 4: acc.operador = result.value; break;
                    case 5: acc.equipo = result.value; break;
                    case 6: acc.actividad = result.value; break;
                    case 7: acc.areaNeta = result.value; break;
                    case 8: acc.areaBruta = result.value; break;
                    case 9: acc.diferenciaArea = result.value; break;
                    case 10: acc.horaInicio = result.value; break;
                    case 11: acc.horaFinal = result.value; break;
                    case 12: acc.tiempoTotal = result.value; break;
                    case 13: acc.eficiencia = result.value; break;
                    case 14: acc.promedioDosisReal = result.value; break;
                    case 15: acc.dosisTeorica = result.value; break;
                    default: break;
                }
            }
            return acc;
        }, {});

        if (Object.keys(datos).length > 0) {
            setDatosAnalisis(datos);
        }

    } catch (error) {
        console.error("Error al cargar datos de Fertilización:", error);
    }
};

export const shouldEnableExecBashFertilizacion = (selectedFile) => {
    return selectedFile !== null;
};

export const cargaDatosFertilizacion = async (userData, selectedAnalysisTypeRef, setIdAnalisisFertilizacion) => {
    if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
        try {
            const response = await ultimoAnalisis(selectedAnalysisTypeRef, userData.ID_USUARIO);
            if (response && response.data && response.data.ID_ANALISIS) {
                setIdAnalisisFertilizacion(response.data.ID_ANALISIS);
                return response;
            } else {
                console.error("Respuesta del último análisis no contiene datos esperados");
            }
        } catch (error) {
            console.error("Error al obtener último análisis:", error);
        }
    }
};
