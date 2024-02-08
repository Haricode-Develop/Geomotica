import React, { useContext } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/Login/Login';
import RegisterPage from './views/Register/Register';
import Dashboard from "./views/Dashboard/Dashboard";
import HistorialView from "./views/HistorialView/HistorialView";
import { AuthContext } from "./context/AuthContext";
import { PasswordRecuperation } from "./views/PasswordRecuperation/PasswordRecuperation";
import { PasswordConfirmation } from "./views/Confirmations/passwordConfirmation.js";
import { PasswordSender } from "./views/Confirmations/passwordSender.js";
import { RegisterConfirmation } from "./views/Confirmations/registerConfirmation.js";
import { RegisterSender } from "./views/Confirmations/registerSender.js";

const MainRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext);
    return(
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="registrar" element={<RegisterPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="historial" element={<HistorialView />} /> {/* Ruta del Historial agregada */}
            <Route path="passwordRecuperation" element={<PasswordRecuperation />} />
            <Route path="passwordRecuperationConfirmation" element={<PasswordConfirmation />} />
            <Route path="passwordSender/:recipient" element={<PasswordSender/>} />
            <Route path="registerSender/:recipient" element={<RegisterSender/>} />
            <Route path="registerConfirmation/:recipient" element={<RegisterConfirmation/>} />
            <Route path="*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
    );
};

export default MainRoutes;
