import React, { useState, useRef } from "react";
import "./Confirmations.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";

const RegisterConfirmation = () => {
  const { recipient } = useParams();
  const [isSending, setIsSending] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const buttonRef = useRef(null);

  const handleResetPassword = async () => {
    if (isSending) return;
    if (isButtonPressed) return;
    setIsSending(true);
    setIsButtonPressed(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}auth/accountConfirmation`,
        {
          email: recipient,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      buttonRef.current.style.cursor = "none";
      if (response.status === 200 || response.status === 201 || response.status === 202) {
        buttonRef.current.setAttribute("disabled", true);
        buttonRef.current.style.pointerEvents = "none";
        buttonRef.current.style.backgroundColor = "#6c6c6c";
        buttonRef.current.style.cursor = "none";
        buttonRef.current.innerHTML =
          "Ya puedes ingresar a tu cuenta";
      } else {
        console.error("Error al confirmar la cuenta");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="container-fluid text-center background ">
        <div className="container container-confirmations">
          <img src={logo} alt="logo" className="logo text-dark" />
          <h2>Confirmacion de Cuenta</h2>
          <p>Hola <strong>{recipient}</strong> ,</p>
          <p>
            Recibimos una solicitud para confirmar tu cuenta, por favor haz
            clic en el enlace de abajo para activar tu cuenta:
          </p>
          <p>SOLO ES NECESARIO PRESIONAR UNA VEZ EL BOTÓN.</p>
          <button
            className="button"
            id="resetPasswordButton"
            disabled={isSending || isButtonPressed}
            onClick={handleResetPassword}
            ref={buttonRef}
          >
            {isSending || isButtonPressed ? "Cuenta Verificada" : "Confirmar cuenta"}
          </button>
          <p className="text-muted">
            Los mejores deseos, Geomotica
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterConfirmation;
