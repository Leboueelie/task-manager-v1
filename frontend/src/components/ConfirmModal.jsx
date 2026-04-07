function ConfirmModal({ title, message, onConfirm, onCancel, isLoading }) {
  return (
    <div className="modal-overlay">
      <div className="modal confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button 
            onClick={onCancel} 
            className="btn-secondary"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            onClick={onConfirm} 
            className="btn-danger"
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal