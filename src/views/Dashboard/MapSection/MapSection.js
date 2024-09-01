import React, { useEffect, useRef, useState } from 'react';
import Mapping from "../../Mapping/Mapping";
import AerialApplications from "../../Aplicaciones Areas/AerialApplications";
import CommonMap from "../../../components/CommonMap/CommonMap";
import PalmsCount from "../../../Mappings/PalmsCount";

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
                        activeLotes = [],
                        highlightedLote,
                        polygonsData = [],
                        onLeaveLote,
                        onSelectLote,
                        onHoverLote,
                        closeFilterDialog,
                        isFilterDialogOpen,
                        setImgLaflet,
                        imageUrl = '',
                        northWestCoords = 0,
                        southEastCoords = 0,
                        isAnalysisPerformed,
                        mapRef
                    }) => {
    const [nombreAnalisisMapeo, setNombreAnalisisMapeo] = useState('');
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [commonMapElement, setCommonMapElement] = useState(null); // Guardar la instancia de CommonMap

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            // Renderizar y guardar la instancia de CommonMap
            setCommonMapElement(
                <CommonMap
                    mapRef={mapRef}
                    activeLotes={activeLotes}
                    highlightedLote={highlightedLote}
                    polygonsData={polygonsData}
                    onLeaveLote={onLeaveLote}
                    onSelectLote={onSelectLote}
                    onHoverLote={onHoverLote}
                    setImgLaflet={setImgLaflet}
                />
            );
        }
    }, [isFirstRender]); // Este efecto solo se ejecuta una vez al inicio

    useEffect(() => {
        try {
            setNombreAnalisisMapeo(nombreAnalisis(idAnalisisBash));
        } catch (error) {
            console.error("Error en useEffect nombreAnalisisMapeo:", error);
        }
    }, [idAnalisisBash]);

    const handleAreaCalculation = (polygonArea, outsidePolygonArea, areaDifference) => {
        try {
            setAreaNetaCm(`${outsidePolygonArea.toFixed(2)} H`);
            setAreaBrutaCm(`${polygonArea.toFixed(2)} H`);
            setDiferenciaDeAreaCm(`${areaDifference.toFixed(2)} H`);
        } catch (error) {
            console.error("Error en handleAreaCalculation:", error);
        }
    };

    const handlePercentageCalculation = (autoTracket, autoPilot, modoCorteBase, totalEfficiency) => {
        try {
            setPorcentajeAreaPilotoCm(`${autoPilot.toFixed(2)}%`);
            setPorcentajeAreaAutoTrackerCm(`${autoTracket.toFixed(2)}%`);
            setPorcentajeModoCortadorBaseCm(`${modoCorteBase.toFixed(2)}%`);
            setEficienciaCm(`${totalEfficiency.toFixed(2)} Ha/Hora`);
        } catch (error) {
            console.error("Error en handlePercentageCalculation:", error);
        }
    };

    const handleAreasCalculated = (areas) => {
        try {
            setAreaSobreAplicada(areas.areaSobreAplicada || 0);
            setAreaAplicada(areas.areaAplicada || 0);
            setPorcentajeVariacion(`${areas.porcentajeDeVariacion || 0}%`);
            setAreaNoAplicada(areas.nonAppliedArea || 0);
        } catch (error) {
            console.error("Error en handleAreasCalculated:", error);
        }
    };

    const handlePromediosCalculados = (promedios) => {
        try {
            setPromedioVelocidad(promedios.promedioVelocidad || 0);
            setPromedioAltura(promedios.promedioAltura || 0);
            setDosisReal(promedios.promedioDosisReal || 0);
        } catch (error) {
            console.error("Error en handlePromediosCalculados:", error);
        }
    };

    return (
        <section className="map-section">
            {isAnalysisPerformed && selectedFile && selectedAnalysisType === 'COSECHA_MECANICA' ? (
                <Mapping
                    csvData={datosMapeo}
                    zipFile={selectedZipFile}
                    progressFinish={processingFinished}
                    idAnalisis={ultimoAnalisis}
                    tipoAnalisis={nombreAnalisisMapeo}
                    onAreaCalculated={handleAreaCalculation}
                    percentageAutoPilot={handlePercentageCalculation}
                    activeLotes={activeLotes}
                    highlightedLote={highlightedLote}
                    polygonsData={polygonsData}
                    onLeaveLote={onLeaveLote}
                    onSelectLote={onSelectLote}
                    onHoverLote={onHoverLote}
                    closeFilterDialog={closeFilterDialog}
                    isFilterDialogOpen={isFilterDialogOpen}
                    setImgLaflet={setImgLaflet}
                    mapRef={mapRef}
                />
            ) : isAnalysisPerformed && selectedZipFile && selectedFile && selectedAnalysisType === 'APLICACIONES_AEREAS' ? (
                <AerialApplications
                    csvData={datosMapeo}
                    zipFile={selectedZipFile}
                    progressFinish={processingFinished}
                    idAnalisis={ultimoAnalisis}
                    tipoAnalisis={nombreAnalisis(idAnalisisBash)}
                    onAreasCalculated={handleAreasCalculated}
                    onPromediosCalculated={handlePromediosCalculados}
                    activarEdicionInteractiva={activarEdicionInteractiva}
                    activeLotes={activeLotes}
                    highlightedLote={highlightedLote}
                    polygonsData={polygonsData}
                    onLeaveLote={onLeaveLote}
                    onSelectLote={onSelectLote}
                    onHoverLote={onHoverLote}
                    closeFilterDialog={closeFilterDialog}
                    isFilterDialogOpen={isFilterDialogOpen}
                    setImgLaflet={setImgLaflet}
                    mapRef={mapRef}
                />
            ) : isAnalysisPerformed && selectedZipFile && selectedAnalysisType === 'CONTEO_PALMA' ? (
                <PalmsCount
                    imageUrl={imageUrl}
                    activeLotes={activeLotes}
                    polygonsData={polygonsData}
                    northWestCoords={northWestCoords}
                    southEastCoords={southEastCoords}
                    setImgLaflet={setImgLaflet}
                    onSelectLote={onSelectLote}
                    onHoverLote={onHoverLote}
                    mapRef={mapRef}
                />
            ) : commonMapElement ? (
                <>
                    {commonMapElement}
                </>
            ) : null}
        </section>
    );
};

export default MapSection;
