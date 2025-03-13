import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';

class AuthService {
    async login(username, password) {
        try {
            const response = await axios.post(
                `${BASE_URL}/login`,
                { username, password }, // ✅ Truyền đúng dữ liệu vào body
                { withCredentials: true } // ✅ Đặt `withCredentials` đúng chỗ
            );
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error); // ✅ Sửa lỗi console log
            throw error;
        }
    }
    async register(userData) {
        try {
            const response = await axios.post(`${BASE_URL}/register`, userData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error);
            throw error;
        }
    }
}

export default new AuthService();
