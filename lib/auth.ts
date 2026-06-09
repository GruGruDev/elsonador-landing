import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Khóa bí mật dùng để đóng dấu giáp lai cho "Thẻ từ".
const secretKey = process.env.JWT_SECRET || "elsonador-super-secret-key-2026";
const key = new TextEncoder().encode(secretKey);

// Hàm 1: Tạo thẻ (Khi nhân viên gõ đúng mật khẩu)
export async function createSession(
  userId: string,
  role: string,
  fullName: string,
) {
  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000); // Thẻ có hạn 12 tiếng

  const session = await new SignJWT({ userId, role, fullName })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key);

  // SỬA Ở ĐÂY: Thêm await cookies()
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    expires,
    httpOnly: true, // Bảo mật: Trình duyệt không thể tự ăn cắp cookie này
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

// Hàm 2: Quét thẻ (Lấy thông tin nhân viên đang đăng nhập)
export async function getSession() {
  // SỬA Ở ĐÂY: Thêm await cookies()
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as { userId: string; role: string; fullName: string };
  } catch (error) {
    return null; // Thẻ giả hoặc hết hạn
  }
}

// Hàm 3: Thu lại thẻ (Đăng xuất)
export async function logout() {
  // SỬA Ở ĐÂY: Thêm await cookies()
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}
