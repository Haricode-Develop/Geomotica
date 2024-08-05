import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AgriculturalIcon from '@mui/icons-material/Agriculture';
import FlightIcon from '@mui/icons-material/Flight';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import SpaIcon from '@mui/icons-material/Spa';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { StyledPaper, ActivityList, ActivityItem, SelectedActivityItem } from './ActivitiesComponentStyle';

const activities = [
    { text: 'Cosecha Mecanica', icon: <AgriculturalIcon /> },
    { text: 'Aplicaciones Areas', icon: <FlightIcon /> },
    { text: 'Herbicidas', icon: <LocalFloristIcon /> },
    { text: 'Fertilización', icon: <SpaIcon /> },
    { text: 'Siembra', icon: <SpaIcon /> },
    { text: 'Gráficas Comparativas', icon: <AssessmentIcon /> },
];

const ActivitiesComponent = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <StyledPaper elevation={3}>
            <Typography variant="h6" component="div" gutterBottom>
                Actividades
            </Typography>
            <ActivityList>
                {activities.map((activity, index) => (
                    <React.Fragment key={activity.text}>
                        {index === selectedIndex ? (
                            <SelectedActivityItem
                                button
                                selected={index === selectedIndex}
                                onClick={(event) => handleListItemClick(event, index)}
                            >
                                <ListItemIcon>{activity.icon}</ListItemIcon>
                                <ListItemText primary={activity.text} />
                            </SelectedActivityItem>
                        ) : (
                            <ActivityItem
                                button
                                selected={index === selectedIndex}
                                onClick={(event) => handleListItemClick(event, index)}
                            >
                                <ListItemIcon>{activity.icon}</ListItemIcon>
                                <ListItemText primary={activity.text} />
                            </ActivityItem>
                        )}
                    </React.Fragment>
                ))}
            </ActivityList>
        </StyledPaper>
    );
};

export default ActivitiesComponent;