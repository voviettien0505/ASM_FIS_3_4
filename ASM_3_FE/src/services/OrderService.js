import axios from "axios";

const BASE_URL = "http://localhost:8080/api/orders";

class OrderService {
    // 🛒 Tạo đơn hàng từ giỏ hàng
    async createOrder(orderData) {
        try {
            const response = await axios.post(`${BASE_URL}/add`, orderData, {
                withCredentials: true, // Đảm bảo cookie/session được gửi đi
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            throw error;
        }
    }


    // 🆕 Lấy đơn hàng mới nhất của người dùng// OrderService.js
    async getOrdersByUserId(userId) {
        try {
            const response = await axios.get(`${BASE_URL}/user/${userId}`);
            return response.data; // Danh sách đơn hàng
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            throw error;
        }
    }

    async getAllOrders() {
        try {
            const response = await axios.get(`${BASE_URL}/all/admin`, {
                withCredentials: true, // Đảm bảo cookie/session được gửi đi nếu cần xác thực
            });
            return response.data; // Danh sách tất cả đơn hàng
        } catch (error) {
            console.error("Lỗi khi lấy tất cả đơn hàng:", error);
            throw error;
        }
    }

}

export default new OrderService();
