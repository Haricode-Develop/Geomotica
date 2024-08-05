import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const DetailsTableContainer = styled(Box)({
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    '& h2': {
        margin: '0 0 20px 0',
        color: '#333',
        fontWeight: 500,
    },
});

export const Table = styled('table')({
    width: '100%',
    borderCollapse: 'collapse',
});

export const TableHeading = styled('th')({
    padding: '12px',
    backgroundColor: '#f5f5f5',
    color: '#666',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
});

export const TableData = styled('td')({
    padding: '12px',
    color: '#333',
    borderBottom: '1px solid #ddd',
});