"use server";

import { createLog } from "@/lib/log";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteOrder(orderId: string) {
  try {
    // Truy vấn thông tin của đơn hàng gốc trước khi tiến hành xóa
    const orderInfo = await prisma.order.findUnique({
      where: { id: orderId },
    });

    // 1. Xóa chi tiết các món ăn liên quan trước để không dính lỗi khóa ngoại
    await prisma.orderItem.deleteMany({
      where: { orderId: orderId },
    });

    // 2. Tiến hành xóa vỏ đơn hàng
    await prisma.order.delete({
      where: { id: orderId },
    });

    // 📸 GHI LOG CHI TIẾT HÀNH ĐỘNG NGUY HIỂM CHỐNG GIAN LẬN BILL
    if (orderInfo) {
      await createLog(
        "DELETE_ORDER",
        `⚠️ CẢNH BÁO: Đơn hàng hệ thống mang mã số ID: #${orderInfo.id.slice(-6).toUpperCase()} tại vị trí [${orderInfo.tableNumber}] trị giá ${orderInfo.totalAmount.toLocaleString("vi-VN")}đ ĐÃ BỊ XÓA HOÀN TOÀN KHỎI HỆ THỐNG.`,
      );
    }

    revalidatePath("/admin/orders");
    revalidatePath("/bar");
    return { success: true };
  } catch (error) {
    console.error("Lỗi xóa đơn:", error);
    return { success: false, error: "Không thể xóa đơn hàng này!" };
  }
}
