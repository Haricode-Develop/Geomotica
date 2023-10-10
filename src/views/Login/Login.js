import React from 'react';
import './Login.css';
// Importa tu logo aquí
import logo from '../assets/your_logo.png';

function Login() {
    return (
        <div className="login-background">
            <div className="login-container">
                <div className="login-form-container">
                    <img src={logo} alt="Logo de la empresa" className="logo" />
                    <form>
                        <input type="email" placeholder="Correo" className="input" />
                        <input type="password" placeholder="Contraseña" className="input" />
                        <button type="submit" className="button">Iniciar sesión</button>
                    </form>
                    <p className="forgot-password">¿Haz olvidado tu contraseña?</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
