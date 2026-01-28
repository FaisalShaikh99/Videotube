function Button({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    disabled = false, 
    loading = false, 
    onClick, 
    type = 'submit', 
    className = '',
    ...props 
}) {
    // New Gradient Rules
    const variants = {
        primary: 'bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 border-none hover:shadow-indigo-500/50 hover:brightness-110',
        secondary: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30 border-none hover:shadow-cyan-500/50 hover:brightness-110',
        outline: 'border-2 border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-500 hover:text-white dark:hover:text-white',
        ghost: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700',
        danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50',
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg',
        xl: 'px-10 py-4 text-xl',
    };

    const baseStyles =
        'inline-flex items-center justify-center font-bold tracking-wide rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';

    const buttonStyles = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`;

    return (
        <button
            type={type}
            className={buttonStyles}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : null}
            {children}
        </button>
    );
}

export default Button;
