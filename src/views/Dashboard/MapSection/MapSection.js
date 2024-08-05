import React, { useRef } from 'react';
import Mapping from "../../Mapping/Mapping";
import AerialApplications from "../../Aplicaciones Areas/AerialApplications";
import CommonMap from "../../../components/CommonMap/CommonMap";

const MapSection = ({
                        selectedFile,
                        selectedAnalysisType,
                        datosMapeo,
                        selectedZipFile,
                        processingFinished,
                        ultimoAnalisis,
                        nombreAnalisis,
                        idAnalisisBash,
                        activarEdicionInteractiva,
                        setAreaNetaCm,
                        setAreaBrutaCm,
                        setDiferenciaDeAreaCm,
                        setPorcentajeAreaPilotoCm,
                        setPorcentajeAreaAutoTrackerCm,
                        setPorcentajeModoCortadorBaseCm,
                        setEficienciaCm,
                        setAreaSobreAplicada,
                        setAreaAplicada,
                        setPorcentajeVariacion,
                        setAreaNoAplicada,
                        setPromedioVelocidad,
                        setPromedioAltura,
                        setDosisReal,
                        limpiarMapa,
                        activeLotes,
                        highlightedLote,
                        polygonsData,
                        onLeaveLote,
                        onSelectLote,
                        onHoverLote,
                        closeFilterDialog,
                        isFilterDialogOpen
                    }) => {
    const mapRef = useRef(null);

    const handleAreaCalculation = (polygonArea, outsidePolygonArea, areaDifference, pilotAutoPercentage, autoTracketPercentage) => {

        setAreaNetaCm(`${outsidePolygonArea.toFixed(2)} H`);
        setAreaBrutaCm(`${polygonArea.toFixed(2)} H`);
        setDiferenciaDeAreaCm(`${areaDifference.toFixed(2)} H`);
    };

    const handlePercentageCalculation = (autoTracket, autoPilot, modoCorteBase, totalEfficiency) => {

        setPorcentajeAreaPilotoCm(`${autoPilot.toFixed(2)}%`);
        setPorcentajeAreaAutoTrackerCm(`${autoTracket.toFixed(2)}%`);
        setPorcentajeModoCortadorBaseCm(`${modoCorteBase.toFixed(2)}%`);
        setEficienciaCm(`${totalEfficiency.toFixed(5)} Ha/Hora`);
    };

    const handleAreasCalculated = (areas) => {
        setAreaSobreAplicada(areas.areaSobreAplicada);
        setAreaAplicada(areas.areaAplicada);
        setPorcentajeVariacion(`${areas.porcentajeDeVariacion}%`);
        setAreaNoAplicada(areas.nonAppliedArea);
    };

    const handlePromediosCalculados = (promedios) => {
        setPromedioVelocidad(promedios.promedioVelocidad);
        setPromedioAltura(promedios.promedioAltura);
        setDosisReal(promedios.promedioDosisReal);
    };

    return (
        <section className="map-section">
            {selectedFile && selectedAnalysisType === 'COSECHA_MECANICA' ? (
                <Mapping
                    csvData={datosMapeo}
                    zipFile={selectedZipFile}
                    progressFinish={processingFinished}
                    idAnalisis={ultimoAnalisis()}
                    tipoAnalisis={nombreAnalisis(idAnalisisBash)}
                    onAreaCalculated={handleAreaCalculation}
                    percentageAutoPilot={handlePercentageCalculation}
                    limpiarMapa={limpiarMapa}
                    activeLotes={activeLotes}
                    highlightedLote={highlightedLote}
                    polygonsData={polygonsData}
                    onLeaveLote={onLeaveLote}
                    onSelectLote={onSelectLote}
                    onHoverLote={onHoverLote}
                    closeFilterDialog={closeFilterDialog}
                    isFilterDialogOpen={isFilterDialogOpen}
                />
            ) : selectedZipFile && selectedFile && selectedAnalysisType === 'APLICACIONES_AEREAS' ? (
                <AerialApplications
                    csvData={datosMapeo}
                    zipFile={selectedZipFile}
                    progressFinish={processingFinished}
                    idAnalisis={ultimoAnalisis()}
                    tipoAnalisis={nombreAnalisis(idAnalisisBash)}
                    onAreasCalculated={handleAreasCalculated}
                    onPromediosCalculated={handlePromediosCalculados}
                    activarEdicionInteractiva={activarEdicionInteractiva}
                    limpiarMapa={limpiarMapa}
                    activeLotes={activeLotes}
                    highlightedLote={highlightedLote}
                    polygonsData={polygonsData}
                    onLeaveLote={onLeaveLote}
                    onSelectLote={onSelectLote}
                    onHoverLote={onHoverLote}
                    closeFilterDialog={closeFilterDialog}
                    isFilterDialogOpen={isFilterDialogOpen}
                />
            ) : (
                <CommonMap mapRef={mapRef}
                           activeLotes={activeLotes}
                           highlightedLote={highlightedLote}
                           polygonsData={polygonsData}
                           onLeaveLote={onLeaveLote}
                           onSelectLote={onSelectLote}
                           onHoverLote={onHoverLote}/>
            )}
        </section>
    );
};

export default MapSection;