import { styled } from '@mui/system';
import { Box, Grid } from '@mui/material';

export const Root = styled(Box)(({ theme, isSidebarOpen }) => ({
    padding: theme.spacing(3),
    width: isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 75px)',
    marginLeft: isSidebarOpen ? '110px' : '30px',
    transition: 'width 0.5s ease, margin-left 0.5s ease',
    marginTop: '25px'
}));

export const Section = styled(Grid)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));