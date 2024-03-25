/*======================================================
*  PETICIONES DE APS
* ======================================================*/
import axios from "axios";
import {API_BASE_URL} from "./config";

export const obtenerResponsableAps = async (idAnalisisAps, setResponsableAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/responsableAps/${idAnalisisAps}`);
        setResponsableAps(response.data);
    } catch (error) {
        console.error("Error en obtenerResponsableAps:", error);
    }
};

export const obtenerFechaInicioCosechaAps = async (idAnalisisAps, setFechaInicioCosechaAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/fechaInicioCosechaAps/${idAnalisisAps}`);

        setFechaInicioCosechaAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerFechaInicioCosechaAps:", error);
    }
};

export const obtenerFechaFinCosechaAps = async (idAnalisisAps, setFechaFinCosechaAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/fechaFinCosechaAps/${idAnalisisAps}`);
        setFechaFinCosechaAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerFechaFinCosechaAps:", error);
    }
};

export const obtenerNombreFincaAps = async (idAnalisisAps, setNombreFincaAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/nombreFincaAps/${idAnalisisAps}`);
        setNombreFincaAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerNombreFincaAps:", error);
    }
};

export const obtenerCodigoParcelasAps = async (idAnalisisAps, setCodigoParcelasAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/codigoParcelasAps/${idAnalisisAps}`);
        setCodigoParcelasAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerCodigoParcelasAps:", error);
    }
};

export const obtenerNombreOperadorAps = async (idAnalisisAps, setNombreOperadorAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/nombreOperadorAps/${idAnalisisAps}`);
        setNombreOperadorAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerNombreOperadorAps:", error);
    }
};

export const obtenerEquipoAps = async (idAnalisisAps, setEquipoAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/equipoAps/${idAnalisisAps}`);
        setEquipoAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerEquipoAps:", error);
    }
};

export const obtenerActividadAps = async (idAnalisisAps, setActividadAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/actividadAps/${idAnalisisAps}`);
        setActividadAps(response.data);
    } catch (error) {
        console.error("Error en obtenerActividadAps:", error);
    }
};

export const obtenerAreaNetaAps = async (idAnalisisAps, setAreaNetaAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/areaNetaAps/${idAnalisisAps}`);
        setAreaNetaAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerAreaNetaAps:", error);
    }
};

export const obtenerAreaBrutaAps = async (idAnalisisAps, setAreaBrutaAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/areaBrutaAps/${idAnalisisAps}`);
        setAreaBrutaAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerAreaBrutaAps:", error);
    }
};

export const obtenerDiferenciaEntreAreasAps = async (idAnalisisAps, setDiferenciaEntreAreasAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/diferenciaEntreAreasAps/${idAnalisisAps}`);
        setDiferenciaEntreAreasAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerDiferenciaEntreAreasAps:", error);
    }
};

export const obtenerHoraInicioAps = async (idAnalisisAps, setHoraInicioAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/horaInicioAps/${idAnalisisAps}`);
        setHoraInicioAps(response.data);
    } catch (error) {
        console.error("Error en obtenerHoraInicioAps:", error);
    }
};

export const obtenerHoraFinalAps = async (idAnalisisAps, setHoraFinalAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/horaFinalAps/${idAnalisisAps}`);
        setHoraFinalAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerHoraFinalAps:", error);
    }
};

export const obtenerTiempoTotalActividadesAps = async (idAnalisisAps, setTiempoTotalActividadesAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/tiempoTotalActividadesAps/${idAnalisisAps}`);
        setTiempoTotalActividadesAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerTiempoTotalActividadesAps:", error);
    }
};

export const obtenerEficienciaAps = async (idAnalisisAps, setEficienciaAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/eficienciaAps/${idAnalisisAps}`);
        setEficienciaAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerEficienciaAps:", error);
    }
};

export const obtenerPromedioVelocidadAps = async (idAnalisisAps, setPromedioVelocidadAps) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/promedioVelocidadAps/${idAnalisisAps}`);
        setPromedioVelocidadAps(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerPromedioVelocidadAps:", error);
    }
};
/*======================================================
*  PETICIONES DE COSECHA_MECANICA
* ======================================================*/

