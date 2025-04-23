const { test, expect} = require('@playwright/test');
const { checkHomeLinkHeader, navigatetoURL, checkFaviconIcon,checkHeaderElements } = require('./header');
const { checkCategoryTitleHomeScreen,checkVodsInHome,NotloggeduserDetailsScrenn,checkRelatedContentInDetailsScreen} = require('./homeContent');
const { checkPlayerScreen } = require('./helper'); 
const { checkFooterLinks } = require('./footer'); 
const { contactUsFirstScenario } = require('./contactUs'); 


// Get the action from the command-line argument or environment variable
const action = process.env.ACTION || process.argv[2]; // Use `ACTION` env variable or second CLI argument

if (action === 'emmanuel') {
    test.describe('Website Tests for Emmanuel', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(90000); // Increase timeout to 60 seconds

            //Step 1: Open the Site
            await navigatetoURL(page, action,1);

            //Step 2: Check if Favicon exists in the browser            
            await checkFaviconIcon(page, action,2);

            //Step 3: Find link Home in the Header and click
            await checkHomeLinkHeader(page,3);

            await page.waitForTimeout(2000); // 2000ms = 2 seconds
            //Step 4: Check if Header elements exist
            await checkHeaderElements(page, action,4);

            //5.Check the Home screen Need to print title of all category
            await checkCategoryTitleHomeScreen(page, action,5);

            //6.Check the VODs in Home screen
            await checkVodsInHome(page, action,6);
            
            //7.Not logged user checking Details screen containts Go back Title background Image watch Now etc'
            await NotloggeduserDetailsScrenn(page, action,7);

            //8.Check the player screen
            await checkPlayerScreen(page, action,8,'undefined');

            //9.Check Related Content in Details screen
            await checkRelatedContentInDetailsScreen(page, action,9);

            //10. Check footer Section 
            await checkFooterLinks (page,action,10);

            //11. Check different scenario for contact Us
            await contactUsFirstScenario(page,action,11);

        });
    });
} else if (action === 'amorir') {
    test.describe('Website Tests for Amorir', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(60000); // Increase timeout to 60 seconds
            
            //Step 1: Open the Site
            await navigatetoURL(page, action,1);

            //Step 2: Check if Favicon exists in the browser                
            await checkFaviconIcon(page, action,2);

            //Step 3: Find link Home in the Header and click
            await checkHomeLinkHeader(page,3);  

            await page.waitForTimeout(2000); // 2000ms = 2 seconds
            //Step 4: Check if Header elements exist
            await checkHeaderElements(page, action,4);

            //5.Check the Home screen Need to print title of all category
            await checkCategoryTitleHomeScreen(page, action,5);

            //6.Check the VODs in Home screen
            await checkVodsInHome(page, action,6);

            //7.Not logged user checking Details screen containts Go back Title background Image watch Now etc'
            await NotloggeduserDetailsScrenn(page, action,7);

            //8.Check Related Content in Details screen
            await checkRelatedContentInDetailsScreen(page, action,8);

            //9. Check footer Section 
            await checkFooterLinks (page,action,9);
        });
    });
}else if (action === 'prtv') {
    test.describe('Website Tests for Prtv', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(60000); // Increase timeout to 60 seconds
    
            //Step 1: Open the Site
            await navigatetoURL(page, action,'1');
        });
    })

} else {
    console.log('No valid action provided. Use "emmanuel" or "amorir".');
    process.exit(1);
}