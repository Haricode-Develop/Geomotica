import React, { useState } from 'react';
import './Register.css';
import logo from '../../assets/logo.png';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Logica de registro aquí
    };

    return (
        <div className="register-background">
            <div className="register-container">
                <div className="register-form-container">
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
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            className="input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit" className="button">Registrar</button>
                    </form>
                    <p className="have-account">¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
