import React from 'react';
import { Button, Tooltip, Input, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import AnalysisIcon from '@mui/icons-material/BarChart';
import ExcelIcon from '@mui/icons-material/InsertDriveFile';
import ShapefileIcon from '@mui/icons-material/Map';
import TemplateIcon from '@mui/icons-material/Download';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import AnalysisControls from '../../views/Dashboard/AnalysisControls/AnalysisControls';

const ToolbarContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    padding: '10px 20px',
    borderRadius: '30px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    color: '#fff',
    '& .MuiButton-root': {
        margin: theme.spacing(1),
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    backgroundColor: '#3a3a3a',
    color: '#fff',
    minWidth: '48px',
    '& .MuiButton-startIcon': {
        margin: '0',
    },
    '&:hover': {
        backgroundColor: '#565656',
    },
    '&:disabled': {
        backgroundColor: '#555',
        color: '#888',
    }
}));

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
                              execBashEnabled

                          }) => (
    <ToolbarContainer>
        <AnalysisControls
            selectedAnalysisType={selectedAnalysisType}
            handleAnalysisTypeChange={handleAnalysisTypeChange}
        />
        <Tooltip title={!selectedAnalysisType ? "Selecciona un análisis antes de comenzar" : uploadedCsvFileName || 'No se ha seleccionado ningún archivo'}>
            <StyledButton
                variant="contained"
                component="label"
                startIcon={<ExcelIcon />}
                disabled={!selectedAnalysisType}
            >
                <Input
                    type="file"
                    hidden
                    onChange={manejarSubidaArchivo}
                    accept=".csv"
                />
            </StyledButton>
        </Tooltip>
        <Tooltip title={!selectedAnalysisType ? "Selecciona un análisis antes de comenzar" : uploadedZipFileName || 'No se ha seleccionado ningún archivo'}>
            <StyledButton
                variant="contained"
                component="label"
                startIcon={<ShapefileIcon />}
                disabled={!selectedAnalysisType || selectedAnalysisType === 'COSECHA_MECANICA'}
            >
                <Input
                    type="file"
                    hidden
                    onChange={manejarSubidaZip}
                    accept=".zip"
                />
            </StyledButton>
        </Tooltip>
        <Tooltip title={!selectedAnalysisType ? "Selecciona un análisis antes de comenzar" : 'Selecciona tu CSV'}>
            <StyledButton
                variant="contained"
                startIcon={<TemplateIcon />}
                disabled={!selectedAnalysisType}
                href={selectedAnalysisType ? analysisTemplates[selectedAnalysisType] : "#"}
                download
            />
        </Tooltip>
        <StyledButton
            variant="contained"
            onClick={execBash}
            startIcon={<AnalysisIcon />}
            disabled={!execBashEnabled}
        >
            Realizar Análisis
        </StyledButton>
        <Tooltip title={activarEdicionInteractiva ? "Desactivar Edición Interactiva" : "Activar Edición Interactiva"}>
            <IconButton
                color={activarEdicionInteractiva ? "primary" : "default"}
                sx={{ margin: 1, padding: 0 }}
                onClick={() => setActivarEdicionInteractiva(!activarEdicionInteractiva)}
                disabled={!isKMLFile}
            >
                <AutoModeIcon />
            </IconButton>
        </Tooltip>
    </ToolbarContainer>
);

export default ToolbarComponent;
