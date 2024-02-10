import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de importar correctamente el contexto
import './LayoutSideStyle.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Ahora se accede correctamente al contexto

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
                    <img src={user?.profileImage || 'default_profile_image_path'} alt="Perfil" className="profile-image" />
                    <div className="profile-name">{user?.name}</div>
                    <div className="profile-lastName">{user?.apellido}</div>
                    <div className="profile-role">Rol: {user?.role}</div>
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
