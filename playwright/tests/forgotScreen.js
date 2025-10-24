const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists,checkAriaInvalid,checkDinamiclyPopUP,generateEmail} = require('./helper'); 

async function forgotScreen(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Different Scenario: 1. Check if exist all fields `, async () => {
    logStep(`${stepNumber}. Forgot Screen Different Scenario: 1. Check if exist all fields `);

    try {
      // Go to login and wait for a key element
      if (reseller.name !== 'prtv'){
        const baseUrl = `https://${reseller.name}-v3-dev.streann.tech/login`;

        console.log(`⏳ Navigating to login page: ${baseUrl}`);

        // Check if page is already closed
        if (page.isClosed()) {
          throw new Error('❌ Page is already closed before navigation');
        }

        const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 70000 });
        console.log('✅ Goto response status:', response && response.status());
        console.log('✅ Current URL after goto:', page.url());

        // Check if page got closed during navigation
        if (page.isClosed()) {
          throw new Error('❌ Page closed during navigation');
        }

        // For slow loading pages, wait for load state with shorter timeout
        try {
          await page.waitForLoadState('load', { timeout: 30000 });
          console.log('✅ Page loaded');
        } catch (err) {
          console.log('⚠️ Load state timeout, continuing...');
        }

        // Check page state again
        if (page.isClosed()) {
          throw new Error('❌ Page closed after load wait');
        }

        // Wait directly for the forgot password link with extended timeout
        console.log('⏳ Waiting for forgot password link...');
        const forgotPasswordLink = page.locator('#forgotPass');

        try {
          // Use a more aggressive wait strategy
          await forgotPasswordLink.waitFor({ state: 'attached', timeout: 30000 });
          console.log('✅ Forgot password link is attached to DOM');
          await forgotPasswordLink.waitFor({ state: 'visible', timeout: 30000 });
          console.log('✅ Forgot password link is visible');
        } catch (err) {
          console.log('⚠️ Forgot password link not found, taking screenshot...');
          if (!page.isClosed()) {
            try {
              await page.screenshot({ path: `forgotpass_link_not_found_${reseller.name}_${Date.now()}.png` });
              // Also log what's actually on the page
              const bodyText = await page.locator('body').textContent().catch(() => 'Could not get body text');
              console.log('Page content preview:', bodyText?.substring(0, 200));
            } catch (screenshotErr) {
              console.log('⚠️ Could not take screenshot:', screenshotErr.message);
            }
          } else {
            console.log('❌ Page is closed, cannot take screenshot');
          }
          throw new Error(`❌ Forgot password link not found: ${err.message}`);
        }

        // Check page is still open before clicking
        if (page.isClosed()) {
          throw new Error('❌ Page closed before clicking forgot password link');
        }

        // Click Forgot Password and wait for navigation
        console.log('⏳ Clicking forgot password link...');
        await Promise.all([
          page.waitForURL('**/forgot-password', { timeout: 30000 }),
          forgotPasswordLink.click()
        ]);

        console.log('✅ Navigated to forgot password page');
        expect(page.url()).toContain('/forgot-password');
      }else {
        const context = page.context();
        await context.clearCookies();
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        const baseUrl = `https://${reseller.name}-v3-dev.streann.tech/forgot-password`;
        const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 70000 });
        console.log('Goto response status:', response && response.status());
        const currentUrl = page.url();
        if (!currentUrl.includes('/forgot-password')) {
          throw new Error('❌ URL does not contain /forgot-password — navigation failed.');
        }
        console.log('✅ Confirmed on forgot password page');
      }

      // Check title
      try {
        const h1 = await page.locator('h1.mb-1.d-block.float-left.fs-2.fw-bold').first();
        const titleText = await h1.textContent();
        console.log('Title in the Forgot Password:', titleText);
      } catch (e) {
        console.error('Failed to get title:', e);
      }

      // Check required fields
      const requiredFields = [
        { locator: '#back-button', name: 'Back Button' },
        { locator: '#email', name: 'Email Field' },
        { locator: '#send-email-button', name: 'Send Email Button' },
        { locator: '#button-cancel', name: 'Cancel Button' },
      ];
      for (const element of requiredFields) {
        await checkElementExists(page, element.locator, element.name);
      }

      stepNumber += 1;
      await forgotScreenSecondScenario(page, reseller, stepNumber);

      stepNumber += 1;
      await forgotScreenThirdScenario(page, reseller, stepNumber);

      stepNumber += 1;
      await forgotScreenFourthScenario(page, reseller, stepNumber);

    } catch (err) {
      logError(`❌ An error occurred in forgotScreen: ${err.message}`);
      throw new Error(`❌ An error occurred in forgotScreen: ${err.message}`);
    }
  });
}

