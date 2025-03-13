import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Cpu, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { items } = useCart();
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.id || null;

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="bg-gray-100 py-2">
          <div className="container mx-auto px-4 flex justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="mr-2">📍</span>
                306h/2 KDC Hang Bang, KV5, An Khanh, Ninh Kieu, Can Tho
              </span>
              <span className="flex items-center">
                <span className="mr-2">📧</span>
                info@fivestar.team
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/order/tracking" className="hover:text-blue-600">Theo dõi đơn hàng</Link>
              <Link to="/policy" className="hover:text-blue-600">Chính sách</Link>
              <Link to="/payment" className="hover:text-blue-600">Thanh toán</Link>
              <Link to="/build-pc" className="text-blue-600 font-medium">Build PC</Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TECHSMART.VN</h1>
                <p className="text-sm text-gray-600">TECH ELECTRONICS</p>
              </div>
            </Link>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex">
                <select className="px-4 py-2 border-2 border-r-0 border-gray-200 rounded-l-lg focus:outline-none focus:border-blue-500">
                  <option>Tất cả</option>
                  <option>Laptop</option>
                  <option>PC Gaming</option>
                  <option>Linh kiện</option>
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full px-4 py-2 border-2 border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  <button className="absolute right-0 top-0 h-full px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Heart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <div
                className="relative"
                onMouseEnter={() => userId && setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                  <User className="w-6 h-6 text-gray-700" />
                  <span className="text-sm font-medium">
                    {userId ? (
                      <span>{user.username || 'Tài khoản'}</span>
                    ) : (
                      <Link to="/login">Đăng nhập</Link>
                    )}
                  </span>
                </button>
                {userId && isUserMenuOpen && (
                  <div className="absolute right-0 top-full w-40 bg-white shadow-lg rounded-lg z-50 transition-opacity duration-200 ease-in-out">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="bg-blue-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-8 justify-center">
              <button className="px-4 py-3 text-white font-medium hover:bg-blue-700 transition-colors">
                Danh Mục Sản Phẩm
              </button>
              <Link to="/" className="px-4 py-3 text-white hover:bg-blue-700 transition-colors">Trang chủ</Link>
              <Link to="/about" className="px-4 py-3 text-white hover:bg-blue-700 transition-colors">Giới thiệu</Link>
              <Link to="/products" className="px-4 py-3 text-white hover:bg-blue-700 transition-colors">Sản phẩm</Link>
              <Link to="/news" className="px-4 py-3 text-white hover:bg-blue-700 transition-colors">Tin tức</Link>
              <Link to="/contact" className="px-4 py-3 text-white hover:bg-blue-700 transition-colors">Liên hệ</Link>
            </div>
          </div>
        </nav>
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        userId={userId}
      />
    </>
  );
}