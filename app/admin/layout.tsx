import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      {/* Thanh Menu bên trái */}
      <AdminSidebar />

      {/* Nội dung các trang sẽ hiển thị bên phải */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
