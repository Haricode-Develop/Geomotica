import React, { useState } from 'react';
import { Avatar, Badge, Menu, MenuItem, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Flag from 'react-world-flags';
import { useAuth } from '../../context/AuthContext';
import profilePicture from '../../assets/img/user.png';
import logo from '../../assets/img/logo.png'; // Importamos el logo
import { useNavigate } from 'react-router-dom';
import {
    NavbarContainer,
    NavbarSection,
    LanguageSelector,
    FlagIcon,
    UserInfo,
    LogoImage,
    NavbarSectionCentered,
} from './NavbarStyle';

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

    const handleLanguageMenuOpen = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };

    return (
        <NavbarContainer isSidebarOpen={isSidebarOpen}>
            {/* Sección del logo centrada */}
            <NavbarSectionCentered>
                <LogoImage src={logo} alt="Logo" />
            </NavbarSectionCentered>

            {/* Secciones izquierda y derecha */}
            <NavbarSection>
                <LanguageSelector onClick={handleLanguageMenuOpen}>
                    <Flag
                        code="ES"
                        className="flag-icon"
                        style={{ width: '35px', paddingRight: '10px' }}
                    />
                    <span>Español</span>
                    <ArrowDropDownIcon />
                </LanguageSelector>
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
                        <Flag code="ES" className="flag-icon" style={{ width: '35px' }} />
                        <span>Español</span>
                    </MenuItem>
                    <MenuItem onClick={handleLanguageMenuClose}>
                        <Flag code="GB" className="flag-icon" style={{ width: '35px' }} />
                        <span>Inglés</span>
                    </MenuItem>
                </Menu>
            </NavbarSection>
            <NavbarSection>
                <Badge badgeContent={6} color="primary">
                    <NotificationsIcon />
                </Badge>
            </NavbarSection>
            <NavbarSection onClick={handleMenuOpen}>
                <Avatar
                    alt="User Avatar"
                    src={userData?.FOTO_PERFIL || profilePicture}
                />
                <UserInfo>
                    <span>{userData?.NOMBRE}</span>
                    <span>{userData?.RolNombre}</span>
                </UserInfo>
                <ArrowDropDownIcon />
            </NavbarSection>
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
                <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
            </Menu>
        </NavbarContainer>
    );
};

export default Navbar;
