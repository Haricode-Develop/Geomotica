import React from 'react';
import './cardDataStyle.css';

const DataCard = ({ title, children }) => {
    return (
        <div className="data-card">
            <h3>{title}</h3>
            <div className="data-value">{children}</div>
        </div>
    );
};

export default DataCard;
