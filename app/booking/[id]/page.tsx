import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

// SỬA LỖI: Khai báo params là một Promise
export default async function BookBoxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // SỬA LỖI: Thêm chữ 'await' để đợi Next.js giải mã URL xong mới lấy ID
  const resolvedParams = await params;
  const boxId = resolvedParams.id;

  // Kiểm tra xem Box này có tồn tại và đang trống không
  const box = await prisma.sleepBox.findUnique({ where: { id: boxId } });

  if (!box || box.status !== "AVAILABLE") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Rất tiếc!</h1>
        <p className="mb-6">
          Chỗ này không tồn tại hoặc đã có người nhanh tay đặt mất rồi.
        </p>
        <Link
          href="/booking"
          className="px-6 py-2 bg-elso-primary text-white rounded-md"
        >
          Quay lại sơ đồ
        </Link>
      </div>
    );
  }

  // Khối xử lý dữ liệu (Server Action) - Chạy ngầm trên Server khi bấm nút Submit
  // Khối xử lý dữ liệu (Server Action)
  async function submitBooking(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    // 1. Lưu và LẤY DỮ LIỆU Booking vừa tạo
    const newBooking = await prisma.booking.create({
      data: {
        customerName: name,
        phone: phone,
        boxId: box!.id,
        startTime: new Date(),
        endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        totalAmount: box!.price,
        bookingCode: `ELSO-${Math.floor(1000 + Math.random() * 9000)}`,
      },
    });

    // 2. Cập nhật trạng thái Box
    await prisma.sleepBox.update({
      where: { id: box!.id },
      data: { status: "OCCUPIED" },
    });

    // 3. Xóa cache sơ đồ và ĐẨY SANG TRANG VÉ ĐIỆN TỬ
    revalidatePath("/booking");
    redirect(`/booking/ticket/${newBooking.bookingCode}`);
  }

  return (
    <main className="min-h-screen bg-[#F8F3EE] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-bold text-elso-primary mb-2">
          Xác nhận đặt chỗ
        </h1>
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6 border border-green-200">
          <p className="font-medium">
            Bạn đang đặt: <span className="font-bold">{box.name}</span>
          </p>
          <p className="text-sm">
            Giá tạm tính:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(box.price)}
          </p>
        </div>

        <form action={submitBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên của bạn
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-elso-secondary outline-none"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại (Zalo)
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-elso-secondary outline-none"
              placeholder="VD: 0912345678"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-elso-primary text-white font-bold py-4 rounded-md mt-4 hover:bg-elso-secondary transition"
          >
            Xác Nhận & Đặt Chỗ
          </button>

          <Link
            href="/booking"
            className="block text-center text-sm text-gray-500 mt-4 hover:text-gray-800"
          >
            Hủy và quay lại
          </Link>
        </form>
      </div>
    </main>
  );
}
