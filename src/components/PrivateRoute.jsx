import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../redux/slices/authSlice';
import { useNavigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const user = useSelector(selectUser)
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
  }
  else if (!allowedRoles.includes(user.role)) {
    alert('You do not have permission');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;