import React from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
