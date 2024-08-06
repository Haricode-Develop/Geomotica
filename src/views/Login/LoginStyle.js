import { styled } from '@mui/system';
import { Button, Link } from '@mui/material';

// Background for the login page
export const LoginBackground = styled('div')({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
});

// Video background for dynamic visuals
export const VideoBackground = styled('video')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    zIndex: 0,
});

// Dark overlay to enhance text readability
export const VideoOverlay = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
});

// Container for the login form
export const LoginContainer = styled('div')({
    backgroundColor: '#ffffff', // Solid white for clarity
    borderRadius: '10px',
    width: '80%',
    maxWidth: '900px',
    height: '70vh',
    display: 'flex',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    zIndex: 2, // Ensure it is above the overlay
    overflow: 'hidden',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        width: '95%',
    },
});

// Left section for additional information
export const LeftContainer = styled('div')({
    backgroundColor: '#f5f5f5',
    width: '50%',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)',
    '@media (max-width: 768px)': {
        width: '100%',
        padding: '20px',
        clipPath: 'none',
        borderRadius: '10px 10px 0 0',
    },
    position: 'relative',
    zIndex: 3, // Above background shapes
    background: `linear-gradient(
    135deg,
    #f5f5f5 50%,
    #e3e3e3 50%
  )`,
});

// Right section for login form
export const RightContainer = styled('div')({
    width: '50%',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (max-width: 768px)': {
        width: '100%',
        padding: '20px',
    },
});

// Company logo styling
export const Logo = styled('img')({
    width: '85%', // Larger logo size
    maxWidth: '300px',
    marginBottom: '20px',
    alignSelf: 'center',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)', // Slight enlargement on hover
    },
});

// Custom styled button for consistency
export const StyledButton = styled(Button)({
    backgroundColor: '#1976d2', // Blue color for branding
    color: '#fff',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#115293',
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
});

// Forgot Password link styling
export const StyledForgotPassword = styled(Link)({
    display: 'block',
    textAlign: 'center',
    color: '#1976d2', // Matches button color
    fontSize: '0.9rem',
    textDecoration: 'none',
    marginTop: '15px',
    transition: 'color 0.3s ease',
    '&:hover': {
        color: '#115293',
    },
});
