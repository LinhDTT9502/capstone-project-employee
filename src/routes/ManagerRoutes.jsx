import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ListStaff from '../pages/Manager/ListStaff';
// import ProductForm from '../pages/Staff/ImportForm';
import { useNavigate } from "react-router-dom";

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
      {/* <Route path="/import-product" element={<ProductForm />} /> */}
    </Routes>
  );
};

export default ManagerRoutes;
