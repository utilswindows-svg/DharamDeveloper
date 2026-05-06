import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/authStore';

interface Props {
  children: React.ReactNode;
  roles?: Array<'user' | 'admin'>;
}

// Decode JWT payload safely (browser-side, no verification — only to read exp)
const decodeJwt = (token: string): { exp?: number; role?: string } | null => {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return false;
  // exp is seconds since epoch
  return payload.exp * 1000 > Date.now();
};

const PrivateRoute: React.FC<Props> = ({ children, roles }) => {
  const location = useLocation();
  const { user, accessToken, loading } = useAppSelector((s) => s.auth);

  // While an auth request is in flight (login/refresh), don't redirect prematurely
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No session at all OR access token is expired/invalid
  if (!accessToken || !user || !isTokenValid(accessToken)) {
    // Clean up any stale credentials so the user is forced to re-login
    if (accessToken && !isTokenValid(accessToken)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && (!user.role || !roles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;