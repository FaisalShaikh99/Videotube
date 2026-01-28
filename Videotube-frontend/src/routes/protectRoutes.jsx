// src/components/ProtectedRoute.jsx (Nayi file banayein)
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    // auth slice se authentication status check karein
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Agar user authenticated hai, to use page dikhayein (Outlet ke zariye)
    // Nahi to use /login page par redirect kar dein
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;