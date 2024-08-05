import React from 'react';
import History from "../../components/History/History";
import {
    HistoryViewContainer,
    VerticalTimelineElementContent,
    MapContainer,
    LegendContainer,
    LegendItem,
    BarIndicator
} from './HistorialViewStyle';

const HistoryView = ({ sidebarOpen }) => {
    return (
        <HistoryViewContainer sidebarOpen={sidebarOpen}>
            <History />
        </HistoryViewContainer>
    );
};

export default HistoryView;