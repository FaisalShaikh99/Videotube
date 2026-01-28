import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Button from './Button/Button';

/**
 * A reusable modal for delete confirmations.
 * 
 * @param {boolean} isOpen - Whether the modal is open.
 * @param {function} onClose - Function to call when closing the modal (cancel).
 * @param {function} onConfirm - Function to call when confirming the deletion.
 * @param {string} title - The title of the modal (e.g., "Delete Video").
 * @param {string} message - The main warning message (e.g., "Are you sure?").
 * @param {string} description - Additional details (e.g., "This action cannot be undone.").
 * @param {string} confirmLabel - Label for the confirm button.
 * @param {boolean} isDeleting - Loading state for the confirm button.
 */
function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item", 
  message = "Are you sure you want to delete this item?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  isDeleting = false 
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
            <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center p-6 pt-10">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
                <Trash2 size={32} />
            </div>
            
            {/* Text Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 font-medium mb-1">{message}</p>
            <p className="text-sm text-gray-500 mb-8">{description}</p>

            {/* Actions */}
            <div className="flex gap-3 w-full">
                <Button 
                    variant="secondary" 
                    onClick={onClose}
                    className="flex-1 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 h-10"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm}
                    loading={isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 h-10"
                >
                    {confirmLabel}
                </Button>
            </div>
        </div>

        {/* Decorative Bottom Pattern (Optional) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-400 via-red-500 to-red-600"></div>
      </div>
    </div>,
    document.body
  );
}

export default DeleteConfirmationModal;
