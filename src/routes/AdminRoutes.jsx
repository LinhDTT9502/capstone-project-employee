import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import Blog from '../components/Blog';
import ManageUser from '../pages/Admin/ManageUser';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manage-user" element={<ManageUser />} />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  );
};

export default AdminRoutes;
