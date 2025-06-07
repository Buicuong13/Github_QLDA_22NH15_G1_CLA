import React from "react";
import styles from "./FaceDetectionModal.module.scss";

export default function FaceDetectionModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <button className={styles["close-btn"]} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
