const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { GobackLink , titleDetailsScreen ,backgroundImageDetailsScreen,buttonsDetailsScreen} = require('./helper'); 

async function checkCategoryTitleHomeScreen(page,action , stepNumber) {
    await test.step(`${stepNumber}. Check the Home screen and print titles of all categories`, async () => {
        logStep(`${stepNumber}. Checking category titles on the home page...`);
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

async function checkVodsInHome(page,action, stepNumber) {
    await test.step(`${stepNumber}. Check if images exist and click the 14th image vod`, async () => {
        logStep(`${stepNumber}. Check if images exist and click the 14th image vod...`);
        try {
            // Wait for the elements to be located
            const imageElements = await page.locator("div.item[style*='background-image']").all();

            // Check if any images are found
            expect(imageElements.length, 'Expected at least one image').toBeGreaterThan(0);
            console.log(`✅ Found ${imageElements.length} images with background styles.`);

            // Ensure there are at least 5 images
            if (imageElements.length < 15) {
                throw new Error('Less than 15 images found. Cannot click the 14th image (vod).');
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
                { timeout: 20000 }
            );
            // Log the new URL
            const newUrl = page.url();
            logSuccess(`✅ Successfully redirected to: ${newUrl}`);
        } catch (err) {
            logError(`❌ An error occurred in checkVodsInHome: ${err.message}`);
            throw new Error(`❌ An error occurred in checkVodsInHome: ${err.message}`);
        }
    });
}
async function NotloggeduserDetailsScrenn(page,action,stepNumber) {
    await test.step(`${stepNumber}. Not logged user checking Details screen containts Go back Title background Image watch Now`, async () => {
        logStep(`${stepNumber}. Not logged user checking Details screen containts Go back Title background Image watch Now`);
        try {
            // Call the GobackLink function
            await GobackLink(page,'undefined');  

            // Check for the title in the Details screen
            await titleDetailsScreen(page);

            //Background image check
            await backgroundImageDetailsScreen(page);
            // Buttons in the Details screen
            await buttonsDetailsScreen(page,action);

        } catch (err) {
            logError(`❌ An error occurred in NotloggeduserDetailsScrenn: ${err.message}`);
            throw new Error(`❌ An error occurred in NotloggeduserDetailsScrenn: ${err.message}`);
        }
    });
}

async function checkRelatedContentInDetailsScreen(page, action, stepNumber) {
    await test.step(`${stepNumber}. Check Related Content in Details screen`, async () => {
      logStep(`${stepNumber}. Checking related content in the Details screen...`);
        try {
            let titleButtons;
            let count = 0;
    
            if (action === 'amorir') {
            // Check title in the Related Content
            titleButtons = await page.locator('button.nav-link.ng-star-inserted');
            // Wait for at least one element or timeout
            await expect.soft(titleButtons.first(), 'Expect at least one title button to appear').toBeVisible({ timeout: 20000 });
            count = await titleButtons.count();
            }
    
            if (count === 0) {
            logError("❌ No Found title of the category in the Related Content.");
            } else {
            for (let i = 0; i < count; i++) {
                const text = await titleButtons.nth(i).textContent();
                logSuccess(`✅ Title Category in the Related Content is ${i + 1}: ${text.trim()}`);
            }
            }

            console.log("List all  episodes in Related Content and click on the 4 episodes");
            // Check if the related content exists vods/episodes
            // Wait for the elements to be located
            const imageElements = await page.locator('img.card-img-top').all();

            // Check if any images are found
            expect(imageElements.length, 'Expected at least one image').toBeGreaterThan(0);
            console.log(`✅ Found ${imageElements.length} images with background styles.`);

            // Ensure there are at least 5 images
            if (imageElements.length < 4) {
                throw new Error('Less than 4 images found. Cannot click the 3th image (vod).');
            }

            // Click on the 3th image (index 3, as Playwright uses 0-based indexing)
            const thirdImage = imageElements[3];
            await thirdImage.scrollIntoViewIfNeeded();
            console.log('Clicking on the 3th image...');
            await thirdImage.click();

            // Wait for the URL to change
            const initialUrl = page.url();
            await page.waitForFunction(
                (initialUrl) => window.location.href !== initialUrl,
                initialUrl,
                { timeout: 20000 }
            );
            // Log the new URL
            const newUrl = page.url();
            logSuccess(`✅ Successfully redirected to: ${newUrl}`);
        } catch (err) {
        logError(`❌ An error occurred in checkRelatedContentInDetailsScreen: ${err.message}`);
        throw new Error(`❌ An error occurred in checkRelatedContentInDetailsScreen: ${err.message}`);
        }
    });
}
  



module.exports = {
    checkCategoryTitleHomeScreen, 
    checkVodsInHome,
    NotloggeduserDetailsScrenn, 
    GobackLink, 
    titleDetailsScreen, 
    backgroundImageDetailsScreen, 
    buttonsDetailsScreen,
    checkRelatedContentInDetailsScreen
};

