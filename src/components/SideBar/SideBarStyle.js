import { styled } from '@mui/system';
import { Box, Modal } from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme, isOpen }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: isOpen ? '250px' : '75px',
    height: '100vh',
    backgroundColor: '#fff',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    zIndex: 1000,
    overflowY: 'auto',
    padding: '20px 0',
    transition: 'width 0.5s ease, transform 0.5s ease',
}));

export const MenuToggle = styled(Box)(({ theme, isOpen }) => ({
    position: 'fixed',
    top: '20px',
    left: isOpen ? '250px' : '75px',
    cursor: 'pointer',
    zIndex: 1000,
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '0 5px 5px 0',
    transition: 'left 0.5s ease',
}));

export const LogoSection = styled(Box)({
    width: '100%',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
});

export const LogoImage = styled('img')({
    width: '150px',
    height: 'auto',
});

export const MenuItemsContainer = styled(Box)({
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
});

export const MenuItemContainer = styled(Box)(({ theme, active }) => ({
    width: '100%',
    padding: '15px 25px',
    fontSize: '1.1em',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s, border-left 0.3s',
    color: active ? '#1d2d50' : '#333',
    backgroundColor: active ? '#d1d8e0' : 'transparent',
    borderLeft: active ? '5px solid #4a69bd' : 'none',
    '&:hover': {
        backgroundColor: '#f0f0f0',
        color: '#1d2d50',
    },
    justifyContent: 'space-between', // Added to align items
}));

export const MenuIconContainer = styled(Box)({
    marginRight: '15px',
    flexShrink: 0, // Ensure icon doesn't shrink
});

export const MenuText = styled(Box)({
    flexGrow: 1, // Ensure text takes available space
});

export const SubcategoriesContainer = styled(Box)(({ theme, expanded }) => ({
    width: '100%',
    marginLeft: '20px',
    borderLeft: '2px solid #ddd',
    paddingLeft: '10px',
    boxSizing: 'border-box',
    transition: 'max-height 0.3s ease, opacity 0.3s ease',
    maxHeight: expanded ? '1000px' : '0',
    opacity: expanded ? 1 : 0,
    overflow: 'hidden',
    color: '#333',
    backgroundColor: '#fff',
}));

export const SubcategoryItemContainer = styled(Box)(({ theme, active }) => ({
    width: '100%',
    padding: '8px 25px',
    cursor: 'pointer',
    transition: 'color 0.3s, background-color 0.3s',
    color: active ? '#1d2d50' : '#333',
    backgroundColor: active ? '#d1d8e0' : 'transparent',
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
    display: 'flex',
    justifyContent: 'space-between', // Added to align items
}));

export const TooltipContainer = styled(Box)(({ top, left }) => ({
    position: 'absolute',
    backgroundColor: '#333',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    whiteSpace: 'nowrap',
    zIndex: 1100,
    fontSize: '0.9em',
    pointerEvents: 'none',
    top: top,
    left: left,
}));

export const ModalContent = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    '@keyframes rotate': {
        from: {
            transform: 'rotate(0deg)',
        },
        to: {
            transform: 'rotate(360deg)',
        },
    },
});

export const HelpButton = styled('button')({
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,.3)',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#0b7dda',
    },
});
