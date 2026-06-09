"use server";

import { createLog } from "@/lib/log";
import prisma from "@/lib/prisma";

export async function submitOrder(
  cart: any[],
  tableNumber: string,
  totalAmount: number,
  note: string,
  phone: string,
) {
  try {
    // 1. Tạo đơn hàng vào Database với số tiền cuối (đã bao gồm VAT từ Client đẩy lên)
    const newOrder = await prisma.order.create({
      data: {
        tableNumber: tableNumber,
        note: note,
        totalAmount: totalAmount,
        status: "PENDING",
        items: {
          create: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            note: item.note,
          })),
        },
      },
    });

    // 📸 GHI LOG CHI TIẾT ĐƠN HÀNG (MINH BẠCH DÒNG THUẾ)
    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const itemsListText = cart
      .map((item) => `${item.quantity}x ${item.product.name}`)
      .join(", ");

    await createLog(
      "CUSTOMER_ORDER",
      `🛒 Đơn gọi món mới tại vị trí [${tableNumber}] | Mã số đơn: #${newOrder.id.slice(-6).toUpperCase()} | Tổng thanh toán (Đã gồm 8% VAT): ${totalAmount.toLocaleString("vi-VN")}đ | Chi tiết (${totalItemsCount} món): ${itemsListText} | Ghi chú khách: ${note || "Không có"}`,
    );

    // 2. TÍCH ĐIỂM CRM
    if (phone && phone.trim() !== "") {
      const pointsEarned = Math.floor(totalAmount / 10000); // 10.000đ = 1 điểm

      await prisma.customer.upsert({
        where: { phone: phone.trim() },
        update: {
          points: { increment: pointsEarned },
        },
        create: {
          phone: phone.trim(),
          points: pointsEarned,
          name: "Khách hàng thân thiết",
        },
      });

      await createLog(
        "CRM_POINTS",
        `✨ CRM: Khách hàng số điện thoại [${phone.trim()}] được cộng tự động +${pointsEarned} điểm thưởng từ hóa đơn #${newOrder.id.slice(-6).toUpperCase()}`,
      );
    }

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("Lỗi khi tạo order:", error);
    return { success: false, error: "Không thể tạo đơn hàng" };
  }
}
