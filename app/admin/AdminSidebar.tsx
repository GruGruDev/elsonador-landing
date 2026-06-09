"use client";

import {
  BedDouble,
  Coffee,
  History,
  LayoutDashboard,
  LogOut,
  QrCode,
  ShieldAlert,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { performLogout } from "./actions";

const menuItems = [
  { name: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Khách hàng CRM", href: "/admin/customers", icon: Users },
  { name: "Quản lý Nhân sự", href: "/admin/users", icon: UserCog }, // Dòng mới thêm
  // Các menu dưới đây chúng ta sẽ làm ở các bước tiếp theo
  { name: "Quản lý Menu", href: "/admin/menu-manager", icon: Coffee },
  { name: "Quản lý Bàn/Box", href: "/admin/tables", icon: BedDouble },
  { name: "Mã QR Tại Bàn", href: "/admin/qr-builder", icon: QrCode },
  { name: "Lịch sử Order", href: "/admin/orders", icon: History },
  { name: "Nhật ký hệ thống", href: "/admin/logs", icon: ShieldAlert },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      performLogout();
    });
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col hidden md:flex h-full border-r border-gray-800 shrink-0">
      {/* Logo Vùng */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">
          El Soñador <span className="text-elso-primary">Pro</span>
        </h2>
      </div>

      {/* Các nút Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-elso-primary/10 text-elso-primary font-bold"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "text-elso-primary" : "text-gray-400"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Nút Đăng xuất ở cuối cùng */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          {isPending ? "Đang thoát..." : "Đăng xuất"}
        </button>
      </div>
    </aside>
  );
}
