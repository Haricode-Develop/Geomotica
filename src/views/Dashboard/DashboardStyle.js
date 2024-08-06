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