// src/analysis/cosechaMecanica/cosechaMecanicaDataCards.jsx
import React from 'react';
import DataCard from "../../components/CardData/DataCard";
import {displayValue} from "../../utils/generalUtils";

export const renderCosechaMecanicaDataCards = (validations, datosAnalisis, indicadores) => (
    <>
        {validations.nombreMaquina && <DataCard title="Equipo">{displayValue(datosAnalisis.nombreMaquina)}</DataCard>}
        {validations.areaBrutaCm && <DataCard title="Área Bruta">{displayValue(datosAnalisis.areaBrutaCm)}</DataCard>}
        {validations.horaInicio && <DataCard title="Hora Inicio (H)">{displayValue(datosAnalisis.horaInicio)}</DataCard>}
        {validations.horaFin && <DataCard title="Hora Fin (H)">{displayValue(datosAnalisis.horaFin)}</DataCard>}
        {validations.tiempoTotalActividad && <DataCard title="Tiempo total (H)">{displayValue(datosAnalisis.tiempoTotalActividad)}</DataCard>}
        {validations.consumoCombustible && <DataCard title="Combustible Gal/H">{displayValue(datosAnalisis.consumoCombustible)}</DataCard>}
        {validations.calidadGps && <DataCard title="Calidad GPS">{displayValue(datosAnalisis.calidadGps)}</DataCard>}
        {validations.eficienciaCm && <DataCard title="Eficiencia Ha/Hora">{displayValue(datosAnalisis.eficienciaCm)}</DataCard>}
        {validations.promedioVelocidad && <DataCard title="Velocidad Km/H">{displayValue(datosAnalisis.promedioVelocidad)}</DataCard>}
        {validations.rpm && <DataCard title="RPM">{displayValue(datosAnalisis.rpm)}</DataCard>}
        {validations.tch && <DataCard title="TCH">{displayValue(datosAnalisis.tch)}</DataCard>}
        {validations.tah && <DataCard title="TAH">{displayValue(datosAnalisis.tah)}</DataCard>}
        {validations.presionCortadorBase && <DataCard title="Presión Cortador Base (Bar)">{displayValue(datosAnalisis.presionCortadorBase)}</DataCard>}
        {indicadores.porcentajeAreaPilotoCm && <DataCard title="Piloto Automático">{displayValue(indicadores.porcentajeAreaPilotoCm)}</DataCard>}
        {indicadores.porcentajeAreaAutoTrackerCm && <DataCard title="Auto Tracket">{displayValue(indicadores.porcentajeAreaAutoTrackerCm)}</DataCard>}
        {indicadores.porcentajeModoCortadorBaseCm && <DataCard title="Corte Base">{displayValue(indicadores.porcentajeModoCortadorBaseCm)}</DataCard>}
    </>
);
