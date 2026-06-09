import {
  Bed,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Wifi,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Đã thêm import Link

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* FLOATING BUTTONS - Chuyển đổi liên tục */}
      <div className="fixed bottom-6 right-4 lg:right-8 flex flex-col gap-3 z-50">
        <a
          href="tel:0912756271"
          data-track="click_call"
          className="bg-elso-primary text-white p-3.5 rounded-full shadow-xl hover:bg-elso-secondary transition"
        >
          <Phone className="w-5 h-5" />
        </a>
        <a
          href="https://zalo.me/0912756271"
          target="_blank"
          data-track="click_zalo"
          className="bg-blue-600 text-white p-3.5 rounded-full shadow-xl hover:bg-blue-700 transition"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <a
          href="#location"
          data-track="click_map"
          className="bg-green-600 text-white p-3.5 rounded-full shadow-xl hover:bg-green-700 transition"
        >
          <MapPin className="w-5 h-5" />
        </a>
      </div>

      {/* SECTION 1 - HERO (Hiển thị ngay USP trong 3s) */}
      <section className="relative h-[100vh] flex flex-col justify-center px-6 lg:px-20 bg-black">
        <Image
          src="/images/hero-bg.webp"
          alt="Không gian cafe làm việc Đà Lạt"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Cafe Làm Việc & Sleep Box 24H Tại Đà Lạt
          </h1>
          <div className="text-lg text-gray-200 mb-8 space-y-2 font-medium">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-elso-secondary rounded-full"></span>{" "}
              Không gian yên tĩnh.
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-elso-secondary rounded-full"></span>{" "}
              Wifi tốc độ cao.
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-elso-secondary rounded-full"></span> Ổ
              cắm điện tại mọi khu vực.
            </p>
          </div>
          {/* Đã cập nhật nút bấm dẫn vào hệ thống */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/menu"
              data-track="click_hero_menu"
              className="px-8 py-4 bg-white text-elso-primary text-center font-bold rounded-md hover:bg-gray-100 transition shadow-lg"
            >
              Xem Menu & Đặt món
            </Link>
            <Link
              href="/booking"
              data-track="click_hero_sleepbox"
              className="px-8 py-4 bg-elso-primary text-white text-center font-bold rounded-md hover:bg-elso-secondary transition shadow-lg"
            >
              Đặt Sleep Box ngay
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 - LÝ DO CHỌN EL SOÑADOR */}
      <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Wifi className="w-8 h-8" />,
              title: "Wifi mạnh",
              desc: "Đường truyền cáp quang riêng biệt.",
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: "Mở cửa 24H",
              desc: "Không bao giờ đóng cửa.",
            },
            {
              icon: <Bed className="w-8 h-8" />,
              title: "Sleep Box riêng tư",
              desc: "Nghỉ ngơi an toàn, sạch sẽ.",
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Ổ cắm điện mọi nơi",
              desc: "Trang bị tại 100% bàn.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-elso-primary"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 - KHÔNG GIAN LÀM VIỆC */}
      <section className="py-20 bg-white px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-elso-primary mb-10 text-center">
            Một Nơi Để Tập Trung
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Lắp ảnh thật bằng component Image của Next.js để tối ưu SEO và tốc độ */}
            {[1, 2, 3, 4, 5, 6].map((img) => (
              <div
                key={img}
                className="relative h-64 rounded-md overflow-hidden group"
              >
                <Image
                  src={`/images/ws-${img}.webp`} /* Đường dẫn ảnh: ws-1.webp, ws-2.webp... */
                  alt={`Góc làm việc yên tĩnh tại El Soñador Đà Lạt - Góc ${img}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - SLEEP BOX */}
      <section id="sleepbox" className="py-20 px-6 lg:px-20 bg-[#f4ebe1]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 w-full h-[450px] relative rounded-md overflow-hidden shadow-lg">
            {/* Lắp ảnh Sleep Box thật */}
            <Image
              src="/images/sleepbox.webp"
              alt="Bên trong Sleep Box riêng tư tại El Soñador Đà Lạt"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-elso-primary mb-4">
              Trú Chân Giữa Đà Lạt
            </h2>
            <p className="text-elso-text mb-6">
              Khoang nghỉ ngơi riêng tư, an toàn với chăn nệm cao cấp, đèn đọc
              sách và ổ cắm sạc. Phù hợp chợp mắt giữa ngày hoặc qua đêm.
            </p>

            <div className="bg-white/60 p-5 rounded-md border border-elso-secondary/20 mb-8">
              <h3 className="font-bold text-elso-primary mb-3">
                Bảng giá Sleep Box:
              </h3>
              <ul className="space-y-3 text-elso-secondary font-medium text-sm">
                <li className="flex justify-between items-center border-b border-elso-secondary/10 pb-2">
                  <span>
                    ✓ Combo Qua đêm 1 người <br />
                    <span className="text-xs font-normal text-gray-500">
                      (19h tối - trước 12h trưa hôm sau)
                    </span>
                  </span>
                  <span className="font-bold text-elso-primary text-right">
                    130.000đ
                    <br />
                    <span className="text-xs font-normal text-gray-500">
                      (Đã gồm nước & mền)
                    </span>
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-elso-secondary/10 pb-2">
                  <span>
                    ✓ Combo Qua đêm 2 người <br />
                    <span className="text-xs font-normal text-gray-500">
                      (19h tối - trước 12h trưa hôm sau)
                    </span>
                  </span>
                  <span className="font-bold text-elso-primary text-right">
                    160.000đ
                    <br />
                    <span className="text-xs font-normal text-gray-500">
                      (Đã gồm nước & mền)
                    </span>
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-elso-secondary/10 pb-2">
                  <span>✓ Thuê nguyên ngày (24h)</span>
                  <span className="font-bold text-elso-primary">200.000đ</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>✓ Thuê mền lẻ (dành cho khách ngồi ngoài)</span>
                  <span className="font-bold text-elso-primary">
                    30.000đ / cái
                  </span>
                </li>
              </ul>
            </div>

            {/* Đã cập nhật nút bấm dẫn vào hệ thống */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                href="/booking"
                data-track="click_book_now"
                className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-elso-primary text-white font-bold rounded-md hover:bg-elso-secondary transition shadow-lg"
              >
                <Bed className="w-5 h-5" />
                Đặt Box Trên Web
              </Link>
              <a
                href="https://zalo.me/0912756271"
                target="_blank"
                data-track="click_book_zalo"
                className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-[#0068FF] text-white font-bold rounded-md hover:bg-blue-700 transition shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Cần Tư Vấn Thêm
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - REVIEW THỰC TẾ */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-elso-primary mb-12 text-center">
            Khách Hàng Nói Gì?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Hoàng Nam",
                text: "Quán cafe làm việc chân ái ở Đà Lạt. Bàn ghế thiết kế chuẩn, wifi cực mạnh và chỗ nào cũng có ổ cắm. Rất phù hợp cho dân chạy deadline xuyên đêm.",
              },
              {
                name: "Thanh Trúc",
                text: "Mô hình coffee sleep box quá tiện lợi! Bay chuyến đêm đến tìm được quán mở 24/24. Thuê box ngủ một giấc tới sáng rồi làm việc luôn. Rất sạch sẽ và riêng tư.",
              },
              {
                name: "Minh Tuấn",
                text: "Không gian yên tĩnh, nhạc nhẹ nhàng giúp tập trung cao độ. Khách đến đa số mang laptop làm việc nên rất lịch sự, không bị ồn ào như các quán cafe check-in.",
              },
              {
                name: "Ngọc Diệp",
                text: "Mình ở đây làm việc cả ngày, trưa ăn nhẹ rồi chợp mắt ở sleep box. Đồ uống ngon, giá hợp lý. Mọi thứ đều được phục vụ rất chu đáo và chuyên nghiệp.",
              },
              {
                name: "Đức Anh",
                text: "Nơi lý tưởng để học bài. Quán chuẩn bị sẵn cả đèn đọc sách. Đêm lạnh Đà Lạt mà ngồi đây uống ly trà ấm, cắm tai nghe học bài thì tuyệt vời.",
              },
              {
                name: "Phương Linh",
                text: "Vị trí dễ tìm ngay Nguyễn Du. Mình check-out khách sạn sớm nên ra đây ngồi làm việc chờ tới giờ ra xe. Tiện ích đầy đủ không thiếu thứ gì cho dân remote.",
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="p-6 border border-gray-100 rounded-lg shadow-sm bg-[#F8F3EE]/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-yellow-500 mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm uppercase">
                    {review.name.charAt(0)}
                  </div>
                  <div className="font-bold text-elso-primary text-sm">
                    {review.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 - BẢN ĐỒ & LIÊN HỆ */}
      <section id="location" className="py-20 px-6 lg:px-20 bg-[#F8F3EE]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-elso-primary">
              Tìm Đến El Soñador
            </h2>
            <div className="text-elso-text space-y-2">
              <p className="font-bold">Địa chỉ:</p>
              <p>24D Nguyễn Du, Lâm Viên - Đà Lạt, Lâm Đồng 670000</p>
            </div>
            <div className="text-elso-text space-y-2">
              <p className="font-bold">Giờ mở cửa:</p>
              <p>24/7 (Phục vụ xuyên Lễ, Tết)</p>
            </div>
            <div className="text-elso-text space-y-2">
              <p className="font-bold">Hotline & Zalo:</p>
              <p>0912 756 271</p>
            </div>
            <a
              href="https://maps.google.com/?q=El+Soñador+Coffee+Tea+Đà+Lạt"
              target="_blank"
              data-track="click_open_maps"
              className="mt-4 inline-block px-8 py-3 bg-elso-primary text-white font-bold rounded-md hover:bg-elso-secondary transition"
            >
              Mở Google Maps
            </a>
          </div>
          <div className="flex-1 h-[350px] bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=El+Soñador+Coffee+&+Tea,+24D+Nguyễn+Du,+Đà+Lạt&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* SECTION 8 - FAQ CHUẨN SEO */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-elso-primary mb-10 text-center">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Mức giá đồ uống và quy định thời gian ngồi như thế nào?",
                a: "Giá nước tại El Soñador dao động từ 45.000đ - 59.000đ tùy món (giá chưa bao gồm 8% VAT). Với mỗi phần nước, thời gian sử dụng không gian làm việc mặc định là 5 tiếng (đối với ngày thường) và từ 2-3 tiếng (đối với các dịp Lễ, Tết đông khách).",
              },
              {
                q: "Quán có mở 24h không?",
                a: "Có, El Soñador là quán cafe mở cửa 24/24 xuyên suốt các ngày trong tuần, kể cả Lễ Tết. Bạn có thể đến làm việc hoặc nghỉ ngơi vào bất cứ khung giờ nào.",
              },
              {
                q: "Khung giờ thuê Sleep Box qua đêm tính thế nào?",
                a: "Giờ thuê Sleep Box qua đêm được tính từ 19h00 tối hôm trước đến trước 12h00 trưa hôm sau. Gói qua đêm đã bao gồm miễn phí nước uống và chăn mền.",
              },
              {
                q: "Quán có thân thiện với thú cưng (Pet-friendly) không?",
                a: "Có, El Soñador rất chào đón các bé thú cưng! Tuy nhiên, vì là không gian tập trung làm việc, khách hàng vui lòng tự đảm bảo vệ sinh chung cho quán và đặc biệt: các bé thú cưng bắt buộc phải được để trong lồng hoặc túi vận chuyển.",
              },
              {
                q: "Có ổ cắm điện và wifi mạnh không?",
                a: "Có, chúng tôi trang bị ổ cắm điện tại 100% các vị trí bàn ngồi và router chịu tải cao cực mạnh, chuyên phục vụ cho dân cày deadline, freelancer tải file nặng.",
              },
              {
                q: "Có chỗ đỗ xe hơi và chỗ để hành lý không?",
                a: "Có, quán có khu vực đỗ xe an toàn cho xe hơi và khu vực hỗ trợ bảo quản hành lý gọn gàng cho khách du lịch chờ tới giờ check-in/check-out khách sạn.",
              },
              {
                q: "Quán có phục vụ đồ ăn vặt không?",
                a: "Có, bên cạnh đồ uống, quán còn phục vụ các loại bánh ngọt và đồ ăn vặt (snack) để bạn nhâm nhi và tiếp thêm năng lượng khi làm việc xuyên đêm.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group border border-gray-200 rounded-md bg-[#F8F3EE]/30 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between p-5 font-bold cursor-pointer text-elso-primary">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 mt-2 mx-5">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
