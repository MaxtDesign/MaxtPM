import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true,
    redirectTo = '/login',
}) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    // If authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
        // Redirect to login with return URL
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // If authentication is not required and user is authenticated
    if (!requireAuth && isAuthenticated) {
        // Redirect to dashboard or home
        return <Navigate to="/" replace />;
    }

    // User is authenticated and can access the route
    return <>{children}</>;
};

export default ProtectedRoute;
