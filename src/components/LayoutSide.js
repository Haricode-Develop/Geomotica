// Sidebar.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LayoutSideStyle.css';

const Sidebar = ({ profileImage, name, apellido, role }) => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = ['Mapeo', 'Dashboard', 'Historial', 'Cerrar Sesión'];

    const handleMenuItemClick = (item) => {
        switch(item) {
            case 'Dashboard':
                navigate('/dashboard');
                break;
            case 'Historial':
                navigate('/historial');
                break;
            // Agrega más casos según sea necesario
            default:
                break;
        }
    };

    return (
        <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
            <div className="toggle-button" onClick={toggleSidebar}>
                {isOpen ? <span className="icon">&times;</span> : <span className="icon">&#9776;</span>}
            </div>
            {isOpen && (
                <div className="profile-section">
                    <img src={profileImage} alt="Perfil" className="profile-image" />
                    <div className="profile-name">{name}</div>
                    <div className="profile-lastName">{apellido}</div>
                    <div className="profile-role">Rol: {role}</div>
                </div>
            )}
            <div className={`menu-items ${!isOpen ? 'hide' : ''}`}>
                {menuItems.map((item, index) => (
                    <div key={index} className="menu-item" onClick={() => handleMenuItemClick(item)}>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
