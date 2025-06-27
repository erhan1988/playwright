const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists,checkAriaInvalid,checkDinamiclyPopUP,generateEmail} = require('./helper'); 

async function forgotScreen(page, action, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Different Scenario: 1. Check if exist all fields `, async () => {
  logStep(`${stepNumber}. Forgot Screen Different Scenario: 1. Check if exist all fields `);

  try {
      // navigate to the Login screen
      const baseUrl = `https://${action}-v3-dev.streann.tech/login`;
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      
      // Wait for the login screen to load
      await page.waitForSelector('#login-button', { state: 'visible', timeout: 10000 });

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
      try {
        const h1 = await page.locator('h1.mb-1.d-block.float-left.fs-2.fw-bold').first();
        const titleText = await h1.textContent();
        console.log('Title in the Forgot Password:', titleText);
      } catch (e) {
        console.error('Failed to get title:', e);
      }

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
      // Check if the Send Email button is visible
      const sendEmailButton = page.locator('#send-email-button');
      if (await sendEmailButton.isVisible()) {
        await sendEmailButton.click();
        console.log('✅ Clicked on Send Email button without filling the email field.');
      } else {
        throw new Error('❌ Send Email button not found!');
      }

      const invalidFields = [
        { id: '#email', name: 'Email Field' },
      ];

      for (const field of invalidFields) {
        await checkAriaInvalid(page, field); // <-- Use helper function here
      }
  } catch (err) {
    logError(`❌ An error occurred in forgotScreenSecondScenario: ${err.message}`);
    throw new Error(`❌ An error occurred in forgotScreenSecondScenario: ${err.message}`);
    }
  });
}
async function forgotScreenThirdScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Forgot Screen Third Scenario: 3. Fill wrong email need to appear message warning Message `, async () => {
  logStep(`${stepNumber}. Forgot Screen Third Scenario: 3. Fill wrong email need to appear message warning Message `);

  try {
    // Make regresh the page 
    await page.reload();
    await page.waitForSelector('#send-email-button', { state: 'visible' });

    // Fill the email field with an invalid email address
    await page.locator('#email').fill('dd@streann.com');
    const email = await page.locator('#email').inputValue();
    console.log(`Email has Value: ${email}`);

    // Click in the Send Email button
    const sendEmailButton = page.locator('#send-email-button');
    await sendEmailButton.click();

    // Check if the error pop-up is visible
    await checkDinamiclyPopUP(page, action,'#error-forgot-pass');
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
    // Make refresh the page 
    await page.reload();
await page.waitForSelector('#send-email-button', { state: 'visible', timeout: 7000 });
    // Fill Email 
    const baseEmail = "test+@streann.com";
    const emailWithDate = generateEmail(baseEmail);
    console.log(emailWithDate); 
    await page.locator('#email').fill(emailWithDate);
    const email = await page.locator('#email').inputValue();
    console.log(`Email has Value: ${email}`);

    // Click in the Send Email button
    const sendEmailButton = page.locator('#send-email-button');
    await sendEmailButton.click();

    // Check if appear succes message 
    await checkDinamiclyPopUP(page, action,'#success_forgot_pass');
    console.log('Now checking if the error pop up is visible...');

    // Click in cancel Button need to redirect to the Home Page 
    const cancelButton = page.locator('#button-cancel');
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      logSuccess('✅ Clicked on Cancel button.');
    } else {
      throw new Error('❌ Cancel button not found!');
    }
    // Check if the URL is correct
    const url = `https://${action}-v3-dev.streann.tech/`;
    await expect(page).toHaveURL(url);
    console.log(`✅ Successfully navigated to ${url}`);

  } catch (err) {
    logError(`❌ An error occurred in forgotScreenFourthScenario: ${err.message}`);
    throw new Error(`❌ An error occurred in forgotScreenFourthScenario: ${err.message}`);
    }
  });
}








module.exports = {
  forgotScreen,
};








