import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { AuthContext } from "../../context/AuthContext.js";
import {toast } from 'react-toastify';

import backgroundVideo from "../../assets/login/background.mp4"
const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/mapeo");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}auth/login`, {
        email,
        password,
      });
      if (response.data) {
        login(response.data);
        navigate("/mapeo");
      } else {
        setError("Error en el inicio de sesión. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al procesar la solicitud.");
    }
  };


  const handleRegisterClick = () => {
    navigate("/registrar");
  };
  const handleForgotPasswordClick = () => {
    navigate("/passwordRecuperation");
  };



  return (
    <div className="login-background">
      <video autoPlay muted loop id="backgroundVideo" className="video-background">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
      <header />
      <div className="login-container ">
        <div className="login-form-container--left container">
          <h2>¡Bienvenido!</h2>
          <p>Ingresa para acceder a tu cuenta.</p>
        </div>
        <div className="login-form-container--right container">
          <img src={logo} alt="Logo de la empresa" className="logo" />
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-center">
              <label for="emailInput" class="form-label">
               Correo Electrónico:
              </label>
              <input
                type="email"
                id="emailInput"
                placeholder="persona@correo.com"
                className="input form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3 text-center">
              <label for="passwordInput" class="form-label">
               Contraseña:
              </label>
              <input
                type="password"
                id="passwordInput"
                placeholder="**************"
                className="input form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="button-container">
              <button
                type="button"
                className="button register-button"
                style={{ margin: "10px" }}
                onClick={handleRegisterClick}
              >
                Registrar
              </button>
              <button
                type="submit"
                className="button login-button"
                style={{ margin: "10px" }}
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          <a
            href="passwordRecuperation"
            className="forgot-password"
            style={{ textDecoration: "none" }}
            onClick={handleForgotPasswordClick}
          >
            ¿Has olvidado tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
