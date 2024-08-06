import React from 'react';
import Draggable from 'react-draggable';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { BarIndicatorWrapper, DragHandle, BarTitle, LabelContainer, LabelItem } from './BarIndicatorStyle';

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
            case "dosisReal":
                return{
                    title: "Dosis Real",
                    labels: [
                        { color: '#4caf50', text: 'Bajo' },
                        { color: '#ffeb3b', text: 'Medio' },
                        { color: '#f44336', text: 'Alto' }
                    ]
                }
            case "altura":
                return {
                    title: "Altura",
                    labels: [
                        { color: '#4caf50', text: 'Bajo' },
                        { color: '#ffeb3b', text: 'Medio' },
                        { color: '#f44336', text: 'Alto' }
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
            <BarIndicatorWrapper>
                <DragHandle>
                    <DragIndicatorIcon />
                    Mover
                </DragHandle>
                <BarTitle>{title}</BarTitle>
                <LabelContainer>
                    {labels.map((label, index) => (
                        <LabelItem
                            key={index}
                            style={{ backgroundColor: label.color }}
                            onClick={() => onLabelClick(label.text)}
                        >
                            {label.text}
                        </LabelItem>
                    ))}
                </LabelContainer>
            </BarIndicatorWrapper>
        </Draggable>
    );
};

export default BarIndicator;