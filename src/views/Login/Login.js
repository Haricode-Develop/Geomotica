import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import axios from 'axios';

import { useAuth } from '../../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/login', {
                CorreoElectronico: email,
                Contraseña: password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                login();
            } else {
                setError('Error en el inicio de sesión. Por favor, intenta de nuevo.');
            }
        } catch (err) {
            setError('Error en el inicio de sesión. Por favor, intenta de nuevo.');
        }
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
                            <button type="button" className="button register-button">Registrar</button>
                        </div>
                    </form>
                    <p className="forgot-password">¿Haz olvidado tu contraseña?</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
