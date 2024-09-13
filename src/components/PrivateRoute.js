import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuth(); // Check user authentication status and redirect to login page if needed

  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
