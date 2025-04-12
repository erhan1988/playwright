const { test, expect } = require('@playwright/test');
const { checkHomeLinkHeader, navigatetoURL } = require('./header');

// Get the action from the command-line argument or environment variable
const action = process.env.ACTION || process.argv[2]; // Use `ACTION` env variable or second CLI argument

test.describe('Website Tests', () => {
    if (action === 'emmanuel') {
        test('EmmanuelTV Test', async ({ page }) => {
            await navigatetoURL(page, action); // Pass action to navigatetoURL
            // Check Home link in the header
            await checkHomeLinkHeader(page);
        });
    } else if (action === 'amorir') {
        test('Amorir Test', async ({ page }) => {
            await navigatetoURL(page, action); // Pass action to navigatetoURL
            // Check Home link in the header
            await checkHomeLinkHeader(page);
        });
    } else {
        console.log('No valid action provided. Use "emmanuel" or "amorir".');
    }
});

