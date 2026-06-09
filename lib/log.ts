import prisma from "@/lib/prisma";
import { jwtVerify } from "jose"; // Sử dụng thẳng thư viện jose để giải mã
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET || "bi-mat-cua-el-sonador-khong-ai-biet",
);

export async function createLog(action: string, description: string) {
  try {
    let userId: string | null = null;

    // 1. THỬ QUÉT XEM CÓ PHẢI NHÂN VIÊN ĐANG LÀM KHÔNG ( STAFF MODE )
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("session")?.value;
      if (sessionCookie) {
        // Tự giải mã token trực tiếp không cần nhờ auth.ts
        const { payload } = await jwtVerify(sessionCookie, secretKey, {
          algorithms: ["HS256"],
        });

        if (payload && payload.userId) {
          userId = payload.userId as string;
        }
      }
    } catch (cookieError) {
      // Bỏ qua lỗi cookie để tiếp tục xuống bước 2
    }

    // 2. NẾU KHÔNG CÓ COOKIE HOẶC LỖI ( GUEST MODE - Khách tự làm )
    if (!userId) {
      let systemUser = await prisma.user.findFirst({
        where: { username: "system_admin" },
      });

      if (!systemUser) {
        systemUser = await prisma.user.create({
          data: {
            username: "system_admin",
            password: "system_password_secured",
            fullName: "Hệ Thống Tự Động",
            role: "ADMIN",
          },
        });
      }
      userId = systemUser.id;
    }

    // 3. GHI LOG VÀO DATABASE
    await prisma.systemLog.create({
      data: {
        action,
        description,
        userId,
      },
    });
  } catch (error) {
    console.error("🚨 Thất bại khi ghi nhận vết hệ thống (Log):", error);
  }
}
