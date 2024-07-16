import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, OutlinedInput } from '@mui/material';
import { styled } from '@mui/system';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    m: 1,
    minWidth: 190,
    width: '100%',
    padding: 0,
    '& .MuiOutlinedInput-root': {
        borderRadius: 25,
        padding: '5px 14px', // Ajusta el padding interno
    },
    '& .MuiInputLabel-root': {
        left: '3px',
        top: '-6px',
    },
    '& .MuiSelect-select': {
        padding: '5px 14px', // Ajusta el padding del select
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
