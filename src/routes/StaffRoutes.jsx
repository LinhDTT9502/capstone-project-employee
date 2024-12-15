import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import OrderDetail from '../pages/Staff/OrderDetail';
import RentalDetail from '../pages/Staff/RentalDetail';
import ListOrder from '../pages/Staff/ListOrders';
import ListRentalbyBranch from '../pages/Staff/ListRentalbyBranch';
import { useNavigate } from "react-router-dom";
import ListRefund from '../pages/Staff/ListRefund';
import ListExtension from '../pages/Staff/ListExtension';

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
      <Route path="/list-rentals/:rentalId" element={<RentalDetail />} />'
      <Route path="/list-refund" element={<ListRefund />} />
      <Route path="/list-extension" element={<ListExtension />} />
    </Routes>
  );
};

export default StaffRoutes;
