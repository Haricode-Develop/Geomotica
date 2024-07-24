import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, OutlinedInput } from '@mui/material';
import { styled } from '@mui/system';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    margin: theme.spacing(2),  // Increased margin for better separation
    minWidth: 200,
    borderRadius: '25px',
    padding: '5px 2px',
    '& .MuiOutlinedInput-root': {
        borderRadius: 25,
        padding: '5px 14px',
        backgroundColor: '#fff',
        color: '#000',  // Changed to black for better readability
    },
    '& .MuiInputLabel-root': {
        left: '10px',
        top: '-10px',
        color: '#fff',
    },
    '& .MuiSelect-select': {
        padding: '10px 10px', // Increased padding for better UX
    },
}));

const AnalysisControls = ({ selectedAnalysisType, handleAnalysisTypeChange }) => (
    <div className="analysis-controls">
        <StyledFormControl variant="outlined">
            <InputLabel id="analysis-type-selector-label">Tipo de Análisis</InputLabel>
            <Select
                labelId="analysis-type-selector-label"
                id="analysis-type-selector"
                value={selectedAnalysisType}
                onChange={handleAnalysisTypeChange}
                input={<OutlinedInput label="Tipo de Análisis" />}
            >
                <MenuItem value="">
                    <em>Ninguno</em>
                </MenuItem>
                <MenuItem value="APLICACIONES_AEREAS">Aplicaciones Aéreas</MenuItem>
                <MenuItem value="COSECHA_MECANICA">Cosecha Mecánica</MenuItem>
                <MenuItem value="FERTILIZACION">Fertilización</MenuItem>
                <MenuItem value="HERBICIDAS">Herbicidas</MenuItem>
                <MenuItem value="APS">APS</MenuItem>
            </Select>
        </StyledFormControl>
    </div>
);

export default AnalysisControls;