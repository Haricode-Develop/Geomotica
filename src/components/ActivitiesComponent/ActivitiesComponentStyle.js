import { styled } from '@mui/system';
import { List, ListItem, Paper } from '@mui/material';

export const StyledPaper = styled(Paper)({
    padding: '16px',
    borderRadius: '8px',
});

export const ActivityList = styled(List)({
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
});

export const ActivityItem = styled(ListItem)({
    borderRadius: '8px',
    marginBottom: '8px',
    '&:hover': {
        backgroundColor: '#e3f2fd',
    },
});

export const SelectedActivityItem = styled(ListItem)({
    borderRadius: '8px',
    marginBottom: '8px',
    backgroundColor: '#e3f2fd',
});