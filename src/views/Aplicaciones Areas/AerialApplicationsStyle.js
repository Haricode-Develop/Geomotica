import { styled } from '@mui/system';
import { Box, Button, IconButton, TextField, Tooltip } from '@mui/material';

export const FloatingButtonsContainer = styled('div')({
    position: 'absolute',
    top: '290px',
    right: '150px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    background: 'white',
    padding: '5px',
    borderRadius: '8px',
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

export const Polyline = styled('polyline')({
    transition: 'filter 0.3s, stroke-width 0.3s',
'&.polyline-hover': {
    filter: 'drop-shadow(0 0 5px red) drop-shadow(0 0 10px red)',
            strokeWidth: '5px !important',
},
});

export const TextFieldStyled = styled(TextField)({
    margin: 'normal',
});
