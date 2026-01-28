import { forwardRef, useState } from 'react';

const Input = forwardRef(function Input({ 
    type = 'text',
    label,
    placeholder,
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
    icon,
    iconPosition = 'left',
    onIconClick,
    ...props 
}, ref) {
    // ============= INPUT STYLES =============
    const baseStyles = `
        block w-full px-4 py-3 
        bg-gray-50 dark:bg-slate-800 
        border border-gray-200 dark:border-slate-700 
        rounded-xl 
        text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-400
        disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-400 disabled:cursor-not-allowed
    `;
    
    // ============= ERROR STYLES =============
    const errorStyles = error 
        ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500' 
        : 'hover:border-gray-300 dark:hover:border-slate-600';
    
    // ============= ICON STYLES =============
    const iconStyles = icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : '';
    
    // ============= FINAL STYLES =============
    const inputStyles = `${baseStyles} ${errorStyles} ${iconStyles} ${className}`;

    // ============= RENDER =============
    return (
        <div className="space-y-1.5">
            {/* ============= LABEL ============= */}
            {label && (
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                    {label}
                    {required && <span className="text-pink-500 ml-1">*</span>}
                </label>
            )}

            {/* ============= INPUT CONTAINER ============= */}
            <div className="relative group">
                {/* ============= LEFT ICON ============= */}
                {icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors">{icon}</span>
                    </div>
                )}

                {/* ============= INPUT FIELD ============= */}
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={inputStyles}
                    {...props}
                />

                {/* ============= RIGHT ICON ============= */}
                {icon && iconPosition === 'right' && (
                    <div 
                        onClick={onIconClick}
                        className={`absolute inset-y-0 right-0 pr-3.5 flex items-center ${onIconClick ? 'cursor-pointer' : 'pointer-events-none'}`}
                    >
                        <span className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{icon}</span>
                    </div>
                )}
            </div>

            {/* ============= ERROR MESSAGE ============= */}
            {error && (
                <p className="text-sm text-red-500 dark:text-red-400 ml-1 animate-pulse">{error}</p>
            )}

            {/* ============= HELPER TEXT ============= */}
            {helperText && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">{helperText}</p>
            )}
        </div>
    );
});

export default Input;
