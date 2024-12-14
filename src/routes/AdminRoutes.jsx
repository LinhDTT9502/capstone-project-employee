import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import { useNavigate } from "react-router-dom";
import ManageUser from '../pages/Admin/ManageUser';
import ListAllStaff from '../pages/Admin/ListAllStaff';
import StaffDetail from '../pages/Admin/StaffDetail';
import ListAllManagers from '../pages/Admin/ListAllManagers';
import Feedback from '../pages/Admin/Feedback';
import BrandManagement from '../pages/Admin/BrandManagement';
import CategoryManagement from '../pages/Admin/CategoryManagement';
import RoleManagement from '../pages/Admin/RoleManagement';
import SportManagement from '../pages/Admin/SportManagement';
import PromotionManagement from '../pages/Admin/PromotionManagement';

const AdminRoutes = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
}, [token, navigate]);
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manage-user" element={<ManageUser />} />
      <Route path="/manage-staff" element={<ListAllStaff />} />
      <Route path="/manage-staff/:staffId" element={<StaffDetail />} />
      <Route path="/manage-managers" element={<ListAllManagers />} />
      <Route path="/manage-feedback" element={<Feedback />} />
      <Route path="/manage-brand" element={<BrandManagement />} />
      <Route path="/manage-category" element={<CategoryManagement />} />
      <Route path="/manage-role" element={<RoleManagement />} />
      <Route path="/manage-sport" element={<SportManagement />} />
      <Route path="/manage-promotion" element={<PromotionManagement />} />
    </Routes>
  );
};

export default AdminRoutes;
