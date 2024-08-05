import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';
import { Background, ContainerConfirmations, Logo, StyledButton, ConfirmationMessage } from './ConfirmationsStyle'; // Asegúrate de importar ConfirmationMessage
import logo from '../../assets/logo.png';

const RegisterSender = () => {
  const { recipient } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const emailSender = async () => {
      try {
        const response = await axios.post(
            `${API_BASE_URL}auth/confirmGeneration`,
            { email: recipient },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (![200, 201, 202].includes(response.status)) {
          console.error('Error al reiniciar la contraseña');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
    emailSender();
  }, [recipient]);

  const handleRegisterClick = () => {
    navigate('/login');
  };

  return (
      <Background>
        <ContainerConfirmations>
          <Logo src={logo} alt="logo" />
          <h2>Confirmación de Cuenta</h2>
          <p>¡Bienvenido nuevo usuario,</p>
          <p>hemos enviado un correo a <strong>{recipient}</strong> con un enlace para activar su cuenta.</p>
          <p><small>Si no recibes el correo, revisa tu bandeja de spam.</small></p>
          <StyledButton variant="contained" color="primary" onClick={handleRegisterClick}>
            Volver
          </StyledButton>
          <ConfirmationMessage>Los mejores deseos, Geomotica</ConfirmationMessage>
        </ContainerConfirmations>
      </Background>
  );
};

export default RegisterSender;