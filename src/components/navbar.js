import React, { useState } from 'react';
import './navbar.css'; // Estilo para el navbar
import { Avatar, Badge, Menu, MenuItem, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import profilePicture from '../assets/img/user.png'; // Ruta por defecto
import { useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Navbar = ({ isSidebarOpen }) => {
    const { userData, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLanguageMenuOpen = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };

    return (
        <div className={`navbar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="navbar-section">
                <div className="language-selector" onClick={handleLanguageMenuOpen}>
                    <Flag code="ES" className="flag-icon" />
                    <span>Español</span>
                    <ArrowDropDownIcon />
                </div>
                <Menu
                    anchorEl={languageAnchorEl}
                    open={Boolean(languageAnchorEl)}
                    onClose={handleLanguageMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem onClick={handleLanguageMenuClose}>
                        <Flag code="ES" className="flag-icon" />
                        <span>Español</span>
                    </MenuItem>
                    <MenuItem onClick={handleLanguageMenuClose}>
                        <Flag code="GB" className="flag-icon" />
                        <span>Inglés</span>
                    </MenuItem>
                </Menu>
            </div>
            <div className="navbar-section">
                <Badge badgeContent={6} color="primary">
                    <NotificationsIcon />
                </Badge>
            </div>
            <div className="navbar-section" onClick={handleMenuOpen}>
                <Avatar alt="User Avatar" src={userData?.FOTO_PERFIL || profilePicture} />
                <div className="user-info">
                    <span>{userData?.NOMBRE}</span>
                    <span>{userData?.RolNombre}</span>
                </div>
                <ArrowDropDownIcon />
            </div>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
        </div>
    );
};

export default Navbar;