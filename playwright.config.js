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
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['dot'], // Minimal output (dots for each test)
  ],
  use: {
    headless: true, // Run in headed mode
    launchOptions: {
      args: ['--start-maximized'], // Maximize the browser window
    },
    viewport: null, // Disable viewport to use the full screen size
  },
  projects: [
    // {
    //   name: 'firefox',  // Name of the project (can be any name, e.g., 'chromium', 'firefox')
    //   use: {
    //     browserName: 'firefox',  // Use Firefox browser
    //     headless: false,  // Run the browser with UI (set to true for headless mode)
    //     launchOptions: {
    //       args: [
    //         '--start-maximized',  // Start browser maximized
    //         '--no-sandbox',  // Disable sandbox (optional)
    //         '--autoplay-policy=no-user-gesture-required',  // Allow autoplay
    //         '--disable-features=PreloadMediaEngagementData,MediaEngagementBypassAutoplayPolicies',  // Disable autoplay policies
    //       ],
    //     },
    //     viewport: null,  // Disable viewport size to use full screen
    //   },
    // },
    {
      name: 'chrome',
      use: {
        browserName: 'chromium', // Using Chromium as the base
        headless: true, // Run with UI
        launchOptions: {
          executablePath: '/usr/bin/google-chrome', // Path to Google Chrome executable
          args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-gpu',
          ],
        },
        viewport: null,  // Full screen (no viewport size constraints)
      },
    },
  ],

});