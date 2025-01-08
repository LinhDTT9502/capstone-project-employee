import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Checkbox,
  CardBody,
  Breadcrumbs,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  createAdminUser,
  updateUser,
  getUserDetails,
  changeUserStatus,
} from "../../api/apiAdmin";
import { createUser, fetchAllUsers } from "../../services/ManageUserService";
import HeaderStaff from "../../layouts/HeaderStaff";
import SidebarStaff from "../../layouts/SidebarStaff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faEye,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);
  const [viewUserData, setViewUserData] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: "",
    roleId: "",
    isActive: true,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersData = await fetchAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error(error);
      setUsers([]);
      toast.error("Error fetching users");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  const isValidPhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);
  const isValidBirthdate = (birthDate) => new Date(birthDate) <= new Date();
  const isValidGender = (gender) =>
    ["male", "female", "other"].includes(gender);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateUser = async () => {
    const errors = {};
    if (!newUserData.username) errors.username = "Username is required";
    if (!newUserData.password) errors.password = "Password is required";
    if (!newUserData.fullName) errors.fullName = "Full name is required";
    if (!newUserData.email || !isValidEmail(newUserData.email))
      errors.email = "Invalid email";
    if (!newUserData.phone || !isValidPhoneNumber(newUserData.phone))
      errors.phone = "Invalid phone number";
    if (!newUserData.birthDate || !isValidBirthdate(newUserData.birthDate))
      errors.birthDate = "Invalid birthdate";

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        await createUser(newUserData);
        await fetchData();
        setModalOpen(false);
        resetForm();
        toast.success("User created successfully");
      } catch (error) {
        console.error(
          "Error creating user:",
          error.response ? error.response.data : error
        );
        toast.error("Error creating user");
      }
    }
  };

  const resetForm = () => {
    setNewUserData({
      username: "",
      password: "",
      fullName: "",
      phone: "",
      email: "",
      gender: "",
      birthDate: "",
      roleId: "",
      isActive: true,
    });
    setValidationErrors({});
  };

  const handleUpdateUser = async () => {
    const { username, fullName, phone, email, gender, birthDate, roleId } =
      editUserData;

    if (
      !username ||
      !fullName ||
      !phone ||
      !email ||
      !gender ||
      !birthDate ||
      !roleId
    ) {
      toast.warning("All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      toast.warning("Invalid email");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast.warning("Invalid phone number");
      return;
    }

    if (!isValidGender(gender)) {
      toast.warning("Invalid gender");
      return;
    }

    if (!isValidBirthdate(birthDate)) {
      toast.warning("Invalid birthdate");
      return;
    }

    try {
      await updateUser(editUserData.id, editUserData);
      await fetchData();
      setEditModalOpen(false);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Error updating user");
    }
  };

  const handleChangeStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await changeUserStatus(userId, { isActived: newStatus });
      await fetchData();
      toast.success(
        `User status changed to ${newStatus ? "Active" : "Inactive"}`
      );
    } catch (error) {
      toast.error("Error changing user status");
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await getUserDetails(userId);
      const userData = response.data?.result || response.data?.data;
      if (userData) {
        setViewUserData(userData);
        setViewUserModalOpen(true);
      } else {
        toast.error("Error fetching user details");
        console.log("Error: Response data is empty or undefined", response);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.response || error);
      toast.error("Error fetching user details");
    }
  };

  const onSelectChange = (selectedKey) => {
    setSelectedRowKeys((prevSelectedRowKeys) =>
      prevSelectedRowKeys.includes(selectedKey)
        ? prevSelectedRowKeys.filter((key) => key !== selectedKey)
        : [...prevSelectedRowKeys, selectedKey]
    );
  };

  const getRoleName = (roleId) => {
    const roles = {
      1: "Admin",
      3: "Manager",
      5: "BranchStaff",
      7: "Customer",
      2: "Owner",
      4: "Coordinator",
      6: "ContentStaff",
    };
    return roles[roleId] || "Unknown role";
  };

  const getStatusButtonStyle = (isActive) => {
    return isActive
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";
  };

  return (
    <>
      <div className="flex justify-between">
        {" "}
        <h2 className="text-2xl font-bold mx-10 mt-4">Quản lý tài khoản</h2>
        <div className="flex justify-end items-center">
          <Button
            color="blue"
            className="flex items-center mx-10 gap-2 mt-4"
            onClick={() => setModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Tạo tài khoản
          </Button>
        </div>
      </div>

      <hr className=" flex justify-between items-center mx-10 my-4" />
      <div className="min-h-screen px-8">
        <div className="max-w-7xl mx-auto">
          {/* <div className="flex justify-end items-center">
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => setModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Tạo tài khoản
            </Button>
          </div> */}

          <Card className="mb-6 overflow-hidden">
            <CardBody>
              {/* <div className="flex justify-between items-center mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div> */}

              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <Checkbox
                          color="blue"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRowKeys(users.map((row) => row.id));
                            } else {
                              setSelectedRowKeys([]);
                            }
                          }}
                          checked={selectedRowKeys.length === users.length}
                          indeterminate={
                            selectedRowKeys.length > 0 &&
                            selectedRowKeys.length < users.length
                          }
                        />
                      </th>
                      {["Tên đăng nhập", "Email", "Vai trò", "", "Trạng thái"].map(
                        (header) => (
                          <th
                            key={header}
                            className="border-y border-blue-gray-100 bg-blue-gray-50/50 text-center p-4"
                          >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold leading-none opacity-70"
                            >
                              {header}
                            </Typography>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => {
                      const isLast = index === users.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";
                      const isSelected = selectedRowKeys.includes(user.id);

                      return (
                        <tr
                          key={user.id}
                          className={isSelected ? "bg-blue-50" : ""}
                        >
                          <td className={classes}>
                            <Checkbox
                              color="blue"
                              checked={isSelected}
                              onChange={() => onSelectChange(user.id)}
                            />
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.userName}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.email}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {getRoleName(user.roleId)}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                color="blue"
                                variant="text"
                                className="flex items-center gap-2"
                                onClick={() => handleEditUser(user.id)}
                              >
                                <FontAwesomeIcon icon={faPen} />
                                Chỉnh sửa
                              </Button>
                              <Button
                                size="sm"
                                color="blue"
                                variant="text"
                                className="flex items-center gap-2"
                                onClick={() => handleViewUser(user.id)}
                              >
                                <FontAwesomeIcon icon={faEye} />
                                Xem
                              </Button>
                            </div>
                          </td>
                          <td className={classes}>
                            <Button
                              size="sm"
                              className={`${getStatusButtonStyle(
                                user.isActived
                              )} text-white`}
                              onClick={() =>
                                handleChangeStatus(user.id, user.isActived)
                              }
                            >
                              {user.isActived ? "Hoạt động" : "Vô hiệu hóa"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Trước
                </Button>
                <Typography variant="small" className="font-normal">
                  Trang {currentPage} of {Math.ceil(users.length / usersPerPage)}
                </Typography>
                <Button
                  onClick={handleNextPage}
                  disabled={
                    currentPage === Math.ceil(users.length / usersPerPage)
                  }
                >
                  Sau
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* View User Modal */}
        <Dialog
          open={viewUserModalOpen}
          onClose={() => setViewUserModalOpen(false)}
          size="lg"
        >
          <DialogHeader>User Details</DialogHeader>
          <DialogBody className="grid grid-cols-2 gap-4">
            {[
              { label: "Username", value: viewUserData?.userName },
              { label: "Full Name", value: viewUserData?.fullName },
              { label: "Email", value: viewUserData?.email },
              { label: "Gender", value: viewUserData?.gender },
              { label: "Phone", value: viewUserData?.phone },
              {
                label: "Birthdate",
                value: viewUserData?.birthDate
                  ? new Date(viewUserData.birthDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                  : "Unknown",
              },
              { label: "Role", value: getRoleName(viewUserData?.roleId) },
              {
                label: "Status",
                value: viewUserData?.isActive ? "Active" : "Inactive",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <Typography variant="small" className="font-semibold">
                  {label}:
                </Typography>
                <Typography variant="small" className="mb-2">
                  {value || "Unknown"}
                </Typography>
              </div>
            ))}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              onClick={() => setViewUserModalOpen(false)}
              className="mr-1"
            >
              Close
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Create User Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => {
            setModalOpen(false);
            resetForm();
          }}
          size="lg"
        >
          <DialogHeader>Create New User</DialogHeader>
          <DialogBody className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" className="font-semibold mb-2">
                Username:
              </Typography>
              <Input
                variant="outlined"
                name="username"
                value={newUserData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                error={validationErrors.username}
              />
              {validationErrors.username && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.username}
                </Typography>
              )}

              <Typography variant="small" className="font-semibold mb-2 mt-4">
                Full Name:
              </Typography>
              <Input
                variant="outlined"
                name="fullName"
                value={newUserData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                error={validationErrors.fullName}
              />
              {validationErrors.fullName && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.fullName}
                </Typography>
              )}

              <Typography variant="small" className="font-semibold mb-2 mt-4">
                Email:
              </Typography>
              <Input
                variant="outlined"
                name="email"
                value={newUserData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                error={validationErrors.email}
              />
              {validationErrors.email && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.email}
                </Typography>
              )}

              <Typography variant="small" className="font-semibold mb-2 mt-4">
                Password:
              </Typography>
              <Input
                type="password"
                variant="outlined"
                name="password"
                value={newUserData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                error={validationErrors.password}
              />
              {validationErrors.password && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.password}
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="small" className="font-semibold mb-2">
                Phone:
              </Typography>
              <Input
                variant="outlined"
                name="phone"
                value={newUserData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                error={validationErrors.phone}
              />
              {validationErrors.phone && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.phone}
                </Typography>
              )}

              <Typography variant="small" className="font-semibold mb-2 mt-4">
                Birthdate:
              </Typography>
              <Input
                type="date"
                variant="outlined"
                name="birthDate"
                value={newUserData.birthDate}
                onChange={handleInputChange}
                error={validationErrors.birthDate}
              />
              {validationErrors.birthDate && (
                <Typography color="red" className="text-xs mt-1">
                  {validationErrors.birthDate}
                </Typography>
              )}

              <Typography variant="small" className="font-semibold mb-2 mt-4">
                Gender:
              </Typography>
              <Select
                name="gender"
                value={newUserData.gender}
                onChange={(value) =>
                  setNewUserData((prevData) => ({ ...prevData, gender: value }))
                }
              >
                <Option value="Nam">Male</Option>
                <Option value="Nữ">Female</Option>
                <Option value="Khác">Other</Option>
              </Select>

              <Typography variant="small" className="font-semibold mb-2 mt-4">
                Role:
              </Typography>
              <Select
                name="roleId"
                value={newUserData.roleId}
                onChange={(value) =>
                  setNewUserData((prevData) => ({ ...prevData, roleId: value }))
                }
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
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              onClick={() => setModalOpen(false)}
              className="mr-1"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser} color="blue">
              Create User
            </Button>
          </DialogFooter>
        </Dialog>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </>
  );
}
