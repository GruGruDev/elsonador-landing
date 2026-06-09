import prisma from "@/lib/prisma";
import { UserPlus } from "lucide-react";
import ClientUserForm from "./ClientUserForm";
import ClientUserTable from "./ClientUserTable"; // Import Bảng thông minh

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Quản Lý Nhân Sự & Phân Quyền
        </h1>
        <p className="text-gray-500 mt-1">
          Cấp tài khoản đăng nhập và phân quyền cho nhân viên quán
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Thêm Nhân Viên */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <UserPlus className="w-5 h-5 text-elso-primary" />
            <h2 className="font-bold text-gray-800 text-lg">
              Cấp Tài Khoản Mới
            </h2>
          </div>
          <ClientUserForm />
        </div>

        {/* Danh sách Nhân Viên (Đã được bọc logic Sửa/Xóa bên trong) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ClientUserTable users={users} />
        </div>
      </div>
    </div>
  );
}
