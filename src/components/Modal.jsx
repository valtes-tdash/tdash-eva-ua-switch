import React from 'react';

const Modal = ({ title, children, onClose, actions }) => (
  <div className="modal-backdrop" role="dialog" aria-modal="true">
    <div className="modal-body">
      <h3 className="section-title">{title}</h3>
      <div style={{ marginBottom: 16 }}>{children}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        {actions}
        <button className="button-outline" onClick={onClose} type="button">
          閉じる
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
