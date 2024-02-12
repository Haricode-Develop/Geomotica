import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRoutes from './MainRoutes'; // Asegúrate de que MainRoutes sea el componente que maneja todas tus rutas
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <MainRoutes />
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
