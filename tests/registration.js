const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists ,selectDropdownByVisibleText,checkAriaInvalid} = require('./helper'); 

async function registrationScreen(page, action, stepNumber) {
  await test.step(`${stepNumber}. Registration Screen check Different Scenario: 1. Scenario check if exist all fields`, async () => {
  logStep(`${stepNumber}. Registration Screen Different Scenario: 1. Scenario check if exist all fields`);

    // CLick to redirect to Registration Screen from the Header
    const subscribeButton = page.locator(`xpath=//*[contains(normalize-space(text()), 'Subscribe Now') or contains(normalize-space(text()), 'Suscríbase Ahora')]`);
    if (await subscribeButton.count()) {
      await subscribeButton.first().click();
      console.log("Subscribe button clicked in the header!");
    } else {
      throw new Error("❌ Subscribe button not found!");
    }

    // Wait for the Registration screen to load
    await page.waitForSelector('#subscribe-button', { state: 'visible' });
    try {
      // Check first Title
    const h1 = page.locator('h1');
      try {
          await expect(h1).toHaveText(/Registration|Registro/i);
          const headingText = await h1.textContent();
          logSuccess(`✅ Found Title: "${headingText?.trim()}"`);
        } catch (error) {
          const actualText = await h1.textContent();
          logError(`❌ Heading did not match expected text. Found: "${actualText?.trim()}"`);
          throw error;
        }

      let requiredFields = [];
      if (action === 'emmanuel') {
        // Check if all input fields exist on the Contact Us page
        requiredFields = [
          { locator: '#firstname', name: 'First Name' },
          { locator: '#lastname', name: 'Last Name' },
          { locator: '#email', name: 'Email' },
          { locator: '#password', name: 'Password' },
          { locator: '#confirmPassword', name: 'Confirm Password' },
          { locator: '//mat-select[@aria-label="Default select example"]', name: 'Dropdown Select Country' },
          { locator: '#termsOfUseCheckBox', name: 'Checkbox Terms of Use' },
          { locator: '#receiveEmailsCheckBox', name: 'receiveEmailsCheckBox' },
          { locator: '#subscribe-button', name: 'Submit Button' },
        ];
      }else if (action === 'amorir') {
        requiredFields = [
          { locator: '#firstname', name: 'First Name' },
          { locator: '#lastname', name: 'Last Name' },
          { locator: '#email', name: 'Email' },
          { locator: '#password', name: 'Password' },
          { locator: '#confirmPassword', name: 'Confirm Password' },
          { locator: '#termsOfUseCheckBox', name: 'Checkbox Terms of Use' },
          { locator: '#subscribe-button', name: 'Submit Button' },
        ];
      }

      for (const element of requiredFields) {
          await checkElementExists(page, element.locator, element.name);
      }

      // Check if exist link for Sign In
      const signInLink = page.locator('a.sign_in.text-decoration-none.reseller-color-link');
      if (await signInLink.isVisible()) {
        const title = await page.title();
        logSuccess('✅ Sign-in link is found and visible.', title);
      } else {
        logError('Sign-in link is not visible.');
        throw new Error("❌ Sign-in link not found!");
      }

      // Check if button subscribe is disabled
      await checkSubscribeButtonDisabled(page, action);
      console.log('All fields are empty. Now checking if the subscribe button is disabled...');

      // Increment step number and call the four scenario as a separate step
      stepNumber += 1;
      await regScreenSecondScenario(page, action, stepNumber);

    } catch (err) {
      logError(`❌ An error occurred in registrationScreen: ${err.message}`);
      throw new Error(`❌ An error occurred in registrationScreen: ${err.message}`);
    }
  });
}

async function regScreenSecondScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Registration Screen Second Scenario: Need to appear warning message in Email , Password and Confirm Password`, async () => {
    logStep(`${stepNumber}.Registration Screen Second Scenario: Need to appear warning message in Email , Password and Confirm Password`);
    try {

       // Fill First Name 
       await page.locator('#firstname').fill('Test');
       const firstName = await page.locator('#firstname').inputValue();
       console.log(`First Name has Value: ${firstName}`);

       //Fill Last Name
       await page.locator('#lastname').fill('Test');
       const lastName = await page.locator('#lastname').inputValue();
       console.log(`Last Name has Value: ${lastName}`);

      // Fill Select Country
      await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'Albania');

      // Fill Email Not Valid
      await page.locator('#email').fill('test@');
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);
      
      // Fill Password Not Valid
      await page.locator('#password').fill('123');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has Value: ${password}`);
      // Fill Confirm Password Not Valid    

      await page.locator('#confirmPassword').fill('123');
      const confirmPassword = await page.locator('#confirmPassword').inputValue();  
      console.log(`Confirm Password has Value: ${confirmPassword}`);
      await page.waitForTimeout(11000); // Wait for 1 second

      const invalidFields = [
        { id: '#email', name: 'Email'},
        { id: '#password', name: 'Password' },
        { id: '#confirmPassword', name: 'Confirm Password' },
      ];

      for (const field of invalidFields) {
        await checkAriaInvalid(page, field); // <-- Use helper function here
      }

      await termsOfUseCheckBox(page, action);

       // Check if button subscribe is disabled
       await checkSubscribeButtonDisabled(page, action);
       console.log('Now checking if the subscribe button is disabled...');

    } catch (err) {
      logError(`❌ An error occurred in contactUsSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsSecondScenario: ${err.message}`);
    }
  });
}
async function termsOfUseCheckBox(page, action) {
    logStep(`Terms of Use CheckBox`);
    try {
      const termsOfUseCheckBox = page.locator('#termsOfUseCheckBox');
      //await termsOfUseCheckBox.click();
      const isChecked = await termsOfUseCheckBox.evaluate((el) => el.checked);
      if (isChecked) {
        console.log(' Terms of Use checkbox is checked.');
      } else {
        console.log(' Terms of Use checkbox is not checked.');
      }
    } catch (err) {
      logError(`❌ An error occurred in termsOfUseCheckBox: ${err.message}`);
      throw new Error(`❌ An error occurred in termsOfUseCheckBox: ${err.message}`);
    }
}

async function checkSubscribeButtonDisabled(page, action) {
    // Check if the subscribe button is disabled
    const subscribeButton = page.locator('#subscribe-button');
    const isDisabled = await subscribeButton.evaluate((el) => el.disabled);
    if (isDisabled) {
      logSuccess('✅ Subscribe button is disabled as expected.');
    } else {
      logError('❌ Subscribe button is enabled when it should be disabled.');
      throw new Error("❌ Subscribe button is enabled when it should be disabled.");
    }
}

module.exports = {
  registrationScreen,
};








