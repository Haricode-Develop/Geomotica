import { Outlet, Navigate } from "react-router-dom";
//import { useAuthLogin } from "./AuthProvider";
import { useAuth } from "./AuthContext";
export default function ProtectedRoute() {
  const auth = useAuth();
  const token = sessionStorage.getItem("Token");
  const userData = sessionStorage.getItem("userData");
  if (
    token !== "undefined" &&
    token !== null &&
    userData !== "undefined" &&
    userData !== null
  ) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
}
