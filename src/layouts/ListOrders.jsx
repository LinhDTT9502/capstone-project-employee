// src/Blog.js
import React, { useState } from 'react';
import HeaderStaff from './HeaderStaff';
import SidebarStaff from './SidebarStaff';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import ListOrder from '../pages/Staff/ListOrders';
import PendingOrderList from '../pages/OnlineStaff/PendingOrderList';

const ListOrders = () => {

  const user = useSelector(selectUser)
  const isStaffOrAdmin = user && (user.role === 'Coordinator' || user.role === 'Staff' || user.role === 'Manager');

  return (
    <>
            {user.role === 'Staff' ? (<ListOrder/>):(<PendingOrderList/>)}
         
    </>

  );
};

export default ListOrders;