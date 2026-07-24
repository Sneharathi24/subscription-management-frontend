function DeleteModal({ onDelete, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon">⚠️</div>
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete this subscription? This action cannot be undone.
        </p>

        <div className="delete-buttons">
          <button className="confirm-delete-btn" onClick={onDelete}>
            Yes, Delete
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;