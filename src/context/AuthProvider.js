import { useContext, createContext, useState } from "react";

const AuthContextNew = createContext({
  isAuthenticated2: false,
});

export function AuthProviderLogin({ children }) {
  const [isAuthenticated2, setIsAuthenticated2] = useState(false);
  return (
    <AuthContextNew.Provider value={{ isAuthenticated2 }}>
      {children}
    </AuthContextNew.Provider>
  );
}

export const useAuthLogin = () => useContext(AuthContextNew);