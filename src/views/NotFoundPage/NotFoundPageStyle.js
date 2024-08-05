import { styled, keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

export const NotFoundContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontFamily: "'Arial', sans-serif",
});

export const NotFoundTitle = styled('h1')({
    fontSize: '4rem',
    margin: 0,
    animation: `${fadeInUp} 1s ease-in-out`,
});

export const NotFoundDescription = styled('p')({
    fontSize: '1.5rem',
    margin: '20px 0',
    animation: `${fadeInUp} 1s ease-in-out`,
    animationDelay: '0.3s',
    opacity: 0,
    animationFillMode: 'forwards',
});

export const NotFoundAnimation = styled('div')({
    height: 400,
    width: 400,
});