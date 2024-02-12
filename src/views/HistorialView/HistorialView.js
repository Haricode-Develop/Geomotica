// HistorialView.js
import React from 'react';
import History from "../../components/History/History";
import './HistorialViewStyle.css';

const HistorialView = ({ sidebarOpen }) => {
    return (
        <div className={`historial-view ${sidebarOpen ? 'open' : 'closed'}`}>
            <History />
        </div>
    );
};


export default HistorialView;
