import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ListStaff from '../pages/Manager/ListStaff';
import { useNavigate } from "react-router-dom";
import ImportProduct from '../pages/Manager/ProductImportForm';
import ListWarehouses from '../pages/Manager/ListWarehouse';
import ListOrder from '../pages/Staff/ListOrders';
import OrderDetail from '../pages/Staff/OrderDetail';
import ListRentalbyBranch from '../pages/Staff/ListRentalbyBranch';
import RentalDetail from '../pages/Staff/RentalDetail';
import ListRefund from '../pages/Staff/ListRefund';
import ListExtension from '../pages/Staff/ListExtension';
import Invoice from '../pages/Staff/Invoice';

const ManagerRoutes = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  return (
    <Routes>
      <Route path="/list-staffs" element={<ListStaff />} />
      <Route path="/import" element={<ImportProduct />} />
      <Route path="/warehouse" element={<ListWarehouses />} />
      <Route path="/list-orders" element={<ListOrder />} />
      <Route path="/list-orders/:orderId" element={<OrderDetail />} />
      <Route path="/list-rentals" element={<ListRentalbyBranch />} />
      <Route path="/list-rentals/:rentalId" element={<RentalDetail />} />'
      <Route path="/list-refund" element={<ListRefund />} />
      <Route path="/list-extension" element={<ListExtension />} />
      <Route path="/invoice" element={<Invoice />} />
    </Routes>
  );
};

export default ManagerRoutes;
