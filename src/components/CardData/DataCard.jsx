import React from 'react';
import { DataCardContainer, DataCardTitle, DataCardValue } from './DataCardStyle';

const DataCard = ({ title, children }) => {
    return (
        <DataCardContainer>
            <DataCardTitle>{title}</DataCardTitle>
            <DataCardValue>{children}</DataCardValue>
        </DataCardContainer>
    );
};

export default DataCard;