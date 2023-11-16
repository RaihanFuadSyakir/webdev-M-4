import React from 'react';
import Modal from 'your-modal-library'; // Replace with the actual modal library you're using

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, content }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Alert</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{content}</div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
