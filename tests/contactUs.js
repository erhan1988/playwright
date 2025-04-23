const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists  } = require('./helper'); 

async function contactUsDifferentScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Check different scenario in Contact Us Page`, async () => {
    logStep(`${stepNumber}. Check different scenario in Contact Us Page`);
    try {
        
        await page.waitForTimeout(10000);

        try {
          await expect(page.locator('h1')).toHaveText(/Contact Us|Contáctenos/i);
          logSuccess('✅ Heading matches "Contact Us" or "Contáctenos"');
        } catch (error) {
          logError(`❌ Heading did not match expected text: ${error.message}`);
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

        // logStep('Header elements check completed. Results:');
        // results.forEach(result => {
        //     if (result.status === 'visible') {
        //         logSuccess(`✅ ${result.name} is visible.`);
        //     } else if (result.status === 'not visible') {
        //         logError(`❌ ${result.name} is not visible.`);
        //     } else if (result.status === 'error') {
        //         logError(`❌ Error checking ${result.name}: ${result.error}`);
        //     }
        // });
    } catch (err) {
      logError(`❌ An error occurred in contactUsDifferentScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in contactUsDifferentScenario: ${err.message}`);
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
  contactUsDifferentScenario
};

