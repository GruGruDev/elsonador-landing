import prisma from "@/lib/prisma";
import MenuClient from "./MenuClient";

// Bắt buộc Next.js không được lưu Cache trang này để khách luôn thấy Menu mới nhất
export const dynamic = "force-dynamic";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { table?: string };
}) {
  // Bắt tham số từ QR (VD: /menu?table=Box 01)
  const scannedTable = searchParams.table || "";

  // Lấy toàn bộ danh mục kèm theo danh sách sản phẩm ĐANG BÁN
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { isAvailable: true }, // Chỉ lấy món chưa Hết hàng
      },
    },
  });

  // Truyền số bàn quét được (nếu có) sang Giao diện
  return <MenuClient categories={categories} initialTable={scannedTable} />;
}
