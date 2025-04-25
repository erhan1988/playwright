const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists  } = require('./helper'); 

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
    } catch (err) {
      logError(`❌ An error occurred in contactUsFirstScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsFirstScenario: ${err.message}`);
    }
  });
}

module.exports = {
  registrationScreen,
};








