import { styled } from '@mui/system';

export const HistoryViewContainer = styled('div')(({ theme, sidebarOpen }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    height: '100vh',
    width: '100%',
    overflow: 'auto',
    paddingLeft: sidebarOpen ? '250px' : '20px',
transition: 'padding-left 0.3s ease',
}));

export const VerticalTimelineElementContent = styled('div')({
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease',
'&:hover': {
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
},
});

export const MapContainer = styled('div')({
    position: 'relative',
    height: '100%',
    width: '100%',
});

export const LegendContainer = styled('div')({
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 400,
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    padding: '10px',
    pointerEvents: 'none',
});

export const LegendItem = styled('div')({
    pointerEvents: 'auto',
'&.selected': {
    backgroundColor: '#4a83ec',
    color: 'white',
},
});

export const BarIndicator = styled('div')({
    position: 'absolute',
    top: '100px !important',
});