import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // 1. Tính tổng doanh thu Sleep Box
  const bookings = await prisma.booking.findMany();
  const totalBookingRevenue = bookings.reduce(
    (sum, b) => sum + b.totalAmount,
    0,
  );

  // 2. Tính tổng doanh thu Quầy Bar (Order)
  const orders = await prisma.order.findMany();
  const totalOrderRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 3. Phân tích Top món bán chạy nhất
  const orderItems = await prisma.orderItem.findMany({
    include: { product: true },
  });

  // Gom nhóm số lượng theo từng món
  const productSales: Record<string, { name: string; quantity: number }> = {};

  orderItems.forEach((item) => {
    if (!productSales[item.productId]) {
      productSales[item.productId] = { name: item.product.name, quantity: 0 };
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
