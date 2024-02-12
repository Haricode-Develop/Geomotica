// Registro.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import backgroundVideo from "../../assets/login/background.mp4";
import Modal from "../../components/Modal/Modal"; // Asegúrate de importar el componente Modal correctamente

function Registro() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

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
        setIsModalOpen(true); // Abre el modal en vez de navegar
      } else {
        setError("Error al registrarse. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse. Por favor, intenta de nuevo.");
    }
  };

  // Contenido del modal para confirmación de registro
  const ModalContent = (
      <>
        <img src={logo} alt="logo" className="logo text-dark" />
        <h2>Confirmación de Cuenta</h2>
        <p>¡Bienvenido nuevo usuario!</p>
        <p>hemos enviado un correo a <strong>{email}</strong> con un enlace el cual activará su cuenta.</p>
        <p><small>Si no recibes el correo, revisa tu bandeja de spam.</small></p>
        <div>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        </div>
      </>
  );

  return (
      <div className="registro-background">
        <video autoPlay muted loop id="backgroundVideo" className="video-background">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
        <div className="registro-container">
          <div className="registro-text-container">
            <h2>Regístrate</h2>
            <p>Ingresa tus credenciales</p>
          </div>
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {ModalContent}
        </Modal>
      </div>
  );
}

export default Registro;
