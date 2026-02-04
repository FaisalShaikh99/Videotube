function CoverImage({ src, alt = 'Cover Image', className = '', onClick }) {
    return (
        <div 
            className={`w-full h-40 bg-gray-100 rounded-lg overflow-hidden ${className}`} 
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <img 
                src={src || "/default-thumbnail.svg"} 
                alt={alt} 
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.src = "/default-thumbnail.svg";
                }}
            />
        </div>
    );
}

export default CoverImage;
