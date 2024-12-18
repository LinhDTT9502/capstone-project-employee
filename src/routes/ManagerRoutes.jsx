import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ListStaff from '../pages/Manager/ListStaff';
import { useNavigate } from "react-router-dom";
import ImportProduct from '../pages/Manager/ProductImportForm';

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
    </Routes>
  );
};

export default ManagerRoutes;
