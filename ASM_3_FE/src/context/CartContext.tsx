import { createContext, useContext, useState } from 'react';
import CartService from '../services/CartService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Lấy giỏ hàng từ API
  const fetchCart = async (userId) => {
    try {
      const cartData = await CartService.getCart(userId);
      console.log('Cart data from API:', cartData); // Debug
      const mappedItems = cartData.cartItems.map(item => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.price,
          image: item.image || 'https://via.placeholder.com/80' // Fallback image
        },
        quantity: item.quantity
      }));
      setItems(mappedItems);
      setTotal(cartData.totalCartPrice);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setItems([]);
      setTotal(0);
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, userId, quantity) => {
    try {
      const response = await CartService.addToCart(productId, userId, quantity);
      console.log('Add to cart response:', response); // Debug
      // Cập nhật lại giỏ hàng từ API
      await fetchCart(userId);
      return response;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error; // Ném lỗi để xử lý trong ProductCard
    }
  };

  // Cập nhật số lượng
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    recalculateTotal();
  };

  // Xóa sản phẩm
  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    recalculateTotal();
  };

  // Tính lại tổng tiền
  const recalculateTotal = () => {
    const newTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setTotal(newTotal);
  };

  return (
    <CartContext.Provider value={{ items, total, fetchCart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);