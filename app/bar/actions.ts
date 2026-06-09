"use server";

import { createLog } from "@/lib/log";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Cập nhật trạng thái pha chế (PENDING -> PREPARING -> COMPLETED)
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // 📸 GHI LOG CHI TIẾT
    const statusText =
      newStatus === "PREPARING" ? "BẮT ĐẦU PHA CHẾ" : "HOÀN THÀNH & PHỤC VỤ";
    await createLog(
      "BAR_ACTION",
      `Quầy pha chế cập nhật trạng thái đơn hàng #${updatedOrder.id.slice(-6).toUpperCase()} tại vị trí [${updatedOrder.tableNumber}]: Đơn chuyển sang giai đoạn [${statusText}]`,
    );

    revalidatePath("/bar");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn:", error);
    return { success: false, error: "Không thể cập nhật đơn hàng!" };
  }
}
