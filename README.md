# 🌙 El Soñador - Coffee & Sleep Box Management System

![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=flat&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5.14.0-1B222D?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=flat&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript)

Hệ thống quản lý vận hành toàn diện dành riêng cho mô hình kinh doanh **Cafe kết hợp Không gian làm việc & Sleep Box (El Soñador)**. Hệ thống bao gồm phân hệ Đặt chỗ trực tuyến, Gọi món tại bàn qua QR Code và Bảng điều khiển Quản trị (Admin Dashboard) tối ưu nghiệp vụ.

## 🚀 Tính năng nổi bật

### Dành cho Khách hàng (Client)
* 🛒 **Menu F&B thông minh:** Đặt món tại bàn qua mã QR, giỏ hàng tự động bóc tách và tính toán Thuế VAT 8%.
* 🛌 **Booking Sleep Box:** Đặt chỗ trực tuyến với các tùy chọn linh hoạt theo gói Combo (Gói uống nước 5h, Combo Qua đêm 12h, Combo 24h).
* 💳 **Thanh toán:** Tích hợp tạo mã VietQR tự động theo số tiền của Gói/Đơn hàng.

### Dành cho Quản lý & Nhân viên (Admin)
* 🗺️ **Sơ đồ Không gian (Table Manager):** Theo dõi trạng thái thực tế của Box/Bàn (Trống, Có khách, Đang dọn dẹp, Bảo trì sửa chữa) với đồng hồ tính giờ Live-Timer.
* 🍔 **Quản lý Menu:** Thêm/Sửa/Xóa đồ uống, dịch vụ. Tự động chuyển đổi ảnh tải lên thành Base64 hoặc dùng Link. Bật/Tắt trạng thái "Hết hàng" bằng 1 click.
* 👨‍🍳 **Quầy Bar (Order Manager):** Nhận thông báo đơn hàng theo thời gian thực (Real-time), duyệt đơn và hoàn thành món.
* 👥 **Quản lý CRM & Nhân viên:** Tự động tích điểm cho khách hàng qua số điện thoại, phân quyền hệ thống (Admin/Staff).
* 📝 **System Logs:** Ghi vết mọi hành động của nhân viên và khách hàng trên hệ thống để dễ dàng đối soát.

## 🛠 Công nghệ sử dụng

* **Framework:** Next.js (App Router, Turbopack)
* **Ngôn ngữ:** TypeScript
* **Cơ sở dữ liệu:** PostgreSQL (Lưu trữ trên Supabase)
* **ORM:** Prisma
* **Bảo mật:** JWT (Jose), Bcryptjs để mã hóa mật khẩu.
* **Giao diện:** Tailwind CSS, Lucide React, React Hot Toast.
* **Triển khai (Deployment):** Ubuntu Server, PM2, Nginx, Let's Encrypt (SSL).

## ⚙️ Cài đặt môi trường phát triển (Local)

Yêu cầu hệ thống: `Node.js >= 20`, `Git`.

**1. Clone dự án về máy**
```bash
git clone [https://github.com/GruGruDev/elsonador-landing.git](https://github.com/GruGruDev/elsonador-landing.git)
cd elsonador-landing
2. Cài đặt các thư viện (Dependencies)

Bash
npm install
3. Cấu hình biến môi trường
Tạo file .env ở thư mục gốc và cung cấp các thông số sau:

Đoạn mã
# Chuỗi kết nối đến PostgreSQL (VD: Supabase)
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[db_name]"

# Khóa bí mật để ký JWT Token (Cần tạo một chuỗi ngẫu nhiên, bảo mật)
SESSION_SECRET="chuoi-ky-tu-bi-mat-cua-ban"
4. Khởi tạo Cơ sở dữ liệu (Prisma)

Bash
npx prisma generate
npx prisma db push
5. Khởi động môi trường phát triển

Bash
npm run dev
Truy cập http://localhost:3000 để xem ứng dụng.

🔑 Khởi tạo tài khoản Admin đầu tiên
Hệ thống được thiết kế khóa biểu mẫu đăng ký tự do để bảo mật. Để tạo tài khoản Chủ Quán (Super Admin) lần đầu tiên, hãy chạy server và truy cập đường dẫn sau trên trình duyệt:

👉 http://localhost:3000/api/setup (Hoặc https://[ten-mien-cua-ban]/api/setup nếu đã lên live).

Hệ thống sẽ tự động khởi tạo tài khoản Admin mặc định và khóa API này lại.

🌍 Hướng dẫn Triển khai (Production VPS)
Dự án đã được tối ưu để chạy trên máy chủ VPS Ubuntu.

Bash
# 1. Build dự án
npm run build

# 2. Khởi chạy bằng PM2
pm2 start npm --name "elsonador" -- start
pm2 startup
pm2 save

# 3. Cấu hình Nginx Proxy Pass (Điều hướng cổng 80 vào cổng 3000)
# Xem chi tiết cấu hình tại thư mục cài đặt Nginx (/etc/nginx/sites-available)
👨‍💻 Tác giả
Phát triển bởi GruGruDev & Team El Soñador.
Dự án được thiết kế độc quyền cho mô hình vận hành thực tế của El Soñador.

Made with ❤️ & ☕ for El Soñador.
