
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Đặt port mong muốn cho project này
    port: 5173, // Ví dụ: 5173 cho User, 5174 cho Admin
    // Optional: Tự động mở trình duyệt khi chạy dev
    // open: true,
  },
});
