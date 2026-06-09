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

  const booking = await prisma.booking.findUnique({
    where: { bookingCode: code },
    include: { box: true },
  });

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F8F3EE] flex items-center justify-center text-red-500 font-bold text-xl">
        Không tìm thấy mã vé này! Vui lòng kiểm tra lại.
      </div>
    );
  }

  // --- CẤU HÌNH NGÂN HÀNG CỦA QUÁN ---
  const BANK_ID = "MB";
  const ACCOUNT_NO = "686856786";
  const ACCOUNT_NAME = "EL SONADOR CAFE";

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${booking.totalAmount}&addInfo=${booking.bookingCode}&accountName=${ACCOUNT_NAME}`;

  return (
    <main className="min-h-screen bg-[#F8F3EE] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 mt-8 mb-8">
        <div className="bg-elso-primary p-8 text-center text-white relative">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-green-400" />
          <h1 className="text-2xl font-black uppercase tracking-wider">
            Giữ Chỗ Thành Công!
          </h1>
          <p className="text-sm opacity-90 mt-2">
            Vui lòng thanh toán và đưa vé này cho lễ tân để nhận không gian
          </p>

          <div className="absolute -bottom-3 left-0 w-full flex justify-center space-x-2 overflow-hidden opacity-30">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-white rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="p-8 pb-6">
          <div className="flex items-center justify-center gap-2 text-elso-primary mb-8 bg-elso-primary/10 py-3 rounded-lg border border-elso-primary/20">
            <Ticket className="w-6 h-6" />
            <span className="font-mono text-3xl font-black tracking-widest">
              {booking.bookingCode}
            </span>
          </div>

          <div className="space-y-4 text-sm mb-6 border-b border-dashed border-gray-300 pb-6">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium">Khách hàng</span>
              <span className="font-bold text-gray-800">
                {booking.customerName}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium">Khu vực / Box</span>
              <span className="font-black text-elso-primary text-base">
                {booking.box.name}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium">
                Thời gian bắt đầu
              </span>
              <span className="font-bold text-gray-800">
                {booking.startTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - {booking.startTime.toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between pb-2 items-end mt-2">
              <span className="text-gray-500 font-bold uppercase tracking-wider">
                Tổng thanh toán
              </span>
              <span className="font-black text-green-600 text-2xl">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(booking.totalAmount)}
              </span>
            </div>
          </div>

          {/* KHU VỰC QUÉT MÃ QR */}
          <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-4 text-elso-primary font-bold">
              <QrCode className="w-5 h-5" />
              <span>Quét mã VietQR để thanh toán</span>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm inline-block mx-auto mb-3 border border-gray-100">
              <img
                src={qrUrl}
                alt="QR Code Thanh Toán"
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Hệ thống sẽ tự động điền số tiền{" "}
              <strong className="text-gray-700">
                {booking.totalAmount.toLocaleString("vi-VN")}đ
              </strong>{" "}
              và nội dung{" "}
              <strong className="text-gray-700">{booking.bookingCode}</strong>.
            </p>
          </div>

          <Link
            href="/"
            className="block w-full text-center bg-gray-100 text-gray-700 font-bold py-4 rounded-xl mt-6 hover:bg-gray-200 transition"
          >
            Trở về Trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
