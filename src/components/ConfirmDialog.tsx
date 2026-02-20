interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  export default function ConfirmDialog({
    title,
    message,
    confirmLabel = 'Eliminar',
    onConfirm,
    onCancel,
  }: ConfirmDialogProps) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
        <div className="bg-white w-full rounded-t-2xl p-5 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }