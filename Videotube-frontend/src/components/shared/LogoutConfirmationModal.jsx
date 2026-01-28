import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';
import Button from './Button/Button';

function LogoutConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
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
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                <LogOut size={32} className="ml-1" />
            </div>
            
            {/* Text Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out</h3>
            <p className="text-gray-600 font-medium mb-1">Are you sure you want to Log out?</p>
            <p className="text-sm text-gray-500 mb-8">You will need to sign in again to access your account.</p>

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
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 h-10"
                >
                    Log Out
                </Button>
            </div>
        </div>

        {/* Decorative Bottom Pattern */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-800"></div>
      </div>
    </div>,
    document.body
  );
}

export default LogoutConfirmationModal;
