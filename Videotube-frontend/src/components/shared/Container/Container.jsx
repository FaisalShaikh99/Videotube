function Container({ 
    children, 
    maxWidth = '9xl', 
    padding = '0',
    className = '',
    card = false, // New prop for card styling
}) {
    // ============= MAX WIDTH STYLES =============
    const maxWidths = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        '3xl': 'max-w-screen-2xl', // Cap at 2xl for readability usually
        '4xl': 'max-w-[1920px]',
        '9xl': 'max-w-[2400px]',
        full: 'max-w-full',
    };

    // ============= PADDING STYLES =============
    const paddings = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        default: 'px-4 sm:px-6 lg:px-8',
        lg: 'p-8',
        xl: 'p-10',
    };

    // ============= CARD STYLES =============
    const cardStyles = card ? 
        'bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm' : 
        '';

    // ============= COMBINE STYLES =============
    const containerStyles = `mx-auto ${maxWidths[maxWidth] || maxWidths['full']} ${paddings[padding] || (card ? 'p-6' : '')} ${cardStyles} ${className}`;

    // ============= RENDER =============
    return (
        <div className={containerStyles}>
            {children}
        </div>
    );
}

export default Container;
