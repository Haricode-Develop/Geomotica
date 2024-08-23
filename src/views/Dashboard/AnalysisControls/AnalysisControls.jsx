import React, { useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, OutlinedInput } from '@mui/material';
import { StyledFormControl } from './AnalysisControlsStyle';

const AnalysisControls = ({ selectedAnalysisType, handleAnalysisTypeChange, analysisOptions }) => {

    return (
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
                    {analysisOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>
        </div>
    );
};

export default AnalysisControls;
