import { defineConfig } from '@playwright/test'
export default defineConfig({
 testDir: './tests/firebase-ui',
 outputDir: './test-results-firebase',
 reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-firebase-report' }]],
 timeout: 45000,
 use: {
  baseURL: 'http://127.0.0.1:5174', headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure',
  launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {},
 },
 webServer: {
  command: 'npm run dev -- --port 5174 --strictPort', url: 'http://127.0.0.1:5174', reuseExistingServer: false,
  env: {
   VITE_FIREBASE_API_KEY: 'demo-key', VITE_FIREBASE_PROJECT_ID: 'demo-thang-quynh',
   VITE_FIREBASE_APP_ID: '1:123456789:web:test-app', VITE_FIREBASE_AUTH_DOMAIN: 'demo-thang-quynh.firebaseapp.com',
   VITE_FIREBASE_EMULATORS: 'true',
  },
 },
})
