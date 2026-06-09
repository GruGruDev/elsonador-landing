"use client";

import { Calendar, Clock, Eye, MapPin, Receipt, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { deleteOrder } from "./actions";

export default function ClientOrderTable({ orders }: { orders: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("ALL");
  const [viewingOrder, setViewingOrder] = useState<any>(null); // State để mở Modal chi tiết

  // Lọc đơn hàng
  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    return order.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold w-max">
            CHỜ LÀM
          </span>
        );
      case "PREPARING":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold w-max">
            ĐANG PHA
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold w-max">
            ĐÃ GIAO
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold w-max">
            {status}
          </span>
        );
    }
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này? Khuyến cáo chỉ dùng khi khách đặt nhầm!",
      )
    ) {
      startTransition(async () => {
        const result = await deleteOrder(id);
        if (result.success) {
          toast.success("Đã xóa đơn hàng!");
          setViewingOrder(null);
        } else {
          toast.error(result.error || "Không thể xóa đơn hàng này!");
        }
      });
    }
  };

  return (
    <>
      {/* Bộ lọc */}
      <div className="mb-6 flex gap-2">
        {["ALL", "PENDING", "PREPARING", "COMPLETED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              filter === status
                ? "bg-elso-primary text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {status === "ALL"
              ? "Tất cả đơn"
              : status === "PENDING"
                ? "Mới đặt"
                : status === "PREPARING"
                  ? "Đang pha"
                  : "Đã xong"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Mã Đơn</th>
                <th className="px-6 py-4">Bàn / Vị trí</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-400 font-medium"
                  >
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-sm text-gray-500">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {order.tableNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-elso-primary">
                      {order.totalAmount.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Xóa đơn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG (Hóa đơn) */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-elso-primary" /> Chi Tiết Đơn
                Hàng
              </h3>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Vị trí
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {viewingOrder.tableNumber}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Ngày đặt
                  </p>
                  <p className="font-bold text-gray-800">
                    {new Date(viewingOrder.createdAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Trạng thái</p>
                  {getStatusBadge(viewingOrder.status)}
                </div>
                <div>
                  <p className="text-gray-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Giờ đặt
                  </p>
                  <p className="font-bold text-gray-800">
                    {new Date(viewingOrder.createdAt).toLocaleTimeString(
                      "vi-VN",
                    )}
                  </p>
                </div>
              </div>

              {/* Danh sách món */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <h4 className="font-bold text-gray-800 mb-3">Danh sách món:</h4>
                <ul className="space-y-3">
                  {viewingOrder.items.map((item: any) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-bold text-elso-primary mr-2">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-gray-800">
                          {item.product?.name || "Sản phẩm đã bị xóa khỏi Menu"}
                        </span>
                        {item.note && (
                          <p className="text-xs text-red-500 italic mt-0.5 ml-6">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                      <span className="text-gray-600 font-medium">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ghi chú chung */}
              {viewingOrder.note && (
                <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-yellow-800 mb-4 italic">
                  <strong>Ghi chú chung:</strong> {viewingOrder.note}
                </div>
              )}

              {/* Tổng tiền */}
              <div className="border-t-2 border-dashed border-gray-200 pt-4 flex justify-between items-end">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">
                  Tổng thanh toán
                </span>
                <span className="text-2xl font-black text-elso-primary">
                  {viewingOrder.totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
