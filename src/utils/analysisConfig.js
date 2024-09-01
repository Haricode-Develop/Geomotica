// src/utils/analysisConfig.js

import {
    fetchDataCosechaMecanica,
    shouldEnableExecBashCosechaMecanica,
    cargaDatosCosechaMecanica,
    fetchDataCosechaMecanicaIndicators
} from "../analysis/cosechaMecanica/cosechaMecanicaFetchData";

import {
    fetchDataAps,
    shouldEnableExecBashAps,
    cargaDatosAps,
    fetchDataApsIndicators
} from "../analysis/aps/apsFetchData";

import {
    fetchDataHerbicidas,
    shouldEnableExecBashHerbicidas,
    cargaDatosHerbicidas
} from "../analysis/herbicidas/herbicidasFetchData";

import {
    fetchDataFertilizacion,
    shouldEnableExecBashFertilizacion,
    cargaDatosFertilizacion
} from "../analysis/fertilizacion/fertilizacionFetchData";

import {
    fetchDataConteoPalma,
    shouldEnableExecBashConteoPalmas
} from "../analysis/conteoPalmas/conteoPalmasFetch";

const analysisConfig = {
    APLICACIONES_AEREAS: {
        id: 1,
        fetchData: fetchDataAps,
        fetchDataIndicators: fetchDataApsIndicators,
        cargaDatos: cargaDatosAps,
        shouldEnableExecBash: shouldEnableExecBashAps,
        templatePath: "/templates/APLICACIONES_AEREAS.csv",
    },
    COSECHA_MECANICA: {
        id: 2,
        fetchData: fetchDataCosechaMecanica,
        fetchDataIndicators: fetchDataCosechaMecanicaIndicators,
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
        fetchData: fetchDataConteoPalma,
    },
};

export default analysisConfig;
