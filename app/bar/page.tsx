import prisma from "@/lib/prisma";
import { CheckCircle2, Clock, Coffee } from "lucide-react";
import { revalidatePath } from "next/cache";
import { Toaster } from "react-hot-toast";
import BarRealtime from "./BarRealtime";

// IMPORT HÀM ACTION MỚI (Đã được tích hợp hệ thống Ghi Log)
import { updateOrderStatus } from "./actions";

// BẮT BUỘC THÊM DÒNG NÀY: Ép trang không lưu Cache, luôn lấy đơn mới nhất
export const dynamic = "force-dynamic";

export default async function BarDashboard() {
  const activeOrders = await prisma.order.findMany({
    where: {
      status: { in: ["PENDING", "PREPARING"] },
    },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // HÀM UPDATE CŨ ĐÃ BỊ XÓA (Do đã chuyển sang file actions.ts)

  return (
    <main className="min-h-screen bg-gray-100 p-6 lg:p-10 font-sans">
      <Toaster position="top-right" />
      <BarRealtime currentOrderIds={activeOrders.map((o) => o.id)} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-elso-primary text-white rounded-lg">
              <Coffee className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Màn Hình Quầy Pha Chế
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Đang có{" "}
                <strong className="text-red-500">{activeOrders.length}</strong>{" "}
                đơn chờ xử lý
              </p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              revalidatePath("/bar");
            }}
          >
            <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" /> Làm mới dữ liệu
            </button>
          </form>
        </div>

        {/* Lưới hiển thị Đơn hàng */}
        {activeOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-medium">
              Hiện tại không có đơn hàng nào.
            </p>
            <p className="text-gray-400 mt-2">Quầy bar có thể nghỉ ngơi!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className={`flex flex-col bg-white rounded-xl shadow-sm overflow-hidden border-t-4 transition
                  ${order.status === "PENDING" ? "border-red-500" : "border-yellow-400"}`}
              >
                {/* Header Card */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Khu vực / Bàn
                    </span>
                    <h3 className="text-xl font-bold text-elso-primary">
                      {order.tableNumber}
                    </h3>

                    {order.note && (
                      <p className="mt-2 text-sm bg-yellow-100 text-yellow-800 p-2 rounded-md border border-yellow-200">
                        <strong>📌 Note chung:</strong> {order.note}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block mb-1">
                      Giờ đặt
                    </span>
                    <p className="text-sm font-bold text-gray-700">
                      {order.createdAt.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Danh sách món */}
                <div className="p-4 flex-1">
                  <ul className="space-y-3">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="pb-2 border-b border-dashed border-gray-200 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800 text-sm">
                            <span className="font-bold text-elso-primary mr-2">
                              {item.quantity}x
                            </span>
                            {item.product?.name || "Món đã xóa"}
                          </span>
                        </div>
                        {item.note && (
                          <div className="mt-1 ml-6 text-xs text-red-600 italic bg-red-50 p-1.5 rounded-md inline-block">
                            ↳ Note: {item.note}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nút hành động */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                  {/* Đã sửa form action gọi đến hàm import từ actions.ts */}
                  <form
                    action={async (formData) => {
                      "use server";
                      const orderId = formData.get("orderId") as string;
                      const newStatus = formData.get("newStatus") as string;
                      await updateOrderStatus(orderId, newStatus);
                    }}
                  >
                    <input type="hidden" name="orderId" value={order.id} />

                    {order.status === "PENDING" ? (
                      <button
                        type="submit"
                        name="newStatus"
                        value="PREPARING"
                        className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg transition text-sm flex items-center justify-center gap-2"
                      >
                        <Clock className="w-5 h-5" /> Bắt đầu Pha chế
                      </button>
                    ) : (
                      <button
                        type="submit"
                        name="newStatus"
                        value="COMPLETED"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Đã xong & Giao
                      </button>
                    )}
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
