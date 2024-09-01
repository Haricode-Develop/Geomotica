import React from 'react';
import DataCard from "../../components/CardData/DataCard";
import { displayValue } from "../../utils/generalUtils";

export const renderApsDataCards = (validations, datosAnalisis, indicadores) => (
    <>
        {validations.codigoEquipo && (
            <DataCard title="Equipo">{displayValue(datosAnalisis.codigoEquipo)}</DataCard>
        )}
        {validations.eficiencia && (
            <DataCard title="Eficiencia">{displayValue(datosAnalisis.eficiencia)}</DataCard>
        )}
        {validations.codigoFinca && (
            <DataCard title="Código Finca">{displayValue(datosAnalisis.codigoFinca)}</DataCard>
        )}
        {validations.codigoLote && (
            <DataCard title="Código Lote">{displayValue(datosAnalisis.codigoLote)}</DataCard>
        )}
        {validations.dosisTeorica && (
            <DataCard title="Dosis Teórica">{displayValue(datosAnalisis.dosisTeorica)}</DataCard>
        )}
        {validations.productoAps && (
            <DataCard title="Producto">{displayValue(datosAnalisis.productoAps)}</DataCard>
        )}
        {validations.humedadDelCultivo && (
            <DataCard title="Humedad del Cultivo">{displayValue(datosAnalisis.humedadDelCultivo)}</DataCard>
        )}
        {validations.tchEstimado && (
            <DataCard title="TCH Estimado">{displayValue(datosAnalisis.tchEstimado)}</DataCard>
        )}
        {validations.tiempoTotal && (
            <DataCard title="Tiempo Total">{displayValue(datosAnalisis.tiempoTotal)} hrs</DataCard>
        )}
        {indicadores.promedioAltura !== undefined && indicadores.promedioAltura !== null && (
            <DataCard title="Altura">{displayValue(indicadores.promedioAltura)}</DataCard>
        )}
        {indicadores.areaSobreAplicada !== undefined && indicadores.areaSobreAplicada !== null && (
            <DataCard title="Área Sobre Aplicada">{displayValue(indicadores.areaSobreAplicada)} ha</DataCard>
        )}
        {indicadores.areaAplicada !== undefined && indicadores.areaAplicada !== null && (
            <DataCard title="Área Aplicada">{displayValue(indicadores.areaAplicada)} ha</DataCard>
        )}
        {indicadores.porcentajeVariacion !== undefined && indicadores.porcentajeVariacion !== null && (
            <DataCard title="Porcentaje de Variación">{displayValue(indicadores.porcentajeVariacion)}</DataCard>
        )}
        {indicadores.promedioDosisReal !== undefined && indicadores.promedioDosisReal !== null && (
            <DataCard title="Dosis Real">{displayValue(indicadores.promedioDosisReal)}</DataCard>
        )}
        {indicadores.promedioVelocidad !== undefined && indicadores.promedioVelocidad !== null && (
            <DataCard title="Velocidad">{displayValue(indicadores.promedioVelocidad)}</DataCard>
        )}
    </>
);
