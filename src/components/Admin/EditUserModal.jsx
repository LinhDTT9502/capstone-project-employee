import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";

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

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        address: user.address || "",
        roleId: user.roleId ? user.roleId.toString() : "",
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

  const validate = () => {
    const errors = {};
    if (!formData.userName.trim()) errors.userName = "Tên đăng nhập là bắt buộc.";
    if (!formData.fullName.trim()) errors.fullName = "Họ và tên là bắt buộc.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Email không hợp lệ.";
    if (!formData.phoneNumber.trim() || !/^[0-9]{10}$/.test(formData.phoneNumber))
      errors.phoneNumber = "Số điện thoại không hợp lệ.";
    if (!formData.gender) errors.gender = "Giới tính là bắt buộc.";
    if (!formData.dob) errors.dob = "Ngày sinh là bắt buộc.";
    if (!formData.roleId) errors.roleId = "Vai trò là bắt buộc.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onEditUser(user.id, formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} size="lg">
      <DialogHeader className="bg-blue-gray-50 px-6 py-4">
        <Typography variant="h5" color="blue-gray">
          Cập nhật Người Dùng
        </Typography>
      </DialogHeader>
      <DialogBody className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Input
                label="Tên Đăng Nhập"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                error={Boolean(validationErrors.userName)}
              />
              {validationErrors.userName && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.userName}
                </Typography>
              )}
            </div>
            <div>
              <Input
                label="Họ và Tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                error={Boolean(validationErrors.fullName)}
              />
              {validationErrors.fullName && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.fullName}
                </Typography>
              )}
            </div>
            <div>
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={Boolean(validationErrors.email)}
              />
              {validationErrors.email && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.email}
                </Typography>
              )}
            </div>
            <div>
              <Input
                label="Số Điện Thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={Boolean(validationErrors.phoneNumber)}
              />
              {validationErrors.phoneNumber && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.phoneNumber}
                </Typography>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Input
                label="Ngày Sinh"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                error={Boolean(validationErrors.dob)}
              />
              {validationErrors.dob && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.dob}
                </Typography>
              )}
            </div>
            <div>
              <Input
                label="Địa Chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Select
                label="Giới Tính"
                name="gender"
                value={formData.gender}
                onChange={(value) => handleSelectChange("gender", value)}
                error={Boolean(validationErrors.gender)}
              >
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
              {validationErrors.gender && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.gender}
                </Typography>
              )}
            </div>
            <div>
              <Select
                label="Vai Trò"
                name="roleId"
                value={formData.roleId}
                onChange={(value) => handleSelectChange("roleId", value)}
                error={Boolean(validationErrors.roleId)}
              >
                <Option value="1">Admin</Option>
                <Option value="2">Manager</Option>
                <Option value="3">Staff</Option>
                <Option value="4">Customer</Option>
                <Option value="5">Owner</Option>
                <Option value="16">Coordinator</Option>
                <Option value="17">Content Staff</Option>
              </Select>
              {validationErrors.roleId && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.roleId}
                </Typography>
              )}
            </div>
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
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Cập nhật
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditUserModal;
