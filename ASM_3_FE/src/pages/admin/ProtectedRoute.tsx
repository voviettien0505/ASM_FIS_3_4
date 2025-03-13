import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  // 🛠 Kiểm tra user có đăng nhập không
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // 🛠 Lấy role từ user hoặc localStorage (nếu có)
  const storedUser = localStorage.getItem("user");
  const userRole = user.role || (storedUser ? JSON.parse(storedUser).role : null);
  console.log(userRole);

  // 🛠 Nếu không có quyền truy cập, chuyển hướng về trang chính
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  // 🛠 Nếu là ADMIN nhưng không ở trang quản lý, điều hướng sang /admin/orders
  if (userRole === "ADMIN" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin/orders" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
