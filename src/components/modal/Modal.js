import React from 'react';
import './Modal.css';

function ResponseModal({ show, onHide, responseData }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">채점 결과</h2>
        </div>
        <div className="modal-body">
          {responseData.correct ? (
            <p className="correct-text">정답</p>
          ) : (
            <p className="incorrect-text">오답</p>
          )}
        </div>
        <div className="modal-footer">
          <button className="close-button" onClick={onHide}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default ResponseModal;
