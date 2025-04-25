import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './DashBoard.css';
import { url } from '../../assets/assets';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashBoard = () => {
  // Data for the Bar Chart (Monthly Sales)
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalReservations, setTotalReservations] = useState(null);
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));
  const [dishLabels, setDishLabels] = useState([]);
  const [dishData, setDishData] = useState([]);

  const monthlySalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales (₹)',
        data: monthlySales,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get(url+'/api/order/monthly');
        if (response.data.success) {
          // console.log(response.data.data); // Debugging API Response
          setMonthlySales(response.data.data);
        } else {
          console.error("Failed to fetch monthly sales data");
        }
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };


    const fetchTotalOrders = async () => {
      try {
        const response = await axios.get(url+'/api/order/count');
        setTotalOrders(response.data.data);
        // console.log( response.data); // Debugging API Response
        
      } catch (error) {
        console.error('Failed to fetch total orders:', error);
      }
    };

    const fetchTotalAmount = async () => {
      try {
        const response = await axios.get(url+'/api/order/amount');
        setTotalAmount(response.data.data[0].totalAmount);
        // console.log(response.data); // Debugging API Response
      } catch (error) {
        console.error('Failed to fetch total amount:', error);
      }
    };

    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get(url+'/api/user/totalusers');
        // console.log(response.data);
        setTotalUsers(response.data.data);
      } catch (error) {
        console.error('Failed to fetch total users:', error);
      }
    };

    const fetchTotalReservations = async () => {
      try {
        const response = await axios.get(url+'/api/reservation/totalreservations');
        // console.log(response.data);
        setTotalReservations(response.data.data);
      } catch (error) {
        console.error('Failed to fetch total reservations:', error);
      }
    };

    const fetchDishPopularity = async () => {
      try {
        const response = await axios.get(url + "/api/order/popular");
        if (response.data.success) {
          setDishLabels(response.data.labels);
          setDishData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching dish popularity:", err);
      }
    };

    fetchDishPopularity();
    fetchMonthlySales();
    fetchTotalReservations();
    fetchTotalUsers();
    fetchTotalAmount();
    fetchTotalOrders();
  }, []);
  
  // Data for the Pie Chart (Dish Popularity)
  const dishPopularityData = {
    labels: dishLabels,
    datasets: [
      {
        label: 'Dish Popularity',
        data: dishData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="restaurant-stats">
      <h1>Restaurant Dashboard</h1>
      <p className="welcome-message">Welcome back to your restaurant dashboard.</p>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h2>Total Orders</h2>
          <p>{totalOrders !== null ? totalOrders : 'Loading...'}</p>

        </div>
        <div className="stat-card">
          <h2>Total Revenue</h2>
          <p>₹{totalOrders !== null ? totalAmount : 'Loading...'}</p>
        </div>
        <div className="stat-card">
          <h2>Total Customers</h2>
          <p>{totalOrders !== null ? totalUsers : 'Loading...'}</p>
        </div>
        <div className="stat-card">
          <h2>Total Reservations</h2>
          <p>{totalOrders !== null ? totalReservations : 'Loading...'}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card">
          <h2>Monthly Sales</h2>
          <div className="chart-wrapper">
            <Bar
              data={monthlySalesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="chart-card">
          <h2>Dish Popularity</h2>
          <div className="chart-wrapper">
            <Pie
              data={dishPopularityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;