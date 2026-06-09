import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Kiểm tra xem hệ thống đã có Admin nào chưa (Tránh tạo trùng)
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Hệ thống đã có Admin, không thể tạo thêm qua đường dẫn này!",
        username: existingAdmin.username,
      });
    }

    // 2. Băm nát mật khẩu (Mã hóa 10 lớp bảo mật)
    const hashedPassword = await bcrypt.hash("elsonador2026", 10);

    // 3. Khởi tạo tài khoản Chủ quán
    const admin = await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword,
        fullName: "Chủ Quán El Soñador",
        role: "ADMIN",
        isActive: true,
      },
    });

    // 4. Ghi Log đầu tiên của hệ thống
    await prisma.systemLog.create({
      data: {
        action: "SYSTEM_INIT",
        description: "Khởi tạo tài khoản Super Admin thành công.",
        userId: admin.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "🎉 CHÚC MỪNG! ĐÃ TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!",
      credentials: {
        username: "admin",
        password: "elsonador2026",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Lỗi khởi tạo hệ thống" },
      { status: 500 },
    );
  }
}
