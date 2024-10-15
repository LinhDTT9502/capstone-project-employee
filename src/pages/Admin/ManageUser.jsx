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
import { fetchAllUsers } from "../../services/ManageUserService";
import HeaderStaff from "../../layouts/HeaderStaff";
import SidebarStaff from "../../layouts/SidebarStaff";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEye } from '@fortawesome/free-solid-svg-icons';
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

  // State to track validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
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

    fetchData();
  }, []);

  // Calculate paginated users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Go to the next page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to the previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  const isValidPhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);
  const isValidBirthdate = (birthDate) => new Date(birthDate) <= new Date();

  // Validation function for gender
  const isValidGender = (gender) => {
    return ["male", "female", "other"].includes(gender);
  };

  // Handle input change for both create and edit forms
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

  // Handle user creation with validation
  const handleCreateUser = async () => {
    const errors = {};
    if (!newUserData.username) errors.username = "Missing fields";
    if (!newUserData.password) errors.password = "Missing fields";
    if (!newUserData.fullName) errors.fullName = "Missing fields";
    if (!newUserData.email || !isValidEmail(newUserData.email)) errors.email = "Invalid email";
    if (!newUserData.phone || !isValidPhoneNumber(newUserData.phone)) errors.phone = "Invalid phone";
    if (!newUserData.birthDate || !isValidBirthdate(newUserData.birthDate)) errors.birthDate = "Invalid birthdate";
  
    setValidationErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      try {
        console.log("Creating user with data:", newUserData);
        await createAdminUser(newUserData);
        const updatedUsers = await fetchAllUsers();
        setUsers(updatedUsers);
        setModalOpen(false);
        resetForm();
      } catch (error) {
        console.error("Error creating user:", error.response ? error.response.data : error);
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

  // Handle updating user information
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
      toast.error("Missing fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast.error("Invalid phone");
      return;
    }

    if (!isValidGender(gender)) {
      toast.error("Invalid gender");
      return;
    }

    if (!isValidBirthdate(birthDate)) {
      toast.error("Invalid birthdate");
      return;
    }

    try {
      await updateUser(editUserData.id, editUserData);
      const updatedUsers = await fetchAllUsers();
      setUsers(updatedUsers);
      setEditModalOpen(false);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Error updating user");
    }
  };

  // Handle status change
  const handleChangeStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await changeUserStatus(userId, { isActive: newStatus });
      const updatedUsers = await fetchAllUsers();
      setUsers(updatedUsers);
      toast.success(`User status changed to ${newStatus ? "Active" : "Inactive"}`);
    } catch (error) {
      toast.error("Error changing user status");
    }
  };

  // Handle viewing user details
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
    switch (roleId) {
      case 2:
        return "Manager";
      case 3:
        return "Employee";
      case 4:
        return "Customer";
      case 5:
        return "Owner";
      default:
        return "Unknown role";
    }
  };

  const getStatusButtonStyle = (isActive) => {
    return isActive ? "bg-blue-500 text-white" : "bg-gray-500 text-white";
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.userName.toLowerCase().includes(query)
    );
  });
  return (
    <>
      <ToastContainer />
      <HeaderStaff />
      <div className="flex h-full">
        <SidebarStaff />
        <div className="flex-grow border-l-2">
          <h2 className="text-2xl font-bold mx-10 mt-4">
            Customer Account
          </h2>
          <div className="flex justify-between items-center mx-10 my-4">
            <Breadcrumbs className="flex-grow">
              <a href="#" className="opacity-60">
                Home
              </a>
              <a href="#">Customer Account</a>
            </Breadcrumbs>
            <Button onClick={() => setModalOpen(true)} className="mt-4">
              Create User
            </Button>
          </div>
  
          <Card className="h-full w-[95.7%] mx-10 my-10">
            <CardBody className="overflow-scroll px-0">
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
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography
                        variant="large"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Username
                      </Typography>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography
                        variant="large"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Email
                      </Typography>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography
                        variant="large"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Role
                      </Typography>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography
                        variant="large"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Actions
                      </Typography>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography
                        variant="large"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Status
                      </Typography>
                    </th>
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
                        className={isSelected ? "bg-blue-100" : ""}
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
                              variant="text"
                              className="hover:underline"
                              onClick={() => handleEditUser(user.id)}
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faPen} />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="text"
                              className="hover:underline"
                              onClick={() => handleViewUser(user.id)}
                              title="View Information"
                            >
                              <FontAwesomeIcon icon={faEye} />
                              <span className="sr-only">View Information</span>
                            </Button>
                          </div>
                        </td>
                        <td className={classes}>
                          <Button
                            className={`${getStatusButtonStyle(
                              user.isActive
                            )} px-4 py-2`}
                            onClick={() =>
                              handleChangeStatus(user.id, user.isActive)
                            }
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
  
            {/* Pagination controls */}
            <div className="flex justify-between mx-10 my-4">
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Prev
              </Button>
              <Typography variant="small" className="font-normal">
                Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
              </Typography>
              <Button
                onClick={handleNextPage}
                disabled={
                  currentPage === Math.ceil(users.length / usersPerPage)
                }
              >
                Next
              </Button>
            </div>
          </Card>
        </div>
      </div>
  
      {/* View User Modal */}
      <Dialog
        open={viewUserModalOpen}
        onClose={() => setViewUserModalOpen(false)}
        size="lg"
      >
        <DialogHeader>View User Details</DialogHeader>
        <DialogBody className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="small" className="font-bold">
              Username:
            </Typography>
            <Typography variant="small" className="mb-4">
              {viewUserData?.userName || "Unknown"}
            </Typography>
  
            <Typography variant="small" className="font-bold">
              Full Name:
            </Typography>
            <Typography variant="small" className="mb-4">
              {viewUserData?.fullName || "Unknown"}
            </Typography>
  
            <Typography variant="small" className="font-bold">
              Email:
            </Typography>
            <Typography variant="small" className="mb-4">
              {viewUserData?.email || "Unknown"}
            </Typography>
  
            <Typography variant="small" className="font-bold">
              Gender:
            </Typography>
            <Typography variant="small" className="mb-4">
              {viewUserData?.gender || "Unknown"}
            </Typography>
          </div>
          <div>
            <Typography variant="small" className="font-bold">
              Phone:
            </Typography>
            <Typography variant="small" className="mb-4">
              {viewUserData?.phone || "Unknown"}
            </Typography>
  
            <Typography variant="small" className="font-bold">
              Birthdate:
            </Typography>
            <Typography variant="small" className="mb-4">
              {viewUserData?.birthDate
                ? new Date(viewUserData.birthDate).toLocaleDateString()
                : "Unknown"}
            </Typography>
  
            <Typography variant="small" className="font-bold">
              Role:
            </Typography>
            <Typography variant="small" className="mb-4">
              {getRoleName(viewUserData?.roleId)}
            </Typography>
  
            <Typography variant="small" className="font-bold">
              Status:
            </Typography>
            <Typography variant="small" className="mb-4">
              {viewUserData?.isActive ? "Active" : "Inactive"}
            </Typography>
          </div>
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
        <DialogHeader>Create User</DialogHeader>
        <DialogBody className="grid grid-cols-2 gap-4">
          <div>
            <div className="username">
              <Typography variant="small" className="font-bold">
                Username:
              </Typography>
              <Input
                variant="outlined"
                name="username"
                value={newUserData.username}
                onChange={handleInputChange}
                placeholder="Username"
              />
              {validationErrors.username && (
                <Typography color="red">{validationErrors.username}</Typography>
              )}
            </div>
  
            <div className="fullname">
              <Typography variant="small" className="font-bold">
                Full Name:
              </Typography>
              <Input
                variant="outlined"
                name="fullName"
                value={newUserData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
              />
              {validationErrors.fullName && (
                <Typography color="red">{validationErrors.fullName}</Typography>
              )}
            </div>
  
            <div className="email">
              <Typography variant="small" className="font-bold">
                Email:
              </Typography>
              <Input
                variant="outlined"
                name="email"
                value={newUserData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              {validationErrors.email && <Typography color="red">{validationErrors.email}</Typography>}
            </div>
  
            <div className="password">
              <Typography variant="small" className="font-bold">
                Password:
              </Typography>
              <Input
                type="password"
                variant="outlined"
                name="password"
                value={newUserData.password}
                onChange={handleInputChange}
                placeholder="Password"
              />
              {validationErrors.password && (
                <Typography color="red">{validationErrors.password}</Typography>
              )}
            </div>
  
          </div>
  
          <div>
            <div className="phone">
              <Typography variant="small" className="font-bold">
                Phone:
              </Typography>
              <Input
                variant="outlined"
                name="phone"
                value={newUserData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              {validationErrors.phone && <Typography color="red">{validationErrors.phone}</Typography>}
            </div>
  
            <div className="birthdate">
              <Typography variant="small" className="font-bold">
                Birthdate:
              </Typography>
              <Input
                type="date"
                variant="outlined"
                name="birthDate"
                value={newUserData.birthDate}
                onChange={handleInputChange}
              />
              {validationErrors.birthDate && <Typography color="red">{validationErrors.birthDate}</Typography>}
            </div>
  
            <Typography variant="small" className="font-bold">
              Select Gender:
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
            </Select>
  
            <Typography variant="small" className="font-bold">
              Role:
            </Typography>
            <Select
              name="roleId"
              value={newUserData.roleId}
              onChange={(value) =>
                setNewUserData((prevData) => ({ ...prevData, roleId: value }))
              }
            >
              <Option value="2">Manager</Option>
              <Option value="3">Employee</Option>
              <Option value="4">Customer</Option>
              <Option value="5">Owner</Option>
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
          <Button onClick={handleCreateUser} className="bg-blue-500">
            Create
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}