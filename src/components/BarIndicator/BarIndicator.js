import React, { useRef } from 'react';
import './BarIndicatorStyle.css';

const BarIndicator = ({ filterType, isHistory }) => {
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
            indicadorIzquierda = "Automático";
            indicadorDerecha = "Manual";
            break;
        case "cutterBase":
            title = "Presion Cortador Base";
            break;
        case "rpm":
            title = "RPM";
            break;
        case "modeCutterBase":
            title = "Modo de corte base";
            indicadorIzquierda = "Automático";
            indicadorDerecha = "Manual";
            break;
        case "autoTracket":
            title = "Auto Tracket";
            indicadorIzquierda = "Enganchado";
            indicadorDerecha = "Desenganchado";
            break;
        case "aplicacionesAreas":
            title = "Aplicaciones Áreas";
            indicadorIzquierda = "Área aplicada";
            indicadorDerecha = "Área sobre aplicada";
            break;
        case "VELOCIDAD":
            title = "Velocidad";
            break;
        case "ALTURA":
            title = "Altura";
            break;
        case "DOSISREAL":
            title = "Dosis Real";
            break;
        default:
            title = "Indicador";
            break;
    }

    let gradientStyle;

    if (filterType === 'autoPilot' || filterType === 'autoTracket' || filterType === 'modeCutterBase') {
        // Establecer el estilo de gradiente para Piloto Automático y Auto Tracker
        gradientStyle = { background: 'linear-gradient(to top, green 0%, blue 100%)' };
        if (filterType === 'autoPilot' || filterType === 'modeCutterBase') {
            indicadorIzquierda = "Automático";
            indicadorDerecha = "Manual";
        } else
        {
            indicadorIzquierda = "Enganchado";
            indicadorDerecha = "Desenganchado";
        }
    }else if(filterType === 'aplicacionesAreas'){
        gradientStyle = { background: 'linear-gradient(to top, green 0%, red 100%)' };
        indicadorIzquierda = "Área Aplicada";
        indicadorDerecha = "Área sobre aplicada";
    } else {
        // Estilo de gradiente para otros tipos de filtros
        gradientStyle = { background: 'linear-gradient(to top, #4caf50 0%, #ffeb3b 50%, #f44336 100%)' };
    }

    const barIndicatorRef = useRef(null);
    const topStyle = isHistory ? { top: '100px' } : { top: '250px' };

    const dragStart = (e) => {
        const style = window.getComputedStyle(barIndicatorRef.current);
        e.dataTransfer.setData('text/plain',
            (parseInt(style.left, 10) - e.clientX) + ',' +
            (parseInt(style.top, 10) - e.clientY));
    };


    const dragOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const drop = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const offset = e.dataTransfer.getData('text/plain').split(',');
        const dm = barIndicatorRef.current;
        dm.style.left = (e.clientX + parseInt(offset[0],10)) + 'px';
        dm.style.top = (e.clientY + parseInt(offset[1],10)) + 'px';
    };

    const onDragOver = (event) => {
        event.preventDefault();
        return false;
    };
    return (
        <div ref={barIndicatorRef}
             className="bar-indicator"
             draggable="true"
             style={topStyle}
             onDragStart={dragStart}
             onDragOver={dragOver}
             onDrop={drop}>
            <div className="bar-title">{title}</div>
            <div className="bar" style={gradientStyle}>
                <div className="label high">{indicadorDerecha}</div>
                <div className="label low">{indicadorIzquierda}</div>
            </div>
        </div>
    );
};

export default BarIndicator;
