import axios from "axios";

const BASE_URL = "http://localhost:8080/api/cart";

class CartService {
    // Thêm sản phẩm vào giỏ hàng
    async addToCart(productId, userId, quantity) {
        try {
            const response = await axios.post(
                `${BASE_URL}/add`,
                { productId, userId, quantity },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
            throw error;
        }
    }
      // Lấy giỏ hàng của user
      async getCart(userId) {
        try {
            const response = await axios.get(`${BASE_URL}/${userId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            throw error;
        }
    }
}

export default new CartService();
