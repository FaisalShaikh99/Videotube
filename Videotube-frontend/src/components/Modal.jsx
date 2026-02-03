
function Modal({isOpen, onClose, children}) {
  if(!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      >
      </div>

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg w-[400px] p-6 z-50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 border-indigo-500 border-2 rounded hover:text-white dark:text-gray-300 dark:hover:text-white font-semibold duration-200 hover:bg-indigo-600 px-2 py-1 text-gray-500"
        >
          Close
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
