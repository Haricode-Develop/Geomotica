import { styled } from '@mui/system';
import { Paper, Card, Box } from '@mui/material';

export const FloatingPanelWrapper = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    zIndex: 1000,
    padding: theme.spacing(2),
    maxHeight: '80vh',
    overflow: 'auto',
    resize: 'both',
    minHeight: '330px',
    width: '300px',
    height: '330px',
}));

export const LotCard = styled(Card)(({ theme, highlighted, selected }) => ({
    marginBottom: theme.spacing(1),
    backgroundColor: selected ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
    border: selected ? '1px solid red' : 'none',
    transition: 'transform 0.2s ease-in-out',
    transform: highlighted ? 'scale(1.05)' : 'scale(1)',
    cursor: 'pointer',
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
}));