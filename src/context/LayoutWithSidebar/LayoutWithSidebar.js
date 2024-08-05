import React from 'react';
import SideBar from "../../components/SideBar"; // Asegúrate de que la ruta de importación es correcta
import Navbar from "../../components/Navbar"; // Asegúrate de que la ruta de importación es correcta
import './LayoutWithSidebarStyle.css'; // Define los estilos para el layout

const LayoutWithSidebar = ({ children }) => {
    return (
        <div className="layout">
            <SideBar />
            <div className="main-content">
                <Navbar />
                <div className="content-area">
                    <div className="content-wrapper">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LayoutWithSidebar;
