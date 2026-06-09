import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Chìa khóa giải mã (Phải giống hệt trong file lib/auth.ts)
const secretKey = process.env.JWT_SECRET || "elsonador-super-secret-key-2026";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Phân loại khu vực
  const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/bar");
  const isAuthRoute = path === "/login";

  // 2. Yêu cầu khách xuất trình Thẻ từ (Session Cookie)
  const session = request.cookies.get("session")?.value;
  let payload = null;

  // 3. Máy quét Thẻ từ
  if (session) {
    try {
      const verified = await jwtVerify(session, key, { algorithms: ["HS256"] });
      payload = verified.payload; // Lấy thông tin chức vụ, tên nhân viên...
    } catch (err) {
      // Thẻ giả hoặc thẻ đã hết hạn -> payload vẫn là null
    }
  }

  // LUẬT SỐ 1: Chưa đăng nhập mà đòi vào khu vực cấm -> Đuổi ra cổng /login
  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // LUẬT SỐ 2: Đã đăng nhập rồi mà cứ đòi ra cổng /login -> Đẩy thẳng vào Dashboard
  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Mọi thứ hợp lệ, mời đi tiếp!
  return NextResponse.next();
}

// Chỉ điểm cho Cảnh vệ biết phải đứng canh ở những ngã tư nào
export const config = {
  matcher: ["/admin/:path*", "/bar/:path*", "/login"],
};
