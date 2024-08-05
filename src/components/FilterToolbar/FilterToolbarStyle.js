import { styled } from '@mui/system';
import { AppBar, Button } from '@mui/material';
import { red } from '@mui/material/colors';

export const FilterBar = styled(AppBar)(({ isSidebarOpen, isDashboardIndicators }) => ({
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: 'none',
    borderBottom: '1px solid #e0e0e0',
    padding: '0 16px',
    position: isDashboardIndicators ? 'static' : 'fixed',
    top: isDashboardIndicators ? 'auto' : '135px',
    width: isDashboardIndicators ? '100%' : isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 160px)',
    transition: 'width 0.5s ease',
    zIndex: isDashboardIndicators ? 'auto' : 1099,
}));

export const FilterButton = styled(Button)({
    margin: '0 8px',
    textTransform: 'none',
    color: '#000',
    fontWeight: 'bold',
});

export const ResetButton = styled(Button)({
    marginLeft: 'auto',
    color: red[600],
    textTransform: 'none',
    fontWeight: 'bold',
});