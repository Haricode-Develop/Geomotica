import { Outlet, Navigate } from "react-router-dom";
import { useAuthLogin } from "./AuthProvider";
export default function ProtectedRoute() {

  const auth  = useAuthLogin();
  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
