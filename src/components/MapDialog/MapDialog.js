import React, { useState } from 'react';
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
                       isOpen,
                       onClose,
                       availableFilters,
                       lowSpeed,
                       medSpeed,
                       highSpeed,
                       lowGpsQuality,
                       medGpsQuality,
                       highGpsQuality,
                       lowFuel,
                       medFuel,
                       highFuel,
                       lowRpm,
                       medRpm,
                       highRpm,
                       lowCutterBase,
                       medCutterBase,
                       highCutterBase,
                       lowAltitude,
                       medAltitude,
                       highAltitude,
                       lowRealDose,
                       medRealDose,
                       highRealDose,
                       handleToggleFilter,
                       setLowSpeed,
                       setMedSpeed,
                       setHighSpeed,
                       setLowGpsQuality,
                       setMedGpsQuality,
                       setHighGpsQuality,
                       setLowFuel,
                       setMedFuel,
                       setHighFuel,
                       setLowRpm,
                       setMedRpm,
                       setHighRpm,
                       setLowCutterBase,
                       setMedCutterBase,
                       setHighCutterBase,
                       setLowAltitude,
                       setMedAltitude,
                       setHighAltitude,
                       setLowRealDose,
                       setMedRealDose,
                       setHighRealDose,
                       usarVelocidadKmH = false
                   }) => {
    const [activeToggle, setActiveToggle] = useState('');
    const velocidadNombre = usarVelocidadKmH ? 'VELOCIDAD_Km_H' : 'VELOCIDAD';


    const handleSingleToggle = (filterName) => {
        if (activeToggle === filterName) {
            setActiveToggle('');
            handleToggleFilter(filterName);
        } else {
            handleToggleFilter(activeToggle);
            setActiveToggle(filterName);
            handleToggleFilter(filterName);
        }
    };

    return (
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
                            control={
                                <Switch
                                    checked={activeToggle === 'PILOTO_AUTOMATICO'}
                                    onChange={() => handleSingleToggle('PILOTO_AUTOMATICO')}
                                />
                            }
                            label="Piloto Automático"
                        />
                    )}
                    {availableFilters.autoTracket && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={activeToggle === 'AUTO_TRACKET'}
                                    onChange={() => handleSingleToggle('AUTO_TRACKET')}
                                />
                            }
                            label="Auto Tracket"
                        />
                    )}
                    {availableFilters.modeCutterBase && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={activeToggle === 'MODO_CORTE_BASE'}
                                    onChange={() => handleSingleToggle('MODO_CORTE_BASE')}
                                />
                            }
                            label="Modo corte base"
                        />
                    )}
                    {availableFilters.speed && (
                        <>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={activeToggle === velocidadNombre}
                                        onChange={() => {
                                            handleSingleToggle(velocidadNombre);
                                        }}
                                    />
                                }
                                label={usarVelocidadKmH ? "Velocidad (Km/H)" : "Velocidad"}
                            />
                            <TextField
                                label="Bajo"
                                variant="outlined"
                                type="number"
                                name="low"
                                value={lowSpeed}
                                onChange={e => {
                                    const value = e.target.value === '' ? '' : Number(e.target.value);
                                    setLowSpeed(value);
                                }}
                                onBlur={e => {
                                    const value = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                                    setLowSpeed(value);
                                }}
                                margin="normal"
                            />
                            <TextField
                                label="Medio"
                                variant="outlined"
                                type="number"
                                name="medium"
                                value={medSpeed}
                                onChange={e => {
                                    const value = e.target.value === '' ? '' : Number(e.target.value);
                                    setMedSpeed(value);
                                }}
                                onBlur={e => {
                                    const value = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                                    setMedSpeed(value);
                                }}
                                margin="normal"
                            />
                            <TextField
                                label="Alto"
                                variant="outlined"
                                type="number"
                                name="high"
                                value={highSpeed}
                                onChange={e => {
                                    const value = e.target.value === '' ? '' : Number(e.target.value);
                                    setHighSpeed(value);
                                }}
                                onBlur={e => {
                                    const value = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                                    setHighSpeed(value);
                                }}
                                margin="normal"
                            />
                        </>
                    )}
                    {availableFilters.gpsQuality && (
                        <>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={activeToggle === 'CALIDAD_DE_SENAL'}
                                        onChange={() => handleSingleToggle('CALIDAD_DE_SENAL')}
                                    />
                                }
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
                                control={
                                    <Switch
                                        checked={activeToggle === 'CONSUMOS_DE_COMBUSTIBLE'}
                                        onChange={() => handleSingleToggle('CONSUMOS_DE_COMBUSTIBLE')}
                                    />
                                }
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
                                control={
                                    <Switch
                                        checked={activeToggle === 'RPM'}
                                        onChange={() => handleSingleToggle('RPM')}
                                    />
                                }
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
                                control={
                                    <Switch
                                        checked={activeToggle === 'PRESION_DE_CORTADOR_BASE'}
                                        onChange={() => handleSingleToggle('PRESION_DE_CORTADOR_BASE')}
                                    />
                                }
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
                    {availableFilters.altitude && (
                        <>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={activeToggle === 'ALTURA'}
                                        onChange={() => handleSingleToggle('ALTURA')}
                                    />
                                }
                                label="Altura (m)"
                            />
                            <TextField
                                label="Bajo"
                                variant="outlined"
                                type="number"
                                name="low"
                                value={lowAltitude}
                                onChange={e => setLowAltitude(e.target.value === '' ? '' : Number(e.target.value))}
                                onBlur={e => setLowAltitude(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                                margin="normal"
                            />
                            <TextField
                                label="Medio"
                                variant="outlined"
                                type="number"
                                name="medium"
                                value={medAltitude}
                                onChange={e => setMedAltitude(e.target.value === '' ? '' : Number(e.target.value))}
                                onBlur={e => setMedAltitude(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                                margin="normal"
                            />
                            <TextField
                                label="Alto"
                                variant="outlined"
                                type="number"
                                name="high"
                                value={highAltitude}
                                onChange={e => setHighAltitude(e.target.value === '' ? '' : Number(e.target.value))}
                                onBlur={e => setHighAltitude(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                                margin="normal"
                            />
                        </>
                    )}
                    {availableFilters.realDose && (
                        <>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={activeToggle === 'DOSISREAL'}
                                        onChange={() => handleSingleToggle('DOSISREAL')}
                                    />
                                }
                                label="Dosis real (mg)"
                            />
                            <TextField
                                label="Bajo"
                                variant="outlined"
                                type="number"
                                name="low"
                                value={lowRealDose}
                                onChange={e => setLowRealDose(e.target.value === '' ? '' : Number(e.target.value))}
                                onBlur={e => setLowRealDose(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                                margin="normal"
                            />
                            <TextField
                                label="Medio"
                                variant="outlined"
                                type="number"
                                name="medium"
                                value={medRealDose}
                                onChange={e => setMedRealDose(e.target.value === '' ? '' : Number(e.target.value))}
                                onBlur={e => setMedRealDose(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                                margin="normal"
                            />
                            <TextField
                                label="Alto"
                                variant="outlined"
                                type="number"
                                name="high"
                                value={highRealDose}
                                onChange={e => setHighRealDose(e.target.value === '' ? '' : Number(e.target.value))}
                                onBlur={e => setHighRealDose(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
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
};

export default MapDialog;