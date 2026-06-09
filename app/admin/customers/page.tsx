import prisma from "@/lib/prisma";
import { Award, Phone, Users } from "lucide-react";

export default async function CustomersPage() {
  // Lấy danh sách khách hàng, sắp xếp ai nhiều điểm nhất lên đầu
  const customers = await prisma.customer.findMany({
    orderBy: { points: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Khách Hàng Thân Thiết
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Đang có{" "}
              <strong className="text-blue-600">{customers.length}</strong>{" "}
              khách hàng trong hệ thống CRM
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Tên Khách Hàng</th>
                <th className="px-6 py-4">Số Điện Thoại</th>
                <th className="px-6 py-4">Điểm Tích Lũy</th>
                <th className="px-6 py-4">Hạng Thành Viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Chưa có dữ liệu khách hàng.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {/* Bọc flex vào div để không phá vỡ cấu trúc thẻ td */}
                      <div className="flex items-center gap-2 font-bold text-gray-800">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs shrink-0">
                          {customer.name?.charAt(0) || "K"}
                        </div>
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 font-mono">
                        <Phone className="w-4 h-4 text-gray-400" />{" "}
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600 text-lg">
                      {customer.points}
                    </td>
                    <td className="px-6 py-4">
                      {customer.points >= 100 ? (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                          <Award className="w-4 h-4" /> VÀNG (VIP)
                        </span>
                      ) : customer.points >= 50 ? (
                        <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                          <Award className="w-4 h-4" /> BẠC
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                          <Award className="w-4 h-4" /> ĐỒNG
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
