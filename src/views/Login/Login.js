import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { useAuth } from "../../context/AuthContext.js";
import "bootstrap/dist/css/bootstrap.min.css";
import bcrypt from "bcryptjs";

function Login() {
  //verificacion de credenciales para no saltarse al login o al registrar
  if (
    sessionStorage.getItem("Token") != null ||
    sessionStorage.getItem("userData") != null
  ) {
    window.location.href = "/dashboard";
  }

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, setUserData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}auth/login`, {
        email: email,
        password: password,
      });
      if (response.data) {
        setUserData(response.data.user);
        const user = response.data.user;
        sessionStorage.setItem("Token", response.data.token);
        sessionStorage.setItem("userData", JSON.stringify(user));
        sessionStorage.setItem("rol", user.ID_Rol);
        login(response.data.user);
        navigate("/dashboard");
      } else {
        setError(
          response.data.message ||
            "Error en el inicio de sesión. Por favor, intenta de nuevo."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error en el inicio de sesión. Por favor, intenta de nuevo. 2"
      );
      console.log(err);
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
      <header />
      <div className="login-container ">
        <div className="login-form-container--left container">
          <h2>¡Bienvenido de Vuelta!</h2>
          <p>Ingresa para acceder a tu cuenta.</p>
          <p>Recuerda no compartir tu contraseña con nadie</p>
        </div>
        <div className="login-form-container--right container">
          <img src={logo} alt="Logo de la empresa" className="logo" />
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-center">
              <label for="emailInput" class="form-label">
                Introduce tu Correo Electronico:
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
                Introduce tu Contraseña:
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
