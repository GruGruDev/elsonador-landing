import prisma from "@/lib/prisma";
import { ShieldAlert } from "lucide-react";
import ClientLogTable from "./ClientLogTable";

export const dynamic = "force-dynamic";

export default async function SystemLogsPage() {
  // Lấy 500 log gần nhất, kèm theo thông tin User đã thực hiện
  const logs = await prisma.systemLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: {
      user: {
        select: {
          username: true,
          fullName: true,
          role: true,
        },
      },
    },
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-500" /> Nhật Ký Hệ Thống
        </h1>
        <p className="text-gray-500 mt-1">
          Giám sát mọi thao tác Thêm/Sửa/Xóa dữ liệu để đảm bảo an toàn vận
          hành.
        </p>
      </div>

      <ClientLogTable logs={logs} />
    </div>
  );
}
