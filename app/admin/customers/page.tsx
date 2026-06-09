import prisma from "@/lib/prisma";
import { Users } from "lucide-react";
import ClientCustomerTable from "./ClientCustomerTable";

// Tắt Cache để điểm luôn hiển thị mới nhất
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
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

        {/* Nhúng bảng thông minh có chức năng Sửa/Tìm kiếm */}
        <ClientCustomerTable customers={customers} />
      </div>
    </div>
  );
}
