import React from 'react';
import './PasswordRecuperation.css';
import { API_BASE_URL } from "../../utils/config";
import axios from "axios";

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: email,
          password: password,
        });
  
        if (response.data) {
          login();
          console.log("USUARIO ===============");
          console.log(response.data.user);
          setUserData(response.data.user);
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
            "Error en el inicio de sesión. Por favor, intenta de nuevo."
        );
      }
}


export const PasswordRecuperation = () => {
  return (
    <div className='password-recuperation'>
        <form className='password-recuperation__form' onSubmit={handleSubmit}>
            <input type='email' placeholder='Correo' className='input' />
            <button className='button'>Enviar</button>
            <button className='button go-back-button'>Volver</button>
            
        </form>
    </div>
  )
}
