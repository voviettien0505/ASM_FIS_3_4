import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';

export default function OrderPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || null;
  const fullName = user.fullName || 'Không có tên';
  const phone = user.phone || 'Không có số điện thoại';

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập trước khi đặt hàng!");
      navigate('/login');
      return;
    }

    const orderData = {
      userId,
      fullName,
      phone,
      status: "DA_DAT_HANG",
      totalAmount: total,
      orderDetails: items.map((item) => ({
        productId: item.product.id,
        price: item.product.price,
        quantity: item.quantity,
      })),
    };

    try {
      const newOrder = await OrderService.createOrder(orderData);
      setOrder(newOrder);
      clearCart();
      setError(null);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      setError("Đặt hàng thất bại! Vui lòng thử lại sau.");
    }
  };

  const handleCancelOrder = () => {
    setOrder(null);
  };

  if (order) {
    return (
      <div className="container mx-auto p-4 max-w-4xl shadow-md p-4 mt-6">
        <h2 className="text-2xl font-bold mb-6">Đơn hàng của bạn</h2>
        <p><strong>Mã đơn hàng:</strong> {order.orderId}</p>
        <p><strong>Ngày đặt:</strong> {new Date(order.date).toLocaleString()}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
        <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</p>
        <h3 className="text-lg font-medium mt-4">Chi tiết đơn hàng</h3>
        <ul>
          {order.orderDetails.map((detail) => (
            <li key={detail.productId} className="border-b p-2">
              <img src={detail.productImage} alt={detail.productName} className="w-16 h-16 inline-block mr-2" />
              {detail.productName} - {detail.quantity} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}
            </li>
          ))}
        </ul>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Quay lại trang chủ
          </button>
          <button
            onClick={handleCancelOrder}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Hủy đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl shadow-md p-4 mt-6">
      <h2 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Thông tin khách hàng</h3>
        <p><strong>Họ và tên:</strong> {fullName}</p>
        <p><strong>Số điện thoại:</strong> {phone}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Chi tiết đơn hàng</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Ảnh</th>
              <th className="p-3 border-b">Tên sản phẩm</th>
              <th className="p-3 border-b">Số lượng</th>
              <th className="p-3 border-b">Giá</th>
              <th className="p-3 border-b">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.product.id} className="border-b">
                <td className="p-3">
                  <img src={item.product.image || 'https://via.placeholder.com/80'} alt={item.product.name} className="w-16 h-16 object-contain" />
                </td>
                <td className="p-3">{item.product.name}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3 text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}</td>
                <td className="p-3 text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6">
        <span className="font-semibold text-lg mr-3">Tổng tiền:</span>
        <span className="text-red-600 font-bold text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
      </div>
      <div className="flex justify-center space-x-4">
        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Quay lại</button>
        <button onClick={handlePlaceOrder} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">ĐẶT HÀNG</button>
      </div>
    </div>
  );
}
