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
                const el = h5Elements[i];
                try {
                    await expect(el).toBeVisible({ timeout: 5000 });
                    const text = await el.textContent();
                    logSuccess(`✅ Title Category ${i + 1}: ${text.trim()}`);
                } catch (err) {
                    logError(`❌ Title Category ${i + 1} not visible or failed to get text: ${err.message}`);
                    // Optionally: break or continue depending on your needs
                    continue;
                }
            }
            logSuccess('✅ All category titles were successfully retrieved.');
        } catch (err) {
            logError(`❌ An error occurred in checkCategoryTitleHomeScreen: ${err.message}`);
            throw new Error(`❌ An error occurred in checkCategoryTitleHomeScreen: ${err.message}`);
        }
    });
}

async function checkVodsInHome(page, action, stepNumber) {
    await test.step(`${stepNumber}. Check if images exist and click the appropriate VOD`, async () => {
        logStep(`${stepNumber}. Check if images exist and click the appropriate VOD...`);
        try {
            const imageElements = await page.locator("div.item[style*='background-image']").all();
            const imageCount = imageElements.length;

            expect(imageCount, 'Expected at least one image').toBeGreaterThan(0);
            console.log(`✅ Found ${imageCount} images with background styles.`);

            let imageToClickIndex;

            // Handle action-specific VOD selection
            if (action === 'televicentro') {
                if (imageCount >= 1) {
                    imageToClickIndex = 1; // click the first available VOD
                    console.log('ℹ️ Televicentro detected. Clicking the first available VOD.');
                } else {
                    throw new Error('❌ Televicentro has no VODs available.');
                }
            } else {
                // Default behavior
                if (imageCount >= 15) {
                    imageToClickIndex = 14;
                } else if (imageCount >= 9) {
                    imageToClickIndex = 8;
                } else if (imageCount >= 1) {
                    imageToClickIndex = imageCount - 1;
                    console.warn(`⚠️ Less than 9 VODs found. Clicking the last available one.`);
                } else {
                    throw new Error('❌ No VOD images found.');
                }
            }

            const imageToClick = imageElements[imageToClickIndex];
            //await page.screenshot({ path: 'vod_scroll_debug.png' }); // Debug screenshot
            await imageToClick.waitFor({ state: 'visible', timeout: 10000 }); // Wait for visibility
            await imageToClick.scrollIntoViewIfNeeded();
            console.log(`Clicking on the ${imageToClickIndex + 1}th image...`);
           // const initialUrl = page.url();
            await Promise.all([
            page.waitForNavigation({ timeout: 30000 }),
            imageToClick.click()
            ]);

            const newUrl = page.url();
            logSuccess(`✅ Successfully redirected to: ${newUrl}`);
        } catch (err) {
            logError(`❌ An error occurred in checkVodsInHome: ${err.message}`);
            throw err;
        }
    });
}
async function UserDetailsScreen(page,action,stepNumber,loggedUser) {
    const userType = loggedUser ? 'Logged user' : 'Not logged user';

    await test.step(`${stepNumber}. ${userType} checking Details screen contains Go back Title background Image Buttons`, async () => {
        logStep(`${stepNumber}. ${userType} checking Details screen contains Go back Title background Image Buttons`);
        try {
            // Call the GobackLink function
            await GobackLink(page,'undefined');  

            // Check for the title in the Details screen
            await titleDetailsScreen(page,action);

            //Background image check
            await backgroundImageDetailsScreen(page,action);
            // Buttons in the Details screen
            await buttonsDetailsScreen(page,action,loggedUser);

        } catch (err) {
            logError(`❌ An error occurred in UserDetailsScreen: ${err.message}`);
            throw new Error(`❌ An error occurred in UserDetailsScreen: ${err.message}`);
        }
    });
}

async function checkRelatedContentInDetailsScreen(page, action, stepNumber) {
    await test.step(`${stepNumber}. Check Related Content in Details screen`, async () => {
      logStep(`${stepNumber}. Checking related content in the Details screen...`);
        try {
            let titleButtons;
            let count = 0;
    
            if (action === 'amorir' || action === 'okgol') {
            // Check title in the Related Content
            titleButtons = await page.locator('button.nav-link.ng-star-inserted');
            // Wait for at least one element or timeout
            await expect.soft(titleButtons.first(), 'Expect at least one title button to appear').toBeVisible({ timeout: 20000 });
            count = await titleButtons.count();
            }else if (action === 'emmanuel' || action === 'panamsport'){
                // Check title in the Related Content
                titleButtons = await page.locator('h5.season-title');
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

            console.log("List all  episodes in Related Content and click on the some episodes");
            // Check if the related content exists vods/episodes
            // Wait for the elements to be located
            const imageElements = await page.locator('img.card-img-top').all();

            // Check if any images are found
            expect(imageElements.length, 'Expected at least one image').toBeGreaterThan(0);
            console.log(`✅ Found ${imageElements.length} images with background styles.`);

            let imageToClickIndex;
            if (imageElements.length >= 4) {
                imageToClickIndex = 3; // 4th image (index 3)
            } else if (imageElements.length >= 1) {
                imageToClickIndex = 0; // 1st image (index 0)
            } else {
                throw new Error('Less than 1 image found. Cannot click the 1st image (vod).');
            }

            // Click on the selected image
            const imageToClick = imageElements[imageToClickIndex];
            await imageToClick.scrollIntoViewIfNeeded();
            console.log(`Clicking on the ${imageToClickIndex + 1}th image...`);
           // await imageToClick.click();
            // Wait for the URL to change
            await Promise.all([
            page.waitForNavigation({ timeout: 40000 }),
            imageToClick.click()
            ]);
            // Log the new URL
            const newUrl = page.url();
            logSuccess(`✅ Successfully redirected to: ${newUrl}`);
            if (action !== 'panamsport'){
                page.waitForTimeout(11000);
            }
            
        } catch (err) {
        logError(`❌ An error occurred in checkRelatedContentInDetailsScreen: ${err.message}`);
        throw new Error(`❌ An error occurred in checkRelatedContentInDetailsScreen: ${err.message}`);
        }
    });
}
  



module.exports = {
    checkCategoryTitleHomeScreen, 
    checkVodsInHome,
    UserDetailsScreen, 
    GobackLink, 
    titleDetailsScreen, 
    backgroundImageDetailsScreen, 
    buttonsDetailsScreen,
    checkRelatedContentInDetailsScreen
};

