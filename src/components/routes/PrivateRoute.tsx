import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/authStore';

interface Props {
  children: React.ReactNode;
  roles?: Array<'user' | 'admin'>;
}

const PrivateRoute: React.FC<Props> = ({ children, roles }) => {
  const location = useLocation();
  const { user, accessToken } = useAppSelector((s) => s.auth);

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && (!user.role || !roles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;