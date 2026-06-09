"use client";

import {
  AlertTriangle,
  Edit,
  PlusCircle,
  Search,
  Trash2,
  UserCog,
} from "lucide-react";
import { useState } from "react";

export default function ClientLogTable({ logs }: { logs: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  // Lọc log theo từ khóa và loại hành động
  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user?.fullName &&
        log.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchAction =
      filterAction === "ALL" || log.action.includes(filterAction);
    return matchSearch && matchAction;
  });

  // Gắn màu sắc và Icon cho từng loại hành động để dễ nhìn
  const getActionBadge = (action: string) => {
    if (action.includes("DELETE"))
      return (
        <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold w-max">
          <Trash2 className="w-3 h-3" /> XÓA DỮ LIỆU
        </span>
      );
    if (action.includes("UPDATE") || action.includes("EDIT"))
      return (
        <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs font-bold w-max">
          <Edit className="w-3 h-3" /> CẬP NHẬT
        </span>
      );
    if (action.includes("CREATE") || action.includes("ADD"))
      return (
        <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold w-max">
          <PlusCircle className="w-3 h-3" /> THÊM MỚI
        </span>
      );
    if (action.includes("LOGIN"))
      return (
        <span className="flex items-center gap-1 text-purple-600 bg-purple-100 px-2 py-1 rounded text-xs font-bold w-max">
          <UserCog className="w-3 h-3" /> ĐĂNG NHẬP
        </span>
      );

    return (
      <span className="flex items-center gap-1 text-gray-600 bg-gray-200 px-2 py-1 rounded text-xs font-bold w-max">
        <AlertTriangle className="w-3 h-3" /> {action}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Bộ lọc & Tìm kiếm */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo nội dung hoặc tên nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-800 text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {["ALL", "DELETE", "UPDATE", "CREATE"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterAction(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                filterAction === type
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {type === "ALL"
                ? "Tất cả"
                : type === "DELETE"
                  ? "Lịch sử Xóa"
                  : type === "UPDATE"
                    ? "Lịch sử Sửa"
                    : "Lịch sử Thêm"}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng Dữ liệu */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white border-b border-gray-100 text-gray-600 text-sm uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Nhân viên</th>
              <th className="px-6 py-4">Phân loại</th>
              <th className="px-6 py-4 min-w-[300px]">Chi tiết hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-400 font-medium"
                >
                  Không có nhật ký nào được ghi nhận.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    <div className="font-bold text-gray-800">
                      {new Date(log.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-xs">
                      {new Date(log.createdAt).toLocaleTimeString("vi-VN")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">
                      {log.user?.fullName || "Hệ thống"}
                    </div>
                    <div className="text-xs text-gray-400">
                      @{log.user?.username || "system"}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {log.description}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
