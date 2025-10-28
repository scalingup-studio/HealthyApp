import React from "react";
import ReactDOM from "react-dom";

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title || "Dialog"} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ paddingBottom: 20 }}>
          <h2>{title}</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}


