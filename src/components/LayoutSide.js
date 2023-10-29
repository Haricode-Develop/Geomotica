import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import profilePicture from '../assets/login/profile/user.png';
import '../path-to-your-css/dashboard.css';

const LayoutSide = ({ children }) => {
    const { userData, logout } = useContext(AuthContext);
    const [activeSubMenu, setActiveSubMenu] = useState('');
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        setActiveSubMenu(prev => prev === 'Dashboard' ? '' : 'Dashboard');
        navigate('/dashboard');
    };

    const handleAdminClick = () => {
        setActiveSubMenu(prev => prev === 'Administrador' ? '' : 'Administrador');
    };

    return (
        <div style={{ display: 'flex' }}>
            <div className="sidebar">
                <div className="profile-image" style={{ backgroundImage: `url(${profilePicture})` }}></div>
                <div className="user-info">
                    <div style={{ paddingTop: '10px' }}>{userData?.name} {userData?.lastName}</div>
                    <div>{userData?.role}</div>
                </div>
                <div>
                    <div className={`menu-item ${activeSubMenu === 'Dashboard' ? 'active' : ''}`} onClick={handleDashboardClick}>
                        Dashboard
                    </div>
                    <div className={`menu-item ${activeSubMenu === 'Administrador' ? 'active' : ''}`} onClick={handleAdminClick}>
                        Administrador
                        <i className={`chevron-icon fa fa-chevron-up ${activeSubMenu === 'Administrador' ? 'rotate' : ''}`}></i>
                    </div>
                    <div className={`sub-menu ${activeSubMenu === 'Administrador' ? 'active' : ''}`}>
                        {/* You can add more sub menu items here */}
                        <div className="sub-menu-item">Submenu Item 1</div>
                        <div className="sub-menu-item">Submenu Item 2</div>
                    </div>
                    {/* ... any other menu items */}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '250px', width: '100%', boxSizing: 'border-box' }}>
                <Outlet />
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default LayoutSide;
