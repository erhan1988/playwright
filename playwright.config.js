// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests', // Ensure the directory containing your test files is correct
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'always' }]], // Automatically open HTML report
  use: {
    trace: 'on-first-retry',
    headless: false, // Run tests with UI (non-headless mode)
    viewport: { width: 1920, height: 1080 }, // Explicitly set viewport size
    launchOptions: {
      args: ['--start-maximized'], // Maximize the browser window
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false, // Ensure the browser runs in UI mode
        viewport: { width: 1920, height: 1080 }, // Explicitly set viewport size
        launchOptions: {
          args: ['--start-maximized'], // Maximize the browser window
        },
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});

