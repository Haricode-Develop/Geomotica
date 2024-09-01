import React, { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AgriculturalIcon from '@mui/icons-material/Agriculture';
import FlightIcon from '@mui/icons-material/Flight';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import SpaIcon from '@mui/icons-material/Spa';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { StyledPaper, ActivityList, ActivityItem, SelectedActivityItem } from './ActivitiesComponentStyle';

const activities = [
    { id: 'COSECHA_MECANICA', text: 'Cosecha Mecanica', icon: <AgriculturalIcon /> },
    { id: 'APLICACIONES_AEREAS', text: 'Aplicaciones Areas', icon: <FlightIcon /> },
    { id: 'HERBICIDAS', text: 'Herbicidas', icon: <LocalFloristIcon /> },
    { id: 'FERTILIZACION', text: 'Fertilización', icon: <SpaIcon /> },
    { id: 'SIEMBRA', text: 'Siembra', icon: <SpaIcon /> },
    { id: 'GRAFICAS_COMPARATIVAS', text: 'Gráficas Comparativas', icon: <AssessmentIcon /> },
];

const ActivitiesComponent = ({ onSelectActivity }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    useEffect(() => {
        onSelectActivity(activities[0].id);
    }, [onSelectActivity]);

    const handleListItemClick = (event, index, activity) => {
        setSelectedIndex(index);
        onSelectActivity(activity.id);
    };

    return (
        <StyledPaper elevation={3}>
            <Typography variant="h6" component="div" gutterBottom>
                Actividades
            </Typography>
            <ActivityList>
                {activities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                        {index === selectedIndex ? (
                            <SelectedActivityItem
                                button
                                selected={index === selectedIndex}
                                onClick={(event) => handleListItemClick(event, index, activity)}
                            >
                                <ListItemIcon>{activity.icon}</ListItemIcon>
                                <ListItemText primary={activity.text} />
                            </SelectedActivityItem>
                        ) : (
                            <ActivityItem
                                button
                                selected={index === selectedIndex}
                                onClick={(event) => handleListItemClick(event, index, activity)}
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
