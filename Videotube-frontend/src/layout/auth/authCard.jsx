function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6 transition-colors">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>

      {children}

      {footer && (
        <div className="text-center text-sm text-gray-500">{footer}</div>
      )}
    </div>
  );
}

export default AuthCard;
