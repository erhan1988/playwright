// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['dot'],
  ],
  use: {
    headless: true,
    launchOptions: {
      args: ['--start-maximized'],
    },
    viewport: null,

    // ✅ These options ensure assets are generated:
    trace: 'on', // or 'retain-on-failure'
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        headless: true,
        launchOptions: {
          executablePath: '/usr/bin/google-chrome',
          args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-gpu',
          ],
        },
        viewport: null,
      },
    },
  ],
});
