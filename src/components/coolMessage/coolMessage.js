import React from 'react';
import './coolMessageStyle.css'; // Importamos el CSS para el estilo

const CoolMessage = ({ text }) => {
    return (
        <div className="cool-message-container">
            <p className="cool-message-text">{text}</p>
        </div>
    );
};

export default CoolMessage;
