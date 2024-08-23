import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [selectedSidebarOption, setSelectedSidebarOption] = useState('Mapeo de maquinaria');

    return (
        <SidebarContext.Provider value={{ selectedSidebarOption, setSelectedSidebarOption }}>
            {children}
        </SidebarContext.Provider>
    );
};
