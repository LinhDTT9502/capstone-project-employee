import React, { useEffect, useState } from 'react';
import { fetchStaffbyBranch } from '../../services/Staff/StaffService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';

const ListStaff = () => {
  const [staffs, setStaffs] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const data = await fetchStaffbyBranch(user.BranchId);
        setStaffs(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching staffs:', error);
      }
    };

    fetchStaffs();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Danh sách nhân viên chi nhánh {user.BranchId}</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b"></th>
              <th className="px-4 py-2 text-left border-b">Họ và tên</th>
              <th className="px-4 py-2 text-left border-b">Vị trí</th>
              <th className="px-4 py-2 text-left border-b">Email</th>
              <th className="px-4 py-2 text-left border-b">Liên hệ</th>
              <th className="px-4 py-2 text-left border-b">Địa chỉ</th>
            </tr>
          </thead>
          <tbody>
            {staffs.length > 0 ? (
              staffs.map((staff, index) => (
                <tr
                  key={staff.staffId}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-2 border-b">
                    <img
                      src={staff.userVM.imgAvatarPath || "/user-default.png"}
                      alt={staff.userVM.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{staff.userVM.fullName}</td>
                  <td className="px-4 py-2 border-b">{staff.position}</td>
                  <td className="px-4 py-2 border-b">{staff.userVM.email}</td>
                  <td className="px-4 py-2 border-b">{staff.userVM.phoneNumber}</td>
                  <td className="px-4 py-2 border-b">{staff.userVM.address}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListStaff;
