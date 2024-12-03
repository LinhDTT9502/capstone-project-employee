import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBell, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";
import Logout from "../pages/Auth/Logout";
import useOrderNotification from "../hooks/Notification";
import OrderDetailModal from "../pages/Staff/OrderDetailModal";
import { getNoti } from "../services/Notification/NotificationService";

function HeaderStaff() {
    const [open, setOpen] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const user = useSelector(selectUser);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [noti, setNoti] = useState([])
    const token = localStorage.getItem('token');
    

    const getNotification = async () => {
        const data = await getNoti(user.UserId, token);
        setNoti(data);
    };
    useEffect(() => {
        getNotification();
    }, []);
    const handleOpenModal = (part) => {
        setSelectedOrder(part)
        setModalOpen(true);
        getNotification()
    };

    const handleCloseModal = () => {
        setSelectedOrder(null)
        setModalOpen(false);
    };

    // Handle new notifications
    useOrderNotification((message) => {
        setNotifications((prev) => [...prev, message]); // Add new notification to the list
        setUnreadCount((prev) => prev + 1); // Increment unread count
        getNotification()
    });

    const handleNotiToggle = () => {
        setOpenNoti(!openNoti);

        if (!openNoti) {
            setUnreadCount(0); // Clear unread count when opening the menu
        }
    };

    // Function to highlight numbers
    const highlightNumbers = (message) => {
        return message.split(/(\d+)/).map((part, index) =>
            /\d+/.test(part) ? (
                <span key={index} className="font-bold text-orange-500"
                    onClick={() => handleOpenModal(part)}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="justify-between flex items-center py-5 space-x-4 border-2">
            <div className="pl-10">
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
                    <MenuList>
                        {notifications.length === 0 ? (
                            <MenuItem>Chưa có thông báo mới</MenuItem>
                        ) : (
                            notifications.map((noti, index) => (
                                <MenuItem key={index}>
                                    <p className="text-sm">{highlightNumbers(noti)}</p>
                                </MenuItem>
                            ))
                        )}
                        {noti.map((notification) => (
                            <MenuItem key={notification.id}>
                                <div>{highlightNumbers(notification.message)}</div>
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
                            <MenuItem>
                                <Button variant="text">View Profile</Button>
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
                    open={modalOpen}
                    onClose={handleCloseModal}
                    orderId={selectedOrder}
                />
            )}
        </div>
    );
}

export default HeaderStaff;
