import React from 'react';
import { Button, Input, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { styled } from '@mui/system';
import GetAppIcon from '@mui/icons-material/GetApp';

const StyledButton = styled(Button)(({ theme }) => ({
    margin: 1,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    color: '#333',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
}));

const StyledDownloadButton = styled(Button)(({ theme }) => ({
    margin: 1,
    borderRadius: 25, // Más redondeado
    backgroundColor: '#f5f5f5',
    color: '#333',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
}));

const UploadButtons = ({ selectedAnalysisType, manejarSubidaArchivo, manejarSubidaZip, uploadedCsvFileName, uploadedZipFileName }) => (
    <div className="upload-buttons">
        <Tooltip title={!selectedAnalysisType ? "Selecciona un análisis antes de comenzar" : uploadedCsvFileName || 'No se ha seleccionado ningún archivo'}>
            <StyledButton
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                disabled={!selectedAnalysisType}
            >
                Selecciona Excel
                <Input
                    type="file"
                    hidden
                    onChange={manejarSubidaArchivo}
                    accept=".csv"
                />
            </StyledButton>
        </Tooltip>
    </div>
);

export default UploadButtons;
