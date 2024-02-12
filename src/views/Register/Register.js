import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import {AuthContext} from "../../context/AuthContext";

function Registro() {

  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext); // Usando el contexto para verificar si el usuario está autenticado

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}auth/register`, {
        nombre,
        apellido,
        email,
        password,
      });
      if (response.data && response.data.success) {
        navigate(`/registerSender/${email}`); // Navegar a una ruta diferente donde se le pida al usuario que confirme su correo
      } else {
        setError("Error al registrarse. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse. Por favor, intenta de nuevo.");
    }
  };

  return (
      <div className="registro-background">
        <div className="registro-container">
          <div className="registro-form-container">
            <img src={logo} alt="Logo de la empresa" className="logo" />
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  placeholder="Nombre"
                  className="input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
              />
              <input
                  type="text"
                  placeholder="Apellido"
                  className="input"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
              />
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
                  placeholder="Confirmar Contraseña"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" className="button register-submit-button">
                Registrar
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}

export default Registro;
