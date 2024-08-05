import { styled } from '@mui/system';

export const RegistroBackground = styled('div')({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
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

export const RegistroContainer = styled('div')({
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../../assets/img/principal.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    borderRadius: '10px',
    width: '60%',
    minHeight: '60%',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
        width: '100%',
        minHeight: 'auto',
        flexDirection: 'column',
    },
});

export const RegistroTextContainer = styled('div')({
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    zIndex: 1,
    width: '50%',
});

export const RegistroFormContainer = styled('div')({
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '50%',
    minHeight: '100%',
    overflowY: 'auto',
    padding: '20px',
    boxSizing: 'border-box',
    '@media (max-width: 768px)': {
        width: '100%',
        margin: '10px 0',
    },
});

export const Logo = styled('img')({
    display: 'block',
    width: '70%',
    margin: '0 auto 20px auto',
    '@media (max-width: 768px)': {
        width: '50%',
    },
});

export const Input = styled('input')({
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    boxSizing: 'border-box',
});

export const Button = styled('button')({
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
});

export const RegisterSubmitButton = styled(Button)({
    marginTop: '10px',
});