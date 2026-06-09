"use client";

import { BedDouble, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Khai báo kiểu dữ liệu
type DashboardProps = {
  totalBookingRevenue: number;
  totalOrderRevenue: number;
  totalBookings: number;
  totalOrders: number;
  topProducts: { name: string; quantity: number }[];
};

const COLORS = ["#8B5A2B", "#A0522D", "#CD853F", "#DEB887", "#F4A460"]; // Bảng màu tone Cà phê của quán

export default function DashboardClient({
  totalBookingRevenue,
  totalOrderRevenue,
  totalBookings,
  totalOrders,
  topProducts,
}: DashboardProps) {
  const totalRevenue = totalBookingRevenue + totalOrderRevenue;

  // Dữ liệu cho biểu đồ tròn (Nguồn thu)
  const revenueData = [
    { name: "Tiền Thuê Box", value: totalBookingRevenue },
    { name: "Tiền Nước (F&B)", value: totalOrderRevenue },
  ];

  // Format tiền tệ VNĐ
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Tiêu đề */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Thống Kê Tổng Quan
          </h1>
          <p className="text-gray-500 mt-1">
            Nắm bắt dòng tiền và hiệu quả kinh doanh của El Soñador
          </p>
        </div>

        {/* 4 Thẻ KPI trên cùng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-green-500">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Tổng Doanh Thu
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {formatMoney(totalRevenue)}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <BedDouble className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Doanh thu Sleep Box
              </p>
              <h3 className="text-xl font-bold text-gray-800">
                {formatMoney(totalBookingRevenue)}
              </h3>
              <p className="text-xs text-green-500 mt-1">
                Từ {totalBookings} lượt đặt
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Doanh thu Quầy Bar
              </p>
              <h3 className="text-xl font-bold text-gray-800">
                {formatMoney(totalOrderRevenue)}
              </h3>
              <p className="text-xs text-green-500 mt-1">
                Từ {totalOrders} đơn hàng
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Món Bán Chạy Nhất
              </p>
              <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                {topProducts.length > 0
                  ? topProducts[0].name
                  : "Chưa có dữ liệu"}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Top 1 F&B</p>
            </div>
          </div>
        </div>

        {/* Khu vực Biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ tròn: Cơ cấu doanh thu */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              Cơ cấu Doanh thu
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatMoney(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8B5A2B]"></div>
                <span className="text-sm text-gray-600">Sleep Box</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A0522D]"></div>
                <span className="text-sm text-gray-600">Quầy Bar (F&B)</span>
              </div>
            </div>
          </div>

          {/* Biểu đồ cột: Top 5 món bán chạy */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              Top 5 Món Bán Chạy (Số lượng)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={160}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="quantity"
                    fill="#CD853F"
                    name="Số ly đã bán"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
