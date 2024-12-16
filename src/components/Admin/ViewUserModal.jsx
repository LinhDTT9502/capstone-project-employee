import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

// Mapping roleId thành tên vai trò
const roleMapping = {
  1: "Admin",
  2: "Manager",
  3: "Staff",
  4: "Customer",
  5: "Owner",
  6: "Coordinator",
  7: "Content Staff",
};

const ViewUserModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  // Dữ liệu chi tiết người dùng
  const userDetails = [
    { label: "Tên đăng nhập", value: user.userName },
    { label: "Họ và Tên", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Xác nhận Email", value: user.emailConfirmed ? "Đã xác nhận" : "Chưa xác nhận" },
    { label: "Số điện thoại", value: user.phoneNumber },
    { label: "Xác nhận SĐT", value: user.phoneNumberConfirmed ? "Đã xác nhận" : "Chưa xác nhận" },
    { label: "Giới tính", value: user.gender },
    { label: "Ngày sinh", value: user.dob ? new Date(user.dob).toLocaleDateString() : "Không có" },
    { label: "Địa chỉ", value: user.address || "Không có" },
    { label: "Vai trò", value: roleMapping[user.roleId] || "Không xác định" }, // Sử dụng roleMapping
    { label: "Trạng thái", value: user.isActived ? "Hoạt động" : "Vô hiệu hóa" },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} size="lg">
      <DialogHeader className="bg-blue-gray-50 px-6 py-4">
        <Typography variant="h5" color="blue-gray">
          Chi Tiết Người Dùng
        </Typography>
      </DialogHeader>
      <DialogBody className="px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar và tên người dùng */}
          <div className="flex-shrink-0 flex flex-col items-center">
          <img
  src={user.imgAvatarPath || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="}
  alt="Avatar"
  className="h-40 w-40 rounded-full object-cover shadow-lg border-4 border-white"
/>


            <Typography variant="h6" className="mt-4 text-blue-gray-800">
              {user.fullName}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-medium">
              {roleMapping[user.roleId] || "Không xác định"}
            </Typography>
          </div>

          {/* Thông tin người dùng */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {userDetails.map(({ label, value }, index) => (
              <div key={index} className="border-b border-blue-gray-100 pb-2">
                <Typography variant="small" className="font-semibold text-blue-gray-600">
                  {label}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="mt-1">
                  {value || "Không có"}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="bg-blue-gray-50 px-6 py-4">
        <Button
          variant="text"
          color="blue-gray"
          onClick={onClose}
          className="mr-1 hover:bg-blue-gray-100"
        >
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ViewUserModal;
