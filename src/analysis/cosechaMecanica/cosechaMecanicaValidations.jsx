export const validateCosechaMecanicaData = (datosAnalisis) => ({
    nombreMaquina: datosAnalisis.nombreMaquina && datosAnalisis.nombreMaquina !== '',
    areaBrutaCm: datosAnalisis.areaBrutaCm && datosAnalisis.areaBrutaCm !== 0,
    horaInicio: datosAnalisis.horaInicio && datosAnalisis.horaInicio !== '',
    horaFin: datosAnalisis.horaFin && datosAnalisis.horaFin !== '',
    tiempoTotalActividad: datosAnalisis.tiempoTotalActividad && datosAnalisis.tiempoTotalActividad !== 0,
    consumoCombustible: datosAnalisis.consumoCombustible && datosAnalisis.consumoCombustible !== 0,
    calidadGps: datosAnalisis.calidadGps && datosAnalisis.calidadGps !== 0,
    eficiencia: datosAnalisis.eficiencia && datosAnalisis.eficiencia !== 0,
    promedioVelocidad: datosAnalisis.promedioVelocidad && datosAnalisis.promedioVelocidad !== 0,
    rpm: datosAnalisis.rpm && datosAnalisis.rpm !== 0,
    tch: datosAnalisis.tch && datosAnalisis.tch !== 0,
    tah: datosAnalisis.tah && datosAnalisis.tah !== 0,
    presionCortadorBase: datosAnalisis.presionCortadorBase && datosAnalisis.presionCortadorBase !== 0
});
