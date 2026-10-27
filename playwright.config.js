import { defineConfig } from '@playwright/test'
export default defineConfig({
 testDir: './tests/ui',
 outputDir: './test-results',
 reporter: [['list'], ['html', {open:'never'}]],
 timeout: 30000,
 use: {
  baseURL:'http://127.0.0.1:5173',
  headless:true,
  launchOptions: process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH, args:['--no-sandbox'] } : {},
  screenshot:'only-on-failure',
  trace:'retain-on-failure',
 },
 webServer:{command:'npm run dev -- --port 5173 --strictPort',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI},
})
