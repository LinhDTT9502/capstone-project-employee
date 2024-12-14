import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import { useNavigate } from "react-router-dom";
import ManageUser from '../pages/Admin/ManageUser';
import ListAllStaff from '../pages/Admin/ListAllStaff';
import StaffDetail from '../pages/Admin/StaffDetail';
import ListAllManagers from '../pages/Admin/ListAllManagers';
import Feedback from '../pages/Admin/Feedback';

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
    </Routes>
  );
};

export default AdminRoutes;
