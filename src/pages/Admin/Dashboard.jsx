// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Card,
  Breadcrumbs,
  CardBody,
  Typography,
  Avatar,
  Checkbox,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faArrowUp,
  faCalendar,
  faBagShopping
} from "@fortawesome/free-solid-svg-icons";
import { fetchOrders } from "../../services/DashboardService";
import { selectUser } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import RecentOrder from "./RecentOrder";
import HeaderStaff from "../../layouts/HeaderStaff";
import SidebarStaff from "../../layouts/SidebarStaff";
import PieChart from "../../components/Chart/PieChart";
import BarChart from "../../components/Chart/BarChart";


export default function Dashboard() {
  // const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeAmount, setActiveAmount] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [activeLength, setActiveLength] = useState(0);
  const [completedLength, setCompletedLength] = useState(0);
  const user = useSelector(selectUser)

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value) + ' VND';
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const ordersData = await fetchOrders();
  //       setOrders(ordersData);
  //       // console.log(`${t("dashboard.orders")}`, ordersData);
        
  //       // Calculate totals
  //       const totalOrdersCount = ordersData.length;
  //       const totalAmountSum = ordersData.reduce((acc, order) => acc + parseFloat(order.amount), 0);
  //       setTotalOrders(totalOrdersCount);
  //       setTotalAmount(totalAmountSum);
  //       toast.success("Orders fetched successfully");
  //     } catch (error) {
  //       console.log(error);
  //       setOrders([]);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const onSelectChange = (selectedKey) => {
  //   setSelectedRowKeys((prevSelectedRowKeys) =>
  //     prevSelectedRowKeys.includes(selectedKey)
  //       ? prevSelectedRowKeys.filter((key) => key !== selectedKey)
  //       : [...prevSelectedRowKeys, selectedKey]
  //   );
  // };
// comment tạm
  const isStaffOrAdmin = user && (user.role === 'Employee' || user.role === 'Admin');

  return (
    <><HeaderStaff/>
      <div className='flex h-full'>
        {isStaffOrAdmin && <SidebarStaff />}
        <div className='flex-grow border-l-2'>

          <h2 className="text-2xl font-bold mx-10 mt-4">dashboard</h2>
          <div className="flex justify-between items-center mx-10 my-4">
            {/* <Breadcrumbs className="flex-grow">
              <a href="#" className="opacity-60">
                {t("dashboard.home")}
              </a>
              <a href="#">{t("dashboard.dashboard")}</a>
              
            </Breadcrumbs> */}
          </div>

          <div className="flex mx-10  space-x-2">
            <div className="w-2/3">
              <BarChart/>
            </div>
            <div className="w-1/3">
              {/* <PieChart /> */}
            </div>
          </div>
{/* <RecentOrder/> */}
        </div>
      </div>
    </>
  );
}