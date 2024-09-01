// src/analysis/aps/apsValidations.jsx
export const validateApsData = (datosAnalisis) => ({
    codigoEquipo: datosAnalisis.codigoEquipo && datosAnalisis.codigoEquipo !== '',
    eficiencia: datosAnalisis.eficiencia && datosAnalisis.eficiencia !== 0,
    codigoLote: datosAnalisis.codigoLote && datosAnalisis.codigoLote !== '',
    dosisTeorica: datosAnalisis.dosisTeorica && datosAnalisis.dosisTeorica !== 0,
    productoAps: datosAnalisis.productoAps && datosAnalisis.productoAps !== '',
    humedadDelCultivo: datosAnalisis.humedadDelCultivo && datosAnalisis.humedadDelCultivo !== 0,
    tchEstimado: datosAnalisis.tchEstimado && datosAnalisis.tchEstimado !== 0,
    tiempoTotal: datosAnalisis.tiempoTotal && datosAnalisis.tiempoTotal !== 0
});
