const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists  } = require('./helper'); 

async function contactUsFirstScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Contact Us First Different Scenario: 1.Check if Title and fields exist`, async () => {
    logStep(`${stepNumber}. Contact Us First Different Scenario: 1.Check if Title and fields exist`);
    try {
      await page.waitForTimeout(2000);

      // Check first Title
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

      // Check if all input fields exist on the Contact Us page
      const contactUsElements = [
        { locator: '#customer-service', name: 'Form Contact Us' },
        { locator: '#mat-select-value-1', name: 'Dropdown Select Category' },
        { locator: '#email', name: 'Email' },
        { locator: '#subject', name: 'Subject' },
        { locator: '#issue', name: 'Text Area' },
        { locator: '#submit-button', name: 'Submit Button' },
      ];

      for (const element of contactUsElements) {
        await checkElementExists(page, element.locator, element.name);
      }

      // Increment step number and call the second scenario
      stepNumber += 1;
      await contactUsSecondScenario(page, action, stepNumber);

      // Increment step number and call the third scenario as a separate step
      stepNumber += 1;
      await contactUsThirdScenario(page, action, stepNumber);

    } catch (err) {
      logError(`❌ An error occurred in contactUsFirstScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsFirstScenario: ${err.message}`);
    }
  });
}

async function contactUsSecondScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Contact Us Second Scenario: Click submit button with all fields empty`, async () => {
    logStep(`${stepNumber}. Contact Us Second Scenario: Click submit button with all fields empty`);
    try {
      // Wait for the submit button to be visible and enabled
      await page.waitForSelector('#submit-button', { state: 'visible' });
      await page.click('#submit-button');

      const invalidFields = [
        { id: '#subject', name: 'Subject' },
        { id: '#issue', name: 'Issue (Textarea)' },
        { id: '#mat-select-0', name: 'Dropdown Select Category' },
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

async function contactUsThirdScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Contact Us Third Scenario: Validate warning messages for Email and Text Area`, async () => {
    logStep(`${stepNumber}. Contact Us Third Scenario: Validate warning messages for Email and Text Area`);
    try {
      // Refresh first then check from the beginning of this scenario
      await page.reload();
      await page.waitForSelector('#submit-button', { state: 'visible' });

      // Fill Select Category
      await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'General');

      // Delete email because it is automatically filled with the user email
      await page.locator('#email').fill('');
      const emailValue = await page.locator('#email').inputValue();
      console.log('Email field is empty', emailValue);

      // Fill the input field with the text
      await page.locator('#subject').fill('Test');
      const subjectValue = await page.locator('#subject').inputValue();
      console.log('Subject field has value', subjectValue);

      // Fill the textarea with the text
      await page.locator('#issue').fill('');
      const issueValue = await page.locator('#issue').inputValue();
      console.log('Text Area field is empty', issueValue);

      // Click the submit button
      await page.click('#submit-button');

      const invalidFields = [
        { id: '#issue', name: 'Issue (Textarea)' },
        { id: '#email', name: 'Email' },
      ];
      for (const field of invalidFields) {
        await checkAriaInvalid(page, field); // <-- Use helper function here
      }
      
    } catch (err) {
      logError(`❌ An error occurred in contactUsThirdScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsThirdScenario: ${err.message}`);
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

// Function to select a dropdown by visible text
async function selectDropdownByVisibleText(page, dropdownSelector, visibleText) {
  // Wait for the dropdown to be visible and click it
  const dropdown = await page.locator(dropdownSelector);
  await dropdown.click();

  // Wait for the option to be visible and click it
  const option = await page.locator(`//mat-option//span[text()="${visibleText}"]`);
  await option.click();

  // Get the selected value from the dropdown
  const selectedValue = await dropdown.innerText();
  
  // Check if a value was selected
  if (selectedValue) {
    console.log('- -.Selected Value in Dropdown is:', selectedValue);
  } else {
   logError('is not Selected any value in the Dropdown')
   process.exit(1);
  }
}


module.exports = {
  contactUsFirstScenario,
  contactUsSecondScenario,
};








