import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LayoutSideStyle.css';
import logo from '../assets/img/logo.png';
import BarChartIcon from '@mui/icons-material/BarChart';
import MapIcon from '@mui/icons-material/Map';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ConstructionIcon from '@mui/icons-material/Construction';
import { Modal } from '@mui/material';

const Sidebar = ({ onToggle }) => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);
    const [isOpen, setIsOpen] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, content: '', position: { top: 0, left: 0 } });
    const [expandedItems, setExpandedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleMenuItemClick = (path) => {
        if (path) {
            setActiveItem(path);
            navigate(path);
        } else {
            setIsModalOpen(true);
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        onToggle(!isOpen);
    };

    const handleExpandClick = (name) => {
        if (expandedItems.includes(name)) {
            setExpandedItems(expandedItems.filter(item => item !== name));
        } else {
            setExpandedItems([...expandedItems, name]);
        }
    };

    const menuItems = [
        { name: 'Dashboard', icon: <BarChartIcon />, path: '/dashboard', subcategories: [] },
        { name: 'Mapeo de maquinaria', icon: <MapIcon />, path: '/mapeo', subcategories: [] },
        { name: 'Conteo de plantas', icon: <AgricultureIcon />, path: '/conteo-de-plantas', subcategories: [] },
        {
            name: 'SIG Agrícola', icon: <LayersIcon />, subcategories: [
                {
                    name: 'Cosecha', subcategories: [
                        { name: 'Planificación de cosecha', path: '/cosecha/planificacion' },
                        { name: 'Avance de cosecha', path: '/cosecha/avance' },
                        { name: 'Tipo de cosecha (mecánica / manual)', path: '/cosecha/tipo' },
                        { name: 'Traciegos', path: '/cosecha/traciegos' },
                        { name: 'Quemas criminales', path: '/cosecha/quemas' },
                        { name: 'Rutas cañeras', path: '/cosecha/rutas' },
                    ]
                },
                {
                    name: 'Madurantes', subcategories: [
                        { name: 'Planificacion de madurante', path: '/madurantes/planificacion' },
                        { name: 'Avance de madurante', path: '/madurantes/avance' },
                        { name: 'Dias programados para corte', path: '/madurantes/dias-programados' },
                        { name: 'Aplicacion con dron', path: '/madurantes/aplicacion-dron' },
                    ]
                },
                {
                    name: 'Variedades', subcategories: [
                        { name: 'Tipos de variedades', path: '/variedades/tipos' },
                        { name: 'Variedades de más a menos productividad', path: '/variedades/productividad' },
                        { name: 'Semilleros', path: '/variedades/semilleros' },
                        { name: 'Ensayos de variedades', path: '/variedades/ensayos' },
                        { name: 'Ensayos varios', path: '/variedades/ensayos-varios' },
                    ]
                },
                {
                    name: 'Plagas', subcategories: [
                        { name: 'Barrenador', path: '/plagas/barrenador' },
                        { name: 'Chinche salivosa', path: '/plagas/chinche' },
                        { name: 'Rata', path: '/plagas/rata' },
                        { name: 'Plagas del suelo', path: '/plagas/suelo' },
                        { name: 'Programación de muestreo semanal', path: '/plagas/programacion' },
                        { name: 'Avance de muestreo semanal', path: '/plagas/avance' },
                        { name: 'Labores culturales para plagas', path: '/plagas/labores' },
                        { name: 'Control biológico', path: '/plagas/control-biologico' },
                        { name: 'Áreas con aporque', path: '/plagas/aporque' },
                    ]
                },
                {
                    name: 'Riego', subcategories: [
                        { name: 'Áreas con y sin riego', path: '/riego/areas' },
                        { name: 'Tipos de riego', path: '/riego/tipos' },
                        { name: 'Balance hídrico', path: '/riego/balance' },
                        { name: 'Evapotranspiración', path: '/riego/evapotranspiracion' },
                        { name: 'Calidad del riego', path: '/riego/calidad' },
                        { name: 'Productividad con y sin riego', path: '/riego/productividad' },
                        { name: 'Números de riego', path: '/riego/numeros' },
                        { name: 'Ubicación de motobombas de riego', path: '/riego/motobombas' },
                        { name: 'Ubicación de aspersores y radio de acción', path: '/riego/aspersores' },
                        { name: 'Tuberías', path: '/riego/tuberias' },
                        { name: 'Hidrantes', path: '/riego/hidrantes' },
                        { name: 'Humedad del suelo con TDR', path: '/riego/tdr' },
                        { name: 'Costos de riego', path: '/riego/costos' },
                    ]
                },
                {
                    name: 'Suelos', subcategories: [
                        { name: 'Texturas de suelo', path: '/suelos/texturas' },
                        { name: '% Area', path: '/suelos/area' },
                        { name: '% Limo', path: '/suelos/limo' },
                        { name: '% Arcilla', path: '/suelos/arcilla' },
                        { name: 'Materia Orgánica', path: '/suelos/materia-organica' },
                        { name: 'Nitrógeno', path: '/suelos/nitrogeno' },
                        { name: 'Fósforo', path: '/suelos/fosforo' },
                        { name: 'Potasio', path: '/suelos/potasio' },
                        { name: 'Micronutrientes', path: '/suelos/micronutrientes' },
                        { name: 'CIC', path: '/suelos/cic' },
                        { name: 'Nichos agroecológicos', path: '/suelos/nichos' },
                        { name: 'Geología', path: '/suelos/geologia' },
                        { name: 'Geoquímicos', path: '/suelos/geoquimicos' },
                    ]
                },
                {
                    name: 'Topografía', subcategories: [
                        { name: 'Curvas a nivel 1 metro', path: '/topografia/curvas-1m' },
                        { name: 'Curvas a nivel 5 metros', path: '/topografia/curvas-5m' },
                        { name: 'Curvas a nivel 20 metros', path: '/topografia/curvas-20m' },
                        { name: 'Relieve DSM', path: '/topografia/dsm' },
                        { name: 'Relieve DTM', path: '/topografia/dtm' },
                        { name: 'Ortofoto RGB Dron', path: '/topografia/ortofoto' },
                    ]
                },
                {
                    name: 'Clima', subcategories: [
                        { name: 'Precipitación (mm)', path: '/clima/precipitacion' },
                        { name: 'Temperatura mínima', path: '/clima/temperatura-minima' },
                        { name: 'Temperatura media', path: '/clima/temperatura-media' },
                        { name: 'Temperatura máxima', path: '/clima/temperatura-maxima' },
                        { name: 'Radiación solar', path: '/clima/radiacion' },
                        { name: 'Red de pluviómetros y estaciones', path: '/clima/pluviometros' },
                    ]
                }
            ]
        },
        { name: 'Configuración', icon: <SettingsIcon />, path: '/configuracion', subcategories: [] }
    ];

    const showTooltip = (content, event) => {
        const position = {
            top: event.currentTarget.getBoundingClientRect().top + window.scrollY,
            left: event.currentTarget.getBoundingClientRect().right + 10
        };
        setTooltip({ visible: true, content, position });
    };

    const hideTooltip = () => {
        setTooltip({ visible: false, content: '', position: { top: 0, left: 0 } });
    };

    return (
        <>
            <div className={`menu-toggle ${isOpen ? 'open' : 'closed'}`} onClick={toggleSidebar}>
                {isOpen ? <CloseIcon /> : <MenuIcon />}
            </div>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                {isOpen && (
                    <div className="logo-section">
                        <img src={logo} alt="Logo" className="logo-image" />
                    </div>
                )}
                <div className="menu-items">
                    {menuItems.map((item, index) => (
                        <div key={index} style={{ width: '100%' }}>
                            <div
                                className={`menu-item ${activeItem === item.path ? 'active' : ''}`}
                                onClick={() => { item.subcategories.length > 0 ? handleExpandClick(item.name) : handleMenuItemClick(item.path); }}
                                onMouseEnter={(e) => showTooltip(item.name, e)}
                                onMouseLeave={hideTooltip}
                            >
                                <span className="menu-icon">{item.icon}</span>
                                {isOpen && (
                                    <>
                                        <span className="menu-text">{item.name}</span>
                                        {item.subcategories.length > 0 && (
                                            <span className={`expand-icon ${expandedItems.includes(item.name) ? 'expanded' : ''}`}>
                                                {expandedItems.includes(item.name) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            {expandedItems.includes(item.name) && isOpen && item.subcategories.length > 0 && (
                                <div className="subcategories" style={{ maxHeight: expandedItems.includes(item.name) ? '1000px' : '0' }}>
                                    {item.subcategories.map((sub, subIndex) => (
                                        <div key={subIndex} style={{ width: '100%' }}>
                                            <div
                                                className={`subcategory-item ${activeItem === sub.path ? 'active' : ''}`}
                                                onClick={() => { sub.subcategories ? handleExpandClick(sub.name) : handleMenuItemClick(sub.path); }}
                                                onMouseEnter={(e) => showTooltip(sub.name, e)}
                                                onMouseLeave={hideTooltip}
                                            >
                                                {sub.name}
                                                {sub.subcategories && (
                                                    <span className={`expand-icon ${expandedItems.includes(sub.name) ? 'expanded' : ''}`}>
                                                        {expandedItems.includes(sub.name) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                                    </span>
                                                )}
                                            </div>
                                            {expandedItems.includes(sub.name) && sub.subcategories && (
                                                <div className="sub-subcategories" style={{ maxHeight: expandedItems.includes(sub.name) ? '1000px' : '0' }}>
                                                    {sub.subcategories.map((subSub, subSubIndex) => (
                                                        <div
                                                            key={subSubIndex}
                                                            className={`sub-subcategory-item ${activeItem === subSub.path ? 'active' : ''}`}
                                                            onClick={() => handleMenuItemClick(subSub.path)}
                                                            onMouseEnter={(e) => showTooltip(subSub.name, e)}
                                                            onMouseLeave={hideTooltip}
                                                        >
                                                            {subSub.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {tooltip.visible && (
                <div className="tooltip" style={{ top: tooltip.position.top, left: tooltip.position.left }}>
                    {tooltip.content}
                </div>
            )}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className="modal-content">
                    <ConstructionIcon style={{ fontSize: '4rem', color: '#f5a623', animation: 'rotate 2s linear infinite' }} />
                    <h2 id="modal-title">Sección en Construcción</h2>
                    <p id="modal-description">Para mejorar tu experiencia, estamos trabajando en esta sección. ¡Gracias por tu paciencia!</p>
                </div>
            </Modal>
        </>
    );
};

export default Sidebar;