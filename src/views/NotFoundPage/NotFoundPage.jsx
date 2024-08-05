import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../assets/img/astronaut-lottie.json';
import {
    NotFoundContainer,
    NotFoundTitle,
    NotFoundDescription,
    NotFoundAnimation
} from './NotFoundPageStyle';

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
        <NotFoundContainer>
            <NotFoundTitle>Page Not Found</NotFoundTitle>
            <NotFoundDescription>Sorry, the page you are looking for does not exist.</NotFoundDescription>
            <NotFoundAnimation>
                <Lottie options={defaultOptions} height={400} width={400} />
            </NotFoundAnimation>
        </NotFoundContainer>
    );
};

export default NotFoundPage;
