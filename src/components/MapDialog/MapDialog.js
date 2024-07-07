import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Switch, TextField, Button } from '@mui/material';
import Draggable from 'react-draggable';

const PaperComponent = (props) => {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <div {...props} />
        </Draggable>
    );
};

const MapDialog = ({
                       isOpen, onClose,
                       availableFilters, filterSpeed, filterGpsQuality, filterFuel, filterRpm, filterCutterBase, filterAutoPilot, filterAutoTracket, filterModeCutterBase,
                       lowSpeed, medSpeed, highSpeed, lowGpsQuality, medGpsQuality, highGpsQuality, lowFuel, medFuel, highFuel, lowRpm, medRpm, highRpm, lowCutterBase, medCutterBase, highCutterBase,
                       handleToggleFilter,
                       setLowSpeed, setMedSpeed, setHighSpeed, setLowGpsQuality, setMedGpsQuality, setHighGpsQuality, setLowFuel, setMedFuel, setHighFuel, setLowRpm, setMedRpm, setHighRpm, setLowCutterBase, setMedCutterBase, setHighCutterBase
                   }) => (
    <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="draggable-dialog-title"
        sx={{
            '& .MuiDialog-paper': {
                width: '30%',
                maxWidth: 'none',
                overflow: 'hidden',
                backgroundColor: 'white',
                resize: 'both',
            }
        }}
        PaperComponent={PaperComponent}
    >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Generar Mapas
        </DialogTitle>
        <DialogContent>
            <FormGroup>
                {availableFilters.autoPilot && (
                    <FormControlLabel
                        control={<Switch checked={filterAutoPilot} onChange={() => handleToggleFilter('autoPilot')} />}
                        label="Piloto Automático"
                    />
                )}
                {availableFilters.autoTracket && (
                    <FormControlLabel
                        control={<Switch checked={filterAutoTracket} onChange={() => handleToggleFilter('autoTracket')} />}
                        label="Auto Tracket"
                    />
                )}
                {availableFilters.modeCutterBase && (
                    <FormControlLabel
                        control={<Switch checked={filterModeCutterBase} onChange={() => handleToggleFilter('modeCutterBase')} />}
                        label="Modo corte base"
                    />
                )}
                {availableFilters.speed && (
                    <>
                        <FormControlLabel
                            control={<Switch checked={filterSpeed} onChange={() => handleToggleFilter('speed')} />}
                            label="Velocidad (Km/H)"
                        />
                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="low"
                            value={lowSpeed}
                            onChange={e => setLowSpeed(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setLowSpeed(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="medium"
                            value={medSpeed}
                            onChange={e => setMedSpeed(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setMedSpeed(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="high"
                            value={highSpeed}
                            onChange={e => setHighSpeed(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setHighSpeed(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                    </>
                )}
                {availableFilters.gpsQuality && (
                    <>
                        <FormControlLabel
                            control={<Switch checked={filterGpsQuality} onChange={() => handleToggleFilter('gpsQuality')} />}
                            label="Calidad Gps"
                        />
                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="lowGps"
                            value={lowGpsQuality}
                            onChange={e => setLowGpsQuality(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setLowGpsQuality(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="mediumGps"
                            value={medGpsQuality}
                            onChange={e => setMedGpsQuality(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setMedGpsQuality(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="highGps"
                            value={highGpsQuality}
                            onChange={e => setHighGpsQuality(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setHighGpsQuality(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                    </>
                )}
                {availableFilters.fuel && (
                    <>
                        <FormControlLabel
                            control={<Switch checked={filterFuel} onChange={() => handleToggleFilter('fuel')} />}
                            label="Combustible"
                        />
                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="lowFuel"
                            value={lowFuel}
                            onChange={e => setLowFuel(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setLowFuel(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="mediumFuel"
                            value={medFuel}
                            onChange={e => setMedFuel(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setMedFuel(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="highFuel"
                            value={highFuel}
                            onChange={e => setHighFuel(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setHighFuel(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                    </>
                )}
                {availableFilters.rpm && (
                    <>
                        <FormControlLabel
                            control={<Switch checked={filterRpm} onChange={() => handleToggleFilter('rpm')} />}
                            label="RPM"
                        />
                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="lowRPM"
                            value={lowRpm}
                            onChange={e => setLowRpm(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setLowRpm(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="mediumRPM"
                            value={medRpm}
                            onChange={e => setMedRpm(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setMedRpm(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="highRPM"
                            value={highRpm}
                            onChange={e => setHighRpm(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setHighRpm(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                    </>
                )}
                {availableFilters.cutterBase && (
                    <>
                        <FormControlLabel
                            control={<Switch checked={filterCutterBase} onChange={() => handleToggleFilter('cutterBase')} />}
                            label="Presión de cortador base (Bar)"
                        />
                        <TextField
                            label="Bajo"
                            variant="outlined"
                            type="number"
                            name="lowCutterBase"
                            value={lowCutterBase}
                            onChange={e => setLowCutterBase(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setLowCutterBase(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Medio"
                            variant="outlined"
                            type="number"
                            name="mediumCutterBase"
                            value={medCutterBase}
                            onChange={e => setMedCutterBase(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setMedCutterBase(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                        <TextField
                            label="Alto"
                            variant="outlined"
                            type="number"
                            name="highCutterBase"
                            value={highCutterBase}
                            onChange={e => setHighCutterBase(e.target.value === '' ? '' : Number(e.target.value))}
                            onBlur={e => setHighCutterBase(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            margin="normal"
                        />
                    </>
                )}
            </FormGroup>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cerrar
            </Button>
        </DialogActions>
    </Dialog>
);

export default MapDialog;