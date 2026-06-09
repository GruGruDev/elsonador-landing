import prisma from "@/lib/prisma";
import { History } from "lucide-react";
import ClientOrderTable from "./ClientOrderTable";

// Bắt buộc lấy dữ liệu mới nhất, không dùng Cache
export const dynamic = "force-dynamic";

export default async function OrderHistoryPage() {
  // Lấy toàn bộ đơn hàng từ mới nhất đến cũ nhất
  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true }, // Kéo theo tên Sản phẩm
      },
    },
  });

  // Tính toán nhanh tổng doanh thu của tất cả các đơn ĐÃ HOÀN THÀNH
  const totalRevenue = allOrders
    .filter((order) => order.status === "COMPLETED")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <History className="w-8 h-8 text-elso-primary" /> Lịch Sử Order
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý và tra cứu toàn bộ đơn hàng của quán
          </p>
        </div>

        {/* Thẻ hiển thị doanh thu tạm tính */}
        <div className="bg-elso-primary/10 border border-elso-primary/20 px-6 py-4 rounded-xl text-right">
          <p className="text-sm font-bold text-elso-primary uppercase tracking-wider">
            Doanh thu tạm tính
          </p>
          <p className="text-2xl font-black text-elso-primary">
            {totalRevenue.toLocaleString("vi-VN")}đ
          </p>
          <p className="text-xs text-gray-500 mt-1">
            *Chỉ tính đơn hàng Đã Giao
          </p>
        </div>
      </div>

      <ClientOrderTable orders={allOrders} />
    </div>
  );
}
