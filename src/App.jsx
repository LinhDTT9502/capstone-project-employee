import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NotFoundPage from "./pages/NotFoundPage";
import { useSelector } from "react-redux";
import { selectUser } from "./redux/slices/authSlice";
import SignIn from "./pages/Auth/SignIn";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/Admin/Dashboard";
import AdminRoutes from "./routes/AdminRoutes";
import PrivateRoute from "./components/PrivateRoute";
import StaffRoutes from "./routes/StaffRoutes";
import { initializeSignalR } from "./hooks/SignalRService";
import ManagerRoutes from "./routes/ManagerRoutes";
import ContentStaffRoutes from "./routes/ContentStaffRoutes";
import HeaderStaff from "./layouts/HeaderStaff";
import SidebarStaff from "./layouts/SidebarStaff";
import CoordinatorRoutes from "./routes/CoordinatorRoutes";
import OwnerRoutes from "./routes/OwnerRoutes";

function App() {
  const user = useSelector(selectUser);

  return (
    <>
      {user && <HeaderStaff />}
      <div className="flex h-full">
        {user && <SidebarStaff />}
        <div className="flex-grow border-l-2">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute allowedRoles={["Admin"]}>
                    <AdminRoutes />
                  </PrivateRoute>
                }
              />

              <Route
                path="/owner/*"
                element={
                  <PrivateRoute allowedRoles={["Owner"]}>
                    <OwnerRoutes />
                  </PrivateRoute>
                }
              />

              <Route
                path="/staff/*"
                element={
                  <PrivateRoute allowedRoles={["Staff"]}>
                    <StaffRoutes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/coordinator/*"
                element={
                  <PrivateRoute allowedRoles={["Order Coordinator"]}>
                    <CoordinatorRoutes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/manager/*"
                element={
                  <PrivateRoute allowedRoles={["Manager"]}>
                    <ManagerRoutes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/content-staff/*"
                element={
                  <PrivateRoute allowedRoles={["Content Staff"]}>
                    <ContentStaffRoutes />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
