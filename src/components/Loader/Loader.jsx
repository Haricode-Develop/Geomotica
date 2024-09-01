import React from 'react';
import { Box } from '@mui/material';
import { LoaderContainer, Spinner } from './LoaderStyle';

const Loader = () => {
    return (
        <LoaderContainer>
            <Spinner />
        </LoaderContainer>
    );
};

export default Loader;