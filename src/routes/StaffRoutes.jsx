import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../layouts/AdminDashboard';

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/orders" element={<AdminDashboard />} />
    </Routes>
  );
};

export default StaffRoutes;
