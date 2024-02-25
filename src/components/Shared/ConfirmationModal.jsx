import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="modal-confirm">Confirm</button>
          <button onClick={onClose} className="modal-close">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
