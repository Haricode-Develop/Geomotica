// Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
import './ModalStyle.css'; // Asegúrate de crear un archivo CSS para estilos básicos del modal

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-container">
                <button className="modal-close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </>,
        document.getElementById('modal-root') // Asegúrate de tener un elemento con este ID en tu public/index.html
    );
};

export default Modal;
