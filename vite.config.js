import { defineConfig } from 'vite'
export default defineConfig({
  // Đặt BASE_PATH=/thang-quynh-wedding/ khi build trên GitHub Pages.
  base: process.env.BASE_PATH || '/',
})
