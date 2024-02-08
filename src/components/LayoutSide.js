import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './LayoutSideStyle.css'; // Importa tu archivo CSS personalizado

const Sidebar = ({ profileImage, name, apellido, role }) => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate(); // Instancia de useNavigate

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Definimos las opciones del menú aquí
    const menuItems = ['Mapeo', 'Dashboard', 'Historial', 'Cerrar Sesión'];

    const handleMenuItemClick = (item) => {
        switch(item) {
            case 'Dashboard':
                navigate('/dashboard');
                break;
            case 'Historial':
                navigate('/historial'); // Navega a la ruta del Historial
                break;
            // Agrega casos para otros menús según sea necesario
            default:
                break;
        }
    };

    return (
        <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
            <div className="toggle-button" onClick={toggleSidebar}>
                {isOpen ? (
                    <span className="icon">&times;</span>
                ) : (
                    <span className="icon">&#9776;</span>
                )}
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

