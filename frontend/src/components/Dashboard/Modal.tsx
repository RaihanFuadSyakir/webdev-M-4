import React from 'react';

interface OverspendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const OverspendingModal: React.FC<OverspendingModalProps> = ({ isOpen, onClose, content }) => {
  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Overspending Alert</h2>
                <button className="close-button" onClick={onClose}>
                  &times;
                </button>
              </div>
              <div className="modal-body">{content}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OverspendingModal;
