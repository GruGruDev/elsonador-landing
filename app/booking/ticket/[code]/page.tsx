import prisma from "@/lib/prisma";
import { CheckCircle2, QrCode, Ticket } from "lucide-react";
import Link from "next/link";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = await params;
  const code = resolvedParams.code;

  // Lấy thông tin vé từ Database
  const booking = await prisma.booking.findUnique({
    where: { bookingCode: code },
    include: { box: true },
  });

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        Không tìm thấy mã vé này!
      </div>
    );
  }

  // --- CẤU HÌNH NGÂN HÀNG CỦA QUÁN ---
  // Bạn hãy thay đổi các thông tin này bằng tài khoản thật của quán nhé
  const BANK_ID = "MB"; // Mã ngân hàng (VD: MB, VCB, TCB, VIB...)
  const ACCOUNT_NO = "686856786"; // Số tài khoản
  const ACCOUNT_NAME = "EL SONADOR CAFE"; // Tên chủ tài khoản (viết không dấu)

  // Tạo link ảnh VietQR động
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${booking.totalAmount}&addInfo=${booking.bookingCode}&accountName=${ACCOUNT_NAME}`;

  return (
    <main className="min-h-screen bg-[#F8F3EE] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 mt-8 mb-8">
        {/* Phần đầu vé */}
        <div className="bg-elso-primary p-6 text-center text-white relative">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-2 text-green-400" />
          <h1 className="text-2xl font-bold">Đặt Chỗ Thành Công!</h1>
          <p className="text-sm opacity-90 mt-1">
            Vui lòng thanh toán và đưa vé cho lễ tân
          </p>

          {/* Rãnh xé vé */}
          <div className="absolute -bottom-3 left-0 w-full flex justify-center space-x-2 overflow-hidden opacity-30">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-[#F8F3EE] rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Nội dung vé */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-center gap-2 text-elso-secondary mb-6">
            <Ticket className="w-5 h-5" />
            <span className="font-mono text-2xl font-bold tracking-widest">
              {booking.bookingCode}
            </span>
          </div>

          <div className="space-y-4 text-sm mb-6 border-b pb-6">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Khách hàng</span>
              <span className="font-bold text-gray-800">
                {booking.customerName}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Khu vực</span>
              <span className="font-bold text-elso-primary">
                {booking.box.name}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Thời gian nhận</span>
              <span className="font-bold text-gray-800">
                {booking.startTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {booking.startTime.toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-gray-500">Tổng thanh toán</span>
              <span className="font-bold text-green-600 text-lg">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(booking.totalAmount)}
              </span>
            </div>
          </div>

          {/* KHU VỰC QUÉT MÃ QR */}
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-3 text-elso-primary font-bold">
              <QrCode className="w-5 h-5" />
              <span>Quét mã để thanh toán</span>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm inline-block mx-auto mb-2">
              {/* Sử dụng thẻ img thay vì next/image vì đây là external URL động */}
              <img
                src={qrUrl}
                alt="QR Code Thanh Toán"
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-xs text-gray-500">
              Hệ thống sẽ tự động điền số tiền và nội dung.
            </p>
          </div>

          <Link
            href="/"
            className="block w-full text-center bg-gray-100 text-gray-700 font-bold py-4 rounded-md mt-6 hover:bg-gray-200 transition"
          >
            Trở về Trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
