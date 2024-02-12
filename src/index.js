import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRoutes from './MainRoutes'; // Asegúrate de que MainRoutes sea el componente que maneja todas tus rutas
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Importa ToastContainer
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <MainRoutes />
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
