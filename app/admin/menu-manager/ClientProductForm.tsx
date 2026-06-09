"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { createProduct } from "./actions";

export default function ClientProductForm({
  categories,
}: {
  categories: any[];
}) {
  const [isPending, startTransition] = useTransition();
  const [inputType, setInputType] = useState<"url" | "file">("url");

  // Hàm chuyển File ảnh thành chuỗi Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    startTransition(async () => {
      try {
        // Nếu chọn Upload File, ta sẽ chuyển file thành chuỗi Base64 rồi nhét lại vào formData
        if (inputType === "file") {
          const fileInput = formElement.querySelector(
            'input[type="file"]',
          ) as HTMLInputElement;
          const file = fileInput?.files?.[0];
          if (file) {
            if (file.size > 2 * 1024 * 1024) {
              toast.error("Ảnh quá nặng! Vui lòng chọn ảnh dưới 2MB.");
              return;
            }
            const base64Image = await fileToBase64(file);
            formData.set("image", base64Image); // Đè chuỗi Base64 vào biến image
          }
        }

        const result = await createProduct(formData);
        if (result.success) {
          toast.success("Thêm món mới thành công!");
          formElement.reset();
        } else {
          toast.error(result.error || "Thêm món thất bại");
        }
      } catch (err) {
        toast.error("Lỗi xử lý ảnh!");
      }
    });
  };

  return (
    <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên món
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
          placeholder="VD: Trà Đào Cam Sả"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá bán (VNĐ)
          </label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
            placeholder="VD: 45000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục
          </label>
          <select
            name="categoryId"
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
            Hình ảnh
          </label>
          <div className="text-xs bg-gray-100 p-1 rounded-md flex gap-1">
            <button
              type="button"
              onClick={() => setInputType("url")}
              className={`px-2 py-1 rounded-sm ${inputType === "url" ? "bg-white shadow text-elso-primary font-bold" : "text-gray-500"}`}
            >
              Dán Link
            </button>
            <button
              type="button"
              onClick={() => setInputType("file")}
              className={`px-2 py-1 rounded-sm ${inputType === "file" ? "bg-white shadow text-elso-primary font-bold" : "text-gray-500"}`}
            >
              Tải ảnh lên
            </button>
          </div>
        </div>

        {inputType === "url" ? (
          <input
            type="url"
            name="image"
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary text-sm"
            placeholder="https://..."
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-elso-primary/10 file:text-elso-primary hover:file:bg-elso-primary/20"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả ngắn
        </label>
        <textarea
          name="description"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
          placeholder="Thành phần, hương vị..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-elso-primary text-white font-bold py-3 rounded-md hover:bg-elso-secondary transition disabled:bg-gray-400 mt-2 shadow-lg"
      >
        {isPending ? "Đang xử lý..." : "+ Thêm Món Vào Menu"}
      </button>
    </form>
  );
}
