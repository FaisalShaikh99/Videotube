import { useRef } from 'react';
import { Upload } from 'lucide-react';

function FileUploadButton({ 
    label = 'Choose File',
    accept = 'image/*',
    onFileChange,
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    maxSize = 10000,
    ...props 
}) {
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (!file) return;

        // Simple size validation
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }

        if (onFileChange) {
            onFileChange(file);
        }

        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    // Variant classes
    const variantClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    };

    return (
        <div className={className}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                disabled={disabled}
                {...props}
            />

            {/* Button */}
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className={`
                    inline-flex items-center gap-2 rounded-lg font-medium transition-colors
                    ${sizeClasses[size]}
                    ${variantClasses[variant]}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                <Upload size={18} />
                {label}
            </button>
        </div>
    );
}

export default FileUploadButton;
