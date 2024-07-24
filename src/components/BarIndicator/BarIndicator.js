import React from 'react';
import Draggable from 'react-draggable';
import './BarIndicatorStyle.css';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const BarIndicator = ({ filterType, onLabelClick }) => {
    const getTitleAndLabels = (type) => {
        switch (type) {
            case "speed":
                return {
                    title: "Velocidad",
                    labels: [
                        { color: '#4caf50', text: 'Bajo' },
                        { color: '#ffeb3b', text: 'Medio' },
                        { color: '#f44336', text: 'Alto' }
                    ]
                };
            case "gpsQuality":
                return {
                    title: "Calidad GPS",
                    labels: [
                        { color: '#4caf50', text: 'Bajo' },
                        { color: '#ffeb3b', text: 'Medio' },
                        { color: '#f44336', text: 'Alto' }
                    ]
                };
            case "fuel":
                return {
                    title: "Combustible",
                    labels: [
                        { color: '#4caf50', text: 'Bajo' },
                        { color: '#ffeb3b', text: 'Medio' },
                        { color: '#f44336', text: 'Alto' }
                    ]
                };
            case "autoPilot":
                return {
                    title: "Piloto Automático",
                    labels: [
                        { color: 'green', text: 'Enganchado' },
                        { color: 'red', text: 'Desenganchado' }
                    ]
                };
            case "cutterBase":
                return {
                    title: "Presión Cortador Base",
                    labels: [
                        { color: '#4caf50', text: 'Bajo' },
                        { color: '#ffeb3b', text: 'Medio' },
                        { color: '#f44336', text: 'Alto' }
                    ]
                };
            case "rpm":
                return {
                    title: "RPM",
                    labels: [
                        { color: '#4caf50', text: 'Bajo' },
                        { color: '#ffeb3b', text: 'Medio' },
                        { color: '#f44336', text: 'Alto' }
                    ]
                };
            case "modeCutterBase":
                return {
                    title: "Modo de corte base",
                    labels: [
                        { color: 'green', text: 'Automático' },
                        { color: 'red', text: 'Manual' }
                    ]
                };
            case "autoTracket":
                return {
                    title: "Auto Tracket",
                    labels: [
                        { color: 'green', text: 'Enganchado' },
                        { color: 'red', text: 'Desenganchado' }
                    ]
                };
            case "aplicacionesAreas":
                return {
                    title: "Aplicaciones Áreas",
                    labels: [
                        { color: 'green', text: 'Área aplicada' },
                        { color: 'red', text: 'Área sobre aplicada' }
                    ]
                };
            default:
                return {
                    title: "Indicador",
                    labels: [
                        { color: '#4caf50', text: 'Bajo' },
                        { color: '#ffeb3b', text: 'Medio' },
                        { color: '#f44336', text: 'Alto' }
                    ]
                };
        }
    };

    const { title, labels } = getTitleAndLabels(filterType);

    return (
        <Draggable handle=".drag-handle">
            <div className="bar-indicator">
                <div className="drag-handle">
                    <DragIndicatorIcon></DragIndicatorIcon>
                    Mover
                </div>
                <div className="bar-title">{title}</div>
                <div className="label-container">
                    {labels.map((label, index) => (
                        <div
                            key={index}
                            className="label-item"
                            style={{ backgroundColor: label.color }}
                            onClick={() => onLabelClick(label.text)}
                        >
                            {label.text}
                        </div>
                    ))}
                </div>
            </div>
        </Draggable>
    );
};

export default BarIndicator;