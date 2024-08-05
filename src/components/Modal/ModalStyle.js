import { styled } from '@mui/system';
import { Box, IconButton } from '@mui/material';

export const ModalOverlay = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
});

export const ModalContainer = styled(Box)({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    zIndex: 1001,
    width: '80%',
    height: '80%',
    borderRadius: '8px',
    overflow: 'auto',
});

export const ModalCloseButton = styled(IconButton)({
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
});