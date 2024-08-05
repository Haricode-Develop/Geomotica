import React from 'react';
import { DetailsTableContainer, Table, TableData, TableHeading } from './DetailsTableStyle';

const DetailsTable = ({ details }) => {
    return (
        <DetailsTableContainer>
            <h2>Detalles</h2>
            <Table>
                <thead>
                <tr>
                    <TableHeading>Responsable</TableHeading>
                    <TableHeading>Fecha Inicio</TableHeading>
                    <TableHeading>Fecha Fin</TableHeading>
                    <TableHeading>Nombre Finca</TableHeading>
                    <TableHeading>Operador</TableHeading>
                    <TableHeading>Actividad</TableHeading>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <TableData>{details.responsable}</TableData>
                    <TableData>{details.fechaInicio}</TableData>
                    <TableData>{details.fechaFin}</TableData>
                    <TableData>{details.nombreFinca}</TableData>
                    <TableData>{details.operador}</TableData>
                    <TableData>{details.actividad}</TableData>
                </tr>
                </tbody>
            </Table>
        </DetailsTableContainer>
    );
};

export default DetailsTable;