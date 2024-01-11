import { useContext, createContext, useState } from "react";

const AuthContextNew = createContext({
  isAuthenticated: false,
});

export function AuthProviderLogin({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <AuthContextNew.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContextNew.Provider>
  );
}

export const useAuthLogin = () => useContext(AuthContextNew);