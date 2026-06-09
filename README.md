Markdown

# ☕🛌 El Soñador Coffee & Sleep Box

> Hệ thống Quản trị O2O (Online-to-Offline) toàn diện dành cho mô hình Cafe & Sleep Box 24/7 tại Đà Lạt.

**Code by GruGruDev** 🚀

---

## 🌟 Giới thiệu Dự án

El Soñador là một giải pháp Web Application Full-stack được thiết kế để giải quyết toàn bộ bài toán vận hành của một quán Cafe kết hợp Sleep Box. Dự án không chỉ là một Landing Page giới thiệu, mà còn tích hợp sâu các nghiệp vụ: Đặt phòng, Gọi món tại bàn, Màn hình Quầy Bar (KDS), Tích điểm thành viên (CRM) và Báo cáo Doanh thu (Dashboard).

## ✨ Tính năng Cốt lõi

1. **Trải nghiệm Khách hàng (Client-side)**
   - **Landing Page Chuẩn SEO:** Giao diện hiện đại, tối ưu UX/UI, tích hợp Schema Markup (JSON-LD) cho Local Business & FAQ.
   - **Hệ thống Booking:** Đặt Sleep Box theo các gói thời gian (combo qua đêm, 24h), quản lý tình trạng phòng.
   - **Smart Menu & Giỏ hàng:** Khách hàng xem menu, thêm ghi chú riêng cho từng món và chốt đơn trực tiếp tại bàn.

2. **Quản lý Vận hành (Staff & Admin)**
   - **Màn hình Quầy Bar (KDS):** Quản lý đơn hàng F&B theo thời gian thực (Real-time). Tích hợp âm thanh báo đơn "Ting ting" khi có khách đặt mới.
   - **Hệ thống CRM Ngầm:** Tự động tạo hồ sơ khách hàng và tích điểm dựa trên số điện thoại nhập lúc gọi món. Phân hạng thành viên (Đồng, Bạc, Vàng).
   - **Admin Dashboard:** Trực quan hóa dữ liệu tài chính với hệ thống biểu đồ (Recharts). Theo dõi cơ cấu doanh thu, tổng đơn hàng và Top 5 món Bán chạy nhất.

## 🛠️ Công nghệ Sử dụng (Tech Stack)

- **Framework:** Next.js (App Router), React
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Biểu đồ & UI Components:** Recharts, Lucide React, React Hot Toast
- **Deployment:** Vercel

---

## 🚀 Hướng dẫn Cài đặt & Chạy dự án (Local Development)

### Bước 1: Clone dự án

```bash
git clone [https://github.com/GruGruDev/elsonador-landing.git](https://github.com/GruGruDev/elsonador-landing.git)
cd elsonador-landing
Bước 2: Cài đặt thư viện
Bash
npm install
Bước 3: Cấu hình Môi trường
Tạo file .env ở thư mục gốc và thêm chuỗi kết nối Database Supabase của bạn:

Đoạn mã
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"
Bước 4: Khởi tạo Database & Dữ liệu mẫu (Seed)
Bash
npx prisma db push
npx prisma generate
npx prisma db seed
Bước 5: Chạy server
Bash
npm run dev
Mở trình duyệt và truy cập http://localhost:3000.

📂 Cấu trúc Thư mục Chính
/app/page.tsx - Landing Page chính.

/app/menu - Phân hệ Gọi món tại bàn.

/app/booking - Phân hệ Đặt chỗ Sleep Box.

/app/bar - Màn hình hiển thị cho Quầy pha chế (KDS).

/app/admin/dashboard - Trang thống kê doanh thu.

/app/admin/customers - Trang quản lý khách hàng (CRM).

/prisma - Chứa file thiết kế cơ sở dữ liệu (schema.prisma) và dữ liệu mẫu (seed.ts).

Phát triển với tất cả đam mê dành cho ngành F&B và Lập trình. Cảm ơn bạn đã ghé thăm!
```
