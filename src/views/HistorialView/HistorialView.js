import React from 'react';
import HistorialItem from '../../components/HistorialItem/HistorialItem'; // Asegúrate de importar correctamente el componente
import './HistorialViewStyle.css'; // Asegúrate de tener este archivo CSS en la misma carpeta

const HistorialView = () => {
    // Ejemplo de datos, puedes exemplar esto con datos dinámicos si lo deseas
    const historialData = [
        { id: 1, titulo: 'Titulo 1', descripcion: 'Descripción 1', fechaHora: '01/01/2024 10:00 AM' },
        { id: 2, titulo: 'Titulo 2', descripcion: 'Descripción 2', fechaHora: '02/01/2024 11:00 AM' },
        // Agrega más datos según sea necesario
    ];

    return (
        <div className="historial-view">
            {historialData.map(item => (
                <HistorialItem key={item.id} titulo={item.titulo} descripcion={item.descripcion} fechaHora={item.fechaHora} />
            ))}
        </div>
    );
};

export default HistorialView;
