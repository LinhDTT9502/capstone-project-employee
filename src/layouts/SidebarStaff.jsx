import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { List, ListItem } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import { useState } from 'react';
export default function SidebarStaff() {
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='flex flex-col items-center w-1/6 px-5 py-5'>
      <List>
        {user.role === 'Admin' && (
          <Link to='/admin/dashboard'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' /> Tổng quan
            </ListItem>
          </Link>
        )}

        {user.role === 'Admin' && (
          <Link to='/admin/manage-user'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' />
              Quản lý tài khoản
            </ListItem>
          </Link>
        )}

        {user.role === 'Admin' && (
          <Link to='/admin/manage-staff'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' />
              Nhân viên
            </ListItem>
          </Link>
        )}
        {user.role === 'Admin' && (
          <Link to='/admin/manage-managers'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' />
              Quản lý
            </ListItem>
          </Link>
        )}
         {user.role === 'Admin' && (
          <Link to='/admin/import-history'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' />
              Lịch sử nhập hàng
            </ListItem>
          </Link>
        )}
        {user.role === 'Admin' && (
          <Link to='/admin/manage-feedback'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' />
              Danh sách phản hồi
            </ListItem>
          </Link>
        )}
        {user.role === 'Order Coordinator' && (<>
          <button
            onClick={handleToggle}
            className="flex items-center text-left w-full p-2 rounded"
          >
            <FontAwesomeIcon icon={faGauge} className='pr-3' />
            <span>Chỉ Định Chi Nhánh</span>
          </button>

          {isOpen && (
            <div className="mt-2 pl-4">
              <Link to='/coordinator/assign-orders'>
                <div className="p-2 hover:bg-gray-100 rounded">
                  <FontAwesomeIcon icon={faGauge} className='pr-3' />
                  Đơn bán
                </div>
              </Link>
              <Link to='/coordinator/assign-rentals'>
                <div className="p-2 hover:bg-gray-100 rounded">
                  <FontAwesomeIcon icon={faGauge} className='pr-3' />
                  Đơn cho thuê
                </div>
              </Link>
            </div>
          )}
        </>
        )}
        {user.role === 'Staff' && (
          <Link to='/staff/list-orders'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' />
              Danh sách đơn hàng
            </ListItem>
          </Link>
        )}
        {user.role === 'Staff' && (
          <Link to='/staff/list-rentals'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' />
              Danh sách đơn cho thuê
            </ListItem>
          </Link>
        )}
        {user.role === 'Staff' && (
          <Link to='/staff/list-refund'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' />
              Yêu cầu hoàn tiền
            </ListItem>
          </Link>
        )}
        {user.role === 'Content Staff' && (
          <Link to='/content-staff/blogs'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' /> blog
            </ListItem>
          </Link>
        )}
        {user.role === 'Content Staff' && (
          <Link to='/content-staff/test'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' /> test
            </ListItem>
          </Link>
        )}
        {user.role === 'Manager' && (
          <Link to='/manager/list-staffs'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' /> Danh sách nhân viên
            </ListItem>
          </Link>
        )}
        {/* {user.role === 'Manager' && (
          <Link to='/manager/import-product'>
            <ListItem>
              <FontAwesomeIcon icon={faGauge} className='pr-3' /> import product
            </ListItem>
          </Link>
        )} */}
      </List>
    </div>
  );
}
