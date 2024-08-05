import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, OutlinedInput } from '@mui/material';
import { StyledFormControl } from './AnalysisControlsStyle';

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
                displayEmpty
            >
                <MenuItem value="" disabled>
                    Seleccionar análisis
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
