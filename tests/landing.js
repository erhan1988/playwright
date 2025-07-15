const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { redirectUrl } = require('./helper'); 

async function checkButtonsLandingPage(page, action, stepNumber) {
    await test.step(`${stepNumber}. Check Buttons on the Landing Page Login/Register`, async () => {
        logStep(`${stepNumber}. Checking buttons on the landing page Login/Register...`);

        const registerButton = page.locator("//button[contains(., 'Registrate')]").first();
        await registerButton.waitFor({ timeout: 10000 });
        await expect(registerButton).toBeVisible();

        const loginButton = page.locator("//button[contains(., 'Iniciar Sesión')]").first();
        await loginButton.waitFor({ timeout: 10000 });
        await expect(loginButton).toBeVisible();

        // Login Button
        try {
          await expect(loginButton).toBeVisible({ timeout: 20000 });
          logSuccess('✅ Login button is visible');
        } catch (error) {
          logError('❌ Login button not found or not visible');
        }

        // Register Button
        try {
          await expect(registerButton).toBeVisible({ timeout: 20000 });
          logSuccess('✅ Register button is visible');
        } catch (error) {
          logError('❌ Register button not found or not visible');
        }
      
      stepNumber += 1;
      await landingPageSecondScenario(page, action, stepNumber);

    });
}

async function landingPageSecondScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Checking landing Page if redirect to the Login and Register Screen`, async () => {
    logStep(`${stepNumber}. Checking landing Page if redirect to the Login and Register Screen`);
    try {

      // First click in the register button and check if redirect to the Register Screen
      const registerButton = page.locator("//button[contains(., 'Registrate')]").nth(2);
      await registerButton.waitFor({ timeout: 10000 });
      await registerButton.click({ force: true });
      logSuccess('✅ Register button clicked, waiting for redirect...');
      await redirectUrl(page,'/subscribe');
      logSuccess(`✅ Redirected to the Register Screen for action: ${action}`);

      // Now go back
      await page.goBack();
      await expect(page).toHaveURL(`https://${action}-v3-dev.streann.tech/page/landing`, { timeout: 15000 });
      logSuccess('✅ Successfully navigated back to the landing page');

      // Now click in the login button and check if redirect to the Login Screen
      const loginButton = page.locator("//button[contains(., 'Iniciar Sesión')]").nth(2);
      await loginButton.waitFor({ timeout: 10000 });
      await loginButton.click({ force: true });
      logSuccess('✅ Login button clicked, waiting for redirect...');
      await redirectUrl(page, '/login');
      logSuccess(`✅ Redirected to the Login Screen for action: ${action}`);  
      await page.waitForSelector('#login-button', { state: 'visible', timeout: 20000 });


    } catch (err) {
      logError(`❌ An error occurred in landingPageSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in landingPageSecondScenario: ${err.message}`);
    }
  });
}
async function landingPageRegisterButton(page, action, stepNumber) {
  await test.step(`${stepNumber}. Checking landing Page to redirect to the  Register Screen`, async () => {
    logStep(`${stepNumber}.Checking landing Page to redirect to the  Register Screen`);
    try {
      // First click in the register button and check if redirect to the Register Screen
      const registerButton = page.locator("//button[contains(., 'Registrate')]").nth(2);
      await registerButton.waitFor({ timeout: 10000 });
      await registerButton.click({ force: true });
      logSuccess('✅ Register button clicked, waiting for redirect...');
      await redirectUrl(page,'/subscribe');
      logSuccess(`✅ Redirected to the Register Screen for action: ${action}`);

    } catch (err) {
      logError(`❌ An error occurred in landingPageSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in landingPageSecondScenario: ${err.message}`);
    }
  });
}



module.exports = {
  checkButtonsLandingPage,
  landingPageRegisterButton
};

