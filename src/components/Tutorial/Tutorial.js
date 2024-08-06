import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import tutorialStepsConfig from "../../utils/tutorialStepsConfig";

const Tutorial = ({ isActive, onClose }) => {
    const [run, setRun] = useState(isActive);
    const location = useLocation();

    const [steps, setSteps] = useState([]);

    const handleJoyrideCallback = (data) => {
        const { status, action } = data;

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            onClose();
        } else if (action === ACTIONS.CLOSE) {
            setRun(false);
        }
    };

    const locale = {
        last: 'Finalizar',
        skip: 'Omitir',
        next: 'Siguiente',
        back: 'Atrás',
        close: 'Cerrar'
    };

    useEffect(() => {
        const pathSteps = tutorialStepsConfig[location.pathname] || [];
        setSteps(pathSteps);
    }, [location]);

    useEffect(() => {
        setRun(isActive);
    }, [isActive]);

    return (
        <Joyride
            continuous
            run={run}
            scrollToFirstStep
            showSkipButton
            locale={locale}
            steps={steps}
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    zIndex: 10000,
                },
            }}
        />
    );
};

export default Tutorial;
