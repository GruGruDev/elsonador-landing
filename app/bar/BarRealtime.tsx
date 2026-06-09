"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export default function BarRealtime({
  currentOrderIds,
}: {
  currentOrderIds: string[];
}) {
  const router = useRouter();
  const prevOrderIds = useRef(currentOrderIds);

  useEffect(() => {
    // Nếu có ID đơn hàng mới xuất hiện mà trước đó chưa có -> Có đơn mới!
    const hasNewOrder = currentOrderIds.some(
      (id) => !prevOrderIds.current.includes(id),
    );

    if (hasNewOrder) {
      // 1. Phát âm thanh Ting Ting
      const audio = new Audio(
        "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=ding-idea-40142.mp3",
      );
      audio.play().catch((e) => console.log("Trình duyệt chặn autoplay", e));

      // 2. Hiện thông báo đẩy
      toast("🛎️ CÓ ĐƠN HÀNG MỚI TỚI!", {
        duration: 5000,
        style: {
          background: "#EF4444",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
        },
      });
    }

    prevOrderIds.current = currentOrderIds;
  }, [currentOrderIds]);

  // Cài đặt đồng hồ tự động F5 ngầm mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  return null; // Component này chạy ngầm, không cần hiển thị gì cả
}