export const obtenerNombreResponsableCm = async (idAnalisisCosechaMecanica, setNombreResponsableCm) => {
    try {

        const response = await axios.get(`${API_BASE_URL}dashboard/nombreResponsableCm/${idAnalisisCosechaMecanica}`);


        setNombreResponsableCm(response.data);
        return response.data;
    } catch (error) {
        console.error("Error en obtenerNombreResponsableCm:", error);
    }
};

export const obtenerFechaInicioCosechaCm = async (idAnalisisCosechaMecanica, setFechaInicioCosechaCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/fechaInicioCosechaCm/${idAnalisisCosechaMecanica}`);
        setFechaInicioCosechaCm(response.data[0]);

        return response.data[0];
    } catch (error) {
        console.error("Error en obtenerFechaInicioCosechaCm:", error);
    }
};

export const obtenerFechaFinCosechaCm = async (idAnalisisCosechaMecanica, setFechaFinCosechaCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/fechaFinCosechaCm/${idAnalisisCosechaMecanica}`);
        setFechaFinCosechaCm(response.data[0]);

        return response.data[0];
    } catch (error) {
        console.error("Error en obtenerFechaFinCosechaCm:", error);
    }
};

export const obtenerNombreFincaCm = async (idAnalisisCosechaMecanica, setNombreFincaCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/nombreFincaCm/${idAnalisisCosechaMecanica}`);
        setNombreFincaCm(response.data);

        return response.data;
    } catch (error) {
        console.error("Error en obtenerNombreFincaCm:", error);
    }
};

export const obtenerCodigoParcelaResponsableCm = async (idAnalisisCosechaMecanica, setCodigoParcelaResponsableCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/codigoParcelaResponsableCm/${idAnalisisCosechaMecanica}`);
        setCodigoParcelaResponsableCm(response.data);

        return response.data;
    } catch (error) {
        console.error("Error en obtenerCodigoParcelaResponsableCm:", error);
    }
};

export const obtenerPresionCortadorBaseCm = async (idAnalisisCosechaMecanica, setPresionCortadorBase)  => {
    try{
        const response = await axios.get(`${API_BASE_URL}dashboard/presionCortadorBaseCm/${idAnalisisCosechaMecanica}`);
        setPresionCortadorBase(response.data);

        return response.data;
    }catch(error){
        console.error("Error en obtener Presion Cortador Base: ", error);
    }

}


export const obtenerConsumoCombustibleCm = async(idAnalisisCosechaMecanica, setConsumoCombustibleCm) =>{
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/consumoCombustibleCm/${idAnalisisCosechaMecanica}`);
        setConsumoCombustibleCm(response.data);

        return response.data;
    } catch(error){
        console.error("Error en obtenerConsumo COmbusitebleCm:", error);
    }
}

export const obtenerCalidadGpsCm = async(idAnalisisCosechaMecanica, setCalidadGpsCm) =>{
    try{
        const response = await axios.get(`${API_BASE_URL}dashboard/calidadGpsCm/${idAnalisisCosechaMecanica}`);
        setCalidadGpsCm(response.data);

        return response.data;
    }catch(error){
        console.error("Error en obtenerConsumo COmbusitebleCm:", error);
    }
}
export const obtenerNombreOperadorCm = async (idAnalisisCosechaMecanica, setNombreOperadorCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/nombreOperadorCm/${idAnalisisCosechaMecanica}`);
        setNombreOperadorCm(response.data);

        return response.data;
    } catch (error) {
        console.error("Error en obtenerNombreOperadorCm:", error);
    }
};

