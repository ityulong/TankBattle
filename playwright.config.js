import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    headless: true,
    viewport: { width: 1024, height: 768 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 5173',
    cwd: 'src',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },
});
