import React from 'react';
import {
    ModalLoader,
    ModalContent,
    ProgressContainer,
    ProgressBarInner,
    ProgressText,
} from './ProgressBarStyle';

const ProgressBar = ({ progress, message, show, title }) => {
    return (
        show ? (
            <ModalLoader>
                <ModalContent>
                    <h2>{title}</h2>
                    <p>{message}</p>
                    <ProgressContainer>
                        <ProgressBarInner style={{ width: `${progress}%` }} />
                    </ProgressContainer>
                    <ProgressText>{`${progress}%`}</ProgressText>
                </ModalContent>
            </ModalLoader>
        ) : null
    );
};

export default ProgressBar;