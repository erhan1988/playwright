const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers

async function checkCategoryTitleHomeScreen(page) {
    await test.step('5. Check the Home screen and print titles of all categories', async () => {
        logStep('5.Checking category titles on the home page...');
        try {
            // Wait for the elements to be located
            await page.waitForSelector('h5.m-0.mb-1.w-50', { timeout: 5000 });

            // Find all matching elements
            const h5Elements = await page.locator('h5.m-0.mb-1.w-50').all();

            // Assert that at least one category title exists
            expect(h5Elements.length, 'Expected at least one category title').toBeGreaterThan(0);

            // Log the number of elements found
            logSuccess(`✅ Found ${h5Elements.length} Title Category elements on the Home Page.`);

            // Loop through each element and print its text
            for (let i = 0; i < h5Elements.length; i++) {
                const text = await h5Elements[i].textContent();
                logSuccess(`✅ Title Category ${i + 1}: ${text.trim()}`);
            }
            logSuccess('✅ All category titles were successfully retrieved.');
        } catch (err) {
            logError(`❌ An error occurred in checkCategoryTitleHomeScreen: ${err.message}`);
            throw new Error(`❌ An error occurred in checkCategoryTitleHomeScreen: ${err.message}`);
        }
    });
}
module.exports = { checkCategoryTitleHomeScreen };

