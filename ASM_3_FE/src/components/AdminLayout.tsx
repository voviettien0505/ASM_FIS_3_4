import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,              // For Thống Kê
  faFileInvoiceDollar, // For Quản lý đơn hàng
  faBoxOpen,          // For Quản lý sản phẩm
  faTags,             // For Quản lý loại sản phẩm
  faUsers,            // For Quản lý người dùng
  faSignOutAlt,       // For Logout
  faBars              // For menu icon
} from '@fortawesome/free-solid-svg-icons';
import AdminOrders from '../pages/admin/AdminOrders';

const AdminLayout = () => {
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user?.username || 'Admin';

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <span className="font-bold text-lg text-gray-900">{username.toUpperCase()}</span>
          </div>
          <FontAwesomeIcon icon={faBars} className="text-gray-600" />
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul>
            <li className="flex items-center p-2 hover:bg-gray-100">
              <FontAwesomeIcon icon={faHome} className="text-blue-500 w-5 h-5" />
              <Link to="/admin/statistics" className="ml-3 block w-full text-gray-700">
                Thống kê
              </Link>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-blue-500 w-5 h-5" />
              <Link to="/admin/orders" className="ml-3 block w-full text-gray-700">
                Quản lý đơn hàng
              </Link>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100">
              <FontAwesomeIcon icon={faTags} className="text-red-500 w-5 h-5" />
              <Link to="/admin/product-types" className="ml-3 block w-full text-gray-700">
                Quản lý loại sản phẩm
              </Link>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100">
              <FontAwesomeIcon icon={faBoxOpen} className="text-orange-500 w-5 h-5" />
              <Link to="/admin/products" className="ml-3 block w-full text-gray-700">
                Quản lý sản phẩm
              </Link>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100">
              <FontAwesomeIcon icon={faUsers} className="text-purple-500 w-5 h-5" />
              <Link to="/admin/users" className="ml-3 block w-full text-gray-700">
                Quản lý người dùng
              </Link>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500 w-5 h-5" />
              <span className="ml-3 block w-full text-gray-700">Đăng xuất</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Routes>
          <Route path="orders" element={<AdminOrders />} />
          {/* Add more admin routes as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;