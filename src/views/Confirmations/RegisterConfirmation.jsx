import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/config';
import { Background, ContainerConfirmations, Logo, StyledButton, ConfirmationMessage } from './ConfirmationsStyle';
import logo from '../../assets/logo.png';

const RegisterConfirmation = () => {
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
          `${API_BASE_URL}auth/accountConfirmation`,
          { email: recipient },
          { headers: { 'Content-Type': 'application/json' } }
      );
      buttonRef.current.style.cursor = 'none';
      if ([200, 201, 202].includes(response.status)) {
        buttonRef.current.setAttribute('disabled', true);
        buttonRef.current.style.pointerEvents = 'none';
        buttonRef.current.style.backgroundColor = '#6c6c6c';
        buttonRef.current.innerHTML = 'Ya puedes ingresar a tu cuenta';
      } else {
        console.error('Error al confirmar la cuenta');
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
          <h2>Confirmación de Cuenta</h2>
          <p>Hola <strong>{recipient}</strong>,</p>
          <p>Recibimos una solicitud para confirmar tu cuenta, por favor haz clic en el botón de abajo para activar tu cuenta:</p>
          <p>SOLO ES NECESARIO PRESIONAR UNA VEZ EL BOTÓN.</p>
          <StyledButton
              variant="contained"
              color="primary"
              disabled={isSending || isButtonPressed}
              onClick={handleResetPassword}
              ref={buttonRef}
          >
            {isSending || isButtonPressed ? 'Cuenta Verificada' : 'Confirmar cuenta'}
          </StyledButton>
          <ConfirmationMessage className="text-muted">Los mejores deseos, Geomotica</ConfirmationMessage>
        </ContainerConfirmations>
      </Background>
  );
};

export default RegisterConfirmation;