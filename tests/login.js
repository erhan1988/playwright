const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists,redirectUrl,checkDinamiclyPopUP} = require('./helper'); 

async function loginScreen(page, action, stepNumber) {
  await test.step(`${stepNumber}. Login Screen check Different Scenario: 1. Scenario from registration if is redirect to te Login Screen`, async () => {
  logStep(`${stepNumber}. Login Screen check Different Scenario: 1. Scenario from registration if is redirect to te Login Screen`);

  try {
    // Check first from registration if is redirect to the Login screen 
    // Check if exist link for Sign In
    const signInLink = page.locator('a.sign_in.text-decoration-none.reseller-color-link');
    if (await signInLink.isVisible()) {
      const title = await page.title();
      logSuccess('✅ Sign-in link is found and visible.', title);

      // Click the sign-in link
      await signInLink.click();

      // Wait for navigation to complete
      await page.waitForSelector('#login-button', { state: 'visible', timeout: 20000 });

      // Check if the current URL contains "/login"
      const currentURL = page.url();
      await redirectUrl(page,'/login');
    } else {
      logError('Sign-in link is not visible.');
      throw new Error("❌ Sign-in link not found!");
    }
   
    // navigate Back to the previous screen Registration
    await page.goBack({ timeout: 30000 }); // Optional timeout
    console.log('✅ Navigated back to the previous page.');

    stepNumber += 1;
    await loginScreenSecondScenario(page, action, stepNumber);

    stepNumber += 1;
    await loginScreenThirdScenario(page, action, stepNumber);

    stepNumber += 1;
    await loginScreenFourScenario(page, action, stepNumber);

    stepNumber += 1;
    await loginScreenFiveScenario(page, action, stepNumber);
  
    } catch (err) {
      logError(`❌ An error occurred in loginScreen: ${err.message}`);
      throw new Error(`❌ An error occurred in loginScreen: ${err.message}`);
    }
  });
}

async function loginScreenSecondScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Login Screen Second Scenario: Click from the haeader need to redirect to the login screen also check are exist all fields`, async () => {
    logStep(`${stepNumber}. Login Screen Second Scenario: Click from the header need to redirect to the login screen also check are exist all fields`);
    try {
      // CLick to redirect to login Screen from the Header
      const loginbutton = page.locator(`xpath=//*[contains(normalize-space(text()), 'Log In') or contains(normalize-space(text()), 'Iniciar sesión') or contains(normalize-space(text()), 'Ingresar')]`);
      if (await loginbutton.count()) {
        await loginbutton.first().click();
        console.log("Login button clicked in the header!");
      } else {
        throw new Error("❌ Login button not found!");
      }
      // Wait for the Registration screen to load
      await page.waitForSelector('#login-button', { state: 'visible' });

      // Check if exist all fields in the Login screen
       // Check first Title
       const h1 = page.locator('h1');
      try {
        await expect(h1).toHaveText(/Log in|Ingresar/i);
        const headingText = await h1.textContent();
        logSuccess(`✅ Found Title: "${headingText?.trim()}"`);
      } catch (error) {
        const actualText = await h1.textContent();
        logError(`❌ Heading did not match expected text. Found: "${actualText?.trim()}"`);
        throw error;
      }

      let requiredFields = [];
      requiredFields = [
        { locator: '#username', name: 'Email Field' },
        { locator: '#password', name: 'Password Field' },
        { locator: '#rememberMe-input', name: 'Remember me checkbox' },
        { locator: '#forgotPass', name: 'Link Forgot Password' },
        { locator: '#login-button', name: 'Login Button' },
      ];

      for (const element of requiredFields) {
        await checkElementExists(page, element.locator, element.name);
      }

      // After this i will check also if exist the link for Sign Up
      const link = await page.locator('a[href="/subscribe"]');
      const text = await link.textContent();
      console.log('Link text:', text?.trim());
      if (await link.isVisible()) {
        logSuccess('✅ Sign Up link is visible.');
      } else {
        logError('❌ Sign Up link is not visible.');
      }
      // Check if button login is disabled
      await checkLoginButtonDisabled(page, action);
      console.log('All fields are empty. Now checking if the login button is disabled...');

    } catch (err) {
      logError(`❌ An error occurred in loginScreenSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in loginScreenSecondScenario: ${err.message}`);
    }
  });
}

