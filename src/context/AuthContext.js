import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("Token");
        let storedUserData = localStorage.getItem("userData");
        if (token && storedUserData) {
            try {
                storedUserData = JSON.parse(storedUserData);
                const flattenedUserData = {
                    ...storedUserData.user,
                    ...storedUserData
                };
                setIsAuthenticated(true);
                setUserData(flattenedUserData);
            } catch (error) {
                console.error("Error parsing userData from localStorage:", error);
                localStorage.removeItem("userData");
                setIsAuthenticated(false);
                setUserData(null);
            }
        }
    }, []);

    const login = (userData) => {
        const flattenedUserData = {
            ...userData.user,
            ...userData
        };

        setIsAuthenticated(true);
        setUserData(flattenedUserData);
        localStorage.setItem("Token", flattenedUserData.token);
        localStorage.setItem("userData", JSON.stringify(flattenedUserData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserData(null);
        localStorage.removeItem("Token");
        localStorage.removeItem("userData");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
