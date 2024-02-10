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
import HistorialView from './views/HistorialView/HistorialView';
import AdminPanel from './views/AdminPanel/AdminPanel';
import NotFoundPage from "./views/NotFound/NotFound";
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

            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/adminPanel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/historial" element={<ProtectedRoute><HistorialView /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default MainRoutes;
