import { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import NotFoundPage from './pages/NotFoundPage';
import { useSelector } from 'react-redux';
import { selectUser } from './redux/slices/authSlice';
import SignIn from './pages/Auth/SignIn';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Admin/Dashboard';
import AdminRoutes from './routes/AdminRoutes';
import PrivateRoute from './components/PrivateRoute';
import StaffRoutes from './routes/StaffRoutes';
import { initializeSignalR } from './hooks/SignalRService';


function App() {
  const user = useSelector(selectUser);
  useEffect(() => {
    const token = localStorage.getItem('token'); // Replace with your auth token logic
    if (token) {
        initializeSignalR(token);
    }
}, [initializeSignalR]);
  return (
    <>
    <div>
            {/* <h1>Coordinator Dashboard</h1> */}
            <div id="notification-container"></div>
        </div>
    
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute
            allowedRoles={['Admin', 'Staff', 'Order Coordinator']}
            >
              <AdminRoutes />
            </PrivateRoute>
          }
        />
        <Route
          path="/staff/*"
          element={
            <PrivateRoute
            allowedRoles={['Order Coordinator','Staff']}
            >
              <StaffRoutes />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </>
  );
}

export default App;
