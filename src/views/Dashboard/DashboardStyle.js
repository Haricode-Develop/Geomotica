import { styled } from '@mui/system';
import { Button } from '@mui/material'; // Asegúrate de importar Button desde Material UI

export const DashboardContainer = styled('div')({
    display: 'flex',
});

export const MainContent = styled('main')(({ isSidebarOpen }) => ({
    marginLeft: !isSidebarOpen ? '0px' : '110px',
    width: `calc(100%)`,
    transition: 'margin-left 0.3s ease, width 0.3s ease',
}));

export const DashboardMain = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
});

export const DashboardControls = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
});

export const MapSectionContainer = styled('div')({
    marginTop: '180px',
});

export const AnalysisSection = styled('div')({
    marginTop: '20px',
});

export const HelpButton = styled('button')({
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,.3)',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#0b7dda',
    },
});

export const StyledButton = styled(Button)(({ theme }) => ({
    margin: 1,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    color: '#333',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
}));

export const StyledButtonRealizarAnalisis = styled(Button)(({ theme }) => ({
    margin: 1,
    borderRadius: 25,
    backgroundColor: '#2F88C9',
    color: '#fff',
}));