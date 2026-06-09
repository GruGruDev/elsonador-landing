import prisma from "@/lib/prisma";
import { Armchair, Bed } from "lucide-react";
import Link from "next/link";

export default async function BookingPage() {
  // Lấy toàn bộ dữ liệu Box từ Supabase
  const boxes = await prisma.sleepBox.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-elso-background p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-elso-primary">
            Sơ Đồ Đặt Chỗ Trực Tuyến
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-white text-elso-primary border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
          >
            Quay lại Trang chủ
          </Link>
        </div>

        {/* CHÚ THÍCH TRẠNG THÁI */}
        <div className="flex gap-6 mb-8 text-sm font-medium text-gray-600 bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-100 border border-green-500 rounded-full"></span>{" "}
            Trống (Có thể đặt)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-100 border border-red-500 rounded-full"></span>{" "}
            Đang có khách
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-100 border border-yellow-500 rounded-full"></span>{" "}
            Đang dọn dẹp
          </div>
        </div>

        {/* LƯỚI SƠ ĐỒ PHÒNG */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boxes.map((box) => {
            // Định nghĩa nội dung của một Box
            const BoxContent = (
              <div
                className={`p-5 rounded-lg border-2 flex flex-col items-center justify-center text-center transition shadow-sm h-full
                  ${box.status === "AVAILABLE" ? "bg-green-50 border-green-200 hover:border-green-400 cursor-pointer hover:-translate-y-1" : ""}
                  ${box.status === "OCCUPIED" ? "bg-red-50 border-red-200 opacity-70 cursor-not-allowed" : ""}
                  ${box.status === "CLEANING" ? "bg-yellow-50 border-yellow-200 opacity-80 cursor-wait" : ""}
                `}
              >
                {box.type === "WORKSPACE" ? (
                  <Armchair
                    className={`w-8 h-8 mb-2 ${box.status === "AVAILABLE" ? "text-green-600" : box.status === "OCCUPIED" ? "text-red-600" : "text-yellow-600"}`}
                  />
                ) : (
                  <Bed
                    className={`w-8 h-8 mb-2 ${box.status === "AVAILABLE" ? "text-green-600" : box.status === "OCCUPIED" ? "text-red-600" : "text-yellow-600"}`}
                  />
                )}
                <h3 className="font-bold text-gray-800">{box.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {box.type === "SINGLE_BOX"
                    ? "Box Đơn"
                    : box.type === "DOUBLE_BOX"
                      ? "Box Đôi"
                      : "Bàn Làm Việc"}
                </p>
                <p className="font-bold text-elso-primary mt-2">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(box.price)}
                </p>
              </div>
            );

            // Nếu trống thì bọc Link để bấm được, nếu không thì chỉ hiện thẻ div thường
            return box.status === "AVAILABLE" ? (
              <Link
                href={`/booking/${box.id}`}
                key={box.id}
                className="block h-full"
              >
                {BoxContent}
              </Link>
            ) : (
              <div key={box.id} className="h-full">
                {BoxContent}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
