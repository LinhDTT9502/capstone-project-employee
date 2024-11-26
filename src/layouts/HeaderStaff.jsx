import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBell, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";
import Logout from "../pages/Auth/Logout";
import Profile from "../pages/Profile/Profile";
import useOrderNotification from "../hooks/Notification";
import { useEffect } from "react";


function HeaderStaff() {
    const [open, setOpen] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const user = useSelector(selectUser);
    const [notifications, setNotifications] = useState([]);

    // useEffect(() => {
    //     useOrderNotification.startConnection(); // Start the connection when the component mounts

    //     return () => {
    //         useOrderNotification.stopConnection(); // Cleanup when the component unmounts
    //     };
    // }, []);

    // Handle new notifications
    useOrderNotification((message) => {
        setNotifications((prev) => [...prev, message]); // Update notifications
        setOpenNoti(true); // Open the notification menu when a new notification arrives
    });

    const handleMenuToggle = () => setOpen(!open);
    const handleNotiToggle = () => setOpenNoti(!openNoti);
    const handleViewProfile = () => setProfileOpen(true);

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
                            className="w-fit h-10 text-black bg-transparent flex items-center justify-center"
                            onClick={handleNotiToggle}
                        >
                            <FontAwesomeIcon icon={faBell} className="text-xl" />
                        </Button>
                    </MenuHandler>
                    <MenuList>
                        {notifications.length === 0 ? (
                            <MenuItem>No new notifications</MenuItem>
                        ) : (
                            notifications.map((noti, index) => (
                                <MenuItem key={index}>
                                    <p className="text-sm">{noti}</p>
                                </MenuItem>
                            ))
                        )}
                    </MenuList>
                </Menu>

                <div className="w-fit rounded font-bold pr-5 bg-transparent">
                    <Menu open={open} handler={setOpen}>
                        <MenuHandler>
                            <Button
                                className="w-fit h-10 text-black bg-transparent flex items-center justify-center"
                                onClick={handleMenuToggle}
                            >
                                <p className="pr-2">{user.role}:</p>
                                <p className="text-orange-500">{user.FullName}</p>
                                <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                            </Button>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem>
                                <Button variant="text" onClick={handleViewProfile}>
                                    View Profile
                                </Button>
                            </MenuItem>
                            <MenuItem>
                                <Logout />
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </div>
        </div>
    );
}

export default HeaderStaff;
