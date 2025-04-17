const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { GobackLink , titleDetailsScreen } = require('./helper'); 

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

async function checkVodsInHome(page) {
    await test.step('6.Check if images exist and click the 14th image vod', async () => {
        logStep('6.Checking for images with background styles...');
        try {
            // Wait for the elements to be located
            const imageElements = await page.locator("div.item[style*='background-image']").all();

            // Check if any images are found
            expect(imageElements.length, 'Expected at least one image').toBeGreaterThan(0);
            console.log(`✅ Found ${imageElements.length} images with background styles.`);

            // Ensure there are at least 5 images
            if (imageElements.length < 15) {
                throw new Error('Less than 15 images found. Cannot click the 14th image.');
            }

            // Click on the 5th image (index 4, as Playwright uses 0-based indexing)
            const fifthImage = imageElements[14];
            await fifthImage.scrollIntoViewIfNeeded();
            console.log('Clicking on the 14th image...');
            await fifthImage.click();

            // Wait for the URL to change
            const initialUrl = page.url();
            await page.waitForFunction(
                (initialUrl) => window.location.href !== initialUrl,
                initialUrl,
                { timeout: 10000 }
            );
            // Log the new URL
            const newUrl = page.url();
            console.log(`✅ Successfully redirected to: ${newUrl}`);
        } catch (err) {
            console.error(`❌ Error: ${err.message}`);
            expect.fail(`❌ Error: ${err.message}`);
        }
    });
}

async function NotloggeduserDetailsScrenn(page) {
    await test.step('7. Not logged user checking Details screen containts Go back Title background Image watch Now', async () => {
        logStep('7. Not logged user checking Details screen containts Go back Title background Image watch Now');
        try {
            // Call the GobackLink function
            await GobackLink(page,'undefined');  

            // Check for the title in the Details screen
            await titleDetailsScreen(page);

        } catch (err) {
            logError(`❌ An error occurred in NotloggeduserDetailsScrenn: ${err.message}`);
            throw new Error(`❌ An error occurred in NotloggeduserDetailsScrenn: ${err.message}`);
        }
    });
}


module.exports = { checkCategoryTitleHomeScreen, checkVodsInHome,
NotloggeduserDetailsScrenn, GobackLink, titleDetailsScreen };

