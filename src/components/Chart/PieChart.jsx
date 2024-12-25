import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getOrderbyBranch } from "../../services/Staff/OrderService";
import { getRentalbyBranch } from "../../services/Staff/RentalService";

const PieChart = ({ branchId }) => {
  const [chartData, setChartData] = useState({
    series: [],
    labels: [],
  });
  const [isDataAvailable, setIsDataAvailable] = useState(false); // State to track data availability

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getOrderbyBranch(branchId);
        const rentalsData = await getRentalbyBranch(branchId);

        // Calculate totalAmount for orders and rentals
        let ordersTotal = 0;
        let rentalsTotal = 0;
        if (ordersData !== null) {
          ordersTotal = ordersData.reduce(
            (acc, order) => acc + (order.totalAmount || 0),
            0
          );
        }
        if (rentalsData !== null) {
          rentalsTotal = rentalsData.reduce(
            (acc, rental) => acc + (rental.totalAmount || 0),
            0
          );
        }

        if (ordersTotal === 0 && rentalsTotal === 0) {
          setIsDataAvailable(false); // No data available
        } else {
          setIsDataAvailable(true); // Data is available
          setChartData({
            series: [ordersTotal, rentalsTotal],
            labels: ["Doanh thu đơn đã bán", "Doanh thu đơn cho thuê"],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [branchId]);

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
            height: 100,
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
        const seriesValue = opts.w.config.series[opts.seriesIndex];
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
    colors: isDataAvailable ? undefined : ["#ccc"], // Neutral color for placeholder
  };

  return (
    <div>
      <div id="chart">
        <h3>Tổng doanh thu tính đến hiện tại</h3>
        {isDataAvailable ? (
          <ReactApexChart
            options={chartOptions}
            series={chartData.series}
            type="pie"
            width={500}
            height={400}
          />
        ) : (
          <p className="my-16 text-center text-gray-500">Không có dữ liệu doanh thu để hiển thị.</p>
        )}
      </div>
    </div>
  );
};

export default PieChart;
