"use client";

import { Coffee, Lock, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { handleLogin } from "./actions";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await handleLogin(username, password);
      if (result.success) {
        toast.success(`Chào mừng, ${result.name}!`);
        // Đăng nhập xong, chuyển hướng vào trang Admin Dashboard
        router.push("/admin/dashboard");
      } else {
        toast.error(result.error || "Đăng nhập thất bại");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F3EE] flex items-center justify-center p-4 selection:bg-elso-secondary selection:text-white">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-elso-primary p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            El Soñador System
          </h1>
          <p className="text-white/70 text-sm mt-2">
            Đăng nhập hệ thống vận hành
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elso-primary focus:border-elso-primary outline-none transition"
                  placeholder="Nhập mã nhân viên / admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elso-primary focus:border-elso-primary outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !username || !password}
              className="w-full bg-elso-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-elso-secondary transition disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-orange-900/20"
            >
              {isPending ? "Đang xác thực..." : "Đăng Nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
