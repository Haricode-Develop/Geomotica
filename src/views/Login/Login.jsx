import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  LoginBackground,
  VideoBackground,
  VideoOverlay,
  LoginContainer,
  LeftContainer,
  RightContainer,
  Logo,
  Input,
  Button,
  ButtonContainer,
  ForgotPassword
} from './LoginStyle';
import logo from "../../assets/img/logo.png";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import backgroundVideo from "../../assets/login/background.mp4";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}auth/login`, {
        email,
        password,
      });
      if (response.data) {
        login(response.data);
        navigate("/");
      } else {
        toast.error("Login error. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error processing request.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };
  const handleForgotPasswordClick = () => {
    navigate("/passwordRecovery");
  };

  return (
      <LoginBackground>
        <VideoBackground autoPlay muted loop id="backgroundVideo">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </VideoBackground>
        <VideoOverlay />
        <LoginContainer>
          <LeftContainer />
          <RightContainer>
            <Logo src={logo} alt="Company Logo" />
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-center">
                <label htmlFor="emailInput" className="form-label">
                  Email:
                </label>
                <Input
                    type="email"
                    id="emailInput"
                    placeholder="person@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3 text-center">
                <label htmlFor="passwordInput" className="form-label">
                  Password:
                </label>
                <Input
                    type="password"
                    id="passwordInput"
                    placeholder="**************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <ButtonContainer>
                <Button
                    type="button"
                    onClick={handleRegisterClick}
                >
                  Register
                </Button>
                <Button
                    type="submit"
                >
                  Login
                </Button>
              </ButtonContainer>
            </form>
            <ForgotPassword
                href="passwordRecovery"
                onClick={handleForgotPasswordClick}
            >
              Forgot your password?
            </ForgotPassword>
          </RightContainer>
        </LoginContainer>
      </LoginBackground>
  );
}

export default Login;