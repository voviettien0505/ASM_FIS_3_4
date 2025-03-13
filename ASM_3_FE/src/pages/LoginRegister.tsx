import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/AuthService';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Tên đăng nhập là bắt buộc';
    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc';
    
    if (!isLogin) {
      if (!formData.email) newErrors.email = 'Email là bắt buộc';
      if (!formData.fullName) newErrors.fullName = 'Họ tên không được để trống';
      if (!formData.phone) newErrors.phone = 'Số điện thoại không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        const data = await AuthService.login(formData.username, formData.password);
        login(data.token, data);
        alert('Đăng nhập thành công!');
        if (data.role === "ADMIN") {
        navigate("/admin/orders"); 
      } else {
        navigate("/");
      }
      } else {
        await AuthService.register(formData);
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '', fullName: '', phone: '' });
      }
    } catch (error) {
      console.error('Lỗi:', error.response?.data || error.message);
      setErrors({ general: error.response?.data?.message || 'Có lỗi xảy ra' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </h2>

        {errors.general && (
          <p className="text-red-500 text-sm text-center">{errors.general}</p>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
          </div>

          <button type="submit" className="w-full py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="text-center text-sm">
          <p>
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-600 hover:text-blue-500">
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
