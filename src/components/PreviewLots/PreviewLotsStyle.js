import { styled } from '@mui/system';
import { Box, Paper } from '@mui/material';

export const Root = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(3),
}));

export const InfoPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    maxHeight: '500px',
}));

export const MapPanel = styled(Box)(({ theme }) => ({
    flex: 2,
    height: '500px',
    position: 'relative',
}));

export const CustomPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
}));

export const LoaderOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
}));