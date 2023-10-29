import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    const login = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setUserData(null);
        localStorage.removeItem('authToken');
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if(token) {
            setIsAuthenticated(true);
            // Opcionalmente, puedes establecer userData aquí si almacenas los datos del usuario en localStorage.
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userData, setUserData, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};
