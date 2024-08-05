import React, { useState } from 'react';
import SideBar from "../SideBar";
import Navbar from "../Navbar";
import { LayoutContainer, MainContent, ContentWrapper } from './LayoutWithSidebarStyle';

const LayoutWithSidebar = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    const childrenWithProps = React.Children.map(children, child => {
        return React.cloneElement(child, { isSidebarOpen });
    });

    return (
        <LayoutContainer>
            <SideBar onToggle={handleToggleSidebar} />
            <MainContent>
                <Navbar isSidebarOpen={isSidebarOpen} />
                <ContentWrapper>
                    {childrenWithProps}
                </ContentWrapper>
            </MainContent>
        </LayoutContainer>
    );
};

export default LayoutWithSidebar;