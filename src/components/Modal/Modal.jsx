import React from 'react';
import ReactDOM from 'react-dom';
import { ModalOverlay, ModalContainer, ModalCloseButton } from './ModalStyle';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <ModalOverlay onClick={onClose} />
            <ModalContainer>
                <ModalCloseButton onClick={onClose}>
                    <CloseIcon />
                </ModalCloseButton>
                {children}
            </ModalContainer>
        </>,
        document.getElementById('modal-root')
    );
};

export default Modal;