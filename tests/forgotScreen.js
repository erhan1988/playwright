const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists} = require('./helper'); 

async function forgotScreen(page, action, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Different Scenario: 1. Check if exist all fields `, async () => {
  logStep(`${stepNumber}. Forgot Screen Different Scenario: 1. Check if exist all fields `);

  try {
      // navigate to the Login screen
      const baseUrl = `https://${action}-v3-dev.streann.tech/login`;
      await page.goto(baseUrl, { waitUntil: 'networkidle' });

      // Wait for the login screen to load
      await page.waitForSelector('#login-button', { state: 'visible' });
  
      // click in the link Forgot Password 
      const forgotPasswordLink = page.locator('#forgotPass');
      if (await forgotPasswordLink.isVisible()) {
        await forgotPasswordLink.click();
        logSuccess('✅ Clicked on Forgot Password link.');
        await page.waitForURL('**/forgot-password');
        expect(page.url()).toContain('/forgot-password');
      } else {
        throw new Error('❌ Forgot Password link not found!');
      }

      // Check firs title if exist 
      const h1 = await page.locator('h1.mb-1.d-block.float-left.fs-2.fw-bold').first();
      const titleText = await h1.textContent();
      logSuccess('Title in the Forgot Password:', titleText);
      expect(titleText).not.toBeNull();

      // Check if all fields exist in the Forgot Password screen
      let requiredFields = [];
      requiredFields = [
        { locator: '#back-button', name: 'Back Button' },
        { locator: '#email', name: 'Email Field' },
        { locator: '#send-email-button', name: 'Send Email Button' },
        { locator: '#button-cancel', name: 'Cancel Button' },
      ];
      // Check if all required fields exist
      for (const element of requiredFields) {
        await checkElementExists(page, element.locator, element.name);
      }
    
  } catch (err) {
    logError(`❌ An error occurred in forgotScreen: ${err.message}`);
    throw new Error(`❌ An error occurred in forgotScreen: ${err.message}`);
    }
  });
}

// async function loginScreenSecondScenario(page, action, stepNumber) {
//   await test.step(`${stepNumber}. Login Screen Second Scenario: Click from the haeader need to redirect to the login screen also check are exist all fields`, async () => {
//     logStep(`${stepNumber}. Login Screen Second Scenario: Click from the header need to redirect to the login screen also check are exist all fields`);
//     try {
//       // CLick to redirect to login Screen from the Header
//       const loginbutton = page.locator(`xpath=//*[contains(normalize-space(text()), 'Log In') or contains(normalize-space(text()), 'Iniciar sesión') or contains(normalize-space(text()), 'Ingresar')]`);
//       if (await loginbutton.count()) {
//         await loginbutton.first().click();
//         console.log("Login button clicked in the header!");
//       } else {
//         throw new Error("❌ Login button not found!");
//       }
//       // Wait for the Registration screen to load
//       await page.waitForSelector('#login-button', { state: 'visible' });

//       // Check if exist all fields in the Login screen
//        // Check first Title
//        const h1 = page.locator('h1');
//       try {
//         await expect(h1).toHaveText(/Log in|Ingresar/i);
//         const headingText = await h1.textContent();
//         logSuccess(`✅ Found Title: "${headingText?.trim()}"`);
//       } catch (error) {
//         const actualText = await h1.textContent();
//         logError(`❌ Heading did not match expected text. Found: "${actualText?.trim()}"`);
//         throw error;
//       }

//       let requiredFields = [];
//       requiredFields = [
//         { locator: '#username', name: 'Email Field' },
//         { locator: '#password', name: 'Password Field' },
//         { locator: '#rememberMe-input', name: 'Remember me checkbox' },
//         { locator: '#forgotPass', name: 'Link Forgot Password' },
//         { locator: '#login-button', name: 'Login Button' },
//       ];

//       for (const element of requiredFields) {
//         await checkElementExists(page, element.locator, element.name);
//       }

//       // After this i will check also if exist the link for Sign Up
//       const link = await page.locator('a[href="/subscribe"]');
//       const text = await link.textContent();
//       console.log('Link text:', text?.trim());
//       if (await link.isVisible()) {
//         logSuccess('✅ Sign Up link is visible.');
//       } else {
//         logError('❌ Sign Up link is not visible.');
//       }
//       // Check if button login is disabled
//       await checkLoginButtonDisabled(page, action);
//       console.log('All fields are empty. Now checking if the login button is disabled...');

//     } catch (err) {
//       logError(`❌ An error occurred in loginScreenSecondScenario: ${err.message}`);
//       throw new Error(`❌ An error occurred in loginScreenSecondScenario: ${err.message}`);
//     }
//   });
// }





module.exports = {
  forgotScreen,
};








