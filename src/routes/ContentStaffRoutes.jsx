import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Blog from '../components/Blog';
import { useNavigate } from "react-router-dom";
import RichTextEditor from '../pages/ContentStaff/RichTextEditor';

const ContentStaffRoutes = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
}, [token, navigate]);
  return (
    <Routes>
      <Route path="/blogs" element={<Blog />} />
      <Route path="/test" element={<RichTextEditor />} />
    </Routes>
  );
};

export default ContentStaffRoutes;
