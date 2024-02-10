import React from "react";
//import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
import "./Confirmations.css";
//import logo from "../../assets/logo.png";
//import axios from "axios";
//import { API_BASE_URL } from "../../utils/config";
//import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const PasswordConfirmation = () => {
  return (
    <>
      <div className="password-recuperation--background">
        <div className="password-recuperation--div container">
          <div className="password-recuperation--desc">
          <h1 className="display-3">Recuperación Enviada</h1>
            <hr></hr>
            <p>
              Se te envio un correo a la direccion de correo asignada para que puedas validar tu cuenta y tambien que se te sea asignada una contraseña temporal
            </p>
            
          </div>
        </div>
      </div>
    </>
  );
}
export default PasswordConfirmation;
