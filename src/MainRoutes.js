import React, {useContext} from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/Login/Login';
import RegisterPage from './views/Register/Register';
import Dashboard from "./views/Dashboard/Dashboard";
import {AuthContext} from "./context/AuthContext";

const MainRoutes = () => {

    const {isAuthenticated} = useContext(AuthContext);
    return(
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="registrar" element={<RegisterPage />} />
            <Route path="dashboard" element={<Dashboard />} />

        </Routes>
    );
};

export default MainRoutes;