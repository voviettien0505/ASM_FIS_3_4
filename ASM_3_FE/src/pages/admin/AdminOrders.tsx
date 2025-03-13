import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faCheckCircle, faTruck, faBox, faTimesCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import OrderService from '../../services/OrderService'; // Adjust the path as needed

// Define the Order type
interface Order {
  id: string;
  customer: string;
  total: string;
  date: string;
  status: string;
  statusColor: string;
  products?: { name: string; price: string; image?: string; quantity?: number }[];
}

// Map backend status to frontend status and color
const statusMapping: { [key: string]: { display: string; color: string } } = {
  'DA_DAT_HANG': { display: 'Đã đặt hàng', color: 'yellow' },
  'DA_XAC_NHAN': { display: 'Đã xác nhận', color: 'blue' },
  'DANG_VAN_CHUYEN': { display: 'Đang vận chuyển', color: 'orange' },
  'DA_GIAO': { display: 'Đã giao', color: 'green' },
  'DA_HUY': { display: 'Đã hủy', color: 'red' },
  'DA_XOA': { display: 'Đã xóa', color: 'gray' },
};

// Define table columns for main table
const columns: TableColumn<Order>[] = [
  {
    name: 'MÃ HOÁ ĐƠN',
    selector: row => row.id,
    sortable: true,
    cell: row => <span className="text-gray-900 whitespace-no-wrap">{row.id}</span>,
  },
  {
    name: 'TÊN KHÁCH HÀNG',
    selector: row => row.customer,
    sortable: true,
    cell: row => <span className="text-gray-900 whitespace-no-wrap">{row.customer}</span>,
  },
  {
    name: 'TỔNG TIỀN',
    selector: row => row.total,
    sortable: true,
    cell: row => <span className="text-red-500 whitespace-no-wrap">{row.total}</span>,
  },
  {
    name: 'NGÀY ĐẶT HÀNG',
    selector: row => row.date,
    sortable: true,
    cell: row => <span className="text-gray-900 whitespace-no-wrap">{row.date}</span>,
  },
  {
    name: 'TRẠNG THÁI',
    selector: row => row.status,
    sortable: true,
    cell: row => (
      <span className={`relative inline-block px-3 py-1 font-semibold text-${row.statusColor}-900 leading-tight`}>
        <span aria-hidden="true" className={`absolute inset-0 bg-${row.statusColor}-200 opacity-50 rounded-full`}></span>
        <span className="relative">{row.status}</span>
      </span>
    ),
  },
  {
    name: 'HÀNH ĐỘNG',
    cell: (row) => (
      <div className="flex space-x-2">
        {row.status === 'Đã đặt hàng' && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            onClick={() => handleUpdateStatus(row.id, 'DA_XAC_NHAN')}
          >
            Xác nhận
          </button>
        )}
        {row.status === 'Đã xác nhận' && (
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-200"
            onClick={() => handleUpdateStatus(row.id, 'DANG_VAN_CHUYEN')}
          >
            Vận chuyển
          </button>
        )}
        {row.status === 'Đang vận chuyển' && (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
            onClick={() => handleUpdateStatus(row.id, 'DA_GIAO')}
          >
            Đã giao
          </button>
        )}
      </div>
    ),
    ignoreRowClick: true, // Ngăn không cho hành động nhấp vào nút mở chi tiết
    allowOverflow: true,
    button: true,
  },
];

// Define columns for product table in ExpandedComponent
const productColumns: TableColumn<any>[] = [
  {
    name: 'Hình ảnh',
    cell: (row) => (
      <img
        alt={row.name}
        className="w-12 h-12 object-cover rounded"
        src={row.image || 'https://via.placeholder.com/100'}
      />
    ),
    width: '100px',
  },
  {
    name: 'Tên sản phẩm',
    selector: row => row.name,
    sortable: true,
    cell: row => <span className="text-gray-900">{row.name}</span>,
  },
  {
    name: 'Giá',
    selector: row => row.price,
    sortable: true,
    cell: row => <span className="text-gray-700">{row.price}</span>,
  },
  {
    name: 'Số lượng',
    selector: row => row.quantity,
    sortable: true,
    cell: row => <span className="text-gray-700">x{row.quantity}</span>,
    width: '100px',
  },
];

