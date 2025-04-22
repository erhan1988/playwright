const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { redirectUrl  } = require('./helper'); 

async function checkFooterLinks(page, action, stepNumber) {
  await test.step(`${stepNumber}. Check Footer links elements are exists`, async () => {
    logStep(`${stepNumber}. Check Footer links elements are exists`);
    try {
      // ✅ Check footer text
      const footerSelector = 'label:has-text("© 2025")';
      const element = await page.locator(footerSelector).first();
      const text = await element.textContent();

      if (await element.isVisible()) {
        await logSuccess(`Text "All Rights Reserved" exists in footer: "${text}"`);
      } else {
        throw new Error('Element found but not visible');
      }

      // ✅ Check and click Terms of Use
      const termsLink = page.getByRole('link', { name: /terms of use|términos de uso/i });
      await termsLink.waitFor({ state: 'visible', timeout: 8000 });
      const termsofuseText = await termsLink.textContent();
      await logSuccess(`Found Terms of Use link: "${termsofuseText?.trim()}"`);

      await Promise.all([
        termsLink.click(),
        page.waitForURL(/\/terms/, { timeout: 10000 })
      ]);
      await logSuccess('✅ Clicked Terms of Use and navigated to terms page');

      await redirectUrl(page,'/terms');

      // ✅ Wait for known content (optional)
      await page.waitForSelector('body', { timeout: 5000 });
      await page.waitForTimeout(7000);

      // ✅ Now check the expected terms content
      await checkTextExist(page, [
        "Welcome to Emmanuel TV!",
        "Términos de Uso"
      ]);

      // 🛑 Now move to privacy policy **only after above check passes**

      // ✅ Check and click Privacy Policy
      const privacyLink = page.getByRole('link', { name: /privacy policy|política de privacidad/i });
      await privacyLink.waitFor({ state: 'visible', timeout: 8000 });
      const privacyText = await privacyLink.textContent();
      await logSuccess(`Found Privacy Policy link: "${privacyText?.trim()}"`);

      await Promise.all([
        privacyLink.click(),
        page.waitForURL(/\/privacy/, { timeout: 10000 })
      ]);
      await logSuccess('✅ Clicked Privacy Policy and navigated to privacy page');
      await redirectUrl(page,'/privacy');


      // ✅ Wait for known content (optional)
      await page.waitForSelector('body', { timeout: 5000 });
      await page.waitForTimeout(7000);

      // ✅ Check privacy page content
      await checkTextExist(page, [
        "Privacy Policy Effective Since",
        "Política de Privacidad"
      ]);
     
      // CHECK CONTACT US 
      if (action !== 'amorir'){
          const contactLink = page.getByRole('link', { name: /contact us|contáctenos/i });
          await contactLink.waitFor({ state: 'visible', timeout: 8000 });
          const contactUsText = await contactLink.textContent();
          await logSuccess(`Found Contact Us link: "${contactUsText?.trim()}"`);
          await Promise.all([
            contactLink.click(),
            page.waitForURL(/\/contact-us/, { timeout: 10000 })
          ]);
          await logSuccess('✅ Clicked Contact Us and navigated to Contact Us Page');
          expect(page.url()).toContain('/contact-us');
      }
    } catch (err) {
      logError(`❌ An error occurred in checkFooterLinks: ${err.message}`);
      throw new Error(`❌ An error occurred in checkFooterLinks: ${err.message}`);
    }
  });
}

async function checkTextExist(page, expectedTerms) {
  const fullText = (await page.locator('body').innerText()).toLowerCase();

  for (const term of expectedTerms) {
    if (fullText.includes(term.toLowerCase())) {
      await logSuccess(`Found word text: "${term}"`);
      return true; // early return if found
    }
  }
  throw new Error(`Could not find any of: ${expectedTerms.join(" OR ")}`);
}



  



module.exports = {
    checkFooterLinks
};

