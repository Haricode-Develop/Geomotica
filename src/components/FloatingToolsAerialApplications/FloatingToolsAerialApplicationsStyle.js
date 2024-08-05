import { styled } from '@mui/system';
import { IconButton, TextField, Tooltip, Button } from '@mui/material';

export const FloatingButtonsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    background: 'white',
    padding: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
});

export const IconButtonStyled = styled(IconButton)(({ theme }) => ({
    transition: 'background-color 0.3s, color 0.3s',
    '&.active': {
        backgroundColor: '#2196f3',
        color: 'white',
    },
    '&.default': {
        backgroundColor: 'initial',
        color: 'black',
    },
}));

export const TextFieldStyled = styled(TextField)({
    margin: 'normal',
});

export const TooltipStyled = styled(Tooltip)({});

export const DraggableHeader = styled('div')({
    backgroundColor: '#f0f0f0',
    padding: '8px',
    cursor: 'move',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    userSelect: 'none'
});

export const FloatingMessage = styled('div')`
  background-color: #ffcc00;
  color: #000;
  padding: 105px 100px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  animation: float 2s ease-in-out infinite;
width: 200px;
`;

export const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    backgroundColor: '#3a3a3a',
    color: '#fff',
    minWidth: '48px',
    position: 'relative',
    '& .MuiButton-startIcon': {
        margin: '0',
    },
    '&:hover': {
        backgroundColor: '#565656',
    },
    '&:disabled': {
        backgroundColor: '#b6b6b6',
        color: '#888',
    }
}));