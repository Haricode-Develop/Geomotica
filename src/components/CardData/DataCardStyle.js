import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const DataCardContainer = styled(Box)({
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    width: '220px',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
'&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
},
});

export const DataCardTitle = styled('h3')({
    margin: 0,
    color: '#888',
    fontWeight: 500,
    fontSize: '1em',
});

export const DataCardValue = styled(Box)({
    color: '#000',
    fontSize: '1.5em',
    marginTop: '10px',
});