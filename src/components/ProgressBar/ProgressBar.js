import React from 'react';
import './ProgressBarStyle.css';

const ProgressBar = ({ progress, message, show, title }) => {
    return (
        show ? (
            <div className="modal-loader">
                <div className="modal-content">
                    <h2>{title}</h2>
                    <p>{message}</p>
                    <div className="progress-bar" style={{ width: `${progress}%` }}>
                        <div className="progress-bar-inner"></div>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default ProgressBar;
