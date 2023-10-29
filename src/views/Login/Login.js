import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/logo.png';
import axios from 'axios';
import {API_BASE_URL} from "../../utils/config";

import { useAuth } from '../../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, setUserData } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: email,
                password: password
            });

            if (response.data) {
                login();
                console.log("USUARIO ===============");
                console.log(response.data.user);
                setUserData(response.data.user);
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Error en el inicio de sesión. Por favor, intenta de nuevo.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el inicio de sesión. Por favor, intenta de nuevo.');
        }
    };

    const handleRegisterClick = () => {
        navigate('/registrar');
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <div className="login-form-container">
                    <img src={logo} alt="Logo de la empresa" className="logo" />
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Correo"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="button-container">
                            <button type="submit" className="button login-button">Iniciar sesión</button>
                            <button type="button" className="button register-button" onClick={handleRegisterClick}>Registrar</button>
                        </div>
                    </form>
                    <p className="forgot-password">¿Haz olvidado tu contraseña?</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
