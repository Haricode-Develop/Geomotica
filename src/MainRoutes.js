import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginPage from './views/Login/Login';
import RegisterPage from './views/Register/Register';
import Dashboard from './views/Dashboard/Dashboard';
import PasswordRecuperation from './views/PasswordRecuperation/PasswordRecuperation';
import PasswordConfirmation from './views/Confirmations/passwordConfirmation';
import PasswordSender from './views/Confirmations/passwordSender';
import RegisterConfirmation from './views/Confirmations/registerConfirmation';
import RegisterSender from './views/Confirmations/registerSender';
import AdminPanel from './views/AdminPanel/AdminPanel';
import LayoutWithSidebar from "./components/LayoutWithSidebar/LayoutWithSidebar";
import Publicidad from './views/Publicidad/publicidad';  // Importa el componente publicidad

import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrar" element={<RegisterPage />} />
            <Route path="/passwordRecuperation" element={<PasswordRecuperation />} />
            <Route path="/passwordRecuperationConfirmation" element={<PasswordConfirmation />} />
            <Route path="/passwordSender/:recipient" element={<PasswordSender />} />
            <Route path="/registerSender/:recipient" element={<RegisterSender />} />
            <Route path="/registerConfirmation/:recipient" element={<RegisterConfirmation />} />

            <Route path="/" element={<ProtectedRoute><LayoutWithSidebar><Publicidad /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/publicidad" element={<ProtectedRoute><LayoutWithSidebar><Publicidad /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><LayoutWithSidebar><Dashboard /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/mapeo" element={<ProtectedRoute><LayoutWithSidebar><Dashboard /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/adminPanel" element={<ProtectedRoute><LayoutWithSidebar><AdminPanel /></LayoutWithSidebar></ProtectedRoute>} />
        </Routes>
    );
};

export default MainRoutes;
