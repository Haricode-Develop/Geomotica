import { styled } from '@mui/system';

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