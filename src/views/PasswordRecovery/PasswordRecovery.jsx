import React, { useState } from 'react';
import { Background, Container, FormContainer } from './PasswordRecoveryStyle';
import { API_BASE_URL } from "../../utils/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const [emailRecovery, setEmailRecovery] = useState("");
  const [errorRecovery, setErrorRecovery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}auth/passwordRecuperation`, {
        email: emailRecovery,
      });

      if (response.data) {
        navigate("/passwordRecuperationConfirmation");
      } else {
        setErrorRecovery(
            response.data.message ||
            "Login error. Please try again."
        );
      }
    } catch (err) {
      setErrorRecovery(
          err.response?.data?.message ||
          "Login error. Please try again."
      );
    }
  }

  return (
      <Background>
        <Container className='container'>
          <div className='password-recovery--desc'>
            <h1>Password Recovery</h1>
            <hr />
            <p>Enter the email address associated with your account and we'll send you a temporary password.</p>
          </div>
          <FormContainer>
            <form className='password-recovery__form' onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor="emailRecovery" className="form-label">Email Address</label>
                <input
                    type="email"
                    id="emailRecovery"
                    placeholder="Email"
                    className="form-control input"
                    value={emailRecovery}
                    onChange={(e) => setEmailRecovery(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <button className='button'>Send</button>
              </div>
              <div className='mb-3 text-center'>
                <p><a href="Login" className="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-0-hover">Back to Login</a></p>
              </div>
              {errorRecovery && <p className="error-message">{errorRecovery}</p>}
            </form>
          </FormContainer>
        </Container>
      </Background>
  );
}

export default PasswordRecovery;
