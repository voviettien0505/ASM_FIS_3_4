import React, { useState, useEffect, useRef } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck,
    faCheckCircle,
    faTruck,
    faBox,
    faTimesCircle,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import OrderService from "../../services/OrderService";

// Define the Order interface
interface Order {
    id: string;
    customer: string;
    total: string;
    date: string;
    status: string;
    statusColor: string;
    products?: { name: string; price: string; image?: string; quantity?: number }[];
}

// Status mapping to match backend and frontend
const statusMapping: { [key: string]: { display: string; color: string } } = {
    DA_DAT_HANG: { display: "Đã đặt hàng", color: "yellow" },
    DA_XAC_NHAN: { display: "Đã xác nhận", color: "blue" },
    DANG_VAN_CHUYEN: { display: "Đang vận chuyển", color: "orange" },
    DA_GIAO: { display: "Đã giao", color: "green" },
    DA_HUY: { display: "Đã hủy", color: "red" },
    DA_XOA: { display: "Đã xóa", color: "gray" },
};

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({}); // To track row refs for scrolling

    // Fetch orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await OrderService.getAllOrders();
                const mappedOrders = data.map((order: any) => ({
                    id: order.orderId,
                    customer: order.customerName,
                    total: `${order.totalAmount.toLocaleString("vi-VN")} VND`,
                    date: new Date(order.date).toLocaleDateString("vi-VN"),
                    status: statusMapping[order.status]?.display || order.status,
                    statusColor: statusMapping[order.status]?.color || "gray",
                    products: order.orderDetails.map((detail: any) => ({
                        name: detail.productName,
                        price: `${detail.price.toLocaleString("vi-VN")} VND`,
                        image: detail.productImage,
                        quantity: detail.quantity,
                    })),
                }));
                setOrders(mappedOrders);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu đơn hàng:", err);
                setError("Không thể lấy danh sách đơn hàng.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Function to show notification and auto-hide after 3 seconds
    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // Function to switch tab and scroll to the updated order
    const switchTabAndScrollToOrder = (newStatus: string, orderId: string) => {
        setSelectedStatus(newStatus); // Switch to the new status tab
        setTimeout(() => {
            const rowElement = rowRefs.current[orderId];
            if (rowElement) {
                rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
                // Highlight the row
                rowElement.classList.add("highlight-row");
                setTimeout(() => rowElement.classList.remove("highlight-row"), 1000); // Remove highlight after 1s
            }
        }, 100); // Delay to ensure the tab switch renders
    };

    // Confirm order (updates status to DA_XAC_NHAN)
    const confirmOrder = async (orderId: string) => {
        try {
            const response = await OrderService.confirmOrder(orderId);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, status: "Đã xác nhận", statusColor: "blue" }
                        : order
                )
            );
            showNotification(response);
            switchTabAndScrollToOrder("Đã xác nhận", orderId);
        } catch (err) {
            console.error("Lỗi khi xác nhận đơn hàng:", err);
            setError("Không thể xác nhận đơn hàng. Vui lòng thử lại sau.");
        }
    };

    // Placeholder for transport order (no API yet)
    const handleTransportOrder = async (orderId: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn cập nhật đơn hàng ${orderId} thành "Đang vận chuyển"?`)) {
            try {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId
                            ? { ...order, status: "Đang vận chuyển", statusColor: "orange" }
                            : order
                    )
                );
                showNotification("Đơn hàng đã được cập nhật thành 'Đang vận chuyển' (chưa có API).");
                switchTabAndScrollToOrder("Đang vận chuyển", orderId);
            } catch (err) {
                console.error("Lỗi khi cập nhật trạng thái vận chuyển:", err);
                setError("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
            }
        }
    };

    // Placeholder for deliver order (no API yet)
    const handleDeliverOrder = async (orderId: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn cập nhật đơn hàng ${orderId} thành "Đã giao"?`)) {
            try {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId
                            ? { ...order, status: "Đã giao", statusColor: "green" }
                            : order
                    )
                );
                showNotification("Đơn hàng đã được cập nhật thành 'Đã giao' (chưa có API).");
                switchTabAndScrollToOrder("Đã giao", orderId);
            } catch (err) {
                console.error("Lỗi khi cập nhật trạng thái giao hàng:", err);
                setError("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
            }
        }
    };

    // Filter orders by selected status
    const filteredOrders = selectedStatus
        ? orders.filter((order) => order.status === selectedStatus)
        : orders;

    const statuses = [
        "Đã đặt hàng",
        "Đã xác nhận",
        "Đang vận chuyển",
        "Đã giao",
        "Đã hủy",
        "Đã xóa",
    ];

    // Custom styles for DataTable
    const customStyles = {
        table: { style: { width: "100%", minWidth: "100%", maxWidth: "100%" } }, // Fit table to container
        headRow: {
            style: {
                backgroundColor: "#f3f4f6",
                borderBottomWidth: "2px",
                borderBottomColor: "#e5e7eb",
            },
        },
        headCells: {
            style: {
                padding: "0.75rem 1.25rem",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#4b5563",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
            },
        },
        rows: {
            style: {
                "&:not(:last-of-type)": {
                    borderBottomWidth: "1px",
                    borderBottomColor: "#e5e7eb",
                },
            },
            highlightOnHoverStyle: { backgroundColor: "#f9fafb" },
        },
        cells: { style: { padding: "1.25rem", fontSize: "0.875rem" } },
    };

    // Define table columns
    const columns: TableColumn<Order>[] = [
        {
            name: "MÃ HOÁ ĐƠN",
            selector: (row) => row.id,
            sortable: true,
            cell: (row) => <span className="text-gray-900 whitespace-no-wrap">{row.id}</span>,
            width: "15%",
        },
        {
            name: "TÊN KHÁCH HÀNG",
            selector: (row) => row.customer,
            sortable: true,
            cell: (row) => <span className="text-gray-900 whitespace-no-wrap">{row.customer}</span>,
            width: "20%",
        },
        {
            name: "TỔNG TIỀN",
            selector: (row) => row.total,
            sortable: true,
            cell: (row) => <span className="text-red-500 whitespace-no-wrap">{row.total}</span>,
            width: "15%",
        },
        {
            name: "NGÀY ĐẶT HÀNG",
            selector: (row) => row.date,
            sortable: true,
            cell: (row) => <span className="text-gray-900 whitespace-no-wrap">{row.date}</span>,
            width: "15%",
        },
        {
            name: "TRẠNG THÁI",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <span
                    className={`relative inline-block px-3 py-1 font-semibold text-${row.statusColor}-900 leading-tight`}
                >
                    <span
                        aria-hidden="true"
                        className={`absolute inset-0 bg-${row.statusColor}-200 opacity-50 rounded-full`}
                    ></span>
                    <span className="relative">{row.status}</span>
                </span>
            ),
            width: "15%",
        },
        {
            name: "HÀNH ĐỘNG",
            cell: (row) => (
                <div className="flex space-x-2">
                    {row.status === "Đã đặt hàng" && (
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap"
                            onClick={() => confirmOrder(row.id)}
                        >
                            Xác nhận
                        </button>
                    )}
                    {row.status === "Đã xác nhận" && (
                        <button
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 whitespace-nowrap"
                            onClick={() => handleTransportOrder(row.id)}
                        >
                            Vận chuyển
                        </button>
                    )}
                    {row.status === "Đang vận chuyển" && (
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 whitespace-nowrap"
                            onClick={() => handleDeliverOrder(row.id)}
                        >
                            Đã giao
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "20%",
        },
    ];

    // Product columns for expanded rows
    const productColumns: TableColumn<any>[] = [
        {
            name: "Hình ảnh",
            cell: (row) => (
                <img
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded"
                    src={row.image || "https://via.placeholder.com/100"}
                />
            ),
            width: "100px",
        },
        {
            name: "Tên sản phẩm",
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => <span className="text-gray-900">{row.name}</span>,
        },
        {
            name: "Giá",
            selector: (row) => row.price,
            sortable: true,
            cell: (row) => <span className="text-gray-700">{row.price}</span>,
        },
        {
            name: "Số lượng",
            selector: (row) => row.quantity,
            sortable: true,
            cell: (row) => <span className="text-gray-700">x{row.quantity}</span>,
            width: "100px",
        },
    ];

    // Expanded component for row details with balanced layout and no progress bar
    const ExpandedComponent: React.FC<{ data: Order }> = ({ data }) => {
        const actionIcons = {
            "Đã đặt hàng": faCalendarCheck,
            "Đã xác nhận": faCheckCircle,
            "Đang vận chuyển": faTruck,
            "Đã giao": faBox,
            "Đã hủy": faTimesCircle,
            "Đã xóa": faTrash,
        };

        const statusOrder = [
            "Đã đặt hàng",
            "Đã xác nhận",
            "Đang vận chuyển",
            "Đã giao",
            "Đã hủy",
            "Đã xóa",
        ];

        const currentStatusIndex = statusOrder.indexOf(data.status);
        const isStatusActiveOrPast = (status: string) => {
            const statusIndex = statusOrder.indexOf(status);
            if (status === "Đã hủy" || status === "Đã xóa") {
                return statusIndex === currentStatusIndex;
            }
            return statusIndex <= currentStatusIndex;
        };

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
                            headRow: { style: { backgroundColor: "#f3f4f6", fontWeight: "600", color: "#4b5563" } },
                            rows: {
                                style: {
                                    "&:not(:last-of-type)": {
                                        borderBottomWidth: "1px",
                                        borderBottomColor: "#e5e7eb",
                                    },
                                },
                            },
                            cells: { style: { padding: "0.5rem" } },
                        }}
                        noDataComponent={<div className="p-2 text-gray-500">Không có sản phẩm</div>}
                    />
                </div>
                <div>
                    <h2 className="font-bold mb-2">Quá trình xử lý:</h2>
                    <div className="flex justify-between items-center gap-4"> {/* Adjusted for balanced spacing */}
                        {Object.entries(actionIcons).map(([status, icon]) => {
                            const isActiveOrPast = isStatusActiveOrPast(status);
                            const iconColor = isActiveOrPast ? "blue-400" : "gray-400"; // Blue for processed icons
                            const textColor = isActiveOrPast ? "text-blue-400" : "text-gray-600"; // Blue for processed text
                            return (
                                <div key={status} className="flex flex-col items-center flex-1"> {/* Added flex-1 for equal spacing */}
                                    <div className="relative flex items-center justify-center w-10 h-10"> {/* Slightly larger icons */}
                                        <FontAwesomeIcon
                                            icon={icon}
                                            className={`text-xl ${
                                                isActiveOrPast ? `text-${iconColor}` : "text-gray-400"
                                            } ${data.status === status ? "scale-125" : ""}`}
                                        />
                                    </div>
                                    <span className={`text-sm whitespace-nowrap mt-2 ${textColor}`}> {/* Adjusted font size and margin */}
                                        {status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 w-full max-w-[95vw]">
            <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
            {error && (
                <div className="text-center text-red-500 font-semibold mb-4">{error}</div>
            )}
            {notification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md animate-fade-in-out">
                    {notification}
                </div>
            )}
            <div className="flex flex-wrap justify-center space-x-4 mb-4 gap-y-2">
                {statuses.map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(status === selectedStatus ? null : status)}
                        className={`px-4 py-2 rounded-lg shadow-md ${
                            selectedStatus === status
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap`}
                    >
                        {status}
                    </button>
                ))}
            </div>
            <div ref={tableRef} className="bg-white shadow-md rounded-lg w-full">
                <DataTable
                    columns={columns}
                    data={filteredOrders}
                    customStyles={customStyles}
                    highlightOnHover
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            Không có đơn hàng nào phù hợp
                        </div>
                    }
                    progressPending={loading}
                    progressComponent={<div className="p-4 text-center">Đang tải dữ liệu...</div>}
                    onRowClicked={(row) => {
                        // Optional: Expand row on click if needed
                    }}
                    customRowProps={(row) => ({
                        ref: (el: HTMLTableRowElement) => (rowRefs.current[row.id] = el),
                        className: "transition-all duration-300",
                    })}
                />
            </div>
        </div>
    );
};

// CSS for fade animation and row highlight
const styles = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    .animate-fade-in-out {
        animation: fadeInOut 3s ease-in-out forwards;
    }
    .highlight-row {
        background-color: #e0f7fa;
        transition: background-color 1s ease-in-out;
    }
`;

// Inject CSS dynamically
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default AdminOrders;