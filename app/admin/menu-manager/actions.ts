"use server";

import { createLog } from "@/lib/log";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Thêm món nước / dịch vụ mới
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseInt(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const imageUrl =
      (formData.get("image") as string) ||
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400";

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        description,
        imageUrl,
        isAvailable: true,
      },
    });

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "CREATE_MENU",
      `Thêm món mới thành công: "${product.name}" | Giá bán: ${product.price.toLocaleString("vi-VN")}đ | Thuộc danh mục ID: ${product.categoryId}`,
    );

    revalidatePath("/admin/menu-manager");
    revalidatePath("/menu");
    return { success: true };
  } catch (error: any) {
    console.error("🚨 LỖI THÊM MÓN:", error);
    return { success: false, error: "Có lỗi xảy ra khi thêm món!" };
  }
}

// 2. Tạm ẩn / Hiện món (Bật/Tắt trạng thái kinh doanh)
export async function toggleProductStatus(id: string, currentStatus: boolean) {
  try {
    const newStatus = currentStatus === true ? false : true;

    const product = await prisma.product.update({
      where: { id: id },
      data: { isAvailable: newStatus },
    });

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "UPDATE_MENU",
      `Thay đổi trạng thái món "${product.name}": Chuyển từ [${currentStatus ? "ĐANG BÁN" : "HẾT HÀNG"}] thành [${product.isAvailable ? "ĐANG BÁN" : "HẾT HÀNG"}]`,
    );

    revalidatePath("/admin/menu-manager");
    revalidatePath("/menu");
    return { success: true };
  } catch (error: any) {
    console.error("🚨 LỖI ĐỔI TRẠNG THÁI:", error);
    return { success: false, error: error.message || "Lỗi cập nhật Database" };
  }
}

// 3. Xóa món hoàn toàn khỏi Database
export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.delete({
      where: { id },
    });

    // 📸 GHI LOG CHI TIẾT
    await createLog(
      "DELETE_MENU",
      `Đã xóa vĩnh viễn món "${product.name}" (Mã ID: ${product.id}) khỏi cơ sở dữ liệu thực đơn`,
    );

    revalidatePath("/admin/menu-manager");
    revalidatePath("/menu");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        "Không thể xóa món này vì nó đã tồn tại trong lịch sử đơn hàng. Hãy dùng chức năng 'Hết Hàng' để ẩn đi!",
    };
  }
}

// 4. Cập nhật thông tin món
export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseInt(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;

    const oldProduct = await prisma.product.findUnique({ where: { id } });

    const dataToUpdate: any = { name, price, categoryId, description };
    if (image && image.trim() !== "") {
      dataToUpdate.imageUrl = image;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    // 📸 GHI LOG CHI TIẾT (So sánh cả biến động giá nếu có)
    let logMsg = `Cập nhật thông tin món "${updatedProduct.name}" thành công.`;
    if (oldProduct && oldProduct.price !== updatedProduct.price) {
      logMsg += ` Thay đổi biểu giá từ: ${oldProduct.price.toLocaleString("vi-VN")}đ -> ${updatedProduct.price.toLocaleString("vi-VN")}đ`;
    }

    await createLog("UPDATE_MENU", logMsg);

    revalidatePath("/admin/menu-manager");
    revalidatePath("/menu");
    return { success: true };
  } catch (error: any) {
    console.error("🚨 LỖI CẬP NHẬT MÓN:", error);
    return { success: false, error: "Không thể cập nhật món này!" };
  }
}
