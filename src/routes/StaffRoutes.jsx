import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import OrderDetail from '../pages/Staff/OrderDetail';
import RentalDetail from '../pages/Staff/RentalDetail';
import ListOrder from '../pages/Staff/ListOrders';
import ListRentalbyBranch from '../pages/Staff/ListRentalbyBranch';
import { useNavigate } from "react-router-dom";

const StaffRoutes = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
}, [token, navigate]);
  return (
    <Routes>
      <Route path="/list-orders" element={<ListOrder />} />
      <Route path="/list-orders/:orderId" element={<OrderDetail />} />
      <Route path="/list-rentals" element={<ListRentalbyBranch />} />
      <Route path="/list-rentals/:rentalId" element={<RentalDetail />} />
    </Routes>
  );
};

export default StaffRoutes;
