import { styled } from '@mui/system';

export const SlideBackground = styled('div')({
    background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '300px',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
    color: 'white',
    width: '100%',
    boxSizing: 'border-box', // Ensure that padding is included in the element's total width and height
    maxWidth: '100%', // Ensure that it doesn't overflow the parent container
});

export const SlideContent = styled('div')({
    position: 'relative',
    zIndex: 2,
    maxWidth: '100%', // Ensure that it doesn't overflow the parent container
});
