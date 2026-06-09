"use server";

import prisma from "@/lib/prisma";

export async function submitOrder(
  cart: any[],
  tableNumber: string,
  totalAmount: number,
  note: string,
  phone: string,
) {
  try {
    // 1. Tạo đơn hàng như bình thường
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

    // 2. TÍCH ĐIỂM CRM: Nếu khách có nhập số điện thoại
    if (phone && phone.trim() !== "") {
      const pointsEarned = Math.floor(totalAmount / 10000); // 10.000đ = 1 điểm

      // Lệnh upsert thần thánh: Có SĐT rồi thì cộng điểm, chưa có thì tạo mới
      await prisma.customer.upsert({
        where: { phone: phone.trim() },
        update: {
          points: { increment: pointsEarned },
        },
        create: {
          phone: phone.trim(),
          points: pointsEarned,
          name: "Khách hàng thân thiết", // Tạm để tên mặc định, có thể làm tính năng đổi tên sau
        },
      });
    }

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("Lỗi khi tạo order:", error);
    return { success: false, error: "Không thể tạo đơn hàng" };
  }
}
