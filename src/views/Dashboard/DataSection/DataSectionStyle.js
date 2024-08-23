import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const DataSectionContainer = styled('section')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
});

export const CardsContainer = styled('div')({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
});

export const TableContainer = styled('div')({
    width: '100%',
    margin: '20px 0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

export const TableHeader = styled('h2')({
    margin: 0,
    padding: '10px',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    color: '#333',
    fontSize: '1.2em',
});

export const StyledTable = styled('table')({
    width: '100%',
    borderCollapse: 'collapse',
});

export const TableCell = styled('td')({
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #e0e0e0',
});

export const TableHeaderCell = styled(TableCell)({
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontWeight: 500,
});

export const FloatingCard = styled(Paper)(({ theme }) => ({
    padding: '20px',
    margin: '10px',
    borderRadius: '15px',
    backgroundColor: '#e0f7fa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none',  // Eliminamos la sombra
}));

export const IconContainer = styled('div')({
    marginBottom: '10px',
});

export const CardTitle = styled(Typography)({
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#00796b',
    marginBottom: '10px',
});

export const CountText = styled(Typography)({
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#00796b',
});
