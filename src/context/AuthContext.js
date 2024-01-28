import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUserData(userData);
    localStorage.setItem("Token", userData.token); // Asegúrate de tener el token en la propiedad correcta de userData
    localStorage.setItem("userData", userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("Token");
    // Puedes eliminar cualquier otra información de autenticación almacenada
  };

  const saveUser = (userData) => {
    setUserData(userData);
    localStorage.setItem("Token", userData.token);
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userData,
        setUserData,
        logout,
        login,
        saveUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
