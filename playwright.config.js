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
  testDir: './tests',
  fullyParallel: false, // Run tests sequentially
  workers: 1, // Ensure only one worker is used
  reporter: [['html', { outputFolder: 'playwright-report', open: 'always' }]],
  use: {
    headless: false, // Run in headed mode
    launchOptions: {
      args: ['--start-maximized'], // Maximize the browser window
    },
    viewport: null, // Disable viewport to use the full screen size
  },
  projects: [
    {
      name: 'chromium',
      use: {
        headless: false,
        launchOptions: {
          args: ['--start-maximized'], // Maximize the browser window
        },
        viewport: null, // Disable viewport for full screen
      },
    },
  ],
});

