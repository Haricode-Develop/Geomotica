import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, Switch, FormControlLabel, TextField, MenuItem, Button } from '@mui/material';
import { styled } from '@mui/system';
import LotesVistaPrevia from '../../components/LotesVistaPrevia/lotesVistaPrevia';

const Root = styled(Box)(({ theme, isSidebarOpen }) => ({
    padding: theme.spacing(3),
    width: isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)',
    marginLeft: isSidebarOpen ? '150px' : '30px',
    transition: 'width 0.5s ease, margin-left 0.5s ease',
}));

const Section = styled(Grid)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const SaveButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const Configuracion = ({ isSidebarOpen }) => {
    const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' });
    const [preferredTime, setPreferredTime] = useState('Afternoons');
    const [notifications, setNotifications] = useState({ daily: true, weekly: false });
    const userData = JSON.parse(localStorage.getItem("userData"));

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setWorkingHours((prev) => ({ ...prev, [name]: value }));
    };

    const handlePreferredTimeChange = (event) => {
        setPreferredTime(event.target.value);
    };

    const handleNotificationChange = (event) => {
        const { name, checked } = event.target;
        setNotifications((prev) => ({ ...prev, [name]: checked }));
    };

    return (
        <Root isSidebarOpen={isSidebarOpen}>
            <Typography variant="h4" gutterBottom>
                Configuración
            </Typography>
            <Grid container spacing={3}>
                <Section item xs={12}>
                    <LotesVistaPrevia userId={userData.ID_USUARIO} />
                </Section>
            </Grid>
        </Root>
    );
};

export default Configuracion;