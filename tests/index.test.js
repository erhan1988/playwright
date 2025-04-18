const { test, expect} = require('@playwright/test');
const { checkHomeLinkHeader, navigatetoURL, checkFaviconIcon,checkHeaderElements } = require('./header');
const { checkCategoryTitleHomeScreen,checkVodsInHome,NotloggeduserDetailsScrenn} = require('./homeContent');
const { checkPlayerScreen } = require('./helper'); 

// Get the action from the command-line argument or environment variable
const action = process.env.ACTION || process.argv[2]; // Use `ACTION` env variable or second CLI argument

if (action === 'emmanuel') {
    test.describe('Website Tests for Emmanuel', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(60000); // Increase timeout to 60 seconds

            //Step 1: Open the Site
            await navigatetoURL(page, action);

            //Step 2: Check if Favicon exists in the browser            
            await checkFaviconIcon(page, action);

            //Step 3: Find link Home in the Header and click
            await checkHomeLinkHeader(page);

            await page.waitForTimeout(2000); // 2000ms = 2 seconds
            //Step 4: Check if Header elements exist
            await checkHeaderElements(page, action);

            //5.Check the Home screen Need to print title of all category
            await checkCategoryTitleHomeScreen(page, action);

            //6.Check the VODs in Home screen
            await checkVodsInHome(page, action);
            
            //7.Not logged user checking Details screen containts Go back Title background Image watch Now etc'
            await NotloggeduserDetailsScrenn(page, action);

            //8.Check the player screen
            await checkPlayerScreen(page, action,'8','undefined');
        });
    });
} else if (action === 'amorir') {
    test.describe('Website Tests for Amorir', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(60000); // Increase timeout to 60 seconds
            
            //Step 1: Open the Site
            await navigatetoURL(page, action);

            //Step 2: Check if Favicon exists in the browser                
            await checkFaviconIcon(page, action);

            //Step 3: Find link Home in the Header and click
            await checkHomeLinkHeader(page);  

            await page.waitForTimeout(2000); // 2000ms = 2 seconds
            //Step 4: Check if Header elements exist
            await checkHeaderElements(page, action);

            //5.Check the Home screen Need to print title of all category
            await checkCategoryTitleHomeScreen(page, action);

            //6.Check the VODs in Home screen
            await checkVodsInHome(page, action);

            //7.Not logged user checking Details screen containts Go back Title background Image watch Now etc'
            await NotloggeduserDetailsScrenn(page, action);
        });
    });
} else {
    console.log('No valid action provided. Use "emmanuel" or "amorir".');
    process.exit(1);
}