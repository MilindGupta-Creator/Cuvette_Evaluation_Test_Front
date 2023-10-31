import React from 'react';
import styles from './DeleteQuizModal.module.css'; // Import the relevant styles if needed

const DeleteQuizModal = ({ handleDelete, handleCancel }) => (
  <div className={styles.container} onClick={handleCancel}>
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalContent}>
        <p style={{ fontSize: "1.7rem", fontWeight: "bold", textAlign: "center" }}>
          Are you sure you want to delete?
        </p>
        <div className={styles.buttonContainer}>
          <button onClick={handleDelete} className={styles.confirmDeleteModalButton}>
            Confirm Delete
          </button>
          <button onClick={handleCancel} className={styles.cancelModalButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default DeleteQuizModal;
