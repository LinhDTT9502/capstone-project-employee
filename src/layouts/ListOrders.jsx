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
  const isStaffOrAdmin = user && (user.role === 'Order Coordinator' || user.role === 'Staff' || user.role === 'Manager');

  return (
    <><HeaderStaff />
      <div className='flex h-full'>
        {isStaffOrAdmin && <SidebarStaff />}
        <div className='flex-grow border-l-2'>
          <div className="container mx-auto p-4">
            {user.role === 'Staff' ? (<ListOrder/>):(<PendingOrderList/>)}
          
          </div>
        </div>
      </div>
    </>

  );
};

export default ListOrders;