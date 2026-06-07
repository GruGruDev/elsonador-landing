// File: D:\workspace\project\elsonador-landing\postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // SỬA DÒNG NÀY: Thay vì 'tailwindcss', ta dùng gói mới
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

export default config;
