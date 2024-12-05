import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ListOrders from '../layouts/ListOrders';
import ListRentals from '../layouts/ListRentals';
import OrderDetail from '../pages/Staff/OrderDetail';
import RentalDetail from '../pages/Staff/RentalDetail';

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/orders" element={<ListOrders />} />
      <Route path="/orders/:orderId" element={<OrderDetail />} />
      <Route path="/rentals" element={<ListRentals />} />
      <Route path="/rentals/:rentalId" element={<RentalDetail />} />
    </Routes>
  );
};

export default StaffRoutes;
