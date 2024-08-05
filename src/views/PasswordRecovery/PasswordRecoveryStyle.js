import { styled } from '@mui/system';

export const Background = styled('div')({
    background: "url('../../assets/recovery/Recovery-background.jfif') no-repeat center center fixed",
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
});

export const Container = styled('div')({
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    width: '60%',
    height: '60%',
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    '@media (max-width: 768px)': {
        width: '90%',
        height: 'auto',
        padding: '20px',
    },
});

export const FormContainer = styled('div')({
    width: '100%',
});
