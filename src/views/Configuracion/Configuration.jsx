import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Root, Section } from './ConfigurationStyle';
import LotesVistaPrevia from '../../components/PreviewLots/PreviewLots';

const Configuration = ({ isSidebarOpen }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));

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

export default Configuration;