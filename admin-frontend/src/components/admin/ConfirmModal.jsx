const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative dark-card rounded-xl w-full max-w-md transform transition-all duration-300">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary text-sm px-5 py-2.5"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="btn-danger text-sm px-5 py-2.5"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

