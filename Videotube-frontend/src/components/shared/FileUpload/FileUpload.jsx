import { useState, useRef } from 'react';
import { validateFileSize, validateFileType } from '../../../utils/validators';

function FileUpload({ 
    label,
    name,
    accept = 'image/*',
    maxSize = 1000, // 5MB default
    required = false,
    error,
    helperText,
    className = '',
    onFileChange,
    preview = true,
    ...props 
}) {
    // ============= STATE MANAGEMENT =============
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // ============= FILE HANDLING =============
    const handleFileSelect = (file) => {
        // ============= VALIDATION =============
        const sizeValidation = validateFileSize(file, maxSize);
        const typeValidation = validateFileType(file, accept.split(',').map(type => type.trim()));

        if (!sizeValidation.isValid) {
            alert(sizeValidation.message);
            return;
        }

        if (!typeValidation.isValid) {
            alert(typeValidation.message);
            return;
        }

        // ============= SET FILE =============
        setSelectedFile(file);
        
        // ============= CREATE PREVIEW =============
        if (preview && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }

        // ============= CALLBACK =============
        if (onFileChange) {
            onFileChange(file);
        }
    };

    // ============= DRAG AND DROP =============
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // ============= CLICK HANDLER =============
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // ============= REMOVE FILE =============
    const handleRemove = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (onFileChange) {
            onFileChange(null);
        }
    };

    // ============= RENDER =============
    return (
        <div className={`space-y-2 ${className}`}>
            {/* ============= LABEL ============= */}
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* ============= FILE INPUT ============= */}
            <input
                ref={fileInputRef}
                type="file"
                name={name}
                accept={accept}
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                {...props}
            />

            {/* ============= UPLOAD AREA ============= */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    dragActive 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : selectedFile 
                            ? 'border-green-500 bg-green-50' 
                            : error 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {/* ============= PREVIEW IMAGE ============= */}
                {previewUrl && (
                    <div className="mb-4">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="mx-auto h-24 w-24 object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* ============= UPLOAD ICON ============= */}
                {!previewUrl && (
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}

                {/* ============= UPLOAD TEXT ============= */}
                <div className="text-sm text-gray-600">
                    {selectedFile ? (
                        <div>
                            <p className="font-medium text-green-600">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-medium">
                                <span className="text-indigo-600 hover:text-indigo-500">
                                    Click to upload
                                </span>{' '}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                                {accept.includes('image') ? 'PNG, JPG, GIF up to' : 'Files up to'} {maxSize}MB
                            </p>
                        </div>
                    )}
                </div>

                {/* ============= REMOVE BUTTON ============= */}
                {selectedFile && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemove();
                        }}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* ============= ERROR MESSAGE ============= */}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {/* ============= HELPER TEXT ============= */}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}

export default FileUpload;

