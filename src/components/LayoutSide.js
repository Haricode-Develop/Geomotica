import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LayoutSideStyle.css';
import logo from '../assets/img/logo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import HistoryIcon from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import BugReportIcon from '@mui/icons-material/BugReport';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LayersIcon from '@mui/icons-material/Layers';
import TerrainIcon from '@mui/icons-material/Terrain';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import VerifiedIcon from '@mui/icons-material/Verified';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import WavesIcon from '@mui/icons-material/Waves';
import HeightIcon from '@mui/icons-material/Height';
import PeopleIcon from '@mui/icons-material/People';

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('Mapeo');
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        navigate('/mapeo');
    }, []);

    const handleMenuItemClick = (path) => {
        setActiveItem(path);
        if (path === 'Cerrar Sesión') {
            logout();
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    const menuItems = [
        { name: 'Mapeo', icon: <AgricultureIcon />, path: '/mapeo' },
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { name: 'Historial', icon: <HistoryIcon />, path: '/historial' },
        { name: 'Cerrar Sesión', icon: <ExitToAppIcon />, path: 'Cerrar Sesión' },
        { name: 'Mapeo de maquinaria', icon: <AgricultureIcon />, path: '/mapeo-maquinaria' },
        { name: 'Cosecha', icon: <MapIcon />, path: '/cosecha' },
        { name: 'Plagas', icon: <BugReportIcon />, path: '/plagas' },
        { name: 'Riego', icon: <WaterDropIcon />, path: '/riego' },
        { name: 'Suelos', icon: <LayersIcon />, path: '/suelos' },
        { name: 'Topografía', icon: <TerrainIcon />, path: '/topografia' },
        { name: 'Clima', icon: <ThermostatIcon />, path: '/clima' },
        { name: 'Control de calidad', icon: <VerifiedIcon />, path: '/control-calidad' },
        { name: 'SIG', icon: <MapOutlinedIcon />, path: '/sig' },
        { name: 'Cuencas hidrográficas', icon: <WavesIcon />, path: '/cuencas' },
        { name: 'Extractos altitudinales', icon: <HeightIcon />, path: '/extractos' },
        { name: 'Recursos humanos', icon: <PeopleIcon />, path: '/recursos-humanos' }
    ];

    return (
        <div className="sidebar">
            <div className="logo-section">
                <img src={logo} alt="Logo" className="logo-image" />
            </div>
            <div className="menu-items">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`menu-item ${activeItem === item.path ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick(item.path)}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-text">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
