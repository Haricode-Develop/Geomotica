import React from 'react';
import DataCard from "../../../components/CardData/DataCard";
import { displayValue } from "../../../utils/Constants";
import {
    DataSectionContainer,
    CardsContainer,
    TableContainer,
    TableHeader,
    StyledTable,
    TableCell,
    TableHeaderCell
} from './DataSectionStyle';

const DataSection = ({
                         selectedAnalysisType,
                         datosCargadosAps,
                         datosCargadosCosechaMecanica,
                         datosCargadosFertilizacion,
                         datosCargadosHerbicidas,
                         ResponsableAps,
                         fechaInicioCosechaAps,
                         fechaFinCosechaAps,
                         nombreOperadorAps,
                         nombreFincaAps,
                         actividadAps,
                         equipoAps,
                         eficienciaAps,
                         codigoParcelasAps,
                         codigoLoresAps,
                         dosisTeorica,
                         productoAps,
                         humedadDelCultivoAps,
                         tchEstimado,
                         promedioAltura,
                         areaSobreAplicada,
                         areaAplicada,
                         porcentajeVariacion,
                         promedioDosisReal,
                         promedioVelocidad,
                         nombreResponsableCm,
                         fechaInicioCosechaCm,
                         fechaFinCosechaCm,
                         nombreFincaCm,
                         codigoParcelaResponsableCm,
                         nombreOperadorCm,
                         nombreMaquinaCm,
                         actividadCm,
                         areaBrutaCm,
                         horaInicioCm,
                         horaFinalCm,
                         tiempoTotalActividadCm,
                         consumoCombustibleCm,
                         calidadGpsCm,
                         eficienciaCm,
                         promedioVelocidadCm,
                         rpmCm,
                         tchCm,
                         tahCm,
                         presionCortadorBase,
                         porcentajeAreaPilotoCm,
                         porcentajeAreaAutoTrackerCm,
                         porcentajeModoCortadorBaseCm,
                         responsableFertilizacion,
                         fechaInicioFertilizacion,
                         fechaFinalFertilizacion,
                         nombreFincaFertilizacion,
                         operadorFertilizacion,
                         equipoFertilizacion,
                         actividadFertilizacion,
                         areaNetaFertilizacion,
                         areaBrutaFertilizacion,
                         diferenciaAreaFertilizacion,
                         horaInicioFertilizacion,
                         horaFinalFertilizacion,
                         tiempoTotalFertilizacion,
                         eficienciaFertilizacion,
                         promedioDosisRealFertilizacion,
                         dosisTeoricaFertilizacion,
                         responsableHerbicidas,
                         fechaHerbicidas,
                         nombreFincaHerbicidas,
                         parcelaHerbicidas,
                         operadorHerbicidas,
                         equipoHerbicidas,
                         actividadHerbicidas,
                         areaNetaHerbicidas,
                         areaBrutaHerbicidas,
                         diferenciaDeAreaHerbicidas,
                         horaInicioHerbicidas,
                         horaFinalHerbicidas,
                         tiempoTotalHerbicidas,
                         eficienciaHerbicidas,
                         promedioVelocidadHerbicidas,
                         esValorValido,
                         codigoLotesAps
                     }) => {
    const tableDetails = {
        responsable: displayValue(ResponsableAps || nombreResponsableCm || responsableFertilizacion || responsableHerbicidas),
        fechaInicio: displayValue(fechaInicioCosechaAps || fechaInicioCosechaCm || fechaInicioFertilizacion || fechaHerbicidas),
        fechaFin: displayValue(fechaFinCosechaAps || fechaFinCosechaCm || fechaFinalFertilizacion),
        nombreFinca: displayValue(nombreFincaAps || nombreFincaCm || nombreFincaFertilizacion || nombreFincaHerbicidas),
        operador: displayValue(nombreOperadorAps || nombreOperadorCm || operadorFertilizacion || operadorHerbicidas),
        actividad: displayValue(actividadAps || actividadCm || actividadFertilizacion || actividadHerbicidas)
    };

    const isValidTableDetails = Object.values(tableDetails).every(esValorValido);

    const renderDataCards = () => {
        if (selectedAnalysisType === 'APLICACIONES_AEREAS') {
            return (
                <>
                    {esValorValido(equipoAps) && <DataCard title="Equipo">{displayValue(equipoAps)}</DataCard>}
                    {esValorValido(eficienciaAps) && <DataCard title="Eficiencia">{displayValue(eficienciaAps)}</DataCard>}
                    {esValorValido(codigoParcelasAps) && <DataCard title="Código Parcelas">{displayValue(codigoParcelasAps)}</DataCard>}
                    {esValorValido(codigoLoresAps) && <DataCard title="Código Lotes">{displayValue(codigoLoresAps)}</DataCard>}
                    {esValorValido(dosisTeorica) && <DataCard title="Dosis Teórica">{displayValue(dosisTeorica)}</DataCard>}
                    {esValorValido(productoAps) && <DataCard title="Producto">{displayValue(productoAps)}</DataCard>}
                    {esValorValido(humedadDelCultivoAps) && <DataCard title="Humedad del Cultivo">{displayValue(humedadDelCultivoAps)}</DataCard>}
                    {esValorValido(tchEstimado) && <DataCard title="TCH Estimado">{displayValue(tchEstimado)}</DataCard>}
                    {esValorValido(promedioAltura) && <DataCard title="Altura">{displayValue(promedioAltura)}</DataCard>}
                    {esValorValido(areaSobreAplicada) && <DataCard title="Área Sobre Aplicada">{displayValue(areaSobreAplicada)} ha</DataCard>}
                    {esValorValido(areaAplicada) && <DataCard title="Área Aplicada">{displayValue(areaAplicada)} ha</DataCard>}
                    {esValorValido(porcentajeVariacion) && <DataCard title="Porcentaje de Variación">{displayValue(porcentajeVariacion)}</DataCard>}
                    {esValorValido(promedioDosisReal) && <DataCard title="Dosis Real">{displayValue(promedioDosisReal)}</DataCard>}
                    {esValorValido(promedioVelocidad) && <DataCard title="Velocidad">{displayValue(promedioVelocidad)}</DataCard>}
                </>
            );
        } else if (selectedAnalysisType === 'COSECHA_MECANICA') {
            return (
                <>
                    {esValorValido(nombreMaquinaCm) && <DataCard title="Equipo">{displayValue(nombreMaquinaCm)}</DataCard>}
                    {esValorValido(areaBrutaCm) && <DataCard title="Área Bruta">{displayValue(areaBrutaCm)}</DataCard>}
                    {esValorValido(horaInicioCm) && <DataCard title="Hora Inicio (H)">{displayValue(horaInicioCm)}</DataCard>}
                    {esValorValido(horaFinalCm) && <DataCard title="Hora Fin (H)">{displayValue(horaFinalCm)}</DataCard>}
                    {esValorValido(tiempoTotalActividadCm) && <DataCard title="Tiempo total (H)">{displayValue(tiempoTotalActividadCm)}</DataCard>}
                    {esValorValido(consumoCombustibleCm) && <DataCard title="Combustible Gal/H">{displayValue(consumoCombustibleCm)}</DataCard>}
                    {esValorValido(calidadGpsCm) && <DataCard title="Calidad GPS">{displayValue(calidadGpsCm)}</DataCard>}
                    {esValorValido(eficienciaCm) && <DataCard title="Eficiencia Ha/Hora">{displayValue(eficienciaCm)}</DataCard>}
                    {esValorValido(promedioVelocidadCm) && <DataCard title="Velocidad Km/H">{displayValue(promedioVelocidadCm)}</DataCard>}
                    {esValorValido(rpmCm) && <DataCard title="RPM">{displayValue(rpmCm)}</DataCard>}
                    {esValorValido(tchCm) && <DataCard title="TCH">{displayValue(tchCm)}</DataCard>}
                    {esValorValido(tahCm) && <DataCard title="TAH">{displayValue(tahCm)}</DataCard>}
                    {esValorValido(presionCortadorBase) && <DataCard title="Presion Cortador Base (Bar)">{displayValue(presionCortadorBase)}</DataCard>}
                    {esValorValido(porcentajeAreaPilotoCm) && <DataCard title="Piloto Automático">{displayValue(porcentajeAreaPilotoCm)}</DataCard>}
                    {esValorValido(porcentajeAreaAutoTrackerCm) && <DataCard title="Auto Tracket">{displayValue(porcentajeAreaAutoTrackerCm)}</DataCard>}
                    {esValorValido(porcentajeModoCortadorBaseCm) && <DataCard title="Corte Base">{displayValue(porcentajeModoCortadorBaseCm)}</DataCard>}
                </>
            );
        } else if (selectedAnalysisType === 'FERTILIZACION') {
            return (
                <>
                    {esValorValido(equipoFertilizacion) && <DataCard title="Equipo">{displayValue(equipoFertilizacion)}</DataCard>}
                    {esValorValido(areaNetaFertilizacion) && <DataCard title="Área Neta">{displayValue(areaNetaFertilizacion)}</DataCard>}
                    {esValorValido(areaBrutaFertilizacion) && <DataCard title="Área Bruta">{displayValue(areaBrutaFertilizacion)}</DataCard>}
                    {esValorValido(diferenciaAreaFertilizacion) && <DataCard title="Diferencia Área">{displayValue(diferenciaAreaFertilizacion)}</DataCard>}
                    {esValorValido(horaInicioFertilizacion) && <DataCard title="Hora Inicio">{displayValue(horaInicioFertilizacion)}</DataCard>}
                    {esValorValido(horaFinalFertilizacion) && <DataCard title="Hora Fin">{displayValue(horaFinalFertilizacion)}</DataCard>}
                    {esValorValido(tiempoTotalFertilizacion) && <DataCard title="Tiempo Total">{displayValue(tiempoTotalFertilizacion)}</DataCard>}
                    {esValorValido(eficienciaFertilizacion) && <DataCard title="Eficiencia">{displayValue(eficienciaFertilizacion)}</DataCard>}
                    {esValorValido(promedioDosisRealFertilizacion) && <DataCard title="Promedio Dosis Real">{displayValue(promedioDosisRealFertilizacion)}</DataCard>}
                    {esValorValido(dosisTeoricaFertilizacion) && <DataCard title="Dosis Teórica">{displayValue(dosisTeoricaFertilizacion)}</DataCard>}
                </>
            );
        } else if (selectedAnalysisType === 'HERBICIDAS') {
            return (
                <>
                    {esValorValido(equipoHerbicidas) && <DataCard title="Equipo">{displayValue(equipoHerbicidas)}</DataCard>}
                    {esValorValido(areaNetaHerbicidas) && <DataCard title="Área Neta">{displayValue(areaNetaHerbicidas)}</DataCard>}
                    {esValorValido(areaBrutaHerbicidas) && <DataCard title="Área Bruta">{displayValue(areaBrutaHerbicidas)}</DataCard>}
                    {esValorValido(diferenciaDeAreaHerbicidas) && <DataCard title="Diferencia De Área">{displayValue(diferenciaDeAreaHerbicidas)}</DataCard>}
                    {esValorValido(horaInicioHerbicidas) && <DataCard title="Hora Inicio">{displayValue(horaInicioHerbicidas)}</DataCard>}
                    {esValorValido(horaFinalHerbicidas) && <DataCard title="Hora Fin">{displayValue(horaFinalHerbicidas)}</DataCard>}
                    {esValorValido(tiempoTotalHerbicidas) && <DataCard title="Tiempo Total">{displayValue(tiempoTotalHerbicidas)}</DataCard>}
                    {esValorValido(eficienciaHerbicidas) && <DataCard title="Eficiencia">{displayValue(eficienciaHerbicidas)}</DataCard>}
                    {esValorValido(promedioVelocidadHerbicidas) && <DataCard title="Promedio Velocidad">{displayValue(promedioVelocidadHerbicidas)}</DataCard>}
                </>
            );
        }
    };

    return (
        <DataSectionContainer>
            {isValidTableDetails && (
                <TableContainer>
                    <TableHeader>Details</TableHeader>
                    <StyledTable>
                        <thead>
                        <tr>
                            <TableHeaderCell>Responsable</TableHeaderCell>
                            <TableHeaderCell>Fecha Inicio</TableHeaderCell>
                            <TableHeaderCell>Fecha Fin</TableHeaderCell>
                            <TableHeaderCell>Nombre Finca</TableHeaderCell>
                            <TableHeaderCell>Operador</TableHeaderCell>
                            <TableHeaderCell>Actividad</TableHeaderCell>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <TableCell>{tableDetails.responsable}</TableCell>
                            <TableCell>{tableDetails.fechaInicio}</TableCell>
                            <TableCell>{tableDetails.fechaFin}</TableCell>
                            <TableCell>{tableDetails.nombreFinca}</TableCell>
                            <TableCell>{tableDetails.operador}</TableCell>
                            <TableCell>{tableDetails.actividad}</TableCell>
                        </tr>
                        </tbody>
                    </StyledTable>
                </TableContainer>
            )}
            <CardsContainer>
                {renderDataCards()}
            </CardsContainer>
        </DataSectionContainer>
    );
};

export default DataSection;