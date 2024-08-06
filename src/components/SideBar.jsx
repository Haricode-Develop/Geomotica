import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';  // Importing the icon from react-icons
import logo from '../assets/img/logo_letra.png';
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
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../context/AuthContext';
import { Modal, Box } from '@mui/material';
import {
    SidebarContainer, MenuToggle, LogoSection, LogoImage, MenuItemsContainer, MenuItemContainer,
    MenuIconContainer, MenuText, SubcategoriesContainer, SubcategoryItemContainer, TooltipContainer,
    ModalContent, HelpButton
} from './SideBarStyle';
import Tutorial from '../components/Tutorial/Tutorial';

const Sidebar = ({ onToggle }) => {
    const location = useLocation();
    const { logout } = useAuth();
    const [activeItem, setActiveItem] = useState(location.pathname);
    const [isOpen, setIsOpen] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, content: '', position: { top: 0, left: 0 } });
    const [expandedItems, setExpandedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isTutorialActive, setIsTutorialActive] = useState(false);

    const navigate = useNavigate();

    const handleMenuItemClick = (path) => {
        if (path === '/logout') {
            logout();
            navigate('/');
        } else if (path) {
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

    const handleHelpClick = () => {
        setIsTutorialActive(true);
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
                        { name: 'Ortofoto RGB Dron', path: '/topografia/ortofoto' },
                        { name: 'DMS Modelo de Superficie Digital', path: '/topografia/dms-modelo-superficie-digital' },
                        { name: 'DMT Modelo del Terreno Digital', path: '/topografia/dms-modelo-terreno-digital' },
                        { name: 'Confirmación de Suelos', path: '/topografia/confirmacion-suelos' },
                        { name: 'Escorrentilla', path: '/topografia/escorrentilla' },
                        { name: 'Pendiente', path: '/topografia/pendiente' },
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
        { name: 'Configuración', icon: <SettingsIcon />, path: '/configuracion', subcategories: [] },
        { name: 'Cerrar sesión', icon: <ExitToAppIcon />, path: '/logout', subcategories: [] }
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
            <MenuToggle isOpen={isOpen} onClick={toggleSidebar}>
                {isOpen ? <CloseIcon /> : <MenuIcon />}
            </MenuToggle>
            <SidebarContainer isOpen={isOpen}>
                {isOpen && (
                    <LogoSection>
                        <LogoImage src={logo} alt="Logo" />
                    </LogoSection>
                )}
                <MenuItemsContainer>
                    {menuItems.map((item, index) => (
                        <Box key={index} style={{ width: '100%' }}>
                            <MenuItemContainer
                                active={activeItem === item.path}
                                onClick={() => { item.subcategories.length > 0 ? handleExpandClick(item.name) : handleMenuItemClick(item.path); }}
                                onMouseEnter={(e) => showTooltip(item.name, e)}
                                onMouseLeave={hideTooltip}
                            >
                                <MenuIconContainer>{item.icon}</MenuIconContainer>
                                {isOpen && (
                                    <>
                                        <MenuText>{item.name}</MenuText>
                                        {item.subcategories.length > 0 && (
                                            <Box className={`expand-icon ${expandedItems.includes(item.name) ? 'expanded' : ''}`}>
                                                {expandedItems.includes(item.name) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                            </Box>
                                        )}
                                    </>
                                )}
                            </MenuItemContainer>
                            {expandedItems.includes(item.name) && isOpen && item.subcategories.length > 0 && (
                                <SubcategoriesContainer expanded={expandedItems.includes(item.name)}>
                                    {item.subcategories.map((sub, subIndex) => (
                                        <Box key={subIndex} style={{ width: '100%' }}>
                                            <SubcategoryItemContainer
                                                active={activeItem === sub.path}
                                                onClick={() => { sub.subcategories ? handleExpandClick(sub.name) : handleMenuItemClick(sub.path); }}
                                                onMouseEnter={(e) => showTooltip(sub.name, e)}
                                                onMouseLeave={hideTooltip}
                                            >
                                                <MenuText>{sub.name}</MenuText>
                                                {sub.subcategories && (
                                                    <Box className={`expand-icon ${expandedItems.includes(sub.name) ? 'expanded' : ''}`}>
                                                        {expandedItems.includes(sub.name) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                                    </Box>
                                                )}
                                            </SubcategoryItemContainer>
                                            {expandedItems.includes(sub.name) && sub.subcategories && (
                                                <SubcategoriesContainer expanded={expandedItems.includes(sub.name)}>
                                                    {sub.subcategories.map((subSub, subSubIndex) => (
                                                        <SubcategoryItemContainer
                                                            key={subSubIndex}
                                                            active={activeItem === subSub.path}
                                                            onClick={() => handleMenuItemClick(subSub.path)}
                                                            onMouseEnter={(e) => showTooltip(subSub.name, e)}
                                                            onMouseLeave={hideTooltip}
                                                        >
                                                            <MenuText>{subSub.name}</MenuText>
                                                        </SubcategoryItemContainer>
                                                    ))}
                                                </SubcategoriesContainer>
                                            )}
                                        </Box>
                                    ))}
                                </SubcategoriesContainer>
                            )}
                        </Box>
                    ))}
                </MenuItemsContainer>
                <HelpButton onClick={handleHelpClick}>
                    <FaQuestionCircle />
                </HelpButton>
            </SidebarContainer>
            {tooltip.visible && (
                <TooltipContainer top={tooltip.position.top} left={tooltip.position.left}>
                    {tooltip.content}
                </TooltipContainer>
            )}

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <ModalContent>
                    <ConstructionIcon style={{ fontSize: '4rem', color: '#f5a623', animation: 'rotate 2s linear infinite' }} />
                    <h2 id="modal-title">Sección en Construcción</h2>
                    <p id="modal-description">Para mejorar tu experiencia, estamos trabajando en esta sección. ¡Gracias por tu paciencia!</p>
                </ModalContent>
            </Modal>

            {/* Tutorial component */}
            <Tutorial isActive={isTutorialActive} onClose={() => setIsTutorialActive(false)} />
        </>
    );
};

export default Sidebar;