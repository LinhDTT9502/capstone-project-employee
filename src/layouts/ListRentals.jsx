// src/Blog.js
import React, { useState } from 'react';
import HeaderStaff from './HeaderStaff';
import SidebarStaff from './SidebarStaff';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import PendingRentalList from '../pages/OnlineStaff/PendingRentalList';
import ListRentalbyBranch from '../pages/Staff/ListRentalbyBranch';

const ListRentals = () => {

  const user = useSelector(selectUser)
  const isStaffOrAdmin = user && (user.role === 'Order Coordinator' || user.role === 'Staff');

  return (
    <>
            {user.role === 'Staff' ? (<ListRentalbyBranch/>):(<PendingRentalList/>)}

    </>

  );
};

export default ListRentals;