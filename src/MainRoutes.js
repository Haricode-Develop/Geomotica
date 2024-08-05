import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginPage from './views/Login/Login';
import RegisterPage from './views/Register/Register';
import Dashboard from './views/Dashboard/Dashboard';
import DashboardIndicators from "./views/DashboardIndicadores/DashboardIndicators";
import PasswordRecovery from './views/PasswordRecovery/PasswordRecovery';
import PasswordConfirmation from './views/Confirmations/PasswordConfirmation';
import PasswordSender from './views/Confirmations/PasswordSender';
import RegisterConfirmation from './views/Confirmations/RegisterConfirmation';
import RegisterSender from './views/Confirmations/RegisterSender';
import AdminPanel from './views/AdminPanel/AdminPanel';
import LayoutWithSidebar from "./components/LayoutWithSidebar/LayoutWithSidebar";
import Advertising from './views/Advertising/Advertising';
import Configuration from './views/Configuracion/Configuration';
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
            <Route path="/passwordRecuperation" element={<PasswordRecovery />} />
            <Route path="/passwordRecuperationConfirmation" element={<PasswordConfirmation />} />
            <Route path="/passwordSender/:recipient" element={<PasswordSender />} />
            <Route path="/registerSender/:recipient" element={<RegisterSender />} />
            <Route path="/registerConfirmation/:recipient" element={<RegisterConfirmation />} />

            <Route path="/" element={<ProtectedRoute><LayoutWithSidebar><Advertising /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/publicidad" element={<ProtectedRoute><LayoutWithSidebar><Advertising /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><LayoutWithSidebar><DashboardIndicators /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/mapeo" element={<ProtectedRoute><LayoutWithSidebar><Dashboard /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/adminPanel" element={<ProtectedRoute><LayoutWithSidebar><AdminPanel /></LayoutWithSidebar></ProtectedRoute>} />
            <Route path="/configuracion" element={<ProtectedRoute><LayoutWithSidebar><Configuration/></LayoutWithSidebar></ProtectedRoute>}/>
        </Routes>
    );
};

export default MainRoutes;
