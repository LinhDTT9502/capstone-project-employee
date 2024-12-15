import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button, Select, Option } from "@material-tailwind/react";

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
  size="lg"
  className="backdrop-blur-md backdrop-opacity-80"
>
      <DialogHeader>Thêm Người Dùng Mới</DialogHeader>
      <DialogBody className="grid grid-cols-2 gap-4">
        <div>
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
        <div>
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
            <Option value="2">Manager</Option>
            <Option value="3">Staff</Option>
            <Option value="4">Customer</Option>
            <Option value="5">Owner</Option>
            <Option value="16">Coordinator</Option>
            <Option value="17">Content Staff</Option>
          </Select>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="blue">
          Thêm Người Dùng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddUserModal;
