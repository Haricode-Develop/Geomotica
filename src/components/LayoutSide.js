import React, { useState } from 'react';
import './LayoutSideStyle.css'; // Importa tu archivo CSS personalizado

const Sidebar = ({ profileImage, name, apellido, menuItems }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
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
                    <img src={profileImage} alt="Profile" className="profile-image" />
                    <div className="profile-name">{name}</div>
                    <div className="profile-lastName">{apellido}</div>
                </div>
            )}
            <div className={`menu-items ${!isOpen ? 'hide' : ''}`}>
                {menuItems.map((item, index) => (
                    <div key={index} className="menu-item">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
