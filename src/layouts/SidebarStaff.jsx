import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faRankingStar,
  faTableCellsLarge,
  faComments,
  faGauge,
  faUser,
  faUsers,
  faBaseball,
  faUserTie,
  faClipboardList,
  faBlog,
  faVial,
  faChevronDown,
  faChevronUp,
  faBoxOpen,
  faHandshake,
  faBars,
  faReceipt,
  faWarehouse,
  faComment,
  faFileImport,
  faToolbox
} from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../redux/slices/authSlice";

export default function SidebarStaff() {
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("/coordinator/assign-orders");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/coordinator")) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const SidebarLink = ({ to, icon, children }) => (
    <Link
      to={to}
      onClick={() => setActiveItem(to)} // Updates activeItem
      className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out group
                ${activeItem === to ? "bg-orange-100 text-orange-600" : ""}`}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`w-5 h-5 mr-3 text-gray-700 hover:bg-gray-100 group-hover:scale-110 transition-transform duration-300 
                  ${isSidebarCollapsed ? "mr-0" : ""}
                  ${activeItem === to ? "text-orange-600" : ""}`}
      />
      <span
        className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 
                      ${isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
      >
        {children}
      </span>
    </Link>
  );


  const renderAdminLinks = () => (
    <>
      <SidebarLink to="/admin/dashboard" icon={faGauge}>
        Bảng điều khiển
      </SidebarLink>
      <SidebarLink to="/admin/manage-user" icon={faUser}>
        Quản lý tài khoản
      </SidebarLink>
      <SidebarLink to="/admin/manage-staff" icon={faUserTie}>
        Danh sách Nhân Viên
      </SidebarLink>
      <SidebarLink to="/admin/manage-managers" icon={faUserTie}>
        Danh sách Quản lý
      </SidebarLink>
      <SidebarLink to="/admin/manage-role" icon={faUsers}>
        Quản lý vai trò
      </SidebarLink>
      <SidebarLink to="/admin/manage-feedback" icon={faComments}>
        Danh sách phản hồi
      </SidebarLink>
      <SidebarLink to="/admin/manage-products" icon={faToolbox}>
        Quản lý sản phẩm
      </SidebarLink>
      <SidebarLink to="/admin/manage-sport" icon={faBaseball}>
        Quản lý thể thao
      </SidebarLink>
      <SidebarLink to="/admin/manage-category" icon={faTableCellsLarge}>
        Quản lý danh mục
      </SidebarLink>
      <SidebarLink to="/admin/manage-brand" icon={faRankingStar}>
        Quản lý thương hiệu
      </SidebarLink>
      <SidebarLink to="/admin/manage-promotion" icon={faReceipt}>
        Khuyến mãi sản phẩm
      </SidebarLink>
      <SidebarLink to="/admin/manage-warehouse" icon={faWarehouse}>
        Xem kho
      </SidebarLink>
      <SidebarLink to="/admin/import-history" icon={faComments}>
        Lịch sử nhập hàng
      </SidebarLink>
    </>
  );

  const renderOwnerLinks = () => (
    <>
      <SidebarLink to="/owner/dashboard" icon={faGauge}>
        Tổng quan
      </SidebarLink>
      <SidebarLink to="/owner/manage-feedback" icon={faComments}>
        Danh sách phản hồi
      </SidebarLink>
      <SidebarLink to="/owner/import-history" icon={faComments}>
        Lịch sử nhập hàng
      </SidebarLink>

      <SidebarLink to="/owner/manage-warehouse" icon={faWarehouse}>
        Quản lý kho
      </SidebarLink>
      <SidebarLink to="/owner/test" icon={faWarehouse}>
        Quản lý kho
      </SidebarLink>
    </>
  );


  const renderCoordinatorLinks = () => (
    <div className="mb-2">
      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="coordinator-menu"
        className={`flex items-center w-full p-2 text-gray-700 hover:bg-indigo-100 rounded-lg transition-all duration-300 ease-in-out group
          ${activeItem.startsWith("/coordinator/assign-orders") ||
            activeItem.startsWith("/coordinator/assign-rentals")
            ? "bg-indigo-100 text-indigo-800"
            : ""
          }`}
      >
        <FontAwesomeIcon
          icon={faClipboardList}
          className={`w-5 h-5 mr-3 text-indigo-600 group-hover:scale-110 transition-transform duration-300 
            ${isSidebarCollapsed ? "mr-0" : ""} 
            ${activeItem.startsWith("/coordinator/assign-orders") ||
              activeItem.startsWith("/coordinator/assign-rentals")
              ? "text-indigo-800"
              : ""
            }`}
        />
        <span
          className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 
            ${isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
        >
          Chỉ Định Chi Nhánh
        </span>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className={`ml-auto w-4 h-4 transition-transform duration-300 
            ${isOpen ? "rotate-180" : ""} 
            ${isSidebarCollapsed ? "hidden" : ""}`}
        />
      </button>
      <div
        id="coordinator-menu"
        className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out 
          ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <SidebarLink to="/coordinator/assign-orders" icon={faBoxOpen}>
          Đơn bán
        </SidebarLink>
        <SidebarLink to="/coordinator/assign-rentals" icon={faHandshake}>
          Đơn cho thuê
        </SidebarLink>
      </div>
      <SidebarLink to="/coordinator/manage-comments" icon={faComment}>
        Quản lý bình luận
      </SidebarLink>
    </div>
  );


  const renderStaffLinks = () => (
    <>
      <SidebarLink to="/staff/list-orders" icon={faClipboardList}>
        Danh sách đơn hàng
      </SidebarLink>
      <SidebarLink to="/staff/list-rentals" icon={faHandshake}>
        Danh sách đơn cho thuê
      </SidebarLink>
      <SidebarLink to="/staff/list-refund" icon={faHandshake}>
        Yêu cầu hoàn tiền
      </SidebarLink>
      <SidebarLink to="/staff/list-extension" icon={faHandshake}>
        Yêu cầu gia hạn đơn thuê
      </SidebarLink>
      <SidebarLink to="/staff/invoice" icon={faHandshake}>
        In hóa đơn
      </SidebarLink>
    </>
  );

  const renderContentStaffLinks = () => (
    <>
      <SidebarLink to="/content-staff/blogs" icon={faBlog}>
        Blog
      </SidebarLink>
      {/* <SidebarLink to="/content-staff/test" icon={faVial}>
        Test
      </SidebarLink> */}
    </>
  );

  const renderManagerLinks = () => (<>
    <SidebarLink to="/manager/list-staffs" icon={faUsers}>
      Danh sách nhân viên
    </SidebarLink>
    <SidebarLink to="/manager/import" icon={faFileImport}>
      Nhập kho
    </SidebarLink>
    <SidebarLink to="/manager/warehouse" icon={faWarehouse}>
      Quản lý kho
    </SidebarLink>
  </>
  );

  return (
    <aside
      className={`bg-white h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-16" : "w-80"
        }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2
            className={`text-2xl font-semibold  transition-all duration-300 ${isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
          >
            Bảng điều khiển
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-2">
            {user.role === "Admin" && renderAdminLinks()}
            {user.role === "Owner" && renderOwnerLinks()}
            {user.role === "Order Coordinator" && renderCoordinatorLinks()}
            {user.role === "Staff" && renderStaffLinks()}
            {user.role === "Content Staff" && renderContentStaffLinks()}
            {user.role === "Manager" && renderManagerLinks()}
          </div>
        </nav>
      </div>
    </aside>
  );
}