export const obtenerNombreMaquinaCm = async (idAnalisisCosechaMecanica, setNombreMaquinaCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/nombreMaquinaCm/${idAnalisisCosechaMecanica}`);
        setNombreMaquinaCm(response.data);

        return response.data;
    } catch (error) {
        console.error("Error en obtenerNombreMaquinaCm:", error);
    }
};

export const obtenerActividadCm = async (idAnalisisCosechaMecanica, setActividadCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/actividadCm/${idAnalisisCosechaMecanica}`);
        setActividadCm(response.data);

        return response.data;
    } catch (error) {
        console.error("Error en obtenerActividadCm:", error);
    }
};

export const obtenerRpmCm = async (idAnalisisCosechaMecanica, setRpmCm) =>{
    try{
        const response = await axios.get(`${API_BASE_URL}dashboard/rpmCm/${idAnalisisCosechaMecanica}`);
        setRpmCm(response.data);

        return response.data;
    } catch(error){
        console.error("Error en obtenerRpmCm:", error);

    }
}

export const obtenerTchCm = async(idAnalisisCosechaMecanica, setTchCm) => {
    try{
        const response = await axios.get(`${API_BASE_URL}dashboard/tchCm/${idAnalisisCosechaMecanica}`);
        setTchCm(response.data);

        return response.data;
    }  catch(error){
        console.error("Error en obtenerRpmCm:", error);
    }
}

export const obtenerTahCm = async(idAnalisisCosechaMecanica, setTahCm) => {
    try{
        const response = await axios.get(`${API_BASE_URL}dashboard/tahCm/${idAnalisisCosechaMecanica}`);
        setTahCm(response.data);

        return response.data;
    }  catch(error){
        console.error("Error en obtenerRpmCm:", error);
    }
}

export const obtenerHoraInicioCm = async (idAnalisisCosechaMecanica, setHoraInicioCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/horaInicioCm/${idAnalisisCosechaMecanica}`);
        setHoraInicioCm(response.data[0]);

        return response.data[0];
    } catch (error) {
        console.error("Error en obtenerHoraInicioCm:", error);
    }
};

export const obtenerHoraFinalCm = async (idAnalisisCosechaMecanica, setHoraFinalCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/horaFinalCm/${idAnalisisCosechaMecanica}`);
        setHoraFinalCm(response.data[0]);

        return response.data[0];
    } catch (error) {
        console.error("Error en obtenerHoraFinalCm:", error);
    }
};

export const obtenerTiempoTotalActividadCm = async (idAnalisisCosechaMecanica, setTiempoTotalActividadCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/tiempoTotalActividadCm/${idAnalisisCosechaMecanica}`);
        setTiempoTotalActividadCm(response.data[0]);

        return response.data[0];
    } catch (error) {
        console.error("Error en obtenerTiempoTotalActividadCm:", error);
    }
};



export const obtenerPromedioVelocidadCm = async (idAnalisisCosechaMecanica, setPromedioVelocidadCm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/promedioVelocidadCm/${idAnalisisCosechaMecanica}`);
        setPromedioVelocidadCm(`${response.data} Km/H`);

        return `${response.data} Km/H`;
    } catch (error) {
        console.error("Error en obtenerPromedioVelocidadCm:", error);
    }
};


/*======================================================
*  PETICIONES DE FERTILIZACIÓN
* ======================================================*/
export const obtenerResponsableFertilizacion = async (idAnalisisFertilizacion, setResponsableFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/responsableFertilizacion/${idAnalisisFertilizacion}`);
        setResponsableFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerResponsableFertilizacion:", error);
    }
};

export const obtenerFechaInicioFertilizacion = async (idAnalisisFertilizacion, setFechaInicioFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/fechaInicioFertilizacion/${idAnalisisFertilizacion}`);
        setFechaInicioFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerFechaInicioFertilizacion:", error);
    }
};

