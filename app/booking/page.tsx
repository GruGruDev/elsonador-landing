import prisma from "@/lib/prisma";
import { Armchair, Bed, Wrench } from "lucide-react";
import Link from "next/link";

// BẮT BUỘC: Ép Next.js tải lại dữ liệu mới nhất để khách không đặt trùng phòng
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const boxes = await prisma.sleepBox.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-elso-background p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-elso-primary text-center md:text-left">
            Sơ Đồ Đặt Chỗ Trực Tuyến
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-white text-elso-primary border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 font-bold"
          >
            Quay lại Trang chủ
          </Link>
        </div>

        {/* CHÚ THÍCH TRẠNG THÁI */}
        <div className="flex flex-wrap gap-4 md:gap-6 mb-8 text-sm font-medium text-gray-600 bg-white p-4 rounded-md shadow-sm">
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
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-100 border border-gray-400 rounded-full"></span>{" "}
            Bảo trì
          </div>
        </div>

        {/* LƯỚI SƠ ĐỒ PHÒNG */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boxes.map((box) => {
            const BoxContent = (
              <div
                className={`p-5 rounded-lg border-2 flex flex-col items-center justify-center text-center transition shadow-sm h-full
                  ${box.status === "AVAILABLE" ? "bg-green-50 border-green-200 hover:border-green-400 cursor-pointer hover:-translate-y-1" : ""}
                  ${box.status === "OCCUPIED" ? "bg-red-50 border-red-200 opacity-70 cursor-not-allowed" : ""}
                  ${box.status === "CLEANING" ? "bg-yellow-50 border-yellow-200 opacity-80 cursor-wait" : ""}
                  ${box.status === "MAINTENANCE" ? "bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed grayscale" : ""}
                `}
              >
                {box.status === "MAINTENANCE" ? (
                  <Wrench className="w-8 h-8 mb-2 text-gray-500" />
                ) : box.type === "WORKSPACE" ? (
                  <Armchair
                    className={`w-8 h-8 mb-2 ${box.status === "AVAILABLE" ? "text-green-600" : box.status === "OCCUPIED" ? "text-red-600" : "text-yellow-600"}`}
                  />
                ) : (
                  <Bed
                    className={`w-8 h-8 mb-2 ${box.status === "AVAILABLE" ? "text-green-600" : box.status === "OCCUPIED" ? "text-red-600" : "text-yellow-600"}`}
                  />
                )}

                <h3
                  className={`font-bold ${box.status === "MAINTENANCE" ? "text-gray-500 line-through" : "text-gray-800"}`}
                >
                  {box.name}
                </h3>

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
                  <span className="text-xs font-normal text-gray-500">/h</span>
                </p>
              </div>
            );

            // Chỉ cho phép click nếu đang Trống
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
