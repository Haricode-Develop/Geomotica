import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import Draggable from 'react-draggable';
import { FaCut, FaDrawPolygon, FaTrash, FaBuffer, FaUndo, FaArrowsAltH } from 'react-icons/fa';
import {
    FloatingButtonsContainer,
    IconButtonStyled,
    TextFieldStyled,
    TooltipStyled,
    DraggableHeader
} from './FloatingToolsAerialApplicationsStyle';
import { FormControlLabel, Switch } from '@mui/material';
const FloatingToolsAerialApplications = ({
                                             handleCutLine,
                                             handleDrawLine,
                                             handleDeleteLine,
                                             handleToggleBuffer,
                                             handleUndo,
                                             handleStretchLine,
                                             activeTool,
                                             isBufferActive,
                                             bufferValue,
                                             setBufferValue,
                                             showUnfilteredLines,
                                             toggleUnfilteredLines
                                         }) => {
    return (
        <Draggable handle=".draggable-header">
            <div style={{ position: 'absolute', top: '290px', left: '150px', zIndex: 1000 }}>
                <DraggableHeader className="draggable-header">Mover</DraggableHeader>
                <FloatingButtonsContainer>
                    <TooltipStyled title="Cortar línea">
                        <IconButtonStyled
                            onClick={handleCutLine}
                            className={activeTool === 'cut' ? 'active' : 'default'}
                        >
                            <FaCut />
                        </IconButtonStyled>
                    </TooltipStyled>
                    <TooltipStyled title="Dibujar línea">
                        <IconButtonStyled
                            onClick={handleDrawLine}
                            className={activeTool === 'draw' ? 'active' : 'default'}
                        >
                            <FaDrawPolygon />
                        </IconButtonStyled>
                    </TooltipStyled>
                    <TooltipStyled title="Borrar líneas">
                        <IconButtonStyled
                            onClick={handleDeleteLine}
                            className={activeTool === 'delete' ? 'active' : 'default'}
                        >
                            <FaTrash />
                        </IconButtonStyled>
                    </TooltipStyled>
                    <TooltipStyled title="Buffer de línea">
                        <IconButtonStyled
                            onClick={handleToggleBuffer}
                            className={isBufferActive ? 'active' : 'default'}
                        >
                            <FaBuffer />
                        </IconButtonStyled>
                    </TooltipStyled>
                    <TooltipStyled title="Deshacer">
                        <IconButtonStyled
                            onClick={handleUndo}
                            className="icon-button"
                        >
                            <FaUndo />
                        </IconButtonStyled>
                    </TooltipStyled>
                    <TooltipStyled title="Estirar línea">
                        <IconButtonStyled
                            onClick={handleStretchLine}
                            className={activeTool === 'stretch' ? 'active' : 'default'}
                        >
                            <FaArrowsAltH />
                        </IconButtonStyled>
                    </TooltipStyled>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showUnfilteredLines}
                                onChange={toggleUnfilteredLines}
                                color="primary"
                            />
                        }
                        label="Ruta de vuelo"
                    />
                    {isBufferActive && (
                        <TextFieldStyled
                            label="Buffer en metros"
                            type="number"
                            value={bufferValue}
                            onChange={(e) => setBufferValue(e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                    )}
                </FloatingButtonsContainer>
            </div>
        </Draggable>
    );
};

export default FloatingToolsAerialApplications;