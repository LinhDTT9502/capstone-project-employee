import { useState } from 'react';
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


function App() {
  const user = useSelector(selectUser);
  
  return (
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute
            allowedRoles={['Admin', 'Employee']}
            >
              <AdminRoutes />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

  );
}

export default App;
