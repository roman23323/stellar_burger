import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthLoading,
  selectUser
} from '../../services/slices/authSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsAuthLoading);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to={'/login'} state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={'/'} />;
  }

  return children;
};
