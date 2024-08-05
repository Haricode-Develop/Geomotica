import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const ModalLoader = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
});

export const ModalContent = styled(Box)({
    width: '50%!important',
    background: 'white!important',
    padding: '20px!important',
    borderRadius: '10px!important',
    textAlign: 'center!important',
});

export const ProgressContainer = styled(Box)({
    width: '100%',
    background: '#f3f3f3',
    borderRadius: '5px',
    overflow: 'hidden',
});

export const ProgressBarInner = styled(Box)({
    height: '10px',
    background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
    transition: 'width 0.5s ease-in-out',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    opacity: 0.9,
    animation: 'loadAnimation 2s infinite',
    '@keyframes loadAnimation': {
        '0%': { opacity: 0.9 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0.9 },
    },
});

export const ProgressText = styled(Box)({
    marginTop: '10px',
    fontSize: '0.9em',
    color: '#333',
});