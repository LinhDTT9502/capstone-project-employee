import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import RichTextEditor from '../pages/ContentStaff/RichTextEditor';
import EditProduct from '../pages/ContentStaff/EditProduct';
import EditOffer from '../pages/ContentStaff/EditOffer';
import Blogs from '../pages/ContentStaff/Blogs';
import CreateBlog from '../pages/ContentStaff/CreateBlog';
import UpdateBlog from '../pages/ContentStaff/UpdateBlog';

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
      <Route path="/create-blog" element={<CreateBlog />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/edit-product" element={<EditProduct />} />
      <Route path="/edit-offer" element={<EditOffer />} />
      <Route path="/update-blog/:blogId" element={<UpdateBlog />} />
    </Routes>
  );
};

export default ContentStaffRoutes;
