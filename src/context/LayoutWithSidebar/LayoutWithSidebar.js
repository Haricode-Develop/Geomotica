// LayoutWithSidebar.js
import React from 'react';
import Sidebar from "../../components/LayoutSide"; // Asegúrate de que la ruta de importación es correcta

const LayoutWithSidebar = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <div>{children}</div> {/* Contenido de la página */}
        </div>
    );
};

export default LayoutWithSidebar;
