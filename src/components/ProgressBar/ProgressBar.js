import React from 'react';
import './ProgressBarStyle.css';

const ProgressBar = ({ progress, show }) => {
    return (
        show ? (
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}>
                    <div className="progress-bar-inner"></div>
                </div>
            </div>
        ) : null
    );
};

export default ProgressBar;
