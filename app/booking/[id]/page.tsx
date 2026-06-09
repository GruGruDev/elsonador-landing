import { createLog } from "@/lib/log";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BookBoxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const boxId = resolvedParams.id;

  const box = await prisma.sleepBox.findUnique({ where: { id: boxId } });

  if (!box || box.status !== "AVAILABLE") {
    return (
      <div className="min-h-screen bg-[#F8F3EE] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Rất tiếc!</h1>
        <p className="mb-6 text-gray-600">
          Chỗ này không tồn tại, đang bảo trì hoặc đã có người nhanh tay đặt mất
          rồi.
        </p>
        <Link
          href="/booking"
          className="px-6 py-3 font-bold bg-elso-primary text-white rounded-md hover:bg-elso-secondary transition"
        >
          Quay lại sơ đồ
        </Link>
      </div>
    );
  }

  // Khối xử lý dữ liệu (Server Action) - CHUẨN HÓA LOGIC GÓI COMBO
  async function submitBooking(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const packageType = formData.get("packageType") as string;

    const startTime = new Date();
    let endTime = new Date(startTime);
    let totalAmount = 0;
    let packageLabel = "";

    // XỬ LÝ LOGIC GÓI COMBO GIỐNG HỆT ADMIN
    if (packageType === "WATER_ONLY") {
      endTime = new Date(startTime.getTime() + 5 * 60 * 60 * 1000);
      totalAmount = 0;
      packageLabel = "Gói Tiêu Chuẩn (Mua nước)";
    } else if (packageType === "NIGHT_1" || packageType === "NIGHT_2") {
      totalAmount = packageType === "NIGHT_1" ? 130000 : 160000;
      endTime.setHours(12, 0, 0, 0);
      if (startTime.getHours() >= 12) {
        endTime.setDate(endTime.getDate() + 1);
      }
      packageLabel =
        packageType === "NIGHT_1" ? "Combo Đêm 1 Người" : "Combo Đêm 2 Người";
    } else if (packageType === "DAY_24H") {
      endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
      totalAmount = 200000;
      packageLabel = "Combo Nguyên Ngày (24h)";
    }

    const bookingCode = `ELSO-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = await prisma.booking.create({
      data: {
        customerName: name,
        phone: phone,
        boxId: box!.id,
        startTime,
        endTime,
        totalAmount,
        paymentStat: "PENDING",
        bookingCode,
      },
    });

    await prisma.sleepBox.update({
      where: { id: box!.id },
      data: { status: "OCCUPIED" },
    });

    // 📸 GHI LOG ONLINE BOOKING CHI TIẾT
    await createLog(
      "ONLINE_BOOKING",
      `🌐 Khách hàng tự đặt chỗ online: ${name} (SĐT: ${phone}) đã đặt vị trí [${box!.name}]. Gói lựa chọn: ${packageLabel}. Mã vé: ${bookingCode}`,
    );

    revalidatePath("/booking");
    revalidatePath("/admin/tables"); // F5 luôn sơ đồ quản trị của quán
    redirect(`/booking/ticket/${newBooking.bookingCode}`);
  }

  return (
    <main className="min-h-screen bg-[#F8F3EE] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-bold text-elso-primary mb-2 text-center">
          Xác nhận đặt chỗ
        </h1>

        <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-6 border border-green-200 text-center">
          <p className="font-medium text-lg mb-1">
            Bạn đang giữ chỗ:{" "}
            <span className="font-black text-xl">{box.name}</span>
          </p>
          <p className="text-sm">Vui lòng chọn Gói dịch vụ bên dưới</p>
        </div>

        <form action={submitBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tên của bạn
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elso-primary outline-none"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Số ĐT (Zalo)
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elso-primary outline-none"
              placeholder="VD: 0912345678"
            />
          </div>

          {/* MENU CHỌN GÓI CHO KHÁCH TỰ ĐẶT */}
          <div className="bg-elso-primary/5 p-4 rounded-lg border border-elso-primary/20">
            <label className="block text-sm font-black text-elso-primary mb-2 uppercase tracking-wide">
              Chọn gói dịch vụ
            </label>
            <select
              name="packageType"
              required
              className="w-full px-3 py-3 border border-elso-primary/30 rounded-lg outline-none focus:ring-2 focus:ring-elso-primary bg-white font-bold text-gray-800 shadow-sm"
            >
              <option value="WATER_ONLY">
                ☕ Chỉ mua Nước (0đ Box - Giữ chỗ 5 tiếng)
              </option>
              <option value="NIGHT_1">
                🌙 Combo Đêm 1 Người (130.000đ - Kèm nước & mền)
              </option>
              <option value="NIGHT_2">
                🌙 Combo Đêm 2 Người (160.000đ - Kèm nước & mền)
              </option>
              <option value="DAY_24H">
                ☀️ Combo 24H (200.000đ - Kèm nước & mền)
              </option>
            </select>
            <p className="text-[11px] text-gray-500 mt-2 font-medium italic leading-relaxed">
              *Gói đêm áp dụng tới 12h00 trưa hôm sau. Mã QR thanh toán sẽ tự
              động tạo dựa theo gói bạn chọn.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-elso-primary text-white font-bold py-4 rounded-lg mt-6 hover:bg-elso-secondary transition shadow-md text-lg"
          >
            Xác Nhận & Lấy Vé
          </button>

          <Link
            href="/booking"
            className="block text-center text-sm font-bold text-gray-400 mt-4 hover:text-red-500 transition"
          >
            Hủy và quay lại sơ đồ
          </Link>
        </form>
      </div>
    </main>
  );
}
