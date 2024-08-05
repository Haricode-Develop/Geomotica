import React from 'react';
import { Background, ContainerConfirmations, ConfirmationMessage } from './ConfirmationsStyle';

const PasswordConfirmation = () => {
  return (
      <Background>
        <ContainerConfirmations>
          <h1 className="display-3">Recuperación Enviada</h1>
          <hr />
          <p>Se te envió un correo a la dirección de correo asignada para que puedas validar tu cuenta y se te sea asignada una contraseña temporal.</p>
          <ConfirmationMessage className="text-muted">Los mejores deseos, Geomotica</ConfirmationMessage>
        </ContainerConfirmations>
      </Background>
  );
};

export default PasswordConfirmation;