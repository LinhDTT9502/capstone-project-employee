import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import OrderDetail from '../pages/Staff/OrderDetail';
import RentalDetail from '../pages/Staff/RentalDetail';
import ListOrder from '../pages/Staff/ListOrders';
import ListRentalbyBranch from '../pages/Staff/ListRentalbyBranch';
import { useNavigate } from "react-router-dom";
import ListRefund from '../pages/Staff/ListRefund';
import ListExtension from '../pages/Staff/ListExtension';
import Invoice from '../pages/Staff/Invoice';
import ReturnList from '../pages/Staff/ReturnList';
import ReturnDetail from '../pages/Staff/ReturnDetail';
import RentalReturnList from '../pages/Staff/RentalReturnList';

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
      <Route path="/list-return" element={<ReturnList />} />
      <Route path="/list-return/:returnID" element={<ReturnDetail />} />
      <Route path="/list-rental-return" element={<RentalReturnList />} />
      <Route path="/list-extension" element={<ListExtension />} />
      <Route path="/invoice" element={<Invoice />} />
    </Routes>
  );
};

export default StaffRoutes;
