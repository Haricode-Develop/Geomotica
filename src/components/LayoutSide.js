// Sidebar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que la ruta de importación es correcta
import './LayoutSideStyle.css';
import profilePicture from '../assets/img/user.png';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const { userData, logout } = useAuth(); // Usamos userData directamente

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = ['Mapeo', 'Dashboard', 'Historial', 'Cerrar Sesión'];

    const handleMenuItemClick = (item) => {
        switch(item) {
            case 'Dashboard':
                navigate('/dashboard');
                break;
            case 'Mapeo':
                navigate('/mapeo');
                break;
            case 'Historial':
                navigate('/historial');
                break;
            case 'Cerrar Sesión':
                logout();
                navigate('/login');
                break;
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
                    <img src={userData?.FOTO_PERFIL || profilePicture} alt="Perfil" className="profile-image" />
                    <div className="profile-name">{userData?.NOMBRE}</div>
                    <div className="profile-lastName">{userData?.APELLIDO}</div>
                    <div className="profile-role">Rol: {userData?.RolNombre}</div> {/* Asumiendo que el ID_Rol indica el rol del usuario */}
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
