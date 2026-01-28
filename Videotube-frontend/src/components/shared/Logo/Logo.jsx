import { Link } from 'react-router-dom';

function Logo({ 
    size = 'md', 
    showText = true, 
    className = '',
    to = '/' 
}) {
    // ============= SIZE STYLES =============
    const sizes = {
        sm: {
            icon: 'w-6 h-6',
            text: 'text-lg',
        },
        md: {
            icon: 'w-8 h-8',
            text: 'text-xl',
        },
        lg: {
            icon: 'w-10 h-10',
            text: 'text-2xl',
        },
        xl: {
            icon: 'w-12 h-12',
            text: 'text-3xl',
        },
    };

    // ============= LOGO COMPONENT =============
    const LogoContent = () => (
        <div className={`flex items-center space-x-2 ${className}`}>
            {/* ============= LOGO ICON ============= */}
            <div className={`${sizes[size].icon} bg-indigo-600 rounded-lg flex items-center justify-center`}>
                <svg 
                    className="w-2/3 h-2/3 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
            </div>
            
            {/* ============= LOGO TEXT ============= */}
            {showText && (
                <span className={`${sizes[size].text} font-bold text-indigo-600`}>
                    VideoTube
                </span>
            )}
        </div>
    );

    // ============= RENDER =============
    return to ? (
        <Link to={to} className="inline-block">
            <LogoContent />
        </Link>
    ) : (
        <LogoContent />
    );
}

export default Logo;

