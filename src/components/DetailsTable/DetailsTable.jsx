import React from 'react';
import './DetailsTableStyle.css';

const DetailsTable = ({ details }) => {
    return (
        <div className="details-table">
            <h2>Detalles</h2>
            <table>
                <thead>
                <tr>
                    <th>Responsable</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Nombre Finca</th>
                    <th>Operador</th>
                    <th>Actividad</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{details.responsable}</td>
                    <td>{details.fechaInicio}</td>
                    <td>{details.fechaFin}</td>
                    <td>{details.nombreFinca}</td>
                    <td>{details.operador}</td>
                    <td>{details.actividad}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DetailsTable;
