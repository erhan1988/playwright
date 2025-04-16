const { test, expect } = require('@playwright/test');
const { checkHomeLinkHeader, navigatetoURL, checkFaviconIcon } = require('./header');

// Get the action from the command-line argument or environment variable
const action = process.env.ACTION || process.argv[2]; // Use `ACTION` env variable or second CLI argument

if (action === 'emmanuel') {
    test.describe('Website Tests for Emmanuel', () => {
        test('Website Tests', async ({ page }) => {
            await navigatetoURL(page, action);
            
            await checkFaviconIcon(page, action);
        
            await checkHomeLinkHeader(page);
        });
    });
} else if (action === 'amorir') {
    test.describe('Website Tests for Amorir', () => {
        test('Website Tests', async ({ page }) => {
            await navigatetoURL(page, action);
           
            await checkFaviconIcon(page, action);
            
            //await checkHomeLinkHeader(page);   
        });
    });
} else {
    console.log('No valid action provided. Use "emmanuel" or "amorir".');
    process.exit(1);
}