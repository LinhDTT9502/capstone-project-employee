import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import PendingOrderList from '../pages/OnlineStaff/PendingOrderList';
import PendingRentalList from '../pages/OnlineStaff/PendingRentalList';
import CommentList from '../pages/OnlineStaff/CommentList';
import Chat from '../pages/OnlineStaff/Chat';

const CoordinatorRoutes = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  return (
    <Routes>
      <Route path="/assign-orders" element={<PendingOrderList />} />
      <Route path="/assign-rentals" element={<PendingRentalList />} />
      <Route path="/manage-comments" element={<CommentList />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default CoordinatorRoutes;
