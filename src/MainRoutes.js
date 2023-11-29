import React, {useContext} from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/Login/Login';
import RegisterPage from './views/Register/Register';
import Dashboard from "./views/Dashboard/Dashboard";
import {AuthContext} from "./context/AuthContext";
import { PasswordRecuperation } from "./views/PasswordRecuperation/PasswordRecuperation";

const MainRoutes = () => {

    const {isAuthenticated} = useContext(AuthContext);
    return(
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="registrar" element={<RegisterPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="passwordRecuperation" element={<PasswordRecuperation />} />

            <Route path="*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />

        </Routes>
    );
};

export default MainRoutes;