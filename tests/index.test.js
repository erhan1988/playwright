const { test, expect } = require('@playwright/test');
const { checkHomeLinkHeader, navigatetoURL, checkFaviconIcon } = require('./header');

// Get the action from the command-line argument or environment variable
const action = process.env.ACTION || process.argv[2]; // Use `ACTION` env variable or second CLI argument

if (action === 'emmanuel') {
    test.describe('Website Tests for Emmanuel', () => {
        test('1. Open the Site and Check Favicon Icon', async ({ page }) => {
            // Step 1: Open the site
            await navigatetoURL(page, action);
            // Step 2: Check Favicon Icon
            await checkFaviconIcon(page, action);
        });

        // test('2. Find link Home in the Header and click', async ({ page }) => {
        //     // Step 3: Check Home link in the header
        //     await checkHomeLinkHeader(page);
        // });
    });
} else if (action === 'amorir') {
    test.describe('Website Tests for Amorir', () => {
        test('1. Open the Site and Check Favicon Icon', async ({ page }) => {
            // Step 1: Open the site
            await navigatetoURL(page, action);
            // Step 2: Check Favicon Icon
            await checkFaviconIcon(page, action);
        });

        test('2. Find link Home in the Header and click', async ({ page }) => {
            // Step 3: Check Home link in the header
            await checkHomeLinkHeader(page);
        });
    });
} else {
    console.log('No valid action provided. Use "emmanuel" or "amorir".');
    process.exit(1);
}