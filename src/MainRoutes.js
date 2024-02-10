import React from "react";
import { Navigate, createBrowserRouter } from 'react-router-dom';
import LoginPage from './views/Login/Login';
import RegisterPage from './views/Register/Register';
import Dashboard from "./views/Dashboard/Dashboard";
//import {AuthContext} from "./context/AuthContext";
import { PasswordRecuperation } from "./views/PasswordRecuperation/PasswordRecuperation";
import { PasswordConfirmation } from "./views/Confirmations/passwordConfirmation.js";
import { PasswordSender } from "./views/Confirmations/passwordSender.js";
import { RegisterConfirmation } from "./views/Confirmations/registerConfirmation.js";
import { RegisterSender } from "./views/Confirmations/registerSender.js";
import HistorialView from "./views/HistorialView/HistorialView";
import ProtectedRoute from "./context/ProtectedRoute.js";
import AdminPanel from "./views/AdminPanel/AdminPanel.js";


const MainRoutes = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />
    },
    {
        path: '/registrar',
        element: <RegisterPage />
    },
    {
        path: '/passwordRecuperation',
        element: <PasswordRecuperation />
    },
    {
        path: '/passwordRecuperationConfirmation',
        element: <PasswordConfirmation />
    },
    {
        path: '/passwordSender/:recipient',
        element: <PasswordSender />
    },
    {
        path: '/registerSender/:recipient',
        element: <RegisterSender />
    },
    {
        path: '/registerConfirmation/:recipient',
        element: <RegisterConfirmation />
    },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/adminPanel',
                element: <AdminPanel />
            },{
            path: '/historial',
                element: <HistorialView />
            }
        ]

    },
    {
        path: '*',
        element: <Navigate to="/" />
    }
]);

export default MainRoutes;