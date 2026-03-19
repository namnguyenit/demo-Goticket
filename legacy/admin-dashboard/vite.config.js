import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CẤU HÌNH ALIAS
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Đặt port mong muốn cho project này
    port: 5174, // Ví dụ: 5173 cho User, 5174 cho Admin
    // Optional: Tự động mở trình duyệt khi chạy dev
    // open: true,
  },
});