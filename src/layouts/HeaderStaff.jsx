import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBell,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";
import Logout from "../pages/Auth/Logout";
import useOrderNotification from "../hooks/Notification";
import OrderDetailModal from "../pages/OnlineStaff/OrderDetailModal";
import { getNoti } from "../services/Notification/NotificationService";
import { Link, useNavigate } from "react-router-dom";
import { getOrderbyCode } from "../services/Staff/OrderService";
import Profile from "../pages/Profile/Profile";

function HeaderStaff() {
  const [open, setOpen] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const user = useSelector(selectUser);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [noti, setNoti] = useState([]);
  const token = localStorage.getItem("token");
  const [branchId, setBranchId] = useState(null);
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const handleViewProfile = () => {
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const getNotification = async () => {
    const data = await getNoti(user.UserId, token);

    const sortedData = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setNoti(sortedData);
  };

  useEffect(() => {
    getNotification();
  }, [branchId]);

  const handleOpenModal = async (orderCode, id) => {
    const numericOrderCode = orderCode.replace(/^[A-Za-z]-/, "");

    // Set the selectedOrder to the numeric part
    setSelectedOrder(numericOrderCode);
    console.log(selectedOrder);
    const data = await getOrderbyCode(numericOrderCode);
    console.log(data);

    setBranchId(data.branchId);
    setOrderId(data.id);
    console.log(orderCode, branchId, id);
    const response = await fetch(
      `https://capstone-project-703387227873.asia-southeast1.run.app/api/Notification/update-status?id=${id}&isRead=true`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
        },
      }
    );

    // Open the appropriate modal based on the prefix
    if (orderCode.startsWith("S-")) {
      if (user.role === "Order Coordinator") {
        if (data.branchId !== null) {
          alert("Đơn hàng này đã được bàn giao!");
          console.log(branchId);

          setBranchId(null);
          return; // Prevent opening the modal
        }
        setModalOpen(true);
      } else {
        navigate(`/staff/orders/${data.id}`);
      }
    } else if (orderCode.startsWith("T-")) {
      setModalOpen("true");
    }

    getNotification();
  };

  const handleLogo = () => {
    if (user.role === "Order Coordinator" || user.role === "Staff") {
      navigate(`/staff/orders`);
    } else if (user.role === "Admin") {
      navigate(`/admin/dashboard`);
    }
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  // Handle new notifications
  useOrderNotification((message) => {
    setNotifications((prev) => [...prev, message]); // Add new notification to the list
    setUnreadCount((prev) => prev + 1); // Increment unread count
    getNotification();
  });

  const handleNotiToggle = () => {
    setOpenNoti(!openNoti);

    if (!openNoti) {
      setUnreadCount(0); // Clear unread count when opening the menu
    }
  };

  // const handleNotificationClick = async (notificationId, event) => {
  //     event.stopPropagation();  // Prevent the Menu from closing when clicking on the notification
  //     try {
  //         const response = await fetch(`https://capstone-project-703387227873.asia-southeast1.run.app/api/Notification/update-status?id=${notificationId}&isRead=true`, {
  //             method: 'PUT',
  //             headers: {
  //                 'accept': '*/*',
  //             },
  //         });

  //         const data = await response.json();

  //         if (data.isSuccess) {
  //             // Update the local state to mark this notification as read
  //             setNoti((prevNoti) =>
  //                 prevNoti.map((noti) =>
  //                     noti.id === notificationId ? { ...noti, isRead: true } : noti
  //                 )
  //             );
  //         } else {
  //             console.error("Failed to update notification status");
  //         }
  //     } catch (error) {
  //         console.error("Error updating notification:", error);
  //     }
  // };

  // Function to highlight numbers
  const highlightNumbers = (notification) => {
    let message;
    let id;

    // Check if notification is an object or a string
    if (typeof notification === "object") {
      message = notification.message;
      id = notification.id;
    } else {
      message = notification; // Assume it's already the message string
    }

    return message.split(/(S-\d+|T-\d+)/).map((part, index) =>
      /(S-\d+|T-\d+)/.test(part) ? (
        <span
          key={index}
          className="font-bold text-orange-500"
          onClick={() => handleOpenModal(part, id)}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="justify-between flex items-center py-5 space-x-4 border-2">
      <div className="pl-10" onClick={handleLogo}>
        <img src="/Logo.png" alt="2Sport" className="object-scale-down w-20" />
      </div>
      <div className="flex">
        <div className="flex items-center pr-5">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
        </div>

        <Menu open={openNoti} handler={setOpenNoti}>
          <MenuHandler>
            <Button
              className="relative w-fit h-10 text-black bg-transparent flex items-center justify-center"
              onClick={handleNotiToggle}
            >
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </MenuHandler>
          <MenuList className="max-h-[40vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <MenuItem>Chưa có thông báo mới</MenuItem>
            ) : (
              notifications.map((notification, index) => (
                <MenuItem key={index}>
                  <p className="text-sm">{highlightNumbers(notification)}</p>
                </MenuItem>
              ))
            )}
            {noti.map((notiItem) => (
              <MenuItem
                key={notiItem.id}
                className={notiItem.isRead ? "bg-white" : "bg-blue-100"}
                // onClick={(event) => handleNotificationClick(notification.id, event)}
              >
                <div>{highlightNumbers(notiItem)}</div>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <div className="w-fit rounded font-bold pr-5 bg-transparent">
          <Menu open={open} handler={setOpen}>
            <MenuHandler>
              <Button
                className="w-fit h-10 text-black bg-transparent flex items-center justify-center"
                onClick={() => setOpen(!open)}
              >
                <p className="pr-2">{user.role}:</p>
                <p className="text-orange-500">{user.FullName}</p>
                <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={handleViewProfile}>
                <Button variant="text">Xem hồ sơ</Button>
                
              </MenuItem>

              <MenuItem>
                <Logout />
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      {modalOpen && (
        <OrderDetailModal
          open={true}
          onClose={handleCloseModal}
          orderId={orderId}
        />
      )}
      {profileModalOpen && (
                  <Profile
                    open={profileModalOpen}
                    onClose={handleCloseProfileModal}
                  />
                )}
    </div>
  );
}

export default HeaderStaff;
