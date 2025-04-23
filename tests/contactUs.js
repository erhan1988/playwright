const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { redirectUrl  } = require('./helper'); 

async function contactUsDifferentScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Check different scenario in Contact Us Page`, async () => {
    logStep(`${stepNumber}. Check different scenario in Contact Us Page`);
    try {
        // Already is navigated to the Contact Us page

        // check if exist all input fields in the contact us page 
        const headerElements = [
          // { locator:'a.navbar-brand img.img-fluid[alt="logo"]' , name: 'Logo' },
            { locator: "//*[contains(text(),'Contact Us') or contains(text(),' Contáctenos ')]", name: 'Title of the Page' },
          // { locator: "//*[contains(text(),'Subscribe Now') or contains(text(),' Suscríbase Ahora ')]", name: 'Register Button' },      
          // { locator: '#search-button', name: 'Search Button' },
          // { locator: "//a[contains(text(),'Home') or contains(text(),'Inicio')]", name: 'Home Link' }
        ];

        // Collect results for each element
        const results = [];
        for (const element of headerElements) {
            const result = await checkElementExists(page, element.locator, element.name);
            results.push(result); // Store the result
        }
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

