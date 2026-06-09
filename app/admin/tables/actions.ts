"use server";

import { createLog } from "@/lib/log";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Mở Bàn / Nhận Box (Bắt đầu tính giờ THEO GÓI COMBO)
export async function startSession(formData: FormData) {
  try {
    const boxId = formData.get("boxId") as string;
    const customerName = (formData.get("customerName") as string) || "Khách lẻ";
    const phone = (formData.get("phone") as string) || "";
    const packageType = formData.get("packageType") as string; // Lấy Gói dịch vụ

    const startTime = new Date();
    let endTime = new Date(startTime);
    let totalAmount = 0;
    let packageLabel = "";

    // XỬ LÝ LOGIC GÓI COMBO
    if (packageType === "WATER_ONLY") {
      // Mua nước ngồi 5 tiếng (Tiền nước thu riêng, tiền Box = 0)
      endTime = new Date(startTime.getTime() + 5 * 60 * 60 * 1000);
      totalAmount = 0;
      packageLabel = "Gói Tiêu Chuẩn (Mua nước)";
    } else if (packageType === "NIGHT_1" || packageType === "NIGHT_2") {
      // Combo Qua Đêm: Tính giờ tới đúng 12h00 trưa hôm sau
      totalAmount = packageType === "NIGHT_1" ? 130000 : 160000;
      endTime.setHours(12, 0, 0, 0); // Set cứng thành 12h00 trưa
      // Nếu lúc khách vào là từ 12h trưa trở đi (ví dụ 19h tối), thì 12h trưa phải là của ngày mai
      if (startTime.getHours() >= 12) {
        endTime.setDate(endTime.getDate() + 1);
      }
      packageLabel =
        packageType === "NIGHT_1" ? "Combo Đêm 1 Người" : "Combo Đêm 2 Người";
    } else if (packageType === "DAY_24H") {
      // Combo Nguyên ngày
      endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
      totalAmount = 200000;
      packageLabel = "Combo Nguyên Ngày (24h)";
    }

    const bookingCode = `ELSO-${Math.floor(1000 + Math.random() * 9000)}`;

    const [booking, box] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          boxId,
          customerName,
          phone,
          startTime,
          endTime,
          totalAmount,
          paymentStat: "PENDING",
          bookingCode,
        },
      }),
      prisma.sleepBox.update({
        where: { id: boxId },
        data: { status: "OCCUPIED" },
      }),
    ]);

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "START_BOX",
      `Mở Box [${box.name}] cho ${booking.customerName}. Gói: ${packageLabel} | Số ĐT: ${booking.phone || "Không cung cấp"} | Mã vé: ${booking.bookingCode}`,
    );

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    console.error("Lỗi mở bàn:", error);
    return { success: false, error: "Không thể mở Box lúc này!" };
  }
}

// 2. Trả Bàn / Checkout tính tiền
export async function checkoutSession(bookingId: string, boxId: string) {
  try {
    const [booking, box] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStat: "PAID", endTime: new Date() },
      }),
      prisma.sleepBox.update({
        where: { id: boxId },
        data: { status: "CLEANING" },
      }),
    ]);

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "CHECKOUT_BOX",
      `Kết thúc phiên sử dụng & thanh toán thành công tại [${box.name}] | Mã đặt chỗ: ${booking.bookingCode} | Khách hàng: ${booking.customerName} | Tổng tiền giờ thu về: ${booking.totalAmount.toLocaleString("vi-VN")}đ | Trạng thái phòng đổi sang: CHỜ DỌN DẸP`,
    );

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Lỗi thanh toán trả Box!" };
  }
}

// 3. Hoàn tất dọn dẹp
export async function finishCleaning(boxId: string) {
  try {
    const box = await prisma.sleepBox.update({
      where: { id: boxId },
      data: { status: "AVAILABLE" },
    });

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "CLEAN_BOX",
      `Nhân viên quầy báo cáo: Đã dọn dẹp sạch sẽ không gian [${box.name}]. Trạng thái đổi sang: SẴN SÀNG ĐÓN KHÁCH`,
    );

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Lỗi cập nhật!" };
  }
}

// 4. Thêm Box/Bàn mới
export async function createBox(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const price = parseInt(formData.get("price") as string);

    const box = await prisma.sleepBox.create({
      data: { name, type, price, status: "AVAILABLE" },
    });

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "CREATE_TABLE",
      `Thiết lập vị trí không gian mới: [${box.name}] | Cấu hình: ${box.type} | Giá niêm yết: ${box.price.toLocaleString("vi-VN")}đ/giờ`,
    );

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Không thể tạo Box mới!" };
  }
}

// 5. Cập nhật thông tin Box
export async function updateBox(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const price = parseInt(formData.get("price") as string);

    const oldBox = await prisma.sleepBox.findUnique({ where: { id } });
    const box = await prisma.sleepBox.update({
      where: { id },
      data: { name, type, price },
    });

    // 📸 GHI LOG CHI TIẾT
    let logMsg = `Thay đổi thông tin cấu hình của không gian [${box.name}] thành công.`;
    if (oldBox && oldBox.price !== box.price) {
      logMsg += ` Biểu giá giờ thay đổi từ: ${oldBox.price.toLocaleString("vi-VN")}đ/h -> ${box.price.toLocaleString("vi-VN")}đ/h`;
    }
    await createLog("UPDATE_TABLE", logMsg);

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Không thể cập nhật Box!" };
  }
}

// 6. Xóa Box hoàn toàn khỏi sơ đồ
export async function deleteBox(id: string) {
  try {
    const box = await prisma.sleepBox.delete({
      where: { id },
    });

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "DELETE_TABLE",
      `Gỡ bỏ vĩnh viễn vị trí không gian [${box.name}] (Mã ID: ${box.id}) ra khỏi sơ đồ mặt bằng quán`,
    );

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Không thể xóa Box này vì đã có lịch sử khách thuê!",
    };
  }
}

// 7. Bật / Tắt trạng thái Bảo trì
export async function toggleMaintenance(id: string, currentStatus: string) {
  try {
    if (currentStatus === "OCCUPIED") {
      return {
        success: false,
        error: "Box đang có khách, không thể khóa bảo trì!",
      };
    }

    const newStatus =
      currentStatus === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE";

    const box = await prisma.sleepBox.update({
      where: { id },
      data: { status: newStatus },
    });

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "MAINTENANCE_TABLE",
      `Cập nhật kỹ thuật hệ thống tại [${box.name}]: Đã chuyển đổi trạng thái hoạt động thành [${box.status === "MAINTENANCE" ? "KHÓA BẢO TRÌ SỬA CHỮA" : "SẴN SÀNG ĐÓN KHÁCH BÌNH THƯỜNG"}]`,
    );

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Lỗi cập nhật trạng thái bảo trì!" };
  }
}
