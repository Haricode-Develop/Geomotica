import { styled } from '@mui/system';
import { FormControl } from '@mui/material';

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
    margin: theme.spacing(2),  // Increased margin for better separation
    minWidth: 200,
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
        borderRadius: 25,
        padding: '5px 14px',
        backgroundColor: '#fff',
        color: '#000',

    },
    '& .MuiInputLabel-root': {
        left: '10px',
        top: '-10px',
        color: '#fff',
        fontSize: '11px',
    },
    '& .MuiSelect-select': {
        padding: '10px 10px',
    },
}));