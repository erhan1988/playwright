const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists  } = require('./helper'); 

async function contactUsFirstScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}.Contact Us First scenario Check if exist Title and fields `, async () => {
    logStep(`${stepNumber}.Contact Us First scenario Check if exist Title and fields`);
    try {

        await page.waitForTimeout(2000);

        // Check first Title
        await page.waitForTimeout(10000);
        const h1 = page.locator('h1');
        try {
          await expect(h1).toHaveText(/Contact Us|Contáctenos/i);
          const headingText = await h1.textContent();
          logSuccess(`✅ Found Title: "${headingText?.trim()}"`);
        } catch (error) {
          const actualText = await h1.textContent();
          logError(`❌ Heading did not match expected text. Found: "${actualText?.trim()}"`);
          throw error; 
        }

        // check if exist all input fields in the contact us page 
        const contactUsElements = [
          { locator: '#customer-service', name: 'Form Contact Us' },
          { locator: '#mat-select-value-1', name: 'Dropdown Select Category' },
          { locator: '#email', name: 'Email' },
          { locator: '#subject', name: 'Subject' },
          { locator: '#issue', name: 'Text Area' },
          { locator: '#submit-button', name: 'Submit Button' },
        ];

        // Collect results for each element
        const results = [];
        for (const element of contactUsElements) {
            const result = await checkElementExists(page, element.locator, element.name);
            results.push(result); // Store the result
        }

        stepNumber += 1 ;
        await contactUsSecondScenario(page,action,stepNumber);

    } catch (err) {
      logError(`❌ An error occurred in contactUsFirstScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsFirstScenario: ${err.message}`);
    }
  });
}
async function contactUsSecondScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}.Contact Us Second Scenario click in submit button all fields empty need to appear warning message`, async () => {
    logStep(`${stepNumber}.Contact Us Second Scenario click in submit button all fields empty need to appear warning message`);
    try {
        // Wait for the submit button to be visible and enabled
        try {
          await page.waitForSelector('#submit-button', { state: 'visible' });
          await page.click('#submit-button');
        } catch (error) {
          logError("❌ Failed to click the submit button: " + error.message);
          process.exit(1); // Exit the script if the button click fails
        }

        const invalidFields = [
          { id: '#subject', name: 'Subject' },
          { id: '#issue', name: 'Issue (Textarea)' },
          { id: '#mat-select-value-1', name: 'Dropdown Select Category' },
        ];
        for (const field of invalidFields) {
          await checkAriaInvalid(page, field); // <-- Use helper function here
        }

    } catch (err) {
      logError(`❌ An error occurred in contactUsSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsSecondScenario: ${err.message}`);
    }
  });
}

async function checkAriaInvalid(page, field) {
  const input = page.locator(field.id);
  const ariaInvalid = await input.getAttribute('aria-invalid');

  await page.waitForTimeout(2000); // Wait for 2 seconds

  if (ariaInvalid === 'true' || ariaInvalid === null) {
    logSuccess(`✅ Field "${field.name}" is invalid (aria-invalid=${ariaInvalid})`);
  } else {
    logError(`❌ Field "${field.name}" is valid (aria-invalid=${ariaInvalid})`);
  }
}


module.exports = {
  contactUsFirstScenario,
  contactUsSecondScenario,
};



  




