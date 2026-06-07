import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"], // Các độ dày để hỗ trợ text thường đến in đậm
});

// SEO Technical chuẩn xác 100% theo Brief
export const metadata: Metadata = {
  title: "Cafe Làm Việc & Sleep Box 24H Tại Đà Lạt | El Soñador",
  description:
    "El Soñador Coffee & Tea là quán cafe làm việc 24h tại Đà Lạt với wifi mạnh, ổ cắm điện và sleep box riêng tư.",
  openGraph: {
    title: "Cafe Làm Việc & Sleep Box 24H Tại Đà Lạt | El Soñador",
    description:
      "Không gian yên tĩnh. Wifi tốc độ cao. Ổ cắm điện tại mọi khu vực.",
    url: "https://elsonador.vn",
    siteName: "El Soñador Coffee & Tea",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Tích hợp Multi-Schema SEO
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CafeOrCoffeeShop",
      name: "El Soñador Coffee & Tea",
      image: "https://elsonador.vn/images/hero-bg.webp",
      "@id": "https://elsonador.vn",
      url: "https://elsonador.vn",
      telephone: "0912756271",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "24D Nguyễn Du",
        addressLocality: "Lâm Viên - Đà Lạt",
        addressRegion: "Lâm Đồng",
        postalCode: "670000",
        addressCountry: "VN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 11.9549303,
        longitude: 108.4357497,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quán có mở 24h không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có, quán mở cửa xuyên đêm 24/7.",
          },
        },
        {
          "@type": "Question",
          name: "Có wifi mạnh không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có, wifi tốc độ cao chuyên cho freelancer.",
          },
        },
      ],
    },
  ];

  return (
    // suppressHydrationWarning trên <html> giúp bỏ qua cảnh báo
    // do extension thêm thuộc tính vào thẻ <html>
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      </head>
      {/* Thêm suppressHydrationWarning vào <body> vì Logs cho thấy */}
      {/* Extension đang chèn script lạ vào cấu trúc này */}
      <body
        className={`${montserrat.className} bg-elso-background text-elso-text antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
