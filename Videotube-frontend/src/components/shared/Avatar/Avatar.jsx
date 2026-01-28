function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
  onClick
}) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const baseStyles =
    'inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold overflow-hidden';

  const avatarStyles = `${baseStyles} ${sizes[size]} ${className}`;

  const getFallback = () => {
    if (fallback) return fallback;
    if (alt) return alt.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div
      className={avatarStyles}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {src && (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"   // GOOGLE AVATAR FIX
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextSibling.style.display = 'flex';
          }}
        />
      )}

      <span
        className={
          src
            ? 'hidden items-center justify-center w-full h-full'
            : 'flex items-center justify-center w-full h-full'
        }
      >
        {getFallback()}
      </span>
    </div>
  );
}

export default Avatar;
