"use client";

import {
  AlertTriangle,
  Image as ImageIcon,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { deleteProduct, toggleProductStatus, updateProduct } from "./actions";

export default function ClientProductTable({
  products,
  categories,
}: {
  products: any[];
  categories: any[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // State quản lý Hộp thoại Xóa
  const [deletingProduct, setDeletingProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [inputType, setInputType] = useState<"url" | "file">("url");

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Hàm xử lý Xóa sau khi bấm "Đồng ý" trên Modal
  const executeDelete = () => {
    if (!deletingProduct) return;
    startTransition(async () => {
      const result = await deleteProduct(deletingProduct.id);
      if (result.success) {
        toast.success("Đã xóa món thành công!");
        setDeletingProduct(null); // Tắt modal
      } else {
        toast.error(result.error || "Không thể xóa món này!"); // <--- ĐÃ SỬA
        setDeletingProduct(null);
      }
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    startTransition(async () => {
      try {
        if (inputType === "file") {
          const fileInput = formElement.querySelector(
            'input[type="file"]',
          ) as HTMLInputElement;
          const file = fileInput?.files?.[0];
          if (file) {
            if (file.size > 2 * 1024 * 1024) {
              // ĐÃ SỬA: Tách toast và return ra 2 dòng để không vướng lỗi Type Check
              toast.error("Ảnh quá nặng! Chọn ảnh dưới 2MB.");
              return;
            }
            const base64Image = await fileToBase64(file);
            formData.set("image", base64Image);
          }
        }

        const result = await updateProduct(editingProduct.id, formData);
        if (result.success) {
          toast.success("Cập nhật thành công!");
          setEditingProduct(null);
        } else {
          toast.error(result.error || "Cập nhật thất bại");
        }
      } catch (err) {
        toast.error("Lỗi xử lý");
      }
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Sản Phẩm</th>
              <th className="px-6 py-4">Danh Mục</th>
              <th className="px-6 py-4">Giá Bán</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-50 transition ${!product.isAvailable ? "opacity-60" : ""}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {/* SỬA IMAGE THÀNH IMAGEURL */}
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="font-bold text-gray-800">
                      {product.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                  {product.category.name}
                </td>
                <td className="px-6 py-4 font-bold text-elso-primary">
                  {product.price.toLocaleString("vi-VN")}đ
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* NÚT ẨN/HIỆN */}
                    <button
                      onClick={() => {
                        startTransition(async () => {
                          const result = await toggleProductStatus(
                            product.id,
                            product.isAvailable,
                          );
                          if (result.success) {
                            toast.success(
                              product.isAvailable
                                ? "Đã báo hết hàng!"
                                : "Đã mở bán món này!",
                            );
                          } else {
                            toast.error(`Lỗi: ${result.error}`);
                          }
                        });
                      }}
                      disabled={isPending}
                      className={`p-2 rounded-md transition-colors ${
                        product.isAvailable
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-red-50 text-red-500 hover:bg-red-100"
                      } ${isPending ? "opacity-50 cursor-wait" : ""}`}
                      title={
                        product.isAvailable
                          ? "Đang Bán (Click để Ẩn)"
                          : "Đã Ẩn (Click để Bán)"
                      }
                    >
                      {product.isAvailable ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setInputType("url");
                      }}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      title="Sửa thông tin"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        setDeletingProduct({
                          id: product.id,
                          name: product.name,
                        })
                      }
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      title="Xóa món"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CẢNH BÁO XÓA SẢN PHẨM (GIỮ NGUYÊN) */}
      {deletingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Xóa Sản Phẩm?</h3>
              <p className="text-gray-500 text-sm">
                Bạn có chắc chắn muốn xóa vĩnh viễn món <br />{" "}
                <strong className="text-gray-800">
                  {deletingProduct.name}
                </strong>{" "}
                không? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setDeletingProduct(null)}
                disabled={isPending}
                className="flex-1 px-4 py-3 font-bold text-gray-500 hover:bg-gray-50 transition"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={executeDelete}
                disabled={isPending}
                className="flex-1 px-4 py-3 font-bold text-red-600 hover:bg-red-50 border-l border-gray-100 transition disabled:opacity-50"
              >
                {isPending ? "Đang xóa..." : "Xác Nhận Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SỬA MÓN (GIỮ NGUYÊN) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                Sửa Món: {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên món
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProduct.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá bán
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingProduct.price}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={editingProduct.categoryId}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Đổi hình ảnh mới{" "}
                    <span className="font-normal text-gray-400">
                      (Bỏ trống nếu giữ nguyên)
                    </span>
                  </label>
                  <div className="text-xs bg-gray-100 p-1 rounded-md flex gap-1">
                    <button
                      type="button"
                      onClick={() => setInputType("url")}
                      className={`px-2 py-1 rounded-sm ${inputType === "url" ? "bg-white shadow text-elso-primary font-bold" : "text-gray-500"}`}
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputType("file")}
                      className={`px-2 py-1 rounded-sm ${inputType === "file" ? "bg-white shadow text-elso-primary font-bold" : "text-gray-500"}`}
                    >
                      Upload
                    </button>
                  </div>
                </div>
                {inputType === "url" ? (
                  <input
                    type="url"
                    name="image"
                    // SỬA defaultValue ĐỂ LẤY ẢNH CŨ VÀO Ô INPUT
                    defaultValue={editingProduct.imageUrl || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary text-sm"
                    placeholder="https://..."
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-elso-primary/10 file:text-elso-primary"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả ngắn
                </label>
                <textarea
                  name="description"
                  defaultValue={editingProduct.description || ""}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
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
