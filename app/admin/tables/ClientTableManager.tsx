"use client";

import {
  BedDouble,
  CheckCircle2,
  Clock,
  Pencil,
  Play,
  Plus,
  Sparkles,
  Trash2,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  checkoutSession,
  createBox,
  deleteBox,
  finishCleaning,
  startSession,
  toggleMaintenance,
  updateBox,
} from "./actions";

// Đồng hồ tính giờ
const LiveTimer = ({ startTime }: { startTime: Date }) => {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.floor((now - start) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setElapsed(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return <span className="font-mono font-bold">{elapsed}</span>;
};

export default function ClientTableManager({ boxes }: { boxes: any[] }) {
  const [isPending, startTransition] = useTransition();

  // Các state quản lý Box (Mở/Đóng)
  const [openingBox, setOpeningBox] = useState<any>(null);
  const [checkoutBox, setCheckoutBox] = useState<any>(null);

  // Các state quản lý CRUD (Thêm/Sửa/Xóa)
  const [isAddingBox, setIsAddingBox] = useState(false);
  const [editingBox, setEditingBox] = useState<any>(null);

  // --- HÀM NGHIỆP VỤ VẬN HÀNH ---
  const handleStartSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await startSession(formData);
      if (res.success) {
        toast.success("Mở Box thành công!");
        setOpeningBox(null);
      } else toast.error(res.error || "Có lỗi xảy ra");
    });
  };

  const handleCheckout = (bookingId: string, boxId: string) => {
    startTransition(async () => {
      const res = await checkoutSession(bookingId, boxId);
      if (res.success) {
        toast.success("Đã thanh toán xong!");
        setCheckoutBox(null);
      } else toast.error(res.error || "Có lỗi xảy ra");
    });
  };

  const handleCleaned = (boxId: string) => {
    startTransition(async () => {
      const res = await finishCleaning(boxId);
      if (res.success) toast.success("Sẵn sàng đón khách mới!");
      else toast.error(res.error || "Có lỗi xảy ra");
    });
  };

  // --- HÀM BẢO TRÌ ---
  const handleToggleMaintenance = (boxId: string, currentStatus: string) => {
    startTransition(async () => {
      const res = await toggleMaintenance(boxId, currentStatus);
      if (res.success) {
        toast.success(
          currentStatus === "MAINTENANCE"
            ? "Đã mở lại Box!"
            : "Đã khóa Box để bảo trì!",
        );
      } else toast.error(res.error || "Có lỗi xảy ra");
    });
  };

  // --- HÀM QUẢN TRỊ BOX (CRUD) ---
  const handleAddBox = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createBox(formData);
      if (res.success) {
        toast.success("Đã thêm Box mới!");
        setIsAddingBox(false);
      } else toast.error(res.error || "Có lỗi xảy ra");
    });
  };

  const handleUpdateBox = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateBox(formData);
      if (res.success) {
        toast.success("Cập nhật thành công!");
        setEditingBox(null);
      } else toast.error(res.error || "Có lỗi xảy ra");
    });
  };

  const handleDeleteBox = (boxId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa Box này?")) {
      startTransition(async () => {
        const res = await deleteBox(boxId);
        if (res.success) {
          toast.success("Đã xóa Box!");
          setEditingBox(null);
        } else toast.error(res.error || "Có lỗi xảy ra");
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* NÚT THÊM BOX MỚI (Luôn nằm đầu tiên) */}
        <div
          onClick={() => setIsAddingBox(true)}
          className="rounded-2xl p-5 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-elso-primary/5 hover:border-elso-primary hover:text-elso-primary transition text-gray-400 h-48 group"
        >
          <div className="bg-gray-100 group-hover:bg-elso-primary/10 p-3 rounded-full mb-2 transition">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold">Thêm Bàn / Box</span>
        </div>

        {/* DANH SÁCH CÁC BOX HIỆN CÓ */}
        {boxes.map((box) => {
          const activeBooking = box.bookings?.[0];

          return (
            <div
              key={box.id}
              className={`relative group rounded-2xl p-5 border-2 shadow-sm transition-all flex flex-col h-48 cursor-pointer hover:-translate-y-1 hover:shadow-md
                ${
                  box.status === "AVAILABLE"
                    ? "bg-white border-green-200 hover:border-green-400"
                    : box.status === "OCCUPIED"
                      ? "bg-red-50 border-red-300"
                      : box.status === "MAINTENANCE"
                        ? "bg-gray-100 border-gray-300 opacity-70"
                        : "bg-yellow-50 border-yellow-300"
                }`}
              onClick={() => {
                if (box.status === "AVAILABLE") setOpeningBox(box);
                else if (box.status === "OCCUPIED")
                  setCheckoutBox({ box, booking: activeBooking });
                else if (box.status === "CLEANING") handleCleaned(box.id);
                else if (box.status === "MAINTENANCE") {
                  if (
                    confirm("Xác nhận đã sửa chữa xong và đưa vào sử dụng lại?")
                  ) {
                    handleToggleMaintenance(box.id, box.status);
                  }
                }
              }}
            >
              {/* Nút Edit */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingBox(box);
                }}
                className="absolute top-2 left-2 p-1.5 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 text-gray-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition z-10"
                title="Sửa thông tin Box"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Nút Bảo trì (Kế bên nút sửa) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMaintenance(box.id, box.status);
                }}
                className="absolute top-2 left-10 p-1.5 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 text-gray-500 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition z-10"
                title={
                  box.status === "MAINTENANCE"
                    ? "Mở lại Box"
                    : "Tạm khóa Bảo trì"
                }
              >
                <Wrench className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-start mb-auto pl-12">
                <div>
                  <h3
                    className={`font-black text-xl ${box.status === "MAINTENANCE" ? "text-gray-500 line-through" : "text-gray-800"}`}
                  >
                    {box.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {box.type === "SINGLE_BOX"
                      ? "Box Đơn"
                      : box.type === "DOUBLE_BOX"
                        ? "Box Đôi"
                        : "Bàn Mở"}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg ${box.status === "AVAILABLE" ? "bg-green-100 text-green-600" : box.status === "OCCUPIED" ? "bg-red-200 text-red-600 animate-pulse" : box.status === "MAINTENANCE" ? "bg-gray-200 text-gray-500" : "bg-yellow-200 text-yellow-700"}`}
                >
                  {box.status === "AVAILABLE" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : box.status === "OCCUPIED" ? (
                    <Clock className="w-5 h-5" />
                  ) : box.status === "MAINTENANCE" ? (
                    <Wrench className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-black/5">
                {box.status === "AVAILABLE" ? (
                  <div className="text-green-600 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Sẵn sàng
                  </div>
                ) : box.status === "OCCUPIED" ? (
                  <div className="space-y-1">
                    <div className="text-red-600 font-bold text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />{" "}
                      {activeBooking?.customerName || "Khách"}
                    </div>
                    <div className="text-red-500 text-xs flex items-center justify-between">
                      <span>Đang dùng:</span>
                      {activeBooking?.startTime && (
                        <LiveTimer startTime={activeBooking.startTime} />
                      )}
                    </div>
                  </div>
                ) : box.status === "MAINTENANCE" ? (
                  <div className="text-gray-500 font-bold text-sm flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> Đang sửa chữa
                  </div>
                ) : (
                  <div className="text-yellow-700 font-bold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Bấm để dọn xong
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          MODAL QUẢN TRỊ (CRUD): THÊM MỚI BOX
      ========================================= */}
      {isAddingBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                Thêm Bàn / Box Mới
              </h3>
              <button
                onClick={() => setIsAddingBox(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddBox} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Bàn / Box
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="VD: Box 01, Bàn Cửa Sổ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại Box
                  </label>
                  <select
                    name="type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary bg-white"
                  >
                    <option value="SINGLE_BOX">Box Đơn</option>
                    <option value="DOUBLE_BOX">Box Đôi</option>
                    <option value="WORKSPACE">Bàn Làm Việc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá niêm yết (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={40000}
                    step={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-elso-primary text-white font-bold py-3 rounded-lg hover:bg-elso-secondary transition mt-4"
              >
                {isPending ? "Đang lưu..." : "Xác Nhận Thêm"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL QUẢN TRỊ (CRUD): SỬA / XÓA BOX
      ========================================= */}
      {editingBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-500" /> Sửa Thông Tin Box
              </h3>
              <button
                onClick={() => setEditingBox(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateBox} className="p-5 space-y-4">
              <input type="hidden" name="id" value={editingBox.id} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Bàn / Box
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingBox.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại Box
                  </label>
                  <select
                    name="type"
                    defaultValue={editingBox.type}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary bg-white"
                  >
                    <option value="SINGLE_BOX">Box Đơn</option>
                    <option value="DOUBLE_BOX">Box Đôi</option>
                    <option value="WORKSPACE">Bàn Làm Việc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá niêm yết (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingBox.price}
                    step={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-elso-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t mt-6 border-gray-100">
                <button
                  type="button"
                  onClick={() => handleDeleteBox(editingBox.id)}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-elso-primary text-white font-bold py-3 rounded-lg hover:bg-elso-secondary transition"
                >
                  {isPending ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL VẬN HÀNH: NHẬN KHÁCH / MỞ BOX
      ========================================= */}
      {openingBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Play className="w-5 h-5 text-green-500" /> Mở Box:{" "}
                {openingBox.name}
              </h3>
              <button
                onClick={() => setOpeningBox(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartSession} className="p-5 space-y-4">
              <input type="hidden" name="boxId" value={openingBox.id} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Tên khách
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Khách lẻ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Số ĐT
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Để tích điểm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* MENU CHỌN GÓI DỊCH VỤ THÔNG MINH */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-black text-green-800 mb-2 uppercase tracking-wide">
                  Chọn gói dịch vụ
                </label>
                <select
                  name="packageType"
                  required
                  className="w-full px-3 py-3 border border-green-300 rounded-md outline-none focus:ring-2 focus:ring-green-600 bg-white font-bold text-gray-800 shadow-sm"
                >
                  <option value="WATER_ONLY">
                    ☕ Chỉ mua Nước (0đ Box - Ngồi 5 tiếng)
                  </option>
                  <option value="NIGHT_1">
                    🌙 Combo Đêm 1 Người (130.000đ - Gồm nước & mền)
                  </option>
                  <option value="NIGHT_2">
                    🌙 Combo Đêm 2 Người (160.000đ - Gồm nước & mền)
                  </option>
                  <option value="DAY_24H">
                    ☀️ Combo 24H (200.000đ - Gồm nước & mền)
                  </option>
                </select>
                <p className="text-xs text-green-700 mt-2 font-medium italic">
                  *Gói đêm tự động tính giờ đến 12h trưa hôm sau.
                </p>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition shadow-md mt-4 text-lg"
              >
                {isPending ? "Đang xử lý..." : "Nhận Khách & Bắt Đầu Tính Giờ"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL VẬN HÀNH: THANH TOÁN TRẢ BOX
      ========================================= */}
      {checkoutBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden zoom-in-95 duration-200">
            <div className="p-6 text-center bg-gray-50 border-b border-gray-100 relative">
              <button
                onClick={() => setCheckoutBox(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <BedDouble className="w-12 h-12 text-elso-primary mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-gray-800">
                {checkoutBox.box.name}
              </h3>
              <p className="text-sm text-gray-500">Thanh toán & Trả Box</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Khách hàng:</span>
                <span className="font-bold text-gray-800">
                  {checkoutBox.booking?.customerName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giờ vào:</span>
                <span className="font-bold text-gray-800">
                  {checkoutBox.booking?.startTime
                    ? new Date(
                        checkoutBox.booking.startTime,
                      ).toLocaleTimeString("vi-VN")
                    : "--"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mã Booking:</span>
                <span className="font-mono font-bold text-gray-600">
                  {checkoutBox.booking?.bookingCode}
                </span>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 my-4 pt-4 flex justify-between items-end">
                <span className="text-gray-800 font-bold">
                  Tổng thanh toán:
                </span>
                <span className="text-3xl font-black text-red-500">
                  {checkoutBox.booking?.totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button
                onClick={() =>
                  handleCheckout(checkoutBox.booking.id, checkoutBox.box.id)
                }
                disabled={isPending}
                className="w-full bg-elso-primary text-white font-bold py-4 rounded-xl hover:bg-elso-secondary disabled:bg-gray-400 transition shadow-lg mt-4 text-lg"
              >
                {isPending ? "Đang xử lý..." : "Xác Nhận Đã Thu Tiền"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
