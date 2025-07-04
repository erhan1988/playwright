const { test, expect} = require('@playwright/test');
const { checkHomeLinkHeader, navigatetoURL, checkFaviconIcon,checkHeaderElements } = require('./header');
const { checkCategoryTitleHomeScreen,checkVodsInHome,UserDetailsScreen,checkRelatedContentInDetailsScreen} = require('./homeContent');
const { checkPlayerScreen } = require('./helper'); 
const { checkFooterLinks } = require('./footer'); 
const { contactUsFirstScenario } = require('./contactUs'); 
const { registrationScreen } = require('./registration');
const { loginScreen,loginScreenNewPassword } = require('./login');
const { forgotScreen } = require('./forgotScreen');
const { loggedUserMyAccount} = require('./myAccountScreen');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers

// Get the action from the command-line argument or environment variable
const action = process.env.ACTION || process.argv[2]; // Use `ACTION` env variable or second CLI argument

if (action === 'emmanuel') {
    test.describe('Website Tests for Emmanuel', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(110000); 

            // //Step 1: Open the Site
            // await navigatetoURL(page, action,1);

            // //Step 2: Check if Favicon exists in the browser            
            // await checkFaviconIcon(page, action,2);

            // //Step 3: Find link Home in the Header and click
            // await checkHomeLinkHeader(page,3);

            // await page.waitForTimeout(2000); // 2000ms = 2 seconds
            // //Step 4: Check if Header elements exist
            // await checkHeaderElements(page, action,4);

            // //5.Check the Home screen Need to print title of all category
            // await checkCategoryTitleHomeScreen(page, action,5);

            // //6.Check the VODs in Home screen
            // await checkVodsInHome(page, action,6);
            
            // //7.Not logged user checking Details screen containts Go back Title background Image watch Now etc'
            // await UserDetailsScreen(page, action,7);

            // //8.Check the player screen
            // await checkPlayerScreen(page, action,8,'undefined');

            // //9.Check Related Content in Details screen
            // await checkRelatedContentInDetailsScreen(page, action,9);

            // //10. Check footer Section 
            // await checkFooterLinks (page,action,10);

            // //11. Check different scenario for contact Us
            // await contactUsFirstScenario(page,action,11);

            // //12. Check different scenario for registration User
            // await registrationScreen(page,action,12);

            // //13. Check the Login screen
            // await loginScreen(page,action,13);
        });
    });
} else if (action === 'amorir') {
    test.describe('Website Tests for Amorir', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(140000); 
            
            //Step 1: Open the Site
            await navigatetoURL(page, action,1);

            //Step 2: Check if Favicon exists in the browser                
            await checkFaviconIcon(page, action,2);

            //Step 3: Find link Home in the Header and click
            await checkHomeLinkHeader(page,3);  

            await page.waitForTimeout(2000); // 2000ms = 2 seconds
            //Step 4: Check if Header elements exist
            await checkHeaderElements(page, action,4);

            // //5.Check the Home screen Need to print title of all category
             await checkCategoryTitleHomeScreen(page, action,5);

            // //6.Check the VODs in Home screen
             await checkVodsInHome(page, action,6);

            // //7.Not logged user checking Details screen containts Go back Title background Image Subscribe etc'
             await UserDetailsScreen(page, action,7);

            // //8.Check Related Content in Details screen
             await checkRelatedContentInDetailsScreen(page, action,8);

            // //9. Check footer Section 
             await checkFooterLinks (page,action,9);

            //10. Check different scenario for registration User
            await registrationScreen(page,action,10);

            //11. Check the Login screen
            await loginScreen(page,action,11);

            //12. Check the Forgot Password screen
            await forgotScreen(page,action,12);

            //13.Logged User my Account
            await loggedUserMyAccount (page,action,13);

            // 14.Login with New Password
            await loginScreenNewPassword(page,action,14);
        });
    });
}else if (action === 'okgol') {
    test.describe('Website Tests for Okgol', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(110000); 
    
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

            //7.Not logged user checking Details screen containts Go back Title background Image Subscribe etc'
            await UserDetailsScreen(page, action,7);

            //8.Check Related Content in Details screen
            await checkRelatedContentInDetailsScreen(page, action,8);

            //9. Check footer Section 
            await checkFooterLinks (page,action,9);

            //10. Check different scenario for registration User
            await registrationScreen(page,action,10);

            //11. Check the Login screen
            await loginScreen(page,action,11);

            //12. Check the Forgot Password screen
            await forgotScreen(page,action,12);

            //13.Logged User my Account
            await loggedUserMyAccount (page,action,13);

            // 14.Login with New Password
            await loginScreenNewPassword(page,action,14);
        });
    })
}else if (action === 'televicentro'){
    test.describe('Website Tests for Televicentro', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(120000); 

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

            //7.Not logged user checking Details screen containts Go back Title background Image Subscribe etc'
             await UserDetailsScreen(page, action,7);

            logSuccess('Notes: Televicentro does not have related content VODs added.');

            // Is not added related content for Televicentro so we skip this step
            // //8.Check Related Content in Details screen
            //  await checkRelatedContentInDetailsScreen(page, action,8);

            //8. Check footer Section 
            await checkFooterLinks (page,action,8);

            //9. Check different scenario for contact Us
            await contactUsFirstScenario(page,action,9);

            //10. Check different scenario for registration User
            await registrationScreen(page,action,10);

            //11. Check the Login screen
             await loginScreen(page,action,11);

            //12. Check the Forgot Password screen
             await forgotScreen(page,action,12);

            //13.Logged User my Account
             await loggedUserMyAccount (page,action,13);

            // 14.Login with New Password
             await loginScreenNewPassword(page,action,14);
        });
    })
}else if(action === 'panamsport'){
    test.describe('Website Tests for Panamsport', () => {
        test('Website Tests', async ({ page }) => {
            test.setTimeout(110000); 
    
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

            //7.Not logged user checking Details screen containts Go back Title background Image Subscribe etc'
            await UserDetailsScreen(page, action,7);

            //8.Check Related Content in Details screen
            await checkRelatedContentInDetailsScreen(page, action,8);

            //9. Check footer Section 
            await checkFooterLinks (page,action,9);

            //10. Check different scenario for contact Us
            await contactUsFirstScenario(page,action,10);

           // 11. Check different scenario for registration User
            await registrationScreen(page,action,11);

            //12. Check the Login screen
            await loginScreen(page,action,12);

            //13. Check the Forgot Password screen
            await forgotScreen(page,action,13);

            //13.Logged User my Account
            await loggedUserMyAccount (page,action,13);

            // 14.Login with New Password
            await loginScreenNewPassword(page,action,14);
        });
    })

} else {
    console.log('No valid action provided. Use "Amorir,OkGol,Televicentro,PanamSport" or "Emmanuel".');
    process.exit(1);
}