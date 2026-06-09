import prisma from "@/lib/prisma";
import ClientQRGenerator from "./ClientQRGenerator";

export default async function QRBuilderPage() {
  // Lấy trước danh sách Bàn/SleepBox từ Database để quản lý chọn cho nhanh
  const tables = await prisma.sleepBox.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Trình Tạo Mã QR Tại Bàn
        </h1>
        <p className="text-gray-500 mt-1">
          Xuất mã QR tự động điền sẵn số bàn để khách quét và gọi món.
        </p>
      </div>

      <ClientQRGenerator tables={tables} />
    </div>
  );
}
