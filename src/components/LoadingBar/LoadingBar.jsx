import React from 'react';
import { LoadingBarContainer, StyledLinearProgress } from './LoadingBarStyle';

const LoadingBar = ({ progress, show }) => {
    if (!show) return null;

    return (
        <LoadingBarContainer>
            <StyledLinearProgress variant="determinate" value={progress} />
        </LoadingBarContainer>
    );
};

export default LoadingBar;
