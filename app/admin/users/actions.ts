"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// 1. Tạo tài khoản nhân viên mới
export async function createEmployee(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const role = formData.get("role") as string;

    // Kiểm tra xem tên đăng nhập đã trùng chưa
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser)
      return { success: false, error: "Tên đăng nhập đã tồn tại!" };

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
        role,
        isActive: true,
      },
    });

    revalidatePath("/admin/users"); // Làm mới trang
    return { success: true };
  } catch (error) {
    return { success: false, error: "Lỗi hệ thống khi tạo tài khoản" };
  }
}

// 2. Khóa / Mở khóa tài khoản (Khi nhân viên nghỉ việc)
export async function toggleEmployeeStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.user.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Không thể cập nhật trạng thái" };
  }
}
// 3. Xóa vĩnh viễn nhân viên
export async function deleteEmployee(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    // Nếu nhân viên đã có lịch sử hệ thống (Log), Database sẽ chặn không cho xóa để bảo vệ dữ liệu.
    return {
      success: false,
      error:
        "Không thể xóa nhân viên này vì họ đã có lịch sử hoạt động trên hệ thống. Vui lòng dùng chức năng 'Khóa thẻ'!",
    };
  }
}

// 4. Cập nhật thông tin nhân viên (Sửa)
export async function updateEmployee(id: string, formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    // Chỉ cập nhật những trường cơ bản (Tên, Quyền). Không cho phép sửa Tên đăng nhập để tránh lỗi hệ thống.
    const dataToUpdate: any = { fullName, role };

    // Nếu quản lý có gõ mật khẩu mới thì mới tiến hành đổi mật khẩu
    if (password && password.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Có lỗi xảy ra khi cập nhật thông tin!" };
  }
}
