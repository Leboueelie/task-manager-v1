function ConfirmModal({ title, message, onConfirm, onCancel, isLoading }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button 
            onClick={onCancel} 
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            onClick={onConfirm} 
            className={`btn btn-error ${isLoading ? 'loading' : ''}`}
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