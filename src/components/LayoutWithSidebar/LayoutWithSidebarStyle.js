import { styled } from '@mui/system';

export const LayoutContainer = styled('div')({
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
});

export const MainContent = styled('main')({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
});

export const ContentWrapper = styled('div')({
    flex: 1,
    overflow: 'auto',
    padding: '20px',
    boxSizing: 'border-box',
    transition: 'margin-left 0.5s ease',
    marginLeft: '120px', // Ajustar para que se adapte al tamaño del contenedor
    width: 'calc(100% - 120px)', // Ajustar para que se adapte al tamaño del contenedor
});
