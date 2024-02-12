import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("Token");
        let storedUserData = localStorage.getItem("userData");
        // Asegúrate de que storedUserData sea una cadena JSON válida antes de analizarla
        if (token && storedUserData) {
            try {
                storedUserData = JSON.parse(storedUserData);
                // Aplanar userData aquí combinando `user` con el resto de propiedades de `storedUserData`
                const flattenedUserData = {
                    ...storedUserData.user,
                    ...storedUserData // Esto incluirá el `token` y cualquier otra propiedad no dentro de `user`
                };
                setIsAuthenticated(true);
                setUserData(flattenedUserData);
            } catch (error) {
                console.error("Error parsing userData from localStorage:", error);
                // Opcional: Limpia userData inválido de localStorage aquí
                localStorage.removeItem("userData");
                // Además, podrías querer actualizar el estado para reflejar que el usuario no está autenticado
                setIsAuthenticated(false);
                setUserData(null);
            }
        }
    }, []);

    const login = (userData) => {
        const flattenedUserData = {
            ...userData.user,
            ...userData // Esto incluirá el `token` y cualquier otra propiedad no dentro de `user`
        };
        setIsAuthenticated(true);
        setUserData(flattenedUserData);
        localStorage.setItem("Token", flattenedUserData.token);
        // Asegúrate de aplanar userData antes de guardarla
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
