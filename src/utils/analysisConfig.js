// src/utils/analysisConfig.js

import { fetchDataCosechaMecanica, shouldEnableExecBashCosechaMecanica, cargaDatosCosechaMecanica } from "../analysis/cosechaMecanica/cosechaMecanicaFetchData";
import { fetchDataAps, shouldEnableExecBashAps, cargaDatosAps } from "../analysis/aps/apsFetchData";
import { fetchDataHerbicidas, shouldEnableExecBashHerbicidas, cargaDatosHerbicidas } from "../analysis/herbicidas/herbicidasFetchData";
import { fetchDataFertilizacion, shouldEnableExecBashFertilizacion, cargaDatosFertilizacion } from "../analysis/fertilizacion/fertilizacionFetchData";
import { shouldEnableExecBashConteoPalmas } from "../analysis/conteoPalmas/conteoPalmasFetch";

const analysisConfig = {
    APLICACIONES_AEREAS: {
        id: 1,
        fetchData: fetchDataAps,
        cargaDatos: cargaDatosAps,
        shouldEnableExecBash: shouldEnableExecBashAps,
        templatePath: "/templates/APLICACIONES_AEREAS.csv",
    },
    COSECHA_MECANICA: {
        id: 2,
        fetchData: fetchDataCosechaMecanica,
        cargaDatos: cargaDatosCosechaMecanica,
        shouldEnableExecBash: shouldEnableExecBashCosechaMecanica,
        templatePath: "/templates/COSECHA_MECANICA.csv",
    },
    FERTILIZACION: {
        id: 4,
        fetchData: fetchDataFertilizacion,
        cargaDatos: cargaDatosFertilizacion,
        shouldEnableExecBash: shouldEnableExecBashFertilizacion,
        templatePath: "/templates/FERTILIZACION.csv",
    },
    HERBICIDAS: {
        id: 3,
        fetchData: fetchDataHerbicidas,
        cargaDatos: cargaDatosHerbicidas,
        shouldEnableExecBash: shouldEnableExecBashHerbicidas,
        templatePath: "/templates/HERBICIDAS.csv",
    },
    CONTEO_PALMA: {
        id: 5,
        shouldEnableExecBash: shouldEnableExecBashConteoPalmas,
    },
};

export default analysisConfig;