export const obtenerFechaFinalFertilizacion = async (idAnalisisFertilizacion, setFechaFinalFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/fechaFinalFertilizacion/${idAnalisisFertilizacion}`);
        setFechaFinalFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerFechaFinalFertilizacion:", error);
    }
};

export const obtenerNombreFincaFertilizacion = async (idAnalisisFertilizacion, setNombreFincaFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/nombreFincaFertilizacion/${idAnalisisFertilizacion}`);
        setNombreFincaFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerNombreFincaFertilizacion:", error);
    }
};

export const obtenerOperadorFertilizacion = async (idAnalisisFertilizacion, setOperadorFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/operadorFertilizacion/${idAnalisisFertilizacion}`);
        setOperadorFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerOperadorFertilizacion:", error);
    }
};

export const obtenerEquipoFertilizacion = async (idAnalisisFertilizacion, setEquipoFertilizacion ) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/equipoFertilizacion/${idAnalisisFertilizacion}`);
        setEquipoFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerEquipoFertilizacion:", error);
    }
};

export const obtenerActividadFertilizacion = async (idAnalisisFertilizacion, setActividadFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/actividadFertilizacion/${idAnalisisFertilizacion}`);
        setActividadFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerActividadFertilizacion:", error);
    }
};

export const obtenerAreaNetaFertilizacion = async (idAnalisisFertilizacion, setAreaNetaFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/areaNetaFertilizacion/${idAnalisisFertilizacion}`);
        setAreaNetaFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerAreaNetaFertilizacion:", error);
    }
};

export const obtenerAreaBrutaFertilizacion = async (idAnalisisFertilizacion, setAreaBrutaFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/areaBrutaFertilizacion/${idAnalisisFertilizacion}`);
        setAreaBrutaFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerAreaBrutaFertilizacion:", error);
    }
};

export const obtenerDiferenciaAreaFertilizacion = async (idAnalisisFertilizacion, setDiferenciaAreaFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/diferenciaAreaFertilizacion/${idAnalisisFertilizacion}`);
        setDiferenciaAreaFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerDiferenciaAreaFertilizacion:", error);
    }
};

export const obtenerHoraInicioFertilizacion = async (idAnalisisFertilizacion, setHoraInicioFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/horaInicioFertilizacion/${idAnalisisFertilizacion}`);
        setHoraInicioFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerHoraInicioFertilizacion:", error);
    }
};

export const obtenerHoraFinalFertilizacion = async (idAnalisisFertilizacion, setHoraFinalFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/horaFinalFertilizacion/${idAnalisisFertilizacion}`);
        setHoraFinalFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerHoraFinalFertilizacion:", error);
    }
};

export const obtenerTiempoTotalFertilizacion = async (idAnalisisFertilizacion, setTiempoTotalFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/tiempoTotalFertilizacion/${idAnalisisFertilizacion}`);
        setTiempoTotalFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerTiempoTotalFertilizacion:", error);
    }
};

export const obtenerEficienciaFertilizacion = async (idAnalisisFertilizacion,setEficienciaFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/eficienciaFertilizacion/${idAnalisisFertilizacion}`);
        setEficienciaFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerEficienciaFertilizacion:", error);
    }
};

export const obtenerPromedioDosisRealFertilizacion = async (idAnalisisFertilizacion, setPromedioDosisRealFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/promedioDosisRealFertilizacion/${idAnalisisFertilizacion}`);
        setPromedioDosisRealFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerPromedioDosisRealFertilizacion:", error);
    }
};

export const obtenerDosisTeoricaFertilizacion = async (idAnalisisFertilizacion, setDosisTeoricaFertilizacion) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/dosisTeoricaFertilizacion/${idAnalisisFertilizacion}`);
        setDosisTeoricaFertilizacion(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerDosisTeoricaFertilizacion:", error);
    }
};





/*======================================================
*  PETICIONES DE HERBICIDAS
* ======================================================*/

export const obtenerResponsableHerbicidas = async (idAnalisisHerbicidas, setResponsableHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/responsableHerbicidas/${idAnalisisHerbicidas}`);
        setResponsableHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerResponsableHerbicidas:", error);
    }
};

export const obtenerFechaHerbicidas = async (idAnalisisHerbicidas, setFechaHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/fechaHerbicidas/${idAnalisisHerbicidas}`);
        setFechaHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerFechaHerbicidas:", error);
    }
};

