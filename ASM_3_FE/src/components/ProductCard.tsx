import React from 'react';
import { Heart, Info, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import CartService from '../services/CartService';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleAddToCart = async () => {
    if (!user?.id) {
      alert('Bạn cần đăng nhập để thêm vào giỏ hàng!');
      return;
    }

    try {
      const cartItem = await CartService.addToCart(product.id, user.id, 1);
      addToCart(cartItem);
      alert('Sản phẩm đã được thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col group hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-contain mb-4" />
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Info className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2 flex-1">{product.name}</h3>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
        ))}
        <span className="text-sm text-gray-500 ml-2">(12 đánh giá)</span>
      </div>
      <div className="text-red-600 font-bold mb-3 text-lg">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center transition-colors"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
