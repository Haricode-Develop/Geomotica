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

import {
    ToolbarContainer,
    ButtonGroup,
    StyledButton,
    IconButtonStyled,
    ButtonSection,
    TooltipStyled,
} from './ToolbarComponentStyle';

const ToolbarComponent = ({
                              selectedAnalysisType,
                              handleAnalysisTypeChange,
                              manejarSubidaArchivo,
                              manejarSubidaZip,
                              uploadedCsvFileName,
                              uploadedZipFileName,
                              execBash,
                              analysisTemplates,
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
                              processingFinished
                          }) => {
    return (
        <ToolbarContainer isSidebarOpen={isSidebarOpen}>
            {/* Sección de botones izquierda */}
            <ButtonSection>
                <ButtonGroup>
                    <AnalysisControls
                        selectedAnalysisType={selectedAnalysisType}
                        handleAnalysisTypeChange={handleAnalysisTypeChange}
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
                            disabled={!selectedAnalysisType}
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
                                onChange={manejarSubidaZip}
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
                            href={selectedAnalysisType ? analysisTemplates[selectedAnalysisType] : '#'}
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
                </ButtonGroup>
            </ButtonSection>
        </ToolbarContainer>
    );
};

export default ToolbarComponent;
