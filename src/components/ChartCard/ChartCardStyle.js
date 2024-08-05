import { styled } from '@mui/system';
import { Card } from '@mui/material';

export const StyledCard = styled(Card)(({ size }) => ({
    margin: '16px',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: size === 'full' ? '100%' : 'calc(50% - 32px)',
}));