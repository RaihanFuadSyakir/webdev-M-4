// components/Modal.tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

interface ModalProps {
  closeModal: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ closeModal, children }) => {
  return (
    <Dialog open={true} onClose={closeModal}>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <button onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
