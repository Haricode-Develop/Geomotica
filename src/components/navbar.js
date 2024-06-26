import React from 'react';
import './navbar.css'; // Estilo para el navbar
import { Avatar, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../context/AuthContext';
import profilePicture from '../assets/img/user.png'; // Ruta por defecto

const Navbar = () => {
    const { userData } = useAuth();

    return (
        <div className="navbar">
            <div className="navbar-section">
                <LanguageIcon />
                <span>Español</span>
            </div>
            <div className="navbar-section">
                <Badge badgeContent={6} color="primary">
                    <NotificationsIcon />
                </Badge>
            </div>
            <div className="navbar-section">
                <Avatar alt="User Avatar" src={userData?.FOTO_PERFIL || profilePicture} />
                <div className="user-info">
                    <span>{userData?.NOMBRE}</span>
                    <span>{userData?.RolNombre}</span> {/* Asumiendo que `RolNombre` contiene el nombre del rol */}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
