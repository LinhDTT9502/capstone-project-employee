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
    <><HeaderStaff />
      <div className='flex h-full'>
        {isStaffOrAdmin && <SidebarStaff />}
        <div className='flex-grow border-l-2'>
          <div className="container mx-auto p-4">
            {user.role === 'Staff' ? (<ListRentalbyBranch/>):(<PendingRentalList/>)}
          </div>
        </div>
      </div>
    </>

  );
};

export default ListRentals;