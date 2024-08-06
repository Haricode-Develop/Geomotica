import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/config";
import axios from "axios";

// Import Material-UI components
import {
  TextField,
  Container,
  Grid,
} from "@mui/material";

// Import styles
import {
  LoginBackground,
  VideoBackground,
  VideoOverlay,
  LoginContainer,
  LeftContainer,
  RightContainer,
  Logo,
  StyledButton,
  StyledForgotPassword,
} from "./LoginStyle";

// Import assets
import logo from "../../assets/img/logo.png";
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

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate("/passwordRecovery");
  };

  return (
      <LoginBackground>
        <VideoBackground autoPlay muted loop>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </VideoBackground>
        <VideoOverlay />
        <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              position: 'relative',
              zIndex: 2,
            }}
        >
          <LoginContainer>
            <LeftContainer>
              <Logo src={logo} alt="Company Logo" />
            </LeftContainer>
            <RightContainer>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ marginTop: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <StyledButton
                        fullWidth
                        variant="outlined"
                        onClick={handleRegisterClick}
                    >
                      Register
                    </StyledButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledButton
                        fullWidth
                        variant="contained"
                        type="submit"
                    >
                      Login
                    </StyledButton>
                  </Grid>
                </Grid>
              </form>
              <StyledForgotPassword
                  href="#"
                  onClick={handleForgotPasswordClick}
              >
                Forgot your password?
              </StyledForgotPassword>
            </RightContainer>
          </LoginContainer>
        </Container>
      </LoginBackground>
  );
};

export default Login;