async function loginScreenThirdScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Login Screen Third Scenario: Fill Email and password which is not exist in the Base need to appear pop up`, async () => {
    logStep(`${stepNumber}. Login Screen Third Scenario: Fill Email and password which is not exist in the Base need to appear pop up`);
    try {
      // Fill the Email 
      await page.locator('#email').fill('nonexistent@example.com');
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

      // Fill the password
      await page.locator('#password').fill('wrongpassword');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has Value: ${password}`);

      await checkLoginButtonDisabled(page, action, 'enabled');
      console.log('Now checking if the login button is Enabled...');

      await checkDinamiclyPopUP(page, action,'#toast-container');

    } catch (err) {
      logError(`❌ An error occurred in loginScreenThirdScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in loginScreenThirdScenario: ${err.message}`);
    }
  });
}

async function loginScreenFourScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Login Screen Four Scenario: Fill Email Password need to be Empty Login button need to be disabled`, async () => {
    logStep(`${stepNumber}. Login Screen Four Scenario: Fill Email Password need to be Empty Login button need to be disabled`);
    try {
      //Refresh the page to reset the form
      await page.reload();
      await page.waitForSelector('#login-button', { state: 'visible' });

      // Fill the Email 
      await page.locator('#email').fill('test@streann.com');
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

      //Password empty
      await page.locator('#password').fill('');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has not Value: ${password}`);

      await checkLoginButtonDisabled(page, action);
      console.log('Now checking if the login button is Disabled...');

    } catch (err) {
      logError(`❌ An error occurred in loginScreenFourScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in loginScreenFourScenario: ${err.message}`);
    }
  });
}

async function loginScreenFiveScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Login Screen Five Scenario: Empty Email Password filled Login button need to be disabled`, async () => {
    logStep(`${stepNumber}. Login Screen Five Scenario: Empty Email Password filled Login button need to be disabled`);
    try {
        //Refresh the page to reset the form
        await page.reload();
        await page.waitForSelector('#login-button', { state: 'visible' });

      // Email Empty
      await page.locator('#email').fill('');
      const email = await page.locator('#email').inputValue();
      console.log(`Email has not Value: ${email}`);

      //Fill the Password
      await page.locator('#password').fill('123123');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has  Value: ${password}`);

      await checkLoginButtonDisabled(page, action);
      console.log('Now checking if the login button is Disabled...');

    } catch (err) {
      logError(`❌ An error occurred in loginScreenFiveScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in loginScreenFiveScenario: ${err.message}`);
    }
  });
}

// NEXT i NEED TO CHECK TO LOGIN AND THEN TO LOG OUT ..
// THEN TO CHECK FORGOT PASSWORD SCREEN




async function checkLoginButtonDisabled(page, action, enabled) {
  if (enabled) {
    // Should be enabled
    const isDisabled = await page.locator('#login-button').isDisabled();
    if (!isDisabled) {
        logSuccess('✅ Login button is enabled as expected.');
        console.log('Click in the Login button');
        await page.waitForTimeout(5000); // Wait for 5 seconds 
        await page.locator('#login-button').click();
    } else {
        logError('❌ Login button is disabled when it should be enabled.');
        throw new Error('❌ Login button is disabled when it should be enabled.');
    }
  } else {
    // Should be disabled
    const isDisabled = await page.locator('#login-button').isDisabled();
    if (isDisabled) {
        logSuccess('✅ Login button is disabled as expected.');
    } else {
        logError('❌ Login button is enabled when it should be disabled.');
        throw new Error('❌ Login button is enabled when it should be disabled.');
    }
  }
}



module.exports = {
  loginScreen,
};








