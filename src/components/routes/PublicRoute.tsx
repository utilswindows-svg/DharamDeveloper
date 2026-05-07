import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/authStore';

interface Props {
  children: React.ReactNode;
  /** If true, authenticated users are redirected away (e.g. login/signup pages). */
  restricted?: boolean;
}

const PublicRoute: React.FC<Props> = ({ children, restricted = false }) => {
  const { user, accessToken } = useAppSelector((s) => s.auth);
  const isAuthed = !!accessToken && !!user;

  if (restricted && isAuthed) {
    const target = user?.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;