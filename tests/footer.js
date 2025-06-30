const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers

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
        page.waitForURL(/\/terms/, { timeout: 20000 })
      ]);
      await logSuccess('✅ Clicked Terms of Use and navigated to terms page');

      // ✅ Wait for known content (optional)
      await page.waitForSelector('body', { timeout: 7000 });
      await page.waitForTimeout(7000);

      // ✅ Now check the expected terms content
      await checkTextExist(page, [
        "Welcome to Emmanuel TV!",
        "Términos de Uso",
        "Términos y Condiciones"
      ]);

      // 🛑 Now move to privacy policy **only after above check passes**
      await privacyPolicy(page);

      // CHECK CONTACT US 
      if (action !== 'amorir'){
          await contactUs(page,action);
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

async function privacyPolicy(page) {
  try {
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

    // ✅ Wait for known content (optional)
    await page.waitForSelector('body', { timeout: 8000 });
    await page.waitForFunction(() => {
    const bodyText = document.body.innerText;
      return bodyText.includes('Privacy Policy Effective Since') || 
       bodyText.includes('Política de Privacidad') || 
       bodyText.includes('Políticas de Privacidad') || 
       bodyText.includes('Avisos Legales');
    });

    // ✅ Check privacy page content
    await checkTextExist(page, [
      "Privacy Policy Effective Since",
      "Política de Privacidad",
      "Avisos Legales",
      "Políticas de Privacidad"
    ]);
  } catch (err) {
    logError(`❌ An error occurred in privacyPolicy: ${err.message}`);
    throw err;
  }
}

async function contactUs(page, action) {
  try {
    const contactLink = page.getByText(/contact us|contáctenos/i, { exact: false });
    await expect(contactLink).toBeVisible();
    const contactUsText = await contactLink.textContent();
    await logSuccess(`Found Contact Us link: "${contactUsText?.trim()}"`);
    if (action !== 'okgol'){
      await Promise.all([
        contactLink.click(),
        page.waitForURL(/\/contact-us/, { timeout: 10000 })
      ]);
      expect(page.url()).toContain('/contact-us');
    } else if ( action === 'okgol'){
      const originalPage = page; // Save the main tab (https://okgol-v3-dev.streann.tech/privacy)

      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        contactLink.click()
      ]);

      await newPage.waitForLoadState('domcontentloaded');
      console.log('New page after loadState URL:', newPage.url());

      // Wait up to 10 seconds for the WhatsApp URL to appear
      let retries = 20;
      while (retries-- > 0) {
        const currentUrl = newPage.url();
        if (/https:\/\/api\.whatsapp\.com\//.test(currentUrl)) break;
        await newPage.waitForTimeout(500);
      }
      expect(newPage.url()).toContain('https://api.whatsapp.com/');

      await newPage.close();

      await originalPage.bringToFront();
      await originalPage.waitForLoadState('domcontentloaded');

      // Wait until the URL is correct (retry if needed)
      let retries2 = 10;
      while (retries2-- > 0) {
        const currentUrl = await originalPage.url();
        if (currentUrl === 'https://okgol-v3-dev.streann.tech/privacy') break;
        await originalPage.waitForTimeout(500);
      }
      expect(await originalPage.url()).toBe('https://okgol-v3-dev.streann.tech/privacy');
      console.log('Back to original tab:', await originalPage.url());
    }
    await logSuccess('✅ Clicked Contact Us and navigated to Contact Us Page');
  } catch (err) {
    logError(`❌ An error occurred in contactUs: ${err.message}`);
    throw err;
  }
}



module.exports = {
  checkFooterLinks
};

