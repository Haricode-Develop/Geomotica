import React from 'react';
import { Button, Tooltip, Input, IconButton } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AnalysisIcon from '@mui/icons-material/BarChart';
import ExcelIcon from '@mui/icons-material/InsertDriveFile';
import ShapefileIcon from '@mui/icons-material/Map';
import TemplateIcon from '@mui/icons-material/Download';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import AnalysisControls from '../../views/Dashboard/AnalysisControls/AnalysisControls';
import FloatingPanel from '../FloatingPanel/FloatingPanel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import analysisUtils from "../../utils/analysisConfig";
import {manejarSubidaZip} from "../../utils/fileHandler";
import {captureMapImage} from "../../analysis/AnalysisMapping/MappingGeneral";
import {
    ToolbarContainer,
    ButtonGroup,
    StyledButton,
    IconButtonStyled,
    ButtonSection,
    TooltipStyled,
} from './ToolbarComponentStyle';
import Loader from '../Loader/Loader';

const ToolbarComponent = ({
                              selectedAnalysisType,
                              handleAnalysisTypeChange,
                              manejarSubidaArchivo,
                              uploadedCsvFileName,
                              uploadedZipFileName,
                              execBash,
                              activarEdicionInteractiva,
                              setActivarEdicionInteractiva,
                              isKMLFile,
                              execBashEnabled,
                              isSidebarOpen,
                              polygonsData = [],
                              highlightedLote,
                              activeLotes,
                              searchTerm,
                              setSearchTerm,
                              onHoverLote,
                              onLeaveLote,
                              onSelectLote,
                              clearAllLotes,
                              openFilterDialog,
                              processingFinished,
                              handleSendDashboardData,
                              analysisOptions,
                              setIsKMLFile,
                              setOpenSnackbar,
                              setSelectedZipFile,
                              setUploadedZipFileName,
                              mapRef,
                              setImgLaflet,
                              setIsGeneratingReport,
                              isGeneratingReport
                          }) => {


    const handleGeneratePdf = async () => {
        try {
            setIsGeneratingReport(true); // Activa el loader
            if (mapRef.current) {
                const imgData = await captureMapImage(mapRef);
                setImgLaflet(imgData);
                await handleSendDashboardData(imgData);
            }
        } catch (error) {
            console.error("Error generando el PDF:", error);
            setIsGeneratingReport(false); // Desactiva el loader en caso de error
        }
    };





    return (
        <ToolbarContainer isSidebarOpen={isSidebarOpen}>
            {/* Sección de botones izquierda */}
            <ButtonSection>
                <ButtonGroup>
                    <AnalysisControls
                        selectedAnalysisType={selectedAnalysisType}
                        handleAnalysisTypeChange={handleAnalysisTypeChange}
                        analysisOptions={analysisOptions}
                    />
                    <Tooltip
                        title={
                            !selectedAnalysisType
                                ? 'Selecciona un análisis antes de comenzar'
                                : uploadedCsvFileName || 'No se ha seleccionado ningún archivo'
                        }
                    >
                        <StyledButton
                            variant="contained"
                            component="label"
                            startIcon={<ExcelIcon />}
                            disabled={!selectedAnalysisType || selectedAnalysisType === 'CONTEO_PALMA'}
                            className={'subir-csv'}
                        >
                            Subir datos
                            <Input
                                type="file"
                                hidden
                                onChange={manejarSubidaArchivo}
                                accept=".csv"
                            />
                        </StyledButton>
                    </Tooltip>
                    <Tooltip
                        title={
                            !selectedAnalysisType
                                ? 'Selecciona un análisis antes de comenzar'
                                : uploadedZipFileName || 'No se ha seleccionado ningún archivo'
                        }
                    >
                        <StyledButton
                            variant="contained"
                            component="label"
                            startIcon={<ShapefileIcon />}
                            className={'subir-zip'}
                            disabled={
                                !selectedAnalysisType || selectedAnalysisType === 'COSECHA_MECANICA'
                            }
                        >
                            Subir shp
                            <Input
                                type="file"
                                hidden
                                onChange={(event) => manejarSubidaZip(event, setSelectedZipFile, setUploadedZipFileName, setOpenSnackbar, setIsKMLFile)}
                                accept=".zip"
                            />
                        </StyledButton>

                    </Tooltip>

                    <FloatingPanel
                        polygonsData={polygonsData}
                        highlightedLote={highlightedLote}
                        activeLotes={activeLotes}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onHoverLote={onHoverLote}
                        onLeaveLote={onLeaveLote}
                        onSelectLote={onSelectLote}
                        clearAllLotes={clearAllLotes}
                    />
                </ButtonGroup>
            </ButtonSection>

            {/* Sección de botones derecha */}
            <ButtonSection>
                <ButtonGroup>
                    <TooltipStyled title="Configurar filtros">
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={openFilterDialog}
                            disabled={!processingFinished}
                        >
                            Generar Mapas
                        </StyledButton>
                    </TooltipStyled>

                    <Tooltip
                        title={
                            !selectedAnalysisType
                                ? 'Selecciona un análisis antes de comenzar'
                                : 'Selecciona tu CSV'
                        }
                    >
                        <StyledButton
                            variant="contained"
                            className={'descargar-plantilla'}
                            startIcon={<TemplateIcon />}
                            disabled={!selectedAnalysisType}
                            href={selectedAnalysisType ? analysisUtils[selectedAnalysisType]?.templatePath : '#'}
                            download
                        >
                            Descargar plantilla
                        </StyledButton>
                    </Tooltip>
                    <StyledButton
                        variant="contained"
                        onClick={execBash}
                        startIcon={<AnalysisIcon />}
                        disabled={!execBashEnabled}
                        className={'realizar-analisis'}
                    >
                        Realizar Análisis
                    </StyledButton>
                    <Tooltip
                        title={
                            activarEdicionInteractiva
                                ? 'Desactivar Edición Interactiva'
                                : 'Activar Edición Interactiva'
                        }
                    >
                        <IconButtonStyled
                            onClick={() => setActivarEdicionInteractiva(!activarEdicionInteractiva)}
                            disabled={!isKMLFile}
                            active={activarEdicionInteractiva}
                        >
                            <AutoModeIcon />
                        </IconButtonStyled>
                    </Tooltip>
                    <Tooltip title="Generar informe">
                        <IconButtonStyled onClick={handleGeneratePdf}>
                            <PictureAsPdfIcon />
                        </IconButtonStyled>
                    </Tooltip>

                </ButtonGroup>
            </ButtonSection>
            {isGeneratingReport && <Loader />}
        </ToolbarContainer>
    );
};

export default React.memo(ToolbarComponent);
