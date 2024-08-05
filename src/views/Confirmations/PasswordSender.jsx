import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/config';
import { Background, ContainerConfirmations, Logo, StyledButton, ConfirmationMessage } from './ConfirmationsStyle';
import logo from '../../assets/logo.png';

const PasswordSender = () => {
  const { recipient } = useParams();
  const [isSending, setIsSending] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const buttonRef = useRef(null);

  const handleResetPassword = async () => {
    if (isSending || isButtonPressed) return;
    setIsSending(true);
    setIsButtonPressed(true);
    try {
      const response = await axios.post(
          `${API_BASE_URL}auth/confirmGeneration`,
          { email: recipient },
          { headers: { 'Content-Type': 'application/json' } }
      );
      buttonRef.current.style.cursor = 'none';
      if ([200, 201, 202].includes(response.status)) {
        buttonRef.current.setAttribute('disabled', true);
        buttonRef.current.style.pointerEvents = 'none';
        buttonRef.current.style.backgroundColor = '#6c6c6c';
        buttonRef.current.innerHTML = 'Te hemos mandado un correo con la nueva contraseña';
      } else {
        console.error('Error al reiniciar la contraseña');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
      <Background>
        <ContainerConfirmations>
          <Logo src={logo} alt="logo" />
          <h2>Recuperación de Contraseña</h2>
          <p>Hola <strong>{recipient}</strong>,</p>
          <p>Recibimos una solicitud para cambiar tu contraseña, por favor haz clic en el botón de abajo para obtener una contraseña temporal:</p>
          <p>SOLO ES NECESARIO PRESIONAR UNA VEZ EL BOTÓN.</p>
          <StyledButton
              variant="contained"
              color="primary"
              disabled={isSending || isButtonPressed}
              onClick={handleResetPassword}
              ref={buttonRef}
          >
            {isSending || isButtonPressed ? 'Contraseña Enviada' : 'Reiniciar Contraseña'}
          </StyledButton>
          <ConfirmationMessage><small>Si no recibes el correo, revisa tu bandeja de spam.</small></ConfirmationMessage>
          <ConfirmationMessage className="text-muted">Los mejores deseos, Geomotica</ConfirmationMessage>
        </ContainerConfirmations>
      </Background>
  );
};

export default PasswordSender;