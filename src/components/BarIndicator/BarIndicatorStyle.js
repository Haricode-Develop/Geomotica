import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const BarIndicatorWrapper = styled(Box)({
    position: 'absolute',
    top: '250px',
    right: '50px',
    background: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '220px',
    height: 'auto',
});

export const DragHandle = styled(Box)({
    cursor: 'grab',
    backgroundColor: '#e0e0e0',
    padding: '8px',
    textAlign: 'center',
    borderRadius: '4px 4px 0 0',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export const BarTitle = styled(Box)({
    width: '100%',
    fontSize: '16px',
    marginBottom: '20px',
    color: '#333',
    fontWeight: 600,
    textAlign: 'center',
});

export const LabelContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

export const LabelItem = styled(Box)({
    fontSize: '14px',
    color: '#fff',
    fontWeight: 500,
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px',
    textAlign: 'center',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
    '&:last-child': {
        marginBottom: 0,
    },
    '&:hover': {
        opacity: 0.8,
    },
});
