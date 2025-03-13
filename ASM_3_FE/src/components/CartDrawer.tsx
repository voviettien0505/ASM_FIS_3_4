import React, { useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function CartDrawer({ isOpen, onClose, userId }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, total, fetchCart } = useCart();
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Dùng useRef để theo dõi trạng thái fetch

  useEffect(() => {
    if (isOpen && userId && !hasFetched.current) {
      console.log('Fetching cart for userId:', userId);
      fetchCart(userId);
      hasFetched.current = true; // Đánh dấu đã fetch
    }

    // Reset hasFetched khi CartDrawer đóng
    return () => {
      if (!isOpen) {
        hasFetched.current = false;
      }
    };
  }, [isOpen, userId, fetchCart]);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }
    navigate('/order');
    onClose();
  };

  if (!isOpen) return null;

  if (!userId) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-lg font-semibold">Giỏ hàng</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center text-gray-500 mt-8">
                Vui lòng đăng nhập để xem giỏ hàng
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-lg font-semibold">Giỏ hàng</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">Giỏ hàng trống</div>
            ) : (
              <div className="w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border-b">Ảnh</th>
                      <th className="p-3 border-b">Tên sản phẩm</th>
                      <th className="p-3 border-b">Số lượng</th>
                      <th className="p-3 border-b">Giá</th>
                      <th className="p-3 border-b">Thành tiền</th>
                      <th className="p-3 border-b"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.product.id} className="border-b">
                        <td className="p-3">
                          <img
                            src={item.product.image || 'https://via.placeholder.com/80'}
                            alt={item.product.name}
                            className="w-20 h-20 object-contain"
                          />
                        </td>
                        <td className="p-3">{item.product.name}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-red-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.product.price)}
                        </td>
                        <td className="p-3 text-red-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.product.price * item.quantity)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 hover:bg-gray-100 rounded text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Tổng tiền:</span>
              <span className="text-red-600 font-bold">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(total)}
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Mã giảm giá"
                className="w-full px-4 py-2 border rounded"
              />
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white py-3 rounded font-medium hover:bg-orange-600"
              >
                TIẾN HÀNH THANH TOÁN
              </button>
              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700"
              >
                TIẾP TỤC MUA HÀNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}