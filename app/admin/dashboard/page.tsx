import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

// Tắt Cache để chủ quán luôn nhìn thấy số liệu mới nhất
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Tính tổng doanh thu Sleep Box (CHỈ LẤY NHỮNG ĐƠN ĐÃ THANH TOÁN "PAID")
  const bookings = await prisma.booking.findMany({
    where: { paymentStat: "PAID" },
  });
  const totalBookingRevenue = bookings.reduce(
    (sum, b) => sum + b.totalAmount,
    0,
  );

  // 2. Tính tổng doanh thu Quầy Bar (CHỈ LẤY NHỮNG ĐƠN ĐÃ HOÀN THÀNH "COMPLETED")
  const orders = await prisma.order.findMany({
    where: { status: "COMPLETED" },
  });
  const totalOrderRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 3. Phân tích Top món bán chạy nhất (Chỉ tính từ những đơn hàng thành công)
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: { status: "COMPLETED" }, // Lọc ngang từ bảng cha
    },
    include: { product: true },
  });

  // Gom nhóm số lượng theo từng món
  const productSales: Record<string, { name: string; quantity: number }> = {};

  orderItems.forEach((item) => {
    // Check đề phòng trường hợp sản phẩm đã bị xóa khỏi menu nhưng lịch sử order vẫn còn
    const productName = item.product?.name || "Món đã xóa";

    if (!productSales[item.productId]) {
      productSales[item.productId] = { name: productName, quantity: 0 };
    }
    productSales[item.productId].quantity += item.quantity;
  });

  // Sắp xếp giảm dần và lấy Top 5
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <DashboardClient
      totalBookingRevenue={totalBookingRevenue}
      totalOrderRevenue={totalOrderRevenue}
      totalBookings={bookings.length}
      totalOrders={orders.length}
      topProducts={topProducts}
    />
  );
}
