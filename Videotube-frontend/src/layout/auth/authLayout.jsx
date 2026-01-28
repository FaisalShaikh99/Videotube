function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      {children}
    </div>
  );
}

export default AuthLayout;