async function forgotScreenSecondScenario(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Second Scenario: 2. Click in the button Send email without to fill Email Field need to appear Warning Message `, async () => {
    logStep(`${stepNumber}. Forgot Screen Second Scenario: 2. Click in the button Send email without to fill Email Field need to appear Warning Message `);

    // Reload the page to ensure a fresh state
    try {
      // Check if page is still open
      if (page.isClosed()) {
        throw new Error('❌ Page is closed at the start of forgotScreenSecondScenario');
      }

      const currentUrl = page.url();
      console.log('Current URL before reload:', currentUrl);

      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
      console.log('✅ Page reloaded successfully');

      // Wait for page to be fully interactive after reload
      await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
        console.log('⚠️ Load state timeout, but continuing...');
      });

      await page.waitForSelector('#send-email-button', { state: 'visible', timeout: 30000 });
      await page.waitForSelector('#email', { state: 'visible', timeout: 30000 });

      const sendEmailButton = page.locator('#send-email-button');
      await expect(sendEmailButton).toBeVisible({ timeout: 20000 });
      await expect(sendEmailButton).toBeEnabled({ timeout: 20000 });
      await sendEmailButton.click();
      console.log('✅ Clicked on Send Email button without filling the email field.');

      const invalidFields = [
        { id: '#email', name: 'Email Field' },
      ];
      for (const field of invalidFields) {
        await checkAriaInvalid(page, field);
      }
    } catch (err) {
      // Only take screenshot if page is still open
      if (!page.isClosed()) {
        try {
          await page.screenshot({ path: `forgotScreenSecondScenario_error_${Date.now()}.png` });
        } catch (screenshotErr) {
          console.log('⚠️ Could not take screenshot:', screenshotErr.message);
        }
      } else {
        console.log('❌ Page is closed, cannot take screenshot');
      }
      logError(`❌ An error occurred in forgotScreenSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in forgotScreenSecondScenario: ${err.message}`);
    }
  });
}

async function forgotScreenThirdScenario(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Third Scenario: 3. Fill wrong email need to appear message warning Message `, async () => {
    logStep(`${stepNumber}. Forgot Screen Third Scenario: 3. Fill wrong email need to appear message warning Message `);

    try {
      // Check if page is still open
      if (page.isClosed()) {
        throw new Error('❌ Page is closed at the start of forgotScreenThirdScenario');
      }

      await page.reload();
      console.log('✅ Page reloaded for third scenario');

      try {
        if ( reseller.name !== 'tdmax'){
          await page.waitForSelector('#send-email-button', { state: 'visible', timeout: 50000 });
        }
        const sendEmailButton = page.locator('#send-email-button');
        await expect(sendEmailButton).toBeVisible({ timeout: 30000 });
      } catch (err) {
        if (!page.isClosed()) {
          try {
            await page.screenshot({ path: `send_email_button_error_${Date.now()}.png` });
            console.log('Current URL:', page.url());
          } catch (screenshotErr) {
            console.log('⚠️ Could not take screenshot:', screenshotErr.message);
          }
        }
        throw new Error('❌ #send-email-button not visible after waiting');
      }

      // Fill the email field with an invalid email address
      await page.locator('#email').fill(reseller.forgotScreen.emailWrong);
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

      // Click in the Send Email button
      const sendEmailButton = page.locator('#send-email-button');
      await expect(sendEmailButton).toBeVisible({ timeout: 8000 });
      await sendEmailButton.click();

      // Check if the error pop-up is visible
      await checkDinamiclyPopUP(page, reseller, '#error-forgot-pass');
      console.log('Now checking if the error pop up is visible...');

    } catch (err) {
      logError(`❌ An error occurred in forgotScreenThirdScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in forgotScreenThirdScenario: ${err.message}`);
    }
  });
}
async function forgotScreenFourthScenario(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Fourth Scenario: 4. Fill correct email need to appear success Message `, async () => {
    logStep(`${stepNumber}. Forgot Screen Fourth Scenario: 4. Fill correct email need to appear success Message `);

    try {
      // Check if page is still open
      if (page.isClosed()) {
        throw new Error('❌ Page is closed at the start of forgotScreenFourthScenario');
      }

      await page.reload();
      console.log('✅ Page reloaded for fourth scenario');

      try {
        const sendEmailButton = page.locator('#send-email-button');
        await expect(sendEmailButton).toBeVisible({ timeout: 90000 });
        await expect(sendEmailButton).toBeEnabled({ timeout: 90000 });
        console.log('✅ Send Email button is visible and enabled.');
      } catch (err) {
        if (!page.isClosed()) {
          try {
            await page.screenshot({ path: `send_email_button_error_${Date.now()}.png` });
            console.log('Current URL:', page.url());
          } catch (screenshotErr) {
            console.log('⚠️ Could not take screenshot:', screenshotErr.message);
          }
        }
        throw new Error('❌ #send-email-button not visible or not clickable after waiting');
      }

      // Fill Email 
      const baseEmail = "test+@streann.com";
      const emailWithDate = generateEmail(baseEmail);
      console.log(emailWithDate);
      await page.locator('#email').fill(emailWithDate);
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

      // Click in the Send Email button
      const sendEmailButton = page.locator('#send-email-button');
      await expect(sendEmailButton).toBeVisible({ timeout: 8000 });
      await sendEmailButton.click();

      // Check if appear success message 
      await checkDinamiclyPopUP(page, reseller, '#success_forgot_pass');
      console.log('Now checking if the success pop up is visible...');

      // Click in cancel Button need to redirect to the Home Page 
      const cancelButton = page.locator('#button-cancel');
      await expect(cancelButton).toBeVisible({ timeout: 10000 });
      await cancelButton.click();
      logSuccess('✅ Clicked on Cancel button.');

      // Check if the URL is correct
      let url= '';
      if (reseller.name === 'tdmax'){
         url = `https://${reseller.name}-v3-dev.streann.tech/page/landing`;
      }else{
      url  = `https://${reseller.name}-v3-dev.streann.tech/`;
      }
      await page.waitForURL(url, { timeout: 20000 });
      await expect(page).toHaveURL(url);
      console.log(`✅ Successfully navigated to ${url}`);

    } catch (err) {
      if (!page.isClosed()) {
        try {
          await page.screenshot({ path: `forgotScreenFourthScenario_error_${Date.now()}.png` });
        } catch (screenshotErr) {
          console.log('⚠️ Could not take screenshot:', screenshotErr.message);
        }
      } else {
        console.log('❌ Page is closed, cannot take screenshot');
      }
      logError(`❌ An error occurred in forgotScreenFourthScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in forgotScreenFourthScenario: ${err.message}`);
    }
  });
}







module.exports = {
  forgotScreen,
};








