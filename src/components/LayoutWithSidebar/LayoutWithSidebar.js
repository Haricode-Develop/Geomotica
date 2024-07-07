import React, { useState } from 'react';
import Sidebar from "../LayoutSide";
import Navbar from "../navbar";
import './LayoutWithSidebarStyle.css';

const LayoutWithSidebar = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    const childrenWithProps = React.Children.map(children, child => {
        return React.cloneElement(child, { isSidebarOpen });
    });

    return (
        <div className="layout">
            <Sidebar onToggle={handleToggleSidebar} />
            <div className="main-content">
                <Navbar isSidebarOpen={isSidebarOpen} />
                <div className="content-wrapper">
                    {childrenWithProps}
                </div>
            </div>
        </div>
    );
};

export default LayoutWithSidebar;
