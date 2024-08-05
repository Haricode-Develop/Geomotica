import { styled } from '@mui/system';

export const LoginBackground = styled('div')({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
'&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    filter: 'blur(5px)',
            zIndex: -1,
},
});

export const VideoBackground = styled('video')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    zIndex: -2,
});

export const VideoOverlay = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
});

export const LoginContainer = styled('div')({
    backgroundColor: '#A1B6D7',
    borderRadius: '10px',
    width: '60%',
    height: '60%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)',
'@media (max-width: 768px)': {
    width: '90%',
    flexDirection: 'column',
    alignItems: 'center',
},
});

export const LeftContainer = styled('div')({
    fontFamily: "'Open Sans', sans-serif",
    color: 'wheat',
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../../assets/img/principal.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    borderRadius: '10px',
    width: '50%',
    minHeight: '100%',
    padding: '20px',
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
'@media (max-width: 768px)': {
    width: '100%',
    borderRadius: '10px 10px 0 0',
},
});

export const RightContainer = styled('div')({
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '75%',
    height: '100%',
    padding: '20px',
    boxSizing: 'border-box',
'@media (max-width: 768px)': {
    width: '100%',
    padding: '20px',
},
});

export const Logo = styled('img')({
    display: 'block',
    width: '35% !important',
    paddingBottom: '20px',
    margin: '0 auto',
});

export const Input = styled('input')({
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    boxSizing: 'border-box',
});

export const Button = styled('button')({
    display: 'inline-block',
    width: 'auto',
    padding: '10px 20px',
    margin: '10px 5px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
'&:hover': {
    backgroundColor: '#555',
},
});

export const ButtonContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
'@media (max-width: 768px)': {
    flexDirection: 'column',
},
});

export const ForgotPassword = styled('a')({
    display: 'block',
    textAlign: 'center',
    color: '#007bff',
    fontSize: '1rem',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: '0 20px',
    textDecoration: 'none',
    marginTop: '20px',
});