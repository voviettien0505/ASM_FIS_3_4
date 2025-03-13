import React, { useEffect, useState } from 'react';
import { Grid, List } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import ProductService from '../services/ProductService';




export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <a href="/" className="text-gray-600">Trang Chủ</a>
          <span>/</span>
          <span>Sản phẩm</span>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-gray-600">Hiển thị {products.length} sản phẩm</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-gray-100 rounded">
              <Grid className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded">
              <List className="w-5 h-5" />
            </button>
          </div>
          <select className="p-2 border rounded">
            <option>Thứ tự mặc định</option>
            <option>Giá: Thấp đến cao</option>
            <option>Giá: Cao đến thấp</option>
            <option>Mới nhất</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