// Expanded component for row details
const ExpandedComponent: React.FC<{ data: Order }> = ({ data }) => {
  const actionIcons = {
    'Đã đặt hàng': faCalendarCheck,
    'Đã xác nhận': faCheckCircle,
    'Đang vận chuyển': faTruck,
    'Đã giao': faBox,
    'Đã hủy': faTimesCircle,
    'Đã xóa': faTrash,
  };

  // Define the order of statuses for the timeline
  const statusOrder = [
    'Đã đặt hàng',
    'Đã xác nhận',
    'Đang vận chuyển',
    'Đã giao',
    'Đã hủy',
    'Đã xóa',
  ];

  // Determine if a status is active or past based on the current status
  const currentStatusIndex = statusOrder.indexOf(data.status);
  const isStatusActiveOrPast = (status: string) => {
    const statusIndex = statusOrder.indexOf(status);
    // If the status is "Đã hủy" or "Đã xóa," it should only be active if it's the current status
    if (status === 'Đã hủy' || status === 'Đã xóa') {
      return statusIndex === currentStatusIndex;
    }
    // Otherwise, a status is active or past if its index is less than or equal to the current status
    return statusIndex <= currentStatusIndex;
  };

  // Calculate the percentage of the timeline to color based on the current status
  const totalStatuses = statusOrder.length;
  const progressPercentage = currentStatusIndex >= 0 ? ((currentStatusIndex + 1) / totalStatuses) * 100 : 0;

  return (
    <div className="p-4 bg-gray-50 border-gray-600 rounded-lg mb-4 shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin chi tiết</h3>
      <div className="mb-4">
        <p><strong>Tên khách hàng:</strong> {data.customer}</p>
        <p><strong>Tổng tiền:</strong> {data.total}</p>
        <p><strong>Ngày đặt hàng:</strong> {data.date}</p>
      </div>
      <div className="mb-4">
        <h2 className="font-bold mb-2">Sản phẩm đã mua:</h2>
        <DataTable
          columns={productColumns}
          data={data.products || []}
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
      <div>
        <h2 className="font-bold mb-2">Quá trình xử lý:</h2>
        <div className="relative flex justify-between items-center">
          {/* Continuous Background Line (Gray) */}
          <div className="absolute top-4 left-0 w-full h-1 bg-gray-300 -z-10" />
          {/* Progress Line (Colored) */}
          <div
            className={`absolute top-4 left-0 h-1 -z-10 ${
              data.status === 'Đã hủy' || data.status === 'Đã xóa' ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${data.status === 'Đã hủy' || data.status === 'Đã xóa' ? (currentStatusIndex / (totalStatuses - 1)) * 100 : progressPercentage}%` }}
          />
          {/* Icons and Statuses */}
          {Object.entries(actionIcons).map(([status, icon]) => {
            const isActiveOrPast = isStatusActiveOrPast(status);
            const highlightColor = (status === 'Đã hủy' || status === 'Đã xóa') && isActiveOrPast ? 'red-500' : 'green-500';
            return (
              <div key={status} className="flex flex-col items-center relative z-10">
                <div className="relative flex items-center justify-center w-8 h-8">
                  <FontAwesomeIcon
                    icon={icon}
                    className={`text-lg ${
                      isActiveOrPast ? `text-${highlightColor}` : 'text-gray-500'
                    } ${data.status === status ? 'scale-125' : ''}`}
                  />
                </div>
                <span className="text-xs whitespace-nowrap mt-1">{status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main AdminOrders component
const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getAllOrders();
        // Map API data to Order interface
        const mappedOrders = data.map((order: any) => ({
          id: order.orderId,
          customer: order.customerName,
          total: `${order.totalAmount.toLocaleString('vi-VN')} VND`,
          date: new Date(order.date).toLocaleDateString('vi-VN'),
          status: statusMapping[order.status]?.display || order.status,
          statusColor: statusMapping[order.status]?.color || 'gray',
          products: order.orderDetails.map((detail: any) => ({
            name: detail.productName,
            price: `${detail.price.toLocaleString('vi-VN')} VND`,
            image: detail.productImage,
            quantity: detail.quantity,
          })),
        }));
        setOrders(mappedOrders);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        setError('Không thể lấy danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Hàm xử lý cập nhật trạng thái
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ${orderId} thành ${statusMapping[newStatus]?.display}?`)) {
      try {
        // Giả định có API để cập nhật trạng thái
        await OrderService.updateOrderStatus(orderId, newStatus);
        // Cập nhật danh sách đơn hàng
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: statusMapping[newStatus].display, statusColor: statusMapping[newStatus].color }
              : order
          )
        );
        alert('Cập nhật trạng thái thành công!');
      } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái:', err);
        setError('Không thể cập nhật trạng thái. Vui lòng thử lại sau.');
      }
    }
  };

  const filteredOrders = selectedStatus
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  const statuses = [
    'Đã đặt hàng',
    'Đã xác nhận',
    'Đang vận chuyển',
    'Đã giao',
    'Đã hủy',
    'Đã xóa',
  ];

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
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      {error && <div className="text-center text-red-500 font-semibold mb-4">{error}</div>}
      <div className="flex flex-wrap justify-center space-x-4 mb-4 gap-y-2">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status === selectedStatus ? null : status)}
            className={`px-4 py-2 rounded ${
              selectedStatus === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition duration-200`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredOrders}
          customStyles={customStyles}
          highlightOnHover
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          noDataComponent={
            <div className="p-4 text-center text-gray-500">Không có đơn hàng nào phù hợp</div>
          }
          progressPending={loading}
          progressComponent={<div className="p-4 text-center">Đang tải dữ liệu...</div>}
        />
      </div>
    </div>
  );
};

export default AdminOrders;