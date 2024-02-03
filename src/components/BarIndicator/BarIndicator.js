import React from 'react';
import './BarIndicatorStyle.css';

const BarIndicator = ({ filterType }) => {
    let title = "";

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
        default:
            title = "Indicador";
    }

    return (
        <div className="bar-indicator">
            <div className="bar-title">{title}</div>
            <div className="bar">
                <span className="label low">Bajo</span>
                <div className="bar-container">
                    <div className="gradient-bar" />
                </div>
                <span className="label high">Alto</span>
            </div>
        </div>
    );
};

export default BarIndicator;
