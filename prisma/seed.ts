import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Đang dọn dẹp dữ liệu cũ...");
  // Xóa dữ liệu Menu cũ
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Xóa dữ liệu Booking/Box cũ
  await prisma.booking.deleteMany();
  await prisma.sleepBox.deleteMany();

  // --------------------------------------------------
  // 1. TẠO DỮ LIỆU SLEEP BOX
  // --------------------------------------------------
  console.log("Đang tạo dữ liệu Sleep Box...");
  const boxes = [
    { name: "Box 01", type: "SINGLE_BOX", status: "AVAILABLE", price: 130000 },
    { name: "Box 02", type: "SINGLE_BOX", status: "AVAILABLE", price: 130000 },
    { name: "Box 03", type: "SINGLE_BOX", status: "OCCUPIED", price: 130000 },
    { name: "Box 04", type: "DOUBLE_BOX", status: "AVAILABLE", price: 160000 },
    { name: "Box 05", type: "DOUBLE_BOX", status: "CLEANING", price: 160000 },
    { name: "Bàn 01", type: "WORKSPACE", status: "AVAILABLE", price: 45000 },
    { name: "Bàn 02", type: "WORKSPACE", status: "OCCUPIED", price: 45000 },
  ];

  for (const box of boxes) {
    await prisma.sleepBox.create({ data: box });
  }

  // --------------------------------------------------
  // 2. TẠO DỮ LIỆU DANH MỤC MENU (CATEGORIES)
  // --------------------------------------------------
  console.log("Đang tạo danh mục Menu...");
  const coffeeCat = await prisma.category.create({ data: { name: "Cà Phê" } });
  const teaCat = await prisma.category.create({
    data: { name: "Trà Trái Cây" },
  });
  const snackCat = await prisma.category.create({
    data: { name: "Ăn Vặt & Bánh" },
  });

  // --------------------------------------------------
  // 3. TẠO DỮ LIỆU MÓN ĂN/THỨC UỐNG (PRODUCTS)
  // --------------------------------------------------
  console.log("Đang nạp 10 món Menu chuẩn giá (45k - 59k)...");
  const products = [
    // --- Nhóm Cà Phê ---
    {
      name: "Cà Phê Muối",
      description: "Cà phê đậm đà kết hợp lớp kem muối mặn ngọt béo ngậy.",
      price: 45000,
      categoryId: coffeeCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1572442388796-11668a67ef84?w=500&q=80",
    },
    {
      name: "Bạc Xỉu",
      description:
        "Nhiều sữa, ít cà phê, ngọt ngào dễ uống cho người cày deadline đêm.",
      price: 45000,
      categoryId: coffeeCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1531318701087-32c116538a3e?w=500&q=80",
    },
    {
      name: "Cold Brew Cam Vàng",
      description:
        "Cà phê ủ lạnh thanh mát kết hợp mứt cam vàng giải nhiệt cực tốt.",
      price: 55000,
      categoryId: coffeeCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1499961024600-ad0f4fd3a02c?w=500&q=80",
    },

    // --- Nhóm Trà ---
    {
      name: "Trà Đào Cam Sả",
      description:
        "Hương vị quốc dân, chua ngọt thanh mát kèm miếng đào giòn sần sật.",
      price: 55000,
      categoryId: teaCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80",
    },
    {
      name: "Trà Vải Hoa Hồng",
      description:
        "Hương hoa hồng thơm nhẹ nhàng, kết hợp trái vải ngâm mọng nước.",
      price: 55000,
      categoryId: teaCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80",
    },
    {
      name: "Trà Ô Long Sen Vàng",
      description:
        "Trà ô long đậm vị, lớp kem cheese béo ngậy và hạt sen bùi bùi.",
      price: 59000,
      categoryId: teaCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=500&q=80",
    },
    {
      name: "Matcha Đá Xay",
      description: "Bột matcha Nhật Bản xay cùng đá và sữa tươi thơm lừng.",
      price: 59000,
      categoryId: teaCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&q=80",
    },

    // --- Nhóm Ăn Vặt / Bánh ---
    {
      name: "Bánh Sừng Trâu (Croissant)",
      description: "Bánh nướng ngàn lớp thơm lừng mùi bơ Pháp.",
      price: 45000,
      categoryId: snackCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=500&q=80",
    },
    {
      name: "Bánh Phô Mai Nướng",
      description: "Basque Cheesecake xém viền mềm mịn, tan chảy trong miệng.",
      price: 55000,
      categoryId: snackCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80",
    },
    {
      name: "Khoai Tây Chiên Phô Mai",
      description:
        "Khoai tây chiên giòn rụm, lắc đều cùng bột phô mai mặn ngọt.",
      price: 45000,
      categoryId: snackCat.id,
      imageUrl:
        "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80",
    },
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  console.log("✅ Đã nạp xong toàn bộ dữ liệu mẫu!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
