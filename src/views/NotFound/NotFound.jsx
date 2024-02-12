// NotFoundPage.js
import React from 'react';
import './NotFoundStyle.css';
import Lottie from 'react-lottie';

import animationData from '../../assets/img/astronaut-lottie.json';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const NotFoundPage = () => {
    return (
        <div className="NotFoundContainer">
            <h1 className="NotFoundTitle">Página No Encontrada</h1>
            <p className="NotFoundDescription">Lo sentimos, la página que buscas no existe.</p>
            <div className="NotFoundAnimation">
                <Lottie options={defaultOptions}
                        height={400}
                        width={400}
                />
            </div>
        </div>
    );
};

export default NotFoundPage;
