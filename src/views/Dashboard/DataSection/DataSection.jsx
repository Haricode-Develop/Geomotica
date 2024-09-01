import React, { useEffect } from 'react';
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
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';

import {processApsData} from "../../../analysis/aps/apsFetchData";
import { validateApsData } from "../../../analysis/aps/apsValidations";
import { renderApsDataCards } from "../../../analysis/aps/apsDataCards";

import {processCosechaMecanicaData} from "../../../analysis/cosechaMecanica/cosechaMecanicaFetchData";
import { validateCosechaMecanicaData } from "../../../analysis/cosechaMecanica/cosechaMecanicaValidations";
import { renderCosechaMecanicaDataCards } from "../../../analysis/cosechaMecanica/cosechaMecanicaDataCards";

import { validateConteoPalmasData } from "../../../analysis/conteoPalmas/conteoPalmasValidation";
import { renderConteoPalmasDataCards } from "../../../analysis/conteoPalmas/conteoPalmasDataCards";


import {displayValue} from "../../../utils/generalUtils";
import {isObjectEmptyOrFalsy} from "../../../utils/generalUtils";
import {processConteoPalmasData} from "../../../analysis/conteoPalmas/conteoPalmasFetch";

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
    useEffect(() => {
        if (datosAnalisis && Object.keys(datosAnalisis).length > 0) {
            let datos = {};
            let validations = {};
            console.log("ESTE ES EL SELECTED ANALYSIS TYPE: ", selectedAnalysisType);
            switch (selectedAnalysisType) {
                case 'APLICACIONES_AEREAS':
                    validations = validateApsData(datosAnalisis);
                    datos = processApsData(datosAnalisis, {
                        promedioAltura,
                        areaSobreAplicada,
                        areaAplicada,
                        porcentajeVariacion,
                        promedioDosisReal,
                        promedioVelocidad,
                    });
                    break;
                case 'COSECHA_MECANICA':
                    validations = validateCosechaMecanicaData(datosAnalisis);
                    datos = processCosechaMecanicaData(datosAnalisis, {
                        areaBrutaCm,
                        eficienciaCm,
                        promedioVelocidadCm,
                        porcentajeAreaPilotoCm,
                        porcentajeAreaAutoTrackerCm,
                        porcentajeModoCortadorBaseCm,
                    });
                    break;
                case 'CONTEO_PALMA':
                    validations = validateConteoPalmasData(datosAnalisis);
                    datos = processConteoPalmasData(datosAnalisis, {
                        conteoPalmas
                    });
                    console.log("ESTOS SON LOS DATOS PARA CONTEO DE PALMAS: ", datos);
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

    const tableDetails = {

        responsable: displayValue(datosAnalisis.nombreResponsable),
        fechaInicio: displayValue(datosAnalisis.fechaInicio || datosAnalisis.fecha),
        fechaFin: displayValue(datosAnalisis.fechaFin),
        nombreFinca: displayValue(datosAnalisis.nombreFinca),
        operador: displayValue(datosAnalisis.nombreOperador || datosAnalisis.operador),
        actividad: displayValue(datosAnalisis.actividad),
    };

    const renderDataCards = () => {
        switch (selectedAnalysisType) {
            case 'APLICACIONES_AEREAS':
                const apsValidations = validateApsData(datosAnalisis);
                const isApsDataEmpty = isObjectEmptyOrFalsy(datosAnalisis);
                const areApsIndicatorsEmpty = isObjectEmptyOrFalsy({
                    promedioAltura,
                    areaSobreAplicada,
                    areaAplicada,
                    porcentajeVariacion,
                    promedioDosisReal,
                    promedioVelocidad,
                });

                if (isApsDataEmpty && areApsIndicatorsEmpty) {
                    return null;
                }

                return renderApsDataCards(apsValidations, datosAnalisis, {
                    promedioAltura,
                    areaSobreAplicada,
                    areaAplicada,
                    porcentajeVariacion,
                    promedioDosisReal,
                    promedioVelocidad,
                });

            case 'COSECHA_MECANICA':
                const cosechaValidations = validateCosechaMecanicaData(datosAnalisis);
                const isCosechaDataEmpty = isObjectEmptyOrFalsy(datosAnalisis);
                const areCosechaIndicatorsEmpty = isObjectEmptyOrFalsy({
                    areaBrutaCm,
                    eficienciaCm,
                    promedioVelocidadCm,
                    porcentajeAreaPilotoCm,
                    porcentajeAreaAutoTrackerCm,
                    porcentajeModoCortadorBaseCm,
                });

                if (isCosechaDataEmpty && areCosechaIndicatorsEmpty) {
                    return null;
                }

                console.log("ESTOS SON LOS DE COSECHA VALIDATIONS: ", cosechaValidations);
                console.log("ESTOS SON LOS DATOS DEL ANALISIS: ", datosAnalisis);

                return renderCosechaMecanicaDataCards(cosechaValidations, datosAnalisis, {
                    areaBrutaCm,
                    eficienciaCm,
                    promedioVelocidadCm,
                    porcentajeAreaPilotoCm,
                    porcentajeAreaAutoTrackerCm,
                    porcentajeModoCortadorBaseCm,
                });

            case 'CONTEO_PALMA':
                const conteoPalmasValidations = validateConteoPalmasData(datosAnalisis);
                const isConteoPalmasDataEmpty = isObjectEmptyOrFalsy(datosAnalisis);
                const areConteoPalmasIndicatorsEmpty = isObjectEmptyOrFalsy({
                    conteoPalmas
                });

                if (isConteoPalmasDataEmpty && areConteoPalmasIndicatorsEmpty) {
                    return null;
                }

                return renderConteoPalmasDataCards(conteoPalmasValidations, datosAnalisis, {
                    conteoPalmas
                });

            default:
                return null;
        }
    };



    return (
        <DataSectionContainer>
            {selectedAnalysisType !== 'CONTEO_PALMA' && (
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
