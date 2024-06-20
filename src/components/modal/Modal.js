import React from 'react';
import './Modal.css';

function Modal({ message, onClose }) {
  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-content">
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
