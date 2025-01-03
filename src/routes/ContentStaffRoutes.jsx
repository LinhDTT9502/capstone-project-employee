import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import RichTextEditor from '../pages/ContentStaff/RichTextEditor';
import EditProduct from '../pages/ContentStaff/EditProduct';
import EditOffer from '../pages/ContentStaff/EditOffer';
import CreateUpdateBlog from '../pages/ContentStaff/CreateUpdateBlog';
import Blogs from '../pages/ContentStaff/Blogs';

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
      <Route path="/create-update-blog" element={<CreateUpdateBlog />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/edit-product" element={<EditProduct />} />
      <Route path="/edit-offer" element={<EditOffer />} />
    </Routes>
  );
};

export default ContentStaffRoutes;
