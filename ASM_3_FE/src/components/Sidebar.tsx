import React from 'react';

const brands = [
  'Intel', 'AMD', 'NVIDIA', 'Kingston', 'Samsung', 'MSI', 'ASUS', 'Gigabyte', 'Corsair'
];

const categories = [
  'CPU', 'GPU', 'RAM', 'Mainboard', 'SSD', 'HDD', 'Chuột', 'Bàn phím', 
  'Màn hình', 'Vỏ Máy tính', 'Tản nhiệt'
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">THƯƠNG HIỆU</h2>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">LOẠI</h2>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">GIÁ</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="radio" name="price" className="rounded border-gray-300" />
            <span>Dưới 1.000.000đ</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="price" className="rounded border-gray-300" />
            <span>1.000.000đ - 3.000.000đ</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="price" className="rounded border-gray-300" />
            <span>3.000.000đ - 5.000.000đ</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="price" className="rounded border-gray-300" />
            <span>5.000.000đ - 10.000.000đ</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="price" className="rounded border-gray-300" />
            <span>Trên 10.000.000đ</span>
          </label>
        </div>
      </div>
    </div>
  );
}