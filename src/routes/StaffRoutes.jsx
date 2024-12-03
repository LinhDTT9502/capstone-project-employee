import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../layouts/AdminDashboard';
import PendingRentalList from '../pages/OnlineStaff/PendingRentalList';

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/orders" element={<AdminDashboard />} />
      <Route path="/rentals" element={<PendingRentalList />} />
    </Routes>
  );
};

export default StaffRoutes;
