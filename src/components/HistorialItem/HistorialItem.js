import React from 'react';
import './HistorialItemStyle.css'; // Asegúrate de tener este archivo CSS en la misma carpeta

const HistorialItem = ({ titulo, descripcion, fechaHora }) => {
    return (
        <div className="historial-item">
            <h3>{titulo}</h3>
            <p>{descripcion}</p>
            <span className="fecha-hora">{fechaHora}</span>
        </div>
    );
};

export default HistorialItem;
