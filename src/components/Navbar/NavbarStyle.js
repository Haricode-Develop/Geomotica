import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const NavbarContainer = styled(Box)(({ theme, isSidebarOpen }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
    padding: '0 20px',
    backgroundColor: '#fff',
    position: 'fixed',
    right: 0,
    top: 0,
    zIndex: 1001,
    transition: 'width 0.5s ease',
    width: isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 75px)',
}));

export const NavbarSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
    cursor: 'pointer',
});

// Nueva sección centrada para el logo
export const NavbarSectionCentered = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1, // FlexGrow para tomar el espacio restante y centrar el logo
});

export const LanguageSelector = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: '5px 10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
});

export const FlagIcon = styled('img')({
    width: '20px',
    height: 'auto',
    marginRight: '5px',
});

export const UserInfo = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: '10px',
    '& span:first-child': {
        fontWeight: 'bold',
    },
    '& span:last-child': {
        fontSize: '0.9em',
        color: '#555',
    },
});

export const LogoImage = styled('img')({
    width: '150px',
    height: 'auto',
    marginLeft: '170px',
});
