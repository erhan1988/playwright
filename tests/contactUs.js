const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists , selectDropdownByVisibleText,checkAriaInvalid  } = require('./helper'); 

// NOTES : FROM CONTACT US PAGE WE DON'T SEND SUCCESS MESSAGE BECUASE COSTUMER DON'T WANT TO SEE THE MESSAGE FROM TESTING!!!!!

async function contactUsFirstScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Contact Us Different Scenario: 1. First Scenario Check if Title and fields exist`, async () => {
    logStep(`${stepNumber}. Contact Us Different Scenario: 1.First Scenario Check if Title and fields exist`);
    try {
      await page.waitForTimeout(2000);

      // Check first Title.
      const h1 = page.locator('h1');
      try {
          if (action === 'flexflix') {
            await expect(h1).toHaveText("We'd love to hear about your experience with FlexFlix, leave us a comment!");
            const headingText = await h1.textContent();
            logSuccess(`✅ Found FlexFlix Title: "${headingText?.trim()}"`);
          } else {
            await expect(h1).toHaveText(/Contact Us|Contáctenos/i);
            const headingText = await h1.textContent();
            logSuccess(`✅ Found Title: "${headingText?.trim()}"`);
          }
        } catch (error) {
          const actualText = await h1.textContent();
          logError(`❌ Heading did not match expected text. Found: "${actualText?.trim()}"`);
          throw error;
        }

      // Check if all input fields exist on the Contact Us page
      let contactUsElements = [
        { locator: '#customer-service', name: 'Form Contact Us' },
        { locator: '#mat-select-value-1', name: 'Dropdown Select Category' },
        { locator: '#email', name: 'Email' },
        { locator: '#subject', name: 'Subject' },
        { locator: '#issue', name: 'Text Area' },
        { locator: '#submit-button', name: 'Submit Button' },
      ];

      if (action === 'flexflix') {
       // Remove Dropdown Select Category for FlexFlix Here is not checked for Flexflix becuase we don't have 
        contactUsElements = contactUsElements.filter(el => el.name !== 'Dropdown Select Category');
      }

      for (const element of contactUsElements) {
        await checkElementExists(page, element.locator, element.name);
      }

      // Increment step number and call the second scenario
      stepNumber += 1;
      await contactUsSecondScenario(page, action, stepNumber);

      // Increment step number and call the third scenario as a separate step
      stepNumber += 1;
      await contactUsThirdScenario(page, action, stepNumber);

      // Increment step number and call the four scenario as a separate step
      stepNumber += 1;
      await contactUsFourthScenario(page, action, stepNumber);

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

      let invalidFields = [
        { id: '#subject', name: 'Subject' },
        { id: '#issue', name: 'Issue (Textarea)' },
        { id: '#mat-select-0', name: 'Dropdown Select Category' },
      ];

      if (action === 'flexflix') {
        invalidFields = invalidFields.filter(field => field.name !== 'Dropdown Select Category');
      }

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
      if ( action !== 'flexflix') {
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'General');
      }

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

async function contactUsFourthScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Contact Us Fourth Scenario: Validate warning messages for Subject only others to be filled`, async () => {
    logStep(`${stepNumber}. Contact Us Fourth Scenario: Validate warning messages for Subject only others to be filled`);
    try {
      // Refresh first then check from the beginning of this scenario
      await page.reload();
      await page.waitForSelector('#submit-button', { state: 'visible' });

      // Fill Select Category
      if ( action !== 'flexflix') {
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'General');
      }

      // Delete email because it is automatically filled with the user email
      await page.locator('#email').fill('test@streann.com');
      const emailValue = await page.locator('#email').inputValue();
      console.log('Email field is empty', emailValue);

      // Subject field is empty
      await page.locator('#subject').fill('');
      const subjectValue = await page.locator('#subject').inputValue();
      console.log('Subject field has not value', subjectValue);

      // Fill the textarea with the text
      await page.locator('#issue').fill('This is a test');
      const issueValue = await page.locator('#issue').inputValue();
      console.log('Text Area field has value', issueValue);

      // Click the submit button
      await page.click('#submit-button');

      const invalidFields = [
        { id: '#subject', name: 'Subject' }, // <-- Added Subject field to invalidFields
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

module.exports = {
  contactUsFirstScenario,
  contactUsSecondScenario,
  selectDropdownByVisibleText
};