export const obtenerNombreFincaHerbicidas = async (idAnalisisHerbicidas, setNombreFincaHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/nombreFincaHerbicidas/${idAnalisisHerbicidas}`);
        setNombreFincaHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerNombreFincaHerbicidas:", error);
    }
};

export const obtenerParcelaHerbicidas = async (idAnalisisHerbicidas, setParcelaHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/parcelaHerbicidas/${idAnalisisHerbicidas}`);
        setParcelaHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerParcelaHerbicidas:", error);
    }
};

export const obtenerOperadorHerbicidas = async (idAnalisisHerbicidas, setOperadorHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/operadorHerbicidas/${idAnalisisHerbicidas}`);
        setOperadorHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerOperadorHerbicidas:", error);
    }
};

export const obtenerEquipoHerbicidas = async (idAnalisisHerbicidas, setEquipoHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/equipoHerbicidas/${idAnalisisHerbicidas}`);
        setEquipoHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerEquipoHerbicidas:", error);
    }
};

export const obtenerActividadHerbicidas = async (idAnalisisHerbicidas, setActividadHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/actividadHerbicidas/${idAnalisisHerbicidas}`);
        setActividadHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerActividadHerbicidas:", error);
    }
};

export const obtenerAreaNetaHerbicidas = async (idAnalisisHerbicidas, setAreaNetaHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/areaNetaHerbicidas/${idAnalisisHerbicidas}`);
        setAreaNetaHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerAreaNetaHerbicidas:", error);
    }
};

export const obtenerAreaBrutaHerbicidas = async (idAnalisisHerbicidas, setAreaBrutaHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/areaBrutaHerbicidas/${idAnalisisHerbicidas}`);
        setAreaBrutaHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerAreaBrutaHerbicidas:", error);
    }
};

export const obtenerDiferenciaDeAreaHerbicidas = async (idAnalisisHerbicidas, setDiferenciaDeAreaHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/diferenciaDeAreaHerbicidas/${idAnalisisHerbicidas}`);
        setDiferenciaDeAreaHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerDiferenciaDeAreaHerbicidas:", error);
    }
};

export const obtenerHoraInicioHerbicidas = async (idAnalisisHerbicidas, setHoraInicioHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/horaInicioHerbicidas/${idAnalisisHerbicidas}`);
        setHoraInicioHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerHoraInicioHerbicidas:", error);
    }
};

export const obtenerHoraFinalHerbicidas = async (idAnalisisHerbicidas, setHoraFinalHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/horaFinalHerbicidas/${idAnalisisHerbicidas}`);
        setHoraFinalHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerHoraFinalHerbicidas:", error);
    }
};

export const obtenerTiempoTotalHerbicidas = async (idAnalisisHerbicidas, setTiempoTotalHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/tiempoTotalHerbicidas/${idAnalisisHerbicidas}`);
        setTiempoTotalHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerTiempoTotalHerbicidas:", error);
    }
};

export const obtenerEficienciaHerbicidas = async (idAnalisisHerbicidas,setEficienciaHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/eficienciaHerbicidas/${idAnalisisHerbicidas}`);
        setEficienciaHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerEficienciaHerbicidas:", error);
    }
};

export const obtenerPromedioVelocidadHerbicidas = async (idAnalisisHerbicidas, setPromedioVelocidadHerbicidas) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/promedioVelocidadHerbicidas/${idAnalisisHerbicidas}`);
        setPromedioVelocidadHerbicidas(response.data[0]);
    } catch (error) {
        console.error("Error en obtenerPromedioVelocidadHerbicidas:", error);
    }
};

// Función para parsear valores
export function displayValue(value) {
    if (value === undefined || value === null) {
        return 'N/A';
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

