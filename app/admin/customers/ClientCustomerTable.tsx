"use client";

import { Award, Gift, Pencil, Phone, Search, X } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { updateCustomer } from "./actions";

export default function ClientCustomerTable({
  customers,
}: {
  customers: any[];
}) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  // Lọc tìm kiếm
  const filteredCustomers = customers.filter(
    (c) =>
      c.phone.includes(searchTerm) ||
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateCustomer(formData);
      if (result.success) {
        toast.success("Cập nhật thành công!");
        setEditingCustomer(null);
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Thanh tìm kiếm */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm số điện thoại hoặc tên khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Tên Khách Hàng</th>
                <th className="px-6 py-4">Số Điện Thoại</th>
                <th className="px-6 py-4">Điểm Tích Lũy</th>
                <th className="px-6 py-4">Hạng Thành Viên</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Không tìm thấy dữ liệu khách hàng.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-gray-800">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs shrink-0">
                          {customer.name?.charAt(0) || "K"}
                        </div>
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 font-mono">
                        <Phone className="w-4 h-4 text-gray-400" />{" "}
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600 text-lg">
                      {customer.points}
                    </td>
                    <td className="px-6 py-4">
                      {customer.points >= 100 ? (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                          <Award className="w-4 h-4" /> VÀNG (VIP)
                        </span>
                      ) : customer.points >= 50 ? (
                        <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                          <Award className="w-4 h-4" /> BẠC
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                          <Award className="w-4 h-4" /> ĐỒNG
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="Sửa thông tin / Cộng điểm"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CẬP NHẬT THÔNG TIN */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                Sửa thông tin khách
              </h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <input type="hidden" name="id" value={editingCustomer.id} />

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Số điện thoại (ID Định danh)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingCustomer.phone}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCustomer.name || ""}
                  placeholder="VD: Anh Huy, Chị Linh..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm tích lũy hiện tại
                </label>
                <div className="relative">
                  <Gift className="w-5 h-5 absolute left-3 top-2.5 text-green-600" />
                  <input
                    type="number"
                    name="points"
                    defaultValue={editingCustomer.points}
                    min="0"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500 font-bold text-green-600 text-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 italic">
                  *Có thể sửa số này để cộng/trừ điểm thủ công.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
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
