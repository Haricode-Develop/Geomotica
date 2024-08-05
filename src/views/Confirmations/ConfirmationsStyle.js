import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

export const Background = styled(Box)({
    backgroundColor: '#F2F2F2',
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export const ContainerConfirmations = styled(Box)({
    backgroundColor: '#FFFFFF',
    width: '50%',
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    padding: '10%',
    textAlign: 'center',
});

export const Logo = styled('img')({
    width: '50%',
});

export const StyledButton = styled(Button)({
    marginTop: '10px',
});

export const ConfirmationMessage = styled('p')({
    marginTop: '20px',
});