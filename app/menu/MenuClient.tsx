"use client";

import { Coffee, Edit3, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { submitOrder } from "./actions";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
};
type Category = { id: string; name: string; products: Product[] };
type CartItem = { product: Product; quantity: number; note: string };

export default function MenuClient({
  categories,
  initialTable,
}: {
  categories: Category[];
  initialTable: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState(initialTable || "");
  const [generalNote, setGeneralNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phone, setPhone] = useState("");

  const updateCart = (product: Product, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0)
          return prev.filter((item) => item.product.id !== product.id);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item,
        );
      }
      if (delta > 0) return [...prev, { product, quantity: 1, note: "" }];
      return prev;
    });
  };

  const updateItemNote = (productId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, note } : item,
      ),
    );
  };

  // --- LOGIC TÍNH TOÁN GIÁ CẢ & VAT 8% ---
  const subTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  ); // Tiền nước gốc
  const vatAmount = Math.round(subTotal * 0.08); // Thuế VAT 8% (Làm tròn số)
  const totalAmountWithVat = subTotal + vatAmount; // Tổng số tiền cuối cùng phải trả
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0 || !tableNumber.trim()) {
      toast.error("Vui lòng chọn món và nhập số bàn!");
      return;
    }

    startTransition(async () => {
      // Truyền số tiền ĐÃ BAO GỒM VAT lên máy chủ để quầy Bar/Thu ngân nhận đúng số tiền
      const result = await submitOrder(
        cart,
        tableNumber,
        totalAmountWithVat,
        generalNote,
        phone,
      );

      if (result.success) {
        toast.success(
          "Đặt món thành công! Quầy bar đang chuẩn bị đồ cho bạn nhé.",
          { duration: 4000 },
        );
        setCart([]);
        setTableNumber(initialTable || "");
        setGeneralNote("");
        setPhone("");
        setIsCartOpen(false);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-elso-primary text-white p-6 md:p-10 text-center shadow-md relative">
        <Coffee className="w-10 h-10 mx-auto mb-2 opacity-80" />
        <h1 className="text-2xl md:text-3xl font-bold">El Soñador Menu</h1>
        <p className="text-sm md:text-base opacity-80 mt-1">
          Chọn món và chúng tôi sẽ mang đến tận bàn cho bạn
        </p>
        <p className="text-[11px] opacity-60 mt-1 italic">
          *Giá menu chưa bao gồm 8% thuế VAT
        </p>

        {initialTable && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 text-xs font-bold shadow-sm">
            📍 Vị trí: {initialTable}
          </div>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-10 mt-4">
        {categories.map(
          (category) =>
            category.products.length > 0 && (
              <div key={category.id}>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 border-b-2 border-elso-secondary inline-block pb-1">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.products.map((product) => {
                    const cartItem = cart.find(
                      (item) => item.product.id === product.id,
                    );
                    const quantity = cartItem?.quantity || 0;

                    return (
                      <div
                        key={product.id}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 transition hover:shadow-md h-full"
                      >
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm md:text-base">
                              {product.name}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-bold text-elso-primary">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product.price)}
                            </span>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                              <button
                                onClick={() => updateCart(product, -1)}
                                className="p-1 rounded-full bg-white shadow-sm text-gray-600 hover:text-red-500 transition"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-bold w-4 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateCart(product, 1)}
                                className="p-1 rounded-full bg-elso-primary text-white shadow-sm hover:bg-elso-secondary transition"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
        )}
      </div>

      {/* MODAL GIỎ HÀNG CHI TIẾT */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex justify-center items-end sm:items-center p-4 transition-opacity">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-elso-primary" /> Giỏ hàng
                của bạn
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="border border-gray-100 p-3 rounded-lg bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-elso-primary text-sm font-medium">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateCart(item.product, -1)}
                        className="p-1 rounded-full bg-white shadow-sm text-gray-600 hover:text-red-500 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCart(item.product, 1)}
                        className="p-1 rounded-full bg-elso-primary text-white shadow-sm hover:bg-elso-secondary transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="relative mt-2">
                    <Edit3 className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ghi chú (VD: Ít đá, không đường...)"
                      value={item.note}
                      onChange={(e) =>
                        updateItemNote(item.product.id, e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:ring-1 focus:ring-elso-primary outline-none transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* PHẦN TÍNH TOÁN CHI TIẾT HÓA ĐƠN TRONG MODAL */}
            <div className="p-4 border-t bg-gray-50 space-y-4">
              <div className="border-b border-gray-200 pb-3 space-y-1.5 text-sm font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính (Tiền nước gốc):</span>
                  <span className="text-gray-800 font-bold">
                    {subTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>Thuế giá trị gia tăng VAT (8%):</span>
                  <span>+{vatAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ghi chú chung cho đơn (Tùy chọn)"
                  value={generalNote}
                  onChange={(e) => setGeneralNote(e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-elso-primary"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại (Tích điểm VIP)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-1/2 px-4 py-2 border border-blue-300 bg-blue-50 text-blue-800 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400 font-bold"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Số bàn / Box *"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  disabled={!!initialTable}
                  className={`w-1/2 px-4 py-3 border-2 rounded-md text-sm outline-none font-bold ${!!initialTable ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed" : "border-elso-primary text-elso-primary placeholder-elso-primary/50"}`}
                />
                <button
                  onClick={handleCheckout}
                  disabled={!tableNumber.trim() || isPending}
                  className="w-1/2 bg-elso-primary text-white font-bold py-3 rounded-md hover:bg-elso-secondary disabled:bg-gray-400 transition text-base shadow-md"
                >
                  {isPending
                    ? "Đang gửi đơn..."
                    : `Thanh toán: ${totalAmountWithVat.toLocaleString("vi-VN")}đ`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BAR (THANH THANH TOÁN NHANH DƯỚI ĐÁY MÀN HÌNH) */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] z-50 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div
              className="flex items-center gap-4 w-full sm:w-auto pl-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
              onClick={() => setIsCartOpen(true)}
            >
              <div className="relative">
                <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-elso-primary" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  Đã gồm 8% VAT{" "}
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold scale-90">
                    Xem chi tiết bill
                  </span>
                </p>
                <p className="font-black text-xl md:text-2xl text-green-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmountWithVat)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Số bàn (VD: Box 01)"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                disabled={!!initialTable}
                className={`px-4 py-2 border rounded-md outline-none w-full sm:w-40 text-sm md:text-base font-bold ${!!initialTable ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed" : "border-gray-300 focus:ring-2 focus:ring-elso-secondary"}`}
              />
              <button
                onClick={handleCheckout}
                disabled={!tableNumber.trim() || isPending}
                className="bg-elso-primary text-white font-bold px-6 py-2 md:py-3 rounded-md hover:bg-elso-secondary disabled:bg-gray-300 transition shadow-md whitespace-nowrap"
              >
                Gửi Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
