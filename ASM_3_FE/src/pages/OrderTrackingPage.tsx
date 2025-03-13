import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import OrderService from '../services/OrderService';

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
  orderId: string;
  date: string;
  status: string;
  totalAmount: number;
  customerName?: string;
  orderDetails: {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }[];
}

// Định nghĩa cột cho bảng chính
const columns: TableColumn<Order>[] = [
  {
    name: 'MÃ ĐƠN HÀNG',
    selector: row => row.orderId,
    sortable: true,
    cell: row => <span className="text-gray-900 whitespace-no-wrap">{row.orderId}</span>,
  },
  {
    name: 'NGÀY ĐẶT',
    selector: row => row.date,
    sortable: true,
    cell: row => <span className="text-gray-900 whitespace-no-wrap">{new Date(row.date).toLocaleDateString('vi-VN')}</span>,
  },
  {
    name: 'TRẠNG THÁI',
    selector: row => row.status,
    sortable: true,
    cell: row => <span className="text-gray-900 whitespace-no-wrap">{row.status}</span>,
  },
  {
    name: 'TỔNG SỐ TIỀN',
    selector: row => row.totalAmount,
    sortable: true,
    cell: row => <span className="text-red-500 whitespace-no-wrap">{row.totalAmount.toLocaleString('vi-VN')} VND</span>,
  },
  {
    name: 'HÀNH ĐỘNG',
    cell: (row) => (
      <div className="flex space-x-2">
        {row.status === 'DA_DAT_HANG' && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            onClick={() => handleCancel(row.orderId)}
          >
            Hủy đơn
          </button>
        )}
      </div>
    ),
    ignoreRowClick: true, // Ngăn không cho hành động nhấp vào nút mở chi tiết
    allowOverflow: true,
    button: true,
  },
];

// Định nghĩa cột cho bảng chi tiết sản phẩm trong ExpandedComponent
const productColumns: TableColumn<any>[] = [
  {
    name: 'Hình ảnh',
    cell: (row) => (
      <img
        alt={row.productName}
        className="w-12 h-12 object-cover rounded"
        src={row.productImage || 'https://via.placeholder.com/100'}
      />
    ),
    width: '100px',
  },
  {
    name: 'Tên sản phẩm',
    selector: row => row.productName,
    sortable: true,
    cell: row => <span className="text-gray-900">{row.productName}</span>,
  },
  {
    name: 'Số lượng',
    selector: row => row.quantity,
    sortable: true,
    cell: row => <span className="text-gray-700">{row.quantity}</span>,
    width: '100px',
  },
  {
    name: 'Giá',
    selector: row => row.price,
    sortable: true,
    cell: row => <span className="text-gray-700">{row.price.toLocaleString('vi-VN')} VND</span>,
  },
  {
    name: 'Tổng',
    selector: row => (row.price * row.quantity),
    sortable: true,
    cell: row => <span className="text-gray-700">{(row.price * row.quantity).toLocaleString('vi-VN')} VND</span>,
  },
];

// Expanded component để hiển thị chi tiết đơn hàng
const ExpandedComponent: React.FC<{ data: Order }> = ({ data }) => {
  return (
    <div className="p-4 bg-gray-50 border-gray-600 rounded-lg mb-4 shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin chi tiết</h3>
      <div className="mb-4">
        <p><strong>Tên khách hàng:</strong> {data.customerName || 'Khách hàng'}</p>
        <p><strong>Tổng tiền:</strong> {data.totalAmount.toLocaleString('vi-VN')} VND</p>
        <p><strong>Ngày đặt hàng:</strong> {new Date(data.date).toLocaleDateString('vi-VN')}</p>
      </div>
      <div className="mb-4">
        <h2 className="font-bold mb-2">Sản phẩm đã mua:</h2>
        <DataTable
          columns={productColumns}
          data={data.orderDetails || []}
          noHeader
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#f3f4f6',
                fontWeight: '600',
                color: '#4b5563',
              },
            },
            rows: {
              style: {
                '&:not(:last-of-type)': {
                  borderBottomWidth: '1px',
                  borderBottomColor: '#e5e7eb',
                },
              },
            },
            cells: {
              style: {
                padding: '0.5rem',
              },
            },
          }}
          noDataComponent={<div className="p-2 text-gray-500">Không có sản phẩm</div>}
        />
      </div>
    </div>
  );
};

// Hàm xử lý hủy đơn
const handleCancel = async (orderId: string) => {
  if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    try {
      await OrderService.cancelOrder(orderId); // Giả định phương thức này trong OrderService
      setOrders((prevOrders) => prevOrders.filter(order => order.orderId !== orderId));
      alert('Đơn hàng đã được hủy thành công!');
    } catch (err) {
      setError('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
    }
  }
};

// Main OrderTrackingPage component
const OrderTrackingPage = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const storedUserId = storedUser?.id || null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storedUserId) {
      setError('Không tìm thấy thông tin người dùng.');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await OrderService.getOrdersByUserId(storedUserId);
        // Ánh xạ dữ liệu từ API để đảm bảo đúng cấu trúc
        const mappedOrders = response.map((order: any) => ({
          orderId: order.orderId,
          date: order.date,
          status: order.status,
          totalAmount: order.totalAmount,
          customerName: order.customerName || storedUser?.username || 'Khách hàng',
          orderDetails: order.orderDetails.map((detail: any) => ({
            productId: detail.productId,
            productName: detail.productName,
            productImage: detail.productImage,
            quantity: detail.quantity,
            price: detail.price,
          })),
        }));
        setOrders(mappedOrders);
      } catch (err) {
        setError('Không thể lấy danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [storedUserId]);

  const customStyles = {
    table: {
      style: {
        minWidth: '100%',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f3f4f6',
        borderBottomWidth: '2px',
        borderBottomColor: '#e5e7eb',
      },
    },
    headCells: {
      style: {
        padding: '0.75rem 1.25rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#4b5563',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#e5e7eb',
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: '#f9fafb',
      },
    },
    cells: {
      style: {
        padding: '1.25rem',
        fontSize: '0.875rem',
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={orders}
          customStyles={customStyles}
          highlightOnHover
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          noDataComponent={
            <div className="p-4 text-center text-gray-500">Không tìm thấy đơn hàng</div>
          }
          progressPending={loading}
          progressComponent={<div className="p-4 text-center">Đang tải dữ liệu...</div>}
        />
      </div>
    </div>
  );
};

export default OrderTrackingPage;