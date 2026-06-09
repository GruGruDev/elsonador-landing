"use server";

import { createLog } from "@/lib/log";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCustomer(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const pointsStr = formData.get("points") as string;

    const points = parseInt(pointsStr);

    if (isNaN(points) || points < 0) {
      return { success: false, error: "Số điểm không hợp lệ!" };
    }

    // Lấy thông tin tài khoản thành viên cũ trước khi cập nhật
    const oldCustomer = await prisma.customer.findUnique({ where: { id } });

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: name.trim() !== "" ? name : null,
        points,
      },
    });

    // 📸 GHI LOG CHI TIẾT BIẾN ĐỘNG THẺ THÀNH VIÊN CRM
    let logMsg = `Cập nhật dữ liệu khách hàng CRM (SĐT định danh: ${updatedCustomer.phone}). Tên mới: ${updatedCustomer.name || "Chưa đặt tên"}.`;
    if (oldCustomer && oldCustomer.points !== updatedCustomer.points) {
      logMsg += ` 🚨 Số dư điểm được điều chỉnh từ: [${oldCustomer.points} Điểm] -> thành [${updatedCustomer.points} Điểm] (Lệch: ${updatedCustomer.points - oldCustomer.points} Điểm)`;
    }

    await createLog("UPDATE_CRM", logMsg);

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Lỗi cập nhật CRM:", error);
    return {
      success: false,
      error: "Không thể cập nhật thông tin khách hàng!",
    };
  }
}
