import { Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

export const LoadingBarContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1100,
});

export const StyledLinearProgress = styled(LinearProgress)({
    height: '9px',
    borderRadius: '0px',
    backgroundColor: '#f0f0f0',
    '& .MuiLinearProgress-bar': {
        borderRadius: '0px',
        backgroundColor: '#3f51b5',
    },
});
