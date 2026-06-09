"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { createEmployee } from "./actions";

export default function ClientUserForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createEmployee(formData);
      if (result.success) {
        toast.success("Đã tạo tài khoản nhân viên thành công!");
        // Reset form (Mẹo nhỏ dùng DOM)
        (document.getElementById("userForm") as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    });
  };

  return (
    <form id="userForm" action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Tên hiển thị (Tên thật)
        </label>
        <input
          type="text"
          name="fullName"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-elso-primary focus:ring-1 focus:ring-elso-primary"
          placeholder="VD: Nguyễn Văn A"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Tên đăng nhập (ID)
        </label>
        <input
          type="text"
          name="username"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-elso-primary focus:ring-1 focus:ring-elso-primary font-mono text-sm"
          placeholder="VD: nam_phucvu"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Mật khẩu cấp phát
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-elso-primary focus:ring-1 focus:ring-elso-primary"
          placeholder="••••••"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Cấp quyền (Vai trò)
        </label>
        <select
          name="role"
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-elso-primary focus:ring-1 focus:ring-elso-primary bg-white"
        >
          <option value="WAITER">Phục vụ (Waiter)</option>
          <option value="BARISTA">Pha chế (Barista)</option>
          <option value="CLEANER">Tạp vụ (Cleaner)</option>
          <option value="MANAGER">Trưởng ca (Manager)</option>
          <option value="ADMIN">Quản trị viên (Admin)</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-elso-primary text-white font-bold py-2 rounded-md hover:bg-elso-secondary transition disabled:bg-gray-400 mt-2"
      >
        {isPending ? "Đang khởi tạo..." : "Tạo Tài Khoản"}
      </button>
    </form>
  );
}
