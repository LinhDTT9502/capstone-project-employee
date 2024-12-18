import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faUserCircle,
  faLock,
  faVenusMars,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    roleId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onAddUser(formData);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      size="md"
      className="bg-white shadow-xl rounded-xl"
    >
      <DialogHeader className="text-2xl font-bold text-blue-gray-800">
        Thêm Người Dùng Mới
      </DialogHeader>
      <DialogBody className="overflow-y-auto max-h-[60vh]">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="Tên Đăng Nhập"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <Input
                label="Họ và Tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-4">
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                label="Mật Khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Số Điện Thoại"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Input
              label="Ngày Sinh"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Giới Tính"
              value={formData.gender}
              onChange={(value) => handleSelectChange("gender", value)}
            >
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
            <Select
              label="Vai Trò"
              value={formData.roleId}
              onChange={(value) => handleSelectChange("roleId", value)}
            >
            <Option value="1">Admin</Option>
              <Option value="3">Manager</Option>
              <Option value="5">BranchStaff</Option>
              <Option value="7">Customer</Option>
              <Option value="2">Owner</Option>
              <Option value="4">Coordinator</Option>
              <Option value="6">Content Staff</Option>
            </Select>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="outlined" color="red" onClick={onClose}>
          Hủy
        </Button>
        <Button color="blue" onClick={handleSubmit}>
          Thêm Người Dùng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddUserModal;

