import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenExpired, removeToken } from '../../utils/jwtUtils';
import { checkAccessMenu } from '../../utils/authen';

const ProtectedRoute: React.FC<{ children: React.ReactNode; token: string | null; path?: string }> =
    ({ children, token, path }) => {
        const location = useLocation();
        const isAuthenticated = useSelector((state: any) => state.isAuthenticated);
        const loading = useSelector((state: any) => state.loading);
        if (loading) {
            // Optionally, you can return a loading spinner or some other loading indication here
            return null;
        }

        if (checkAccessMenu(path) && location.pathname !== '/error-403') {
            return <Navigate to="/error-403" replace />
        }

        if (location.pathname === '/forgot-password') {
            if (!isAuthenticated) {
                return <>{children}</>;
            } else {
                return <Navigate to="/" replace />;
            }
        }

        if (!isAuthenticated || (token && isTokenExpired(token))) {
            if (location.pathname !== '/login') {
                removeToken();
                return <Navigate to="/login" replace state={{ message: "You need to login to access that page." }} />;
            }
        } else if (isAuthenticated && location.pathname === '/login') {
            return <Navigate to="/" replace />;
        }

        return <>{children}</>;
    };

export default ProtectedRoute;
