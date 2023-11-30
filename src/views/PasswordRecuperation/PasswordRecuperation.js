import React, { useState } from 'react';
import './PasswordRecuperation.css';
import { API_BASE_URL } from "../../utils/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';


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
    <div className='password-recuperation--background'>
      <div className='password-recuperation--div container'>
        <div className='password-recuperation--desc'>
          
          <h1>Recuperación de Contraseña</h1>
          <hr></hr>
          
          <p>Introduce tu direccion de correo electronico de tu cuenta y te enviaremos una contraseña temporal</p>
        </div>
        <div className='password-recuperation--form'>
          <form className='password-recuperation__form' onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label for="emailRecuperation" className="form-label">Dirección de Correo Electronico</label>
              <input type="email"
                id="emailRecuperation"
                placeholder="Correo"
                className="form-control input"
                value={emailRecovery}
                onChange={(e) => setEmailRecovery(e.target.value)} />
            </div>
            <div className='mb-3'>
              <button className='button'>Enviar</button>
            </div>
            <div className='mb-3 text-center'>
            <p><a href="Login" class="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-0-hover">Volver al Login</a></p>
            </div>
            {errorRecovery && <p className="error-message">{errorRecovery}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
