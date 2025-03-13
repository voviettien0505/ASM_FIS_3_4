import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Products from "./pages/Products";
import LoginRegister from "./pages/LoginRegister";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import OrderPage from "./pages/OrderPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AdminLayout from "./components/AdminLayout";
import AdminOrders from "./pages/admin/AdminOrders";
import ProtectedRoute from "./pages/admin/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Routes chung với Header */}
            <Route
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Products />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/order" element={<OrderPage />} />
                      <Route path="/order/tracking" element={<OrderTrackingPage />} />
                      <Route path="/login" element={<LoginRegister />} />
                      {/* 🚀 Route dành cho USER */}
                      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
                        <Route path="/user/orders" element={<OrderPage />} />
                        <Route path="/user/tracking" element={<OrderTrackingPage />} />
                      </Route>
                    </Routes>
                  </main>
                </div>
              }
            >
              <Route path="/*" element={null} /> {/* Catch-all for non-admin routes */}
            </Route>

            {/* 🚀 Route dành cho ADMIN - không có Header */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="orders" element={<AdminOrders />} />
                {/* Thêm các trang quản lý admin khác */}
              </Route>
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;