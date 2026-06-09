import prisma from "@/lib/prisma";
import { Armchair, Bed, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminPage() {
  // Lấy toàn bộ Box từ Database
  const boxes = await prisma.sleepBox.findMany({
    orderBy: { name: "asc" },
  });

  // Server Action: Cập nhật trạng thái phòng
  async function updateStatus(formData: FormData) {
    "use server";
    const boxId = formData.get("boxId") as string;
    const newStatus = formData.get("newStatus") as string;

    await prisma.sleepBox.update({
      where: { id: boxId },
      data: { status: newStatus },
    });

    // Cập nhật lại dữ liệu cho cả trang Admin và trang Booking của khách
    revalidatePath("/admin");
    revalidatePath("/booking");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bảng Điều Khiển Lễ Tân
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý trạng thái Sleep Box & Không gian làm việc
            </p>
          </div>
          <Link
            href="/booking"
            target="_blank"
            className="text-elso-primary font-medium hover:underline text-sm"
          >
            ↗ Xem sơ đồ khách thấy
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boxes.map((box) => (
            <div
              key={box.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg ${box.status === "AVAILABLE" ? "bg-green-100 text-green-600" : box.status === "OCCUPIED" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}
                  >
                    {box.type === "WORKSPACE" ? (
                      <Armchair className="w-6 h-6" />
                    ) : (
                      <Bed className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {box.name}
                    </h3>
                    <p className="text-xs text-gray-500">{box.type}</p>
                  </div>
                </div>
              </div>

              {/* Hiển thị trạng thái hiện tại */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                  ${
                    box.status === "AVAILABLE"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : box.status === "OCCUPIED"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {box.status === "AVAILABLE"
                    ? "🟢 Đang Trống"
                    : box.status === "OCCUPIED"
                      ? "🔴 Đang Có Khách"
                      : "🟡 Đang Dọn Dẹp"}
                </span>
              </div>

              {/* Các nút bấm thao tác nhanh */}
              <div className="mt-auto border-t pt-4">
                <form action={updateStatus} className="flex gap-2">
                  <input type="hidden" name="boxId" value={box.id} />

                  {box.status === "OCCUPIED" && (
                    <button
                      type="submit"
                      name="newStatus"
                      value="CLEANING"
                      className="flex-1 flex items-center justify-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-bold py-2 px-3 rounded-md transition"
                    >
                      <RefreshCw className="w-3 h-3" /> Trả Box & Dọn
                    </button>
                  )}

                  {box.status === "CLEANING" && (
                    <button
                      type="submit"
                      name="newStatus"
                      value="AVAILABLE"
                      className="flex-1 flex items-center justify-center gap-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-bold py-2 px-3 rounded-md transition"
                    >
                      <CheckCircle className="w-3 h-3" /> Dọn xong (Trống)
                    </button>
                  )}

                  {box.status === "AVAILABLE" && (
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-1 bg-gray-50 text-gray-400 text-xs font-bold py-2 px-3 rounded-md cursor-not-allowed"
                    >
                      Sẵn sàng đón khách
                    </button>
                  )}

                  {/* Nút reset khẩn cấp */}
                  {box.status !== "AVAILABLE" && (
                    <button
                      type="submit"
                      name="newStatus"
                      value="AVAILABLE"
                      title="Ép về trạng thái Trống"
                      className="flex-none flex items-center justify-center bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 py-2 px-3 rounded-md transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
