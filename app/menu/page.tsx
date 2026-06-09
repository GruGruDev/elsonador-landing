import prisma from "@/lib/prisma";
import MenuClient from "./MenuClient";

export default async function MenuPage() {
  // Lấy toàn bộ danh mục kèm theo danh sách sản phẩm của từng danh mục
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  return <MenuClient categories={categories} />;
}
