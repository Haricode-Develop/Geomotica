import React, { useState } from 'react';
import './PasswordRecuperation.css';
import { API_BASE_URL } from "../../utils/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export const PasswordRecuperation = () => {
  const navigate = useNavigate();
  const [emailRecovery, setEmailRecovery] = useState("");
  const [errorRecovery, setErrorRecovery] = useState("");
  const { login, setUserData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/passwordRecuperation`, {
        email: emailRecovery,
      });

      if (response.data) {
        login();
        console.log("USUARIO ===============");
        console.log(response.data.user);
        setUserData(response.data.user);
        navigate("/dashboard");
      } else {
        setErrorRecovery(
          response.data.message ||
          "Error en el inicio de sesión. Por favor, intenta de nuevo."
        );
      }
    } catch (err) {
      setErrorRecovery(
        err.response?.data?.message ||
        "Error en el inicio de sesión. Por favor, intenta de nuevo."
      );
    }
  }



  return (
    <div className='password-recuperation'>
      <form className='password-recuperation__form' onSubmit={handleSubmit}>
        <input type="email"
              placeholder="Correo"
              className="input"
              value={emailRecovery}
              onChange={(e) => setEmailRecovery(e.target.value)} />
        <button className='button'>Enviar</button>
        <button className='button go-back-button'>Volver</button>
        {errorRecovery && <p className="error-message">{errorRecovery}</p>}
      </form>
      
    </div>
  )
}
