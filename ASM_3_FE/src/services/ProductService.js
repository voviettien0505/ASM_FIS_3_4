import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';

class ProductService {
  async getAllProducts() {
    try {
      const response = await axios.get(`${BASE_URL}/all`, {
        withCredentials: true, // Đảm bảo gửi cookie nếu cần
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      throw error;
    }
  }
}

export default new ProductService();
