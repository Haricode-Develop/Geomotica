import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRoutes from './MainRoutes';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from './context/SocketContext';
import {CompanyProvider} from "./context/CompanyContext";
import {SidebarProvider} from "./context/SidebarContext";
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <SocketProvider>
                    <CompanyProvider>
                        <SidebarProvider>
                        <MainRoutes />
                        </SidebarProvider>
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    </CompanyProvider>,
                </SocketProvider>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
