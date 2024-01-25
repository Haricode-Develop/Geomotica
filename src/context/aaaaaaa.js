import { useContext, createContext, useState } from "react";

const AuthContextNew = createContext({
  isAuthenticated2: false,
  getAccessToken  : () => {},
});

export function AuthProviderLogin({ children }) {
  const [isAuthenticated2, setIsAuthenticated2] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  function getAccessToken(){
    return accessToken;
  }
  function saveUser(userData){
    setAccessToken(userData.accessToken);
    setRefreshToken(userData.refreshToken);
    localStorage.setItem("refreshToken", userData.refreshToken);

    setIsAuthenticated2(true);
  }
  return (
    <AuthContextNew.Provider value={{ isAuthenticated2 }}>
      {children}
    </AuthContextNew.Provider>
  );
}

export const useAuthLogin = () => useContext(AuthContextNew);
