function CoverImage({ src, alt = 'Cover Image', className = '', onClick }) {
    return (
        <div 
            className={`w-full h-40 bg-gray-100 rounded-lg overflow-hidden ${className}`} 
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {src ? (
                <img 
                    src={src} 
                    alt={alt} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400 font-semibold">
                    No Cover
                </div>
            )}
        </div>
    );
}

export default CoverImage;
