import React from 'react';
import './BarIndicatorStyle.css';

const BarIndicator = ({ filterType }) => {
    let title = "";
    let indicadorIzquierda = "Bajo";
    let indicadorDerecha = "Alto";
    switch (filterType) {
        case "speed":
            title = "Velocidad";
            break;
        case "gpsQuality":
            title = "Calidad GPS";
            break;
        case "fuel":
            title = "Combustible";
            break;
        case "autoPilot":
            title = "Piloto Automatico";
            indicadorIzquierda = "Enganchado";
            indicadorDerecha = "Desenganchado";
            break;
        case "autoTracket":
            title = "Auto Tracket";
            indicadorIzquierda = "Automático";
            indicadorDerecha = "Manual";
            break;
        default:
            title = "Indicador";
    }

    return (
        <div className="bar-indicator">
            <div className="bar-title">{title}</div>
            <div className="bar">
                <span className="label low">{indicadorIzquierda}</span>
                <div className="bar-container">
                    <div className="gradient-bar" />
                </div>
                <span className="label high">{indicadorDerecha}</span>
            </div>
        </div>
    );
};

export default BarIndicator;
