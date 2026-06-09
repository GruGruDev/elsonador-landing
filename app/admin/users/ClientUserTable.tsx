"use client";

import {
  BadgeCheck,
  Lock,
  Pencil,
  ShieldCheck,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  deleteEmployee,
  toggleEmployeeStatus,
  updateEmployee,
} from "./actions";

export default function ClientUserTable({ users }: { users: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingUser, setEditingUser] = useState<any>(null); // State chứa thông tin nhân viên đang bấm sửa

  // Dịch quyền hạn
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <ShieldCheck className="w-3 h-3" /> QUẢN TRỊ VIÊN
          </span>
        );
      case "MANAGER":
        return (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <BadgeCheck className="w-3 h-3" /> TRƯỞNG CA
          </span>
        );
      case "BARISTA":
        return (
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold w-max">
            PHA CHẾ
          </span>
        );
      case "WAITER":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold w-max">
            PHỤC VỤ
          </span>
        );
      case "CLEANER":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold w-max">
            TẠP VỤ
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold w-max">
            {role}
          </span>
        );
    }
  };

  // Xử lý Xóa
  const handleDelete = (id: string, name: string) => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa vĩnh viễn nhân viên ${name}? Hành động này không thể hoàn tác!`,
      )
    ) {
      startTransition(async () => {
        const result = await deleteEmployee(id);
        if (result.success) toast.success("Đã xóa nhân viên");
        else toast.error(result.error || "Lỗi cập nhật nhân viên!");
      });
    }
  };

  // Xử lý Form Sửa
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateEmployee(editingUser.id, formData);
      if (result.success) {
        toast.success("Cập nhật thành công!");
        setEditingUser(null); // Tắt Modal
      } else {
        toast.error(result.error || "Lỗi cập nhật nhân viên!");
      }
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Tên Nhân Viên</th>
              <th className="px-6 py-4">Tài khoản</th>
              <th className="px-6 py-4">Chức vụ</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 transition ${!user.isActive ? "opacity-50" : ""}`}
              >
                <td className="px-6 py-4 font-bold text-gray-800">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                  {user.username}
                </td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* KIỂM TRA: Nếu là Root Admin thì chỉ cho phép Sửa (Đổi mật khẩu) */}
                    {user.username === "admin" ? (
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 italic mr-2">
                          Tài khoản Root
                        </span>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="Đổi mật khẩu"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </span>
                    ) : (
                      /* Nếu là nhân viên bình thường thì hiện ĐẦY ĐỦ 3 NÚT */
                      <>
                        {/* Nút Khóa / Mở khóa */}
                        <button
                          onClick={() =>
                            startTransition(() => {
                              toggleEmployeeStatus(user.id, user.isActive);
                            })
                          }
                          className={`p-2 rounded-md transition-colors ${user.isActive ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                          title={user.isActive ? "Khóa tài khoản" : "Mở khóa"}
                        >
                          {user.isActive ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>

                        {/* Nút Sửa (Bật Modal) */}
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="Sửa thông tin"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Nút Xóa */}
                        <button
                          onClick={() => handleDelete(user.id, user.fullName)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HỘP THOẠI MODAL - Chỉ hiện khi có editingUser */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                Sửa Thông Tin Nhân Viên
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập (Không thể sửa)
                </label>
                <input
                  type="text"
                  value={editingUser.username}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={editingUser.fullName}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cấp quyền (Vai trò)
                </label>
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                >
                  <option value="WAITER">Phục vụ (Waiter)</option>
                  <option value="BARISTA">Pha chế (Barista)</option>
                  <option value="CLEANER">Tạp vụ (Cleaner)</option>
                  <option value="MANAGER">Trưởng ca (Manager)</option>
                  <option value="ADMIN">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đổi mật khẩu mới{" "}
                  <span className="font-normal text-gray-400">
                    (Bỏ trống nếu không muốn đổi)
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-elso-primary text-white font-bold rounded-md hover:bg-elso-secondary disabled:bg-gray-400"
                >
                  {isPending ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
