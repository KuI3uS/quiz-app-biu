import { createPortal } from 'react-dom';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Anuluj</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Usuń</button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
}