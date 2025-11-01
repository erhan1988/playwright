// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 10000 // 10 seconds for assertions
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['dot'],
  ],
  use: {
    headless: true,
    actionTimeout: 15000, // 15 seconds for actions
    navigationTimeout: 30000, // 30 seconds for page loads
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--start-maximized'],
    },
    viewport: null,
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
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
          ],
        },
        viewport: null,
      },
    },
  ],
}); 


// // @ts-check
// import { defineConfig, devices } from '@playwright/test';

// /**
//  * Read environment variables from file.
//  * https://github.com/motdotla/dotenv
//  */
// // import dotenv from 'dotenv';
// // import path from 'path';
// // dotenv.config({ path: path.resolve(__dirname, '.env') });

// /**
//  * @see https://playwright.dev/docs/test-configuration
//  */
// export default defineConfig({
//   testDir: './tests',
//   fullyParallel: false, // Run tests sequentially
//   workers: 1, // Ensure only one worker is used
//   reporter: [
//     ['html', { outputFolder: 'playwright-report', open: 'never' }],
//     ['dot'], // Minimal output (dots for each test)
//   ],
//   use: {
//     headless: true, // Run in headed mode
//     screenshot: 'only-on-failure',   // take screenshot when a test fails
//     video: 'retain-on-failure',      // optional, keep video if it fails
//     trace: 'retain-on-failure', 
//     launchOptions: {
//       args: ['--start-maximized'], // Maximize the browser window
//     },
//     viewport: null, // Disable viewport to use the full screen size
//   },
//   projects: [
//     // {
//     //   name: 'firefox',  // Name of the project (can be any name, e.g., 'chromium', 'firefox')
//     //   use: {
//     //     browserName: 'firefox',  // Use Firefox browser
//     //     headless: false,  // Run the browser with UI (set to true for headless mode)
//     //     launchOptions: {
//     //       args: [
//     //         '--start-maximized',  // Start browser maximized
//     //         '--no-sandbox',  // Disable sandbox (optional)
//     //         '--autoplay-policy=no-user-gesture-required',  // Allow autoplay
//     //         '--disable-features=PreloadMediaEngagementData,MediaEngagementBypassAutoplayPolicies',  // Disable autoplay policies
//     //       ],
//     //     },
//     //     viewport: null,  // Disable viewport size to use full screen
//     //   },
//     // },
//     {
//       name: 'chrome',
//       use: {
//         browserName: 'chromium', // Using Chromium as the base
//         headless: true, // Run with UI
//         launchOptions: {
//           executablePath: '/usr/bin/google-chrome', // Path to Google Chrome executable
//           args: [
//             '--start-maximized',
//             '--no-sandbox',
//             '--disable-gpu',
//           ],
//         },
//         viewport: null,  // Full screen (no viewport size constraints)
//       },
//     },
//   ],

// });