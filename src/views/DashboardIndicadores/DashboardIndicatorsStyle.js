import { styled } from '@mui/system';

export const DashboardContainer = styled('div')(({ isSidebarOpen }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    transition: 'margin-left 0.3s',
    marginLeft: isSidebarOpen ? '110px' : '60px',
}));

export const ContentContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '16px',
});

export const LeftPanel = styled('div')({
    flex: '0 0 250px',
    marginRight: '16px',
});

export const RightPanel = styled('div')({
    flex: '1',
});

export const CardsContainer = styled('div')({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '16px',
});