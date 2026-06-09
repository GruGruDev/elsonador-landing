"use client";

import { Download, Link as LinkIcon, Printer, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

export default function ClientQRGenerator({ tables }: { tables: any[] }) {
  const [origin, setOrigin] = useState("");
  // Mặc định chọn bàn đầu tiên hoặc tự gõ
  const [selectedTable, setSelectedTable] = useState(
    tables[0]?.name || "Box 01",
  );
  const [customTable, setCustomTable] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  // Lấy domain hiện tại (VD: localhost:3000 hoặc elsonador.vn) để QR luôn dẫn đúng web
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const activeTable = customTable.trim() !== "" ? customTable : selectedTable;
  const qrLink = `${origin}/menu?table=${encodeURIComponent(activeTable)}`;

  // Hàm xử lý Tải ảnh QR về máy
  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    // Đổi Canvas thành file ảnh PNG
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_ElSonador_${activeTable}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* BẢNG ĐIỀU KHIỂN */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <QrCode className="w-6 h-6 text-elso-primary" />
          <h2 className="font-bold text-gray-800 text-lg">Cấu Hình Mã QR</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn Bàn / Sleep Box có sẵn
          </label>
          <select
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setCustomTable("");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-elso-primary bg-white cursor-pointer"
          >
            {tables.map((table) => (
              <option key={table.id} value={table.name}>
                {table.name} ({table.type})
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">
            Hoặc tạo mã cho bàn mới
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gõ tên bàn tùy chỉnh (Tạo nhanh)
          </label>
          <input
            type="text"
            value={customTable}
            onChange={(e) => setCustomTable(e.target.value)}
            placeholder="VD: Bàn Ban Công 02"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-elso-primary"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
          <div className="flex items-center gap-2 font-bold mb-1">
            <LinkIcon className="w-4 h-4" /> Đường link nhúng trong QR:
          </div>
          <p className="break-all font-mono mt-2 bg-white px-3 py-2 rounded border border-blue-200">
            {qrLink}
          </p>
        </div>
      </div>

      {/* KHU VỰC PREVIEW (BẢN IN STANDEE) */}
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-gray-500 font-medium mb-4 flex items-center gap-2">
          <Printer className="w-4 h-4" /> Bản Xem Trước (Mô phỏng Standee)
        </h3>

        {/* Khung Standee */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center max-w-sm w-full relative overflow-hidden">
          {/* Header Standee */}
          <div className="bg-gray-900 absolute top-0 left-0 right-0 py-4 text-center">
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">
              EL SOÑADOR
            </h2>
          </div>

          <div className="mt-16 text-center space-y-2 mb-6">
            <h3 className="text-2xl font-black text-elso-primary">
              {activeTable}
            </h3>
            <p className="text-gray-500 text-sm uppercase tracking-wider">
              Quét mã để xem Menu & Gọi món
            </p>
          </div>

          {/* Vùng chứa mã QR */}
          <div
            ref={qrRef}
            className="bg-white p-4 rounded-xl shadow-inner border border-gray-100"
          >
            {/* Lõi tạo QR */}
            <QRCodeCanvas
              value={qrLink}
              size={220}
              level={"H"} // Mức độ sửa lỗi cao nhất, in ra quét vẫn nhạy
              includeMargin={true}
              fgColor={"#000000"} // Màu QR
              bgColor={"#ffffff"} // Màu nền
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
            <QrCode className="w-4 h-4" /> Hệ thống gọi món thông minh
          </div>
        </div>

        {/* Nút Tải Xuống */}
        <button
          onClick={downloadQR}
          className="mt-8 flex items-center gap-2 px-8 py-4 bg-elso-primary text-white font-bold rounded-full hover:bg-elso-secondary hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <Download className="w-5 h-5" />
          Tải Mã QR Về Máy (PNG)
        </button>
      </div>
    </div>
  );
}
