import React, { useEffect } from 'react';
import DataCard from "../../../components/CardData/DataCard";
import { displayValue } from "../../../utils/Constants";
import {
    DataSectionContainer,
    CardsContainer,
    TableContainer,
    TableHeader,
    StyledTable,
    TableCell,
    TableHeaderCell,
    FloatingCard,
    CountText,
    IconContainer,
    CardTitle
} from './DataSectionStyle';
import IconButton from '@mui/material/IconButton';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
const DataSection = ({
                         selectedAnalysisType,
                         promedioAltura,
                         areaSobreAplicada,
                         areaAplicada,
                         porcentajeVariacion,
                         promedioDosisReal,
                         promedioVelocidad,
                         areaBrutaCm,
                         eficienciaCm,
                         promedioVelocidadCm,
                         porcentajeAreaPilotoCm,
                         porcentajeAreaAutoTrackerCm,
                         porcentajeModoCortadorBaseCm,
                         esValorValido,
                         setIndicadores,
                         datosAnalisis,
                         conteoPalmas
                     }) => {
    const tableDetails = {
        responsable: displayValue(datosAnalisis.responsable),
        fechaInicio: displayValue(datosAnalisis.fechaInicioCosecha || datosAnalisis.fechaInicio || datosAnalisis.fecha),
        fechaFin: displayValue(datosAnalisis.fechaFinCosecha || datosAnalisis.fechaFinal),
        nombreFinca: displayValue(datosAnalisis.nombreFinca),
        operador: displayValue(datosAnalisis.nombreOperador || datosAnalisis.operador),
        actividad: displayValue(datosAnalisis.actividad),
    };

    // useEffect para detectar cuando los datos están completos
    useEffect(() => {
        if (datosAnalisis && Object.keys(datosAnalisis).length > 0) {
            let datos = {};
            switch (selectedAnalysisType) {
                case 'APLICACIONES_AEREAS':
                    datos = {
                        analisis: "Aplicaciones Aéreas",
                        ...datosAnalisis,
                        indicadores: {
                            equipo: datosAnalisis.codigoEquipo,
                            eficiencia: datosAnalisis.eficiencia,
                            codigoLote: datosAnalisis.codigoLote,
                            dosisTeorica: datosAnalisis.dosisTeorica,
                            producto: datosAnalisis.productoAps,
                            humedadCultivo: datosAnalisis.humedadDelCultivo,
                            tchEstimado: datosAnalisis.tchEstimado,
                            promedioAltura,
                            areaSobreAplicada,
                            areaAplicada,
                            porcentajeVariacion,
                            promedioDosisReal,
                            promedioVelocidad,
                            tiempoTotal: datosAnalisis.tiempoTotal
                        }
                    };
                    break;
                case 'COSECHA_MECANICA':
                    datos = {
                        analisis: "Cosecha Mecánica",
                        ...datosAnalisis,
                        indicadores: {
                            nombreMaquina: datosAnalisis.nombreMaquina,
                            areaBrutaCm,
                            horaInicio: datosAnalisis.horaInicio,
                            horaFin: datosAnalisis.horaFin,
                            tiempoTotalActividad: datosAnalisis.tiempoTotalActividad,
                            consumoCombustible: datosAnalisis.consumoCombustible,
                            calidadGps: datosAnalisis.calidadGps,
                            eficienciaCm,
                            promedioVelocidadCm,
                            rpmCm: datosAnalisis.rpm,
                            tchCm: datosAnalisis.tch,
                            tahCm: datosAnalisis.tah,
                            presionCortadorBase: datosAnalisis.presionCortadorBase,
                            porcentajeAreaPilotoCm,
                            porcentajeAreaAutoTrackerCm,
                            porcentajeModoCortadorBaseCm,
                        }
                    };
                    break;
                case 'FERTILIZACION':
                    datos = {
                        analisis: "Fertilización",
                        ...datosAnalisis,
                        indicadores: {
                            equipo: datosAnalisis.equipo,
                            areaNeta: datosAnalisis.areaNeta,
                            areaBruta: datosAnalisis.areaBruta,
                            diferenciaArea: datosAnalisis.diferenciaArea,
                            horaInicio: datosAnalisis.horaInicio,
                            horaFinal: datosAnalisis.horaFinal,
                            tiempoTotal: datosAnalisis.tiempoTotal,
                            eficiencia: datosAnalisis.eficiencia,
                            promedioDosisReal: datosAnalisis.promedioDosisReal,
                            dosisTeorica: datosAnalisis.dosisTeorica,
                        }
                    };
                    break;
                case 'HERBICIDAS':
                    datos = {
                        analisis: "Herbicidas",
                        ...datosAnalisis,
                        indicadores: {
                            equipo: datosAnalisis.equipo,
                            areaNeta: datosAnalisis.areaNeta,
                            areaBruta: datosAnalisis.areaBruta,
                            diferenciaDeArea: datosAnalisis.diferenciaDeArea,
                            horaInicio: datosAnalisis.horaInicio,
                            horaFinal: datosAnalisis.horaFinal,
                            tiempoTotal: datosAnalisis.tiempoTotal,
                            eficiencia: datosAnalisis.eficiencia,
                            promedioVelocidad: datosAnalisis.promedioVelocidad,
                        }
                    };
                    break;
                default:
                    datos = {};
                    break;
            }
            setIndicadores(datos);
        }
    }, [
        selectedAnalysisType,
        datosAnalisis,
        promedioAltura,
        areaSobreAplicada,
        areaAplicada,
        porcentajeVariacion,
        promedioDosisReal,
        promedioVelocidad,
        areaBrutaCm,
        eficienciaCm,
        promedioVelocidadCm,
        porcentajeAreaPilotoCm,
        porcentajeAreaAutoTrackerCm,
        porcentajeModoCortadorBaseCm
    ]);

    const isValidTableDetails = Object.values(tableDetails).every(esValorValido);

    const renderDataCards = () => {
        switch (selectedAnalysisType) {
            case 'APLICACIONES_AEREAS':
                return (
                    <>
                        {esValorValido(datosAnalisis.codigoEquipo) && <DataCard title="Equipo">{displayValue(datosAnalisis.codigoEquipo)}</DataCard>}
                        {esValorValido(datosAnalisis.eficiencia) && <DataCard title="Eficiencia">{displayValue(datosAnalisis.eficiencia)}</DataCard>}
                        {esValorValido(datosAnalisis.codigoLote) && <DataCard title="Código Lote">{displayValue(datosAnalisis.codigoLote)}</DataCard>}
                        {esValorValido(datosAnalisis.dosisTeorica) && <DataCard title="Dosis Teórica">{displayValue(datosAnalisis.dosisTeorica)}</DataCard>}
                        {esValorValido(datosAnalisis.productoAps) && <DataCard title="Producto">{displayValue(datosAnalisis.productoAps)}</DataCard>}
                        {esValorValido(datosAnalisis.humedadDelCultivo) && <DataCard title="Humedad del Cultivo">{displayValue(datosAnalisis.humedadDelCultivo)}</DataCard>}
                        {esValorValido(datosAnalisis.tchEstimado) && <DataCard title="TCH Estimado">{displayValue(datosAnalisis.tchEstimado)}</DataCard>}
                        {esValorValido(promedioAltura) && <DataCard title="Altura">{displayValue(promedioAltura)}</DataCard>}
                        {esValorValido(areaSobreAplicada) && <DataCard title="Área Sobre Aplicada">{displayValue(areaSobreAplicada)} ha</DataCard>}
                        {esValorValido(areaAplicada) && <DataCard title="Área Aplicada">{displayValue(areaAplicada)} ha</DataCard>}
                        {esValorValido(porcentajeVariacion) && <DataCard title="Porcentaje de Variación">{displayValue(porcentajeVariacion)}</DataCard>}
                        {esValorValido(promedioDosisReal) && <DataCard title="Dosis Real">{displayValue(promedioDosisReal)}</DataCard>}
                        {esValorValido(promedioVelocidad) && <DataCard title="Velocidad">{displayValue(promedioVelocidad)}</DataCard>}
                        {esValorValido(datosAnalisis.tiempoTotal) && <DataCard title="Tiempo Total">{displayValue(datosAnalisis.tiempoTotal)} hrs</DataCard>}
                    </>
                );
            case 'COSECHA_MECANICA':
                return (
                    <>
                        {esValorValido(datosAnalisis.nombreMaquina) && <DataCard title="Equipo">{displayValue(datosAnalisis.nombreMaquina)}</DataCard>}
                        {esValorValido(areaBrutaCm) && <DataCard title="Área Bruta">{displayValue(areaBrutaCm)}</DataCard>}
                        {esValorValido(datosAnalisis.horaInicio) && <DataCard title="Hora Inicio (H)">{displayValue(datosAnalisis.horaInicio)}</DataCard>}
                        {esValorValido(datosAnalisis.horaFin) && <DataCard title="Hora Fin (H)">{displayValue(datosAnalisis.horaFin)}</DataCard>}
                        {esValorValido(datosAnalisis.tiempoTotalActividad) && <DataCard title="Tiempo total (H)">{displayValue(datosAnalisis.tiempoTotalActividad)}</DataCard>}
                        {esValorValido(datosAnalisis.consumoCombustible) && <DataCard title="Combustible Gal/H">{displayValue(datosAnalisis.consumoCombustible)}</DataCard>}
                        {esValorValido(datosAnalisis.calidadGps) && <DataCard title="Calidad GPS">{displayValue(datosAnalisis.calidadGps)}</DataCard>}
                        {esValorValido(eficienciaCm) && <DataCard title="Eficiencia Ha/Hora">{displayValue(eficienciaCm)}</DataCard>}
                        {esValorValido(promedioVelocidadCm) && <DataCard title="Velocidad Km/H">{displayValue(promedioVelocidadCm)}</DataCard>}
                        {esValorValido(datosAnalisis.rpm) && <DataCard title="RPM">{displayValue(datosAnalisis.rpm)}</DataCard>}
                        {esValorValido(datosAnalisis.tch) && <DataCard title="TCH">{displayValue(datosAnalisis.tch)}</DataCard>}
                        {esValorValido(datosAnalisis.tah) && <DataCard title="TAH">{displayValue(datosAnalisis.tah)}</DataCard>}
                        {esValorValido(datosAnalisis.presionCortadorBase) && <DataCard title="Presión Cortador Base (Bar)">{displayValue(datosAnalisis.presionCortadorBase)}</DataCard>}
                        {esValorValido(porcentajeAreaPilotoCm) && <DataCard title="Piloto Automático">{displayValue(porcentajeAreaPilotoCm)}</DataCard>}
                        {esValorValido(porcentajeAreaAutoTrackerCm) && <DataCard title="Auto Tracket">{displayValue(porcentajeAreaAutoTrackerCm)}</DataCard>}
                        {esValorValido(porcentajeModoCortadorBaseCm) && <DataCard title="Corte Base">{displayValue(porcentajeModoCortadorBaseCm)}</DataCard>}
                    </>
                );
            case 'FERTILIZACION':
                return (
                    <>
                        {esValorValido(datosAnalisis.equipo) && <DataCard title="Equipo">{displayValue(datosAnalisis.equipo)}</DataCard>}
                        {esValorValido(datosAnalisis.areaNeta) && <DataCard title="Área Neta">{displayValue(datosAnalisis.areaNeta)}</DataCard>}
                        {esValorValido(datosAnalisis.areaBruta) && <DataCard title="Área Bruta">{displayValue(datosAnalisis.areaBruta)}</DataCard>}
                        {esValorValido(datosAnalisis.diferenciaArea) && <DataCard title="Diferencia Área">{displayValue(datosAnalisis.diferenciaArea)}</DataCard>}
                        {esValorValido(datosAnalisis.horaInicio) && <DataCard title="Hora Inicio">{displayValue(datosAnalisis.horaInicio)}</DataCard>}
                        {esValorValido(datosAnalisis.horaFinal) && <DataCard title="Hora Fin">{displayValue(datosAnalisis.horaFinal)}</DataCard>}
                        {esValorValido(datosAnalisis.tiempoTotal) && <DataCard title="Tiempo Total">{displayValue(datosAnalisis.tiempoTotal)}</DataCard>}
                        {esValorValido(datosAnalisis.eficiencia) && <DataCard title="Eficiencia">{displayValue(datosAnalisis.eficiencia)}</DataCard>}
                        {esValorValido(datosAnalisis.promedioDosisReal) && <DataCard title="Promedio Dosis Real">{displayValue(datosAnalisis.promedioDosisReal)}</DataCard>}
                        {esValorValido(datosAnalisis.dosisTeorica) && <DataCard title="Dosis Teórica">{displayValue(datosAnalisis.dosisTeorica)}</DataCard>}
                    </>
                );
            case 'HERBICIDAS':
                return (
                    <>
                        {esValorValido(datosAnalisis.equipo) && <DataCard title="Equipo">{displayValue(datosAnalisis.equipo)}</DataCard>}
                        {esValorValido(datosAnalisis.areaNeta) && <DataCard title="Área Neta">{displayValue(datosAnalisis.areaNeta)}</DataCard>}
                        {esValorValido(datosAnalisis.areaBruta) && <DataCard title="Área Bruta">{displayValue(datosAnalisis.areaBruta)}</DataCard>}
                        {esValorValido(datosAnalisis.diferenciaDeArea) && <DataCard title="Diferencia De Área">{displayValue(datosAnalisis.diferenciaDeArea)}</DataCard>}
                        {esValorValido(datosAnalisis.horaInicio) && <DataCard title="Hora Inicio">{displayValue(datosAnalisis.horaInicio)}</DataCard>}
                        {esValorValido(datosAnalisis.horaFinal) && <DataCard title="Hora Fin">{displayValue(datosAnalisis.horaFinal)}</DataCard>}
                        {esValorValido(datosAnalisis.tiempoTotal) && <DataCard title="Tiempo Total">{displayValue(datosAnalisis.tiempoTotal)}</DataCard>}
                        {esValorValido(datosAnalisis.eficiencia) && <DataCard title="Eficiencia">{displayValue(datosAnalisis.eficiencia)}</DataCard>}
                        {esValorValido(datosAnalisis.promedioVelocidad) && <DataCard title="Promedio Velocidad">{displayValue(datosAnalisis.promedioVelocidad)}</DataCard>}
                    </>
                );
            case 'CONTEO_PALMA':
                return (
                    <FloatingCard>
                        <IconContainer>
                            <EmojiNatureIcon sx={{ fontSize: '4rem', color: '#004d40' }} />
                        </IconContainer>
                        <CardTitle>Censo de palma</CardTitle>
                        <CountText>{displayValue(conteoPalmas)}</CountText>
                    </FloatingCard>
                );
            default:
                return null;
        }
    };

    return (
        <DataSectionContainer>
            {selectedAnalysisType !== 'CONTEO_PALMA' && isValidTableDetails && (
                <TableContainer>
                    <TableHeader>Detalles</TableHeader>
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
