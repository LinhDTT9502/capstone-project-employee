import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button, Select, Option } from "@material-tailwind/react";

const EditUserModal = ({ isOpen, onClose, onEditUser, user }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    address: "",
    roleId: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        dob: user.dob,
        address: user.address || "",
        roleId: user.roleId.toString(),
      });
    }
  }, [user]);

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
    onEditUser(user.id, formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} size="lg">
      <DialogHeader>Cập nhật Người Dùng</DialogHeader>
      <DialogBody className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Tên Đăng Nhập"
            name="userName"
            value={formData.userName}
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
        </div>
        <div>
          <Input
            label="Số Điện Thoại"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          <Input
            label="Ngày Sinh"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
          />
          <Input
            label="Địa Chỉ"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
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
          Cập nhật
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditUserModal;
