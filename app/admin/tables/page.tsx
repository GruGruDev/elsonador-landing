import prisma from "@/lib/prisma";
import ClientTableManager from "./ClientTableManager";

// Tắt Cache để sơ đồ Box luôn chính xác tới từng giây
export const dynamic = "force-dynamic";

export default async function TablesPage() {
  const boxes = await prisma.sleepBox.findMany({
    orderBy: { name: "asc" },
    include: {
      bookings: {
        where: { paymentStat: "PENDING" },
        take: 1,
      },
    },
  });

  const total = boxes.length;
  const occupied = boxes.filter((b) => b.status === "OCCUPIED").length;
  const available = boxes.filter((b) => b.status === "AVAILABLE").length;
  const cleaning = boxes.filter((b) => b.status === "CLEANING").length;
  const maintenance = boxes.filter((b) => b.status === "MAINTENANCE").length; // Đếm số box bảo trì

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Quản Lý Không Gian / Sleep Box
        </h1>
        <p className="text-gray-500 mt-1">
          Điều phối khách, tính giờ tự động và quản lý dọn dẹp.
        </p>
      </div>

      {/* Thanh Thống kê 5 Cột */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center border-r border-gray-100">
          <p className="text-sm text-gray-400 font-bold uppercase mb-1">
            Tổng Box
          </p>
          <p className="text-2xl font-black text-gray-700">{total}</p>
        </div>
        <div className="text-center border-r border-gray-100">
          <p className="text-sm text-green-500 font-bold uppercase mb-1">
            Sẵn Sàng
          </p>
          <p className="text-2xl font-black text-green-600">{available}</p>
        </div>
        <div className="text-center border-r md:border-gray-100">
          <p className="text-sm text-red-500 font-bold uppercase mb-1">
            Đang Dùng
          </p>
          <p className="text-2xl font-black text-red-600">{occupied}</p>
        </div>
        <div className="text-center border-r border-gray-100">
          <p className="text-sm text-yellow-500 font-bold uppercase mb-1">
            Chờ Dọn
          </p>
          <p className="text-2xl font-black text-yellow-600">{cleaning}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 font-bold uppercase mb-1">
            Bảo Trì
          </p>
          <p className="text-2xl font-black text-gray-600">{maintenance}</p>
        </div>
      </div>

      <ClientTableManager boxes={boxes} />
    </div>
  );
}
