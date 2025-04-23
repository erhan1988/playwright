const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists  } = require('./helper'); 

async function contactUsFirstScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}.Contact Us First scenario Check if exist Title and fields `, async () => {
    logStep(`${stepNumber}.Contact Us First scenario Check if exist Title and fields`);
    try {
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
      logError(`❌ An error occurred in contactUsDifferentScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsDifferentScenario: ${err.message}`);
    }
  });
}

async function contactUsSecondScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}.Contact Us Second Scenario click in submit button all fields empty need to appear warning message`, async () => {
    logStep(`${stepNumber}.Contact Us Second Scenario click in submit button all fields empty need to appear warning message`);
    try {
      

        // stepNumber += 1 ;
        // await contactUsSecondScenario(page,action,stepNumber);

    } catch (err) {
      logError(`❌ An error occurred in contactUsSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsSecondScenario: ${err.message}`);
    }
  });
}




// async function checkTextExist(page, expectedTerms) {
//   const fullText = (await page.locator('body').innerText()).toLowerCase();

//   for (const term of expectedTerms) {
//     if (fullText.includes(term.toLowerCase())) {
//       await logSuccess(`Found word text: "${term}"`);
//       return true; // early return if found
//     }
//   }
//   throw new Error(`Could not find any of: ${expectedTerms.join(" OR ")}`);
// }

// async function privacyPolicy(page) {
//   try {
//     // ✅ Check and click Privacy Policy
//     const privacyLink = page.getByRole('link', { name: /privacy policy|política de privacidad/i });
//     await privacyLink.waitFor({ state: 'visible', timeout: 8000 });
//     const privacyText = await privacyLink.textContent();
//     await logSuccess(`Found Privacy Policy link: "${privacyText?.trim()}"`);

//     await Promise.all([
//       privacyLink.click(),
//       page.waitForURL(/\/privacy/, { timeout: 10000 })
//     ]);
//     await logSuccess('✅ Clicked Privacy Policy and navigated to privacy page');
//     await redirectUrl(page,'/privacy');


//     // ✅ Wait for known content (optional)
//     await page.waitForSelector('body', { timeout: 5000 });
//     await page.waitForTimeout(7000);

//     // ✅ Check privacy page content
//     await checkTextExist(page, [
//       "Privacy Policy Effective Since",
//       "Política de Privacidad"
//     ]);
//   } catch (err) {
//     logError(`❌ An error occurred in privacyPolicy: ${err.message}`);
//     throw err;
//   }
// }

// async function contactUs(page) {
//   try {
//     const contactLink = page.getByRole('link', { name: /contact us|contáctenos/i });
//     await contactLink.waitFor({ state: 'visible', timeout: 8000 });
//     const contactUsText = await contactLink.textContent();
//     await logSuccess(`Found Contact Us link: "${contactUsText?.trim()}"`);
//     await Promise.all([
//       contactLink.click(),
//       page.waitForURL(/\/contact-us/, { timeout: 10000 })
//     ]);
//     await logSuccess('✅ Clicked Contact Us and navigated to Contact Us Page');
//     expect(page.url()).toContain('/contact-us');
//   } catch (err) {
//     logError(`❌ An error occurred in contactUs: ${err.message}`);
//     throw err;
//   }
// }



  



module.exports = {
  contactUsFirstScenario,
  contactUsSecondScenario,
};

