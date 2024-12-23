import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getOrderbyBranch, getOrderList } from "../../services/Staff/OrderService";
import { getRentalbyBranch, getRentalsList } from "../../services/Staff/RentalService";
import { height } from "@fortawesome/free-regular-svg-icons/faAddressBook";

const PieChart = ({ branchId }) => {
  const [chartData, setChartData] = useState({
    series: [],
    labels: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getOrderbyBranch(branchId); //thêm branchId vào đây
        const rentalsData = await getRentalbyBranch(2); //thêm branchId vào đây

        console.log(ordersData);
        console.log(rentalsData);

        if (ordersData.length > 0 && rentalsData.length > 0) {
          // Calculate totalAmount for orders and rentals
          const ordersTotal = ordersData.reduce(
            (acc, order) => acc + (order.totalAmount || 0),
            0
          );
          const rentalsTotal = rentalsData.reduce(
            (acc, rental) => acc + (rental.totalAmount || 0),
            0
          );


          // Update chart data
          setChartData({
            series: [ordersTotal, rentalsTotal, 100 - ordersTotal - rentalsTotal],
            labels: ["Doanh thu đơn đã bán", "Doanh thu đơn cho thuê", "Doanh thu khác"],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: chartData.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
            height: 100
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        // Get the corresponding series value
        const seriesValue = opts.w.config.series[opts.seriesIndex];
        // Format it using toLocaleString("vi-VN")
        return `${seriesValue.toLocaleString("vi-VN")} ₫`;
      },
      style: {
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        colors: ["#333"],
      },
    },
    tooltip: {
      y: {
        formatter: (val) => val.toLocaleString("vi-VN") + " ₫",
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <h3>Tổng doanh thu tính đến hiện tại</h3>
        <ReactApexChart
          options={chartOptions}
          series={chartData.series}
          type="pie"
          width={500}
          height={400}
        />
      </div>
    </div>
  );
};

export default PieChart;
