import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, logout, useAppDispatch, useAppSelector } from '../../store/authStore';

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
  const dispatch = useAppDispatch();
  const { user, accessToken, loading } = useAppSelector((s) => s.auth);
  const [verifying, setVerifying] = useState<boolean>(!!accessToken);
  const [verified, setVerified] = useState<boolean>(false);

  // Verify session against backend once on mount when a token exists.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!accessToken || !isTokenValid(accessToken)) {
        dispatch(logout());
        if (!cancelled) { setVerifying(false); setVerified(false); }
        return;
      }
      try {
        await api.get('/users/profile');
        if (!cancelled) { setVerified(true); setVerifying(false); }
      } catch {
        dispatch(logout());
        if (!cancelled) { setVerified(false); setVerifying(false); }
      }
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While an auth request is in flight (login/refresh), don't redirect prematurely
  if (loading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No session at all OR access token is expired/invalid OR backend rejected it
  if (!accessToken || !user || !isTokenValid(accessToken) || !verified) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && (!user.role || !roles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;