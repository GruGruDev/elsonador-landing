import prisma from "@/lib/prisma";
import { Coffee } from "lucide-react";
import ClientProductForm from "./ClientProductForm";
import ClientProductTable from "./ClientProductTable"; // Import bảng mới

export default async function MenuManagerPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { categoryId: "asc" },
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Thực Đơn</h1>
        <p className="text-gray-500 mt-1">
          Cập nhật danh sách món uống, giá tiền và tải ảnh sản phẩm
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Coffee className="w-5 h-5 text-elso-primary" />
            <h2 className="font-bold text-gray-800 text-lg">Thêm Món Mới</h2>
          </div>
          <ClientProductForm categories={categories} />
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Nhúng Bảng Thông Minh vào đây, truyền luôn categories để dùng cho thẻ Select trong Modal Sửa */}
          <ClientProductTable products={products} categories={categories} />
        </div>
      </div>
    </div>
  );
}
