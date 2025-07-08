import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setCredentials } from '../../store/slices/authSlice';
import { useGetProfileQuery } from '../../store/api/authApi';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const { data: profile, isLoading, error } = useGetProfileQuery(undefined, {
    skip: !token || isAuthenticated,
  });

  useEffect(() => {
    if (profile && token) {
      dispatch(setCredentials({ user: profile, accessToken: token }));
    }
  }, [profile, token, dispatch]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!token || error) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;