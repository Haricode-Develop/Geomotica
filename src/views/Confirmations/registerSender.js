import React from "react";
import "./Confirmations.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { useParams, useNavigate } from "react-router-dom";

function RegisterSender() {
  const { recipient } = useParams();
  const navigate = useNavigate();

  const emailSender = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/confirmGeneration`,
        {
          email: recipient,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
      } else {
        console.error("Error al reiniciar la contraseña");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };


  const handleRegisterClick = () => {
    navigate("/login");
  };
  emailSender();

  return (
    <>
    
      <div className="container-fluid text-center background ">
        <div className="container container-confirmations">
          <img src={logo} alt="logo" className="logo text-dark" />
          <h2>Confirmacion de Cuenta</h2>
          <p>¡Bienvenido nuevo usuario ,</p>
          <p>
            hemos enviado un correo a <strong>{recipient}</strong> con un enlace
            el cual activara su cuenta.
          </p>
          <p>
            {" "}
            <small>Si no recibes el correo, revisa tu bandeja de spam.</small>
          </p>
          <div>
            <button className="btn btn-primary" onClick={handleRegisterClick}>
              Volver
            </button>
          </div>
          <p className="text-muted">Los mejores deseos, Geomotica</p>
        </div>
      </div>
    </>
  );
}

export { RegisterSender };
