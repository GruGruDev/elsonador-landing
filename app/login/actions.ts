"use server";

import { createSession } from "@/lib/auth";
import { createLog } from "@/lib/log"; // Import hàm log mới
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function handleLogin(username: string, password: string) {
  try {
    // 1. Tìm nhân viên trong Database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !user.isActive) {
      return { success: false, error: "Tài khoản không tồn tại hoặc bị khóa!" };
    }

    // 2. So sánh mật khẩu đã bị băm (Hash)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "Mật khẩu không chính xác!" };
    }

    // 3. Đúng mật khẩu -> Cấp "Thẻ từ" (Session)
    // PHẢI CẤP THẺ TỪ TRƯỚC ĐỂ HÀM LOG CÓ THỂ ĐỌC ĐƯỢC COOKIE
    await createSession(user.id, user.role, user.fullName);

    // 4. Ghi Log: Báo cáo là sếp/nhân viên vừa vào hệ thống
    // Hàm createLog giờ đây sẽ tự động bới Cookie ra để biết ai vừa đăng nhập
    await createLog(
      "LOGIN",
      `[${user.role}] ${user.fullName} đã đăng nhập hệ thống.`,
    );

    return { success: true, name: user.fullName };
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return { success: false, error: "Đã có lỗi hệ thống xảy ra" };
  }
}
