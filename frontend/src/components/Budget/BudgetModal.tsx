// components/Modal.tsx
import React from 'react';

interface ModalProps {
  closeModal: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ closeModal, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div className="modal-container bg-white w-1/2 mx-auto rounded shadow-lg z-50">
        <div className="modal-content py-4 text-left px-6">{children}</div>
        <div className="modal-footer py-4 px-6">
          <button onClick={closeModal} className="bg-blue-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
