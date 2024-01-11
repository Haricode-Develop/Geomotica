import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider } from 'react-router';
import MainRoutes from './MainRoutes';
import { AuthProviderLogin } from './context/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProviderLogin>
        <RouterProvider router = {MainRoutes}/>
    </AuthProviderLogin>
);

