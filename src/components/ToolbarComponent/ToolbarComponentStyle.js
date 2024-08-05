import { styled } from '@mui/system';
import { Box, Button, IconButton, Tooltip } from '@mui/material';

export const ToolbarContainer = styled(Box)(({ theme, isSidebarOpen }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    padding: '10px 20px',
    color: '#fff',
    position: 'fixed',
    top: '60px',
    width: isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 160px)',
    transition: 'width 0.5s ease',
    zIndex: 1001,
    height: '75px',
    justifyContent: 'space-between',
    '& .MuiButton-root': {
        margin: theme.spacing(1),
    },
}));

// Nueva sección para las agrupaciones de botones
export const ButtonSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
});

export const ButtonGroup = styled(Box)({
    display: 'flex',
    alignItems: 'center',
});

export const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    backgroundColor: '#3a3a3a',
    color: '#fff',
    minWidth: '48px',
    fontSize: '11px',
    '& .MuiButton-startIcon': {
        margin: '0',
    },
    '&:hover': {
        backgroundColor: '#565656',
    },
    '&:disabled': {
        backgroundColor: '#b6b6b6',
        color: '#888',
    },
}));

export const IconButtonStyled = styled(IconButton)(({ theme, active }) => ({
    margin: theme.spacing(1),
    padding: 0,
    color: active ? '#0574C8' : 'default',
    '&:hover': {
        backgroundColor: active ? 'rgba(255, 255, 0, 0.1)' : 'inherit',
    },
}));

export const TooltipStyled = styled(Tooltip)({});
