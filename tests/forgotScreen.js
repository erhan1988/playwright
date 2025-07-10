const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists,checkAriaInvalid,checkDinamiclyPopUP,generateEmail} = require('./helper'); 

async function forgotScreen(page, action, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Different Scenario: 1. Check if exist all fields `, async () => {
    logStep(`${stepNumber}. Forgot Screen Different Scenario: 1. Check if exist all fields `);

    try {
      // Go to login and wait for a key element
      const baseUrl = `https://${action}-v3-dev.streann.tech/login`;
      const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 70000 });
      console.log('Goto response status:', response && response.status());
      console.log('Current URL after goto:', page.url());
      if (action === 'panamsport' || action === 'gols'|| action === 'prtv') {
         await page.waitForSelector('#login-button, [type="submit"]', { state: 'visible', timeout: 40000 });
      }
      // Click Forgot Password and wait for navigation
      const forgotPasswordLink = page.locator('#forgotPass');
      console.log('⏳ Waiting for forgot password link...');
      await expect(forgotPasswordLink).toBeVisible({ timeout: 40000 });
      await Promise.all([
        page.waitForURL('**/forgot-password', { timeout: 20000 }),
        forgotPasswordLink.click()
      ]);
      expect(page.url()).toContain('/forgot-password');

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
      await forgotScreenSecondScenario(page, action, stepNumber);

      stepNumber += 1;
      await forgotScreenThirdScenario(page, action, stepNumber);

      stepNumber += 1;
      await forgotScreenFourthScenario(page, action, stepNumber);

    } catch (err) {
      logError(`❌ An error occurred in forgotScreen: ${err.message}`);
      throw new Error(`❌ An error occurred in forgotScreen: ${err.message}`);
    }
  });
}

async function forgotScreenSecondScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Second Scenario: 2. Click in the button Send email without to fill Email Field need to appear Warning Message `, async () => {
    logStep(`${stepNumber}. Forgot Screen Second Scenario: 2. Click in the button Send email without to fill Email Field need to appear Warning Message `);

    try {
      await page.waitForSelector('#send-email-button', { state: 'visible', timeout: 15000 });
      const sendEmailButton = page.locator('#send-email-button');
      await expect(sendEmailButton).toBeVisible({ timeout: 20000 });
      await sendEmailButton.click();
      console.log('✅ Clicked on Send Email button without filling the email field.');

      const invalidFields = [
        { id: '#email', name: 'Email Field' },
      ];
      for (const field of invalidFields) {
        await checkAriaInvalid(page, field);
      }
    } catch (err) {
      await page.screenshot({ path: `forgotScreenSecondScenario_error_${Date.now()}.png` });
      logError(`❌ An error occurred in forgotScreenSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in forgotScreenSecondScenario: ${err.message}`);
    }
  });
}

async function forgotScreenThirdScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Third Scenario: 3. Fill wrong email need to appear message warning Message `, async () => {
    logStep(`${stepNumber}. Forgot Screen Third Scenario: 3. Fill wrong email need to appear message warning Message `);

    try {
      await page.reload();
      //await page.waitForSelector('.loader', { state: 'hidden', timeout: 10000 }); // <-- Add here

      try {
        await page.waitForSelector('#send-email-button', { state: 'visible', timeout: 20000 });
        const sendEmailButton = page.locator('#send-email-button');
        await expect(sendEmailButton).toBeVisible({ timeout: 12000 });
      } catch (err) {
        await page.screenshot({ path: `send_email_button_error_${Date.now()}.png` });
        console.log('Current URL:', page.url());
        throw new Error('❌ #send-email-button not visible after waiting');
      }

      // Fill the email field with an invalid email address
      await page.locator('#email').fill('dd@streann.com');
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

      // Click in the Send Email button
      const sendEmailButton = page.locator('#send-email-button');
      await expect(sendEmailButton).toBeVisible({ timeout: 8000 });
      await sendEmailButton.click();

      // Check if the error pop-up is visible
      await checkDinamiclyPopUP(page, action, '#error-forgot-pass');
      console.log('Now checking if the error pop up is visible...');

    } catch (err) {
      logError(`❌ An error occurred in forgotScreenThirdScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in forgotScreenThirdScenario: ${err.message}`);
    }
  });
}
async function forgotScreenFourthScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Fourth Scenario: 4. Fill correct email need to appear success Message `, async () => {
    logStep(`${stepNumber}. Forgot Screen Fourth Scenario: 4. Fill correct email need to appear success Message `);

    try {
      await page.reload();
      try {
        const sendEmailButton = page.locator('#send-email-button');
        await expect(sendEmailButton).toBeVisible({ timeout: 15000 });
        await expect(sendEmailButton).toBeEnabled({ timeout: 20000 });
        await sendEmailButton.click();
        console.log('✅ Clicked on Send Email button without filling the email field.');
      } catch (err) {
        await page.screenshot({ path: `send_email_button_error_${Date.now()}.png` });
        console.log('Current URL:', page.url());
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
      await checkDinamiclyPopUP(page, action, '#success_forgot_pass');
      console.log('Now checking if the success pop up is visible...');

      // Click in cancel Button need to redirect to the Home Page 
      const cancelButton = page.locator('#button-cancel');
      await expect(cancelButton).toBeVisible({ timeout: 10000 });
      await cancelButton.click();
      logSuccess('✅ Clicked on Cancel button.');

      // Check if the URL is correct
      const url = `https://${action}-v3-dev.streann.tech/`;
      await page.waitForURL(url, { timeout: 20000 });
      await expect(page).toHaveURL(url);
      console.log(`✅ Successfully navigated to ${url}`);

    } catch (err) {
      await page.screenshot({ path: `forgotScreenFourthScenario_error_${Date.now()}.png` });
      logError(`❌ An error occurred in forgotScreenFourthScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in forgotScreenFourthScenario: ${err.message}`);
    }
  });
}







module.exports = {
  forgotScreen,
};








