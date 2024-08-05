import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  RegistroBackground,
  VideoBackground,
  VideoOverlay,
  RegistroContainer,
  RegistroTextContainer,
  RegistroFormContainer,
  Logo,
  Input,
  RegisterSubmitButton
} from "./RegisterStyle";
import logo from "../../assets/logo.png";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import backgroundVideo from "../../assets/login/background.mp4";
import Modal from "../../components/Modal/Modal";

function Register() {
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
        <Logo src={logo} alt="logo" className="logo text-dark" />
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
      <RegistroBackground>
        <VideoBackground autoPlay muted loop id="backgroundVideo">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </VideoBackground>
        <VideoOverlay />
        <RegistroContainer>
          <RegistroTextContainer>
            <h2>Regístrate</h2>
            <p>Ingresa tus credenciales</p>
          </RegistroTextContainer>
          <RegistroFormContainer>
            <Logo src={logo} alt="Logo de la empresa" />
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <Input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
              />
              <Input
                  type="text"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
              />
              <Input
                  type="email"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <RegisterSubmitButton type="submit">
                Registrar
              </RegisterSubmitButton>
            </form>
          </RegistroFormContainer>
        </RegistroContainer>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {ModalContent}
        </Modal>
      </RegistroBackground>
  );
}

export default Register;