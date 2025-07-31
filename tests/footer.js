const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers

async function checkFooterLinks(page, action, stepNumber) {
  await test.step(`${stepNumber}. Check Footer links elements are exists`, async () => {
    logStep(`${stepNumber}. Check Footer links elements are exists`);
    try {
      if (action === 'panamsport' || action === 'gols') {
         await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      }
      // ✅ Check footer text
      const footerSelector = 'label:has-text("© 2025")';
      await page.waitForSelector(footerSelector, { state: 'visible', timeout: 10000 });
      const element = await page.locator(footerSelector).first();
      await element.scrollIntoViewIfNeeded();
      await element.waitFor({ state: 'visible', timeout: 10000 });
      const text = await element.textContent();

      if (await element.isVisible()) {
        await logSuccess(`Text "All Rights Reserved" exists in footer: "${text}"`);
      } else {
        throw new Error('Element found but not visible');
      }

      //This is a workaround for the footer text not being visible in some cases when is on English
      if (action === 'prtv'){
         const languageButton = page.locator('button#languageSelector');
        await languageButton.waitFor({ state: 'visible', timeout: 10000 });
        await languageButton.click();

        // Wait for dropdown to appear
        // Adjust selector below depending on actual structure of dropdown
        const spanishOption = page.locator("text=Español"); // or use 'role' if available
        await spanishOption.waitFor({ state: 'visible', timeout: 10000 });

        // Click the "Spanish" option
        await spanishOption.click();
        console.log("✅ Language switched to Spanish");
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

      const currentUrl = page.url();
      if (/\/terms/.test(currentUrl)) {
        await logSuccess('✅ Clicked Terms of Use and navigated to terms page');
      } else if (/\/login/.test(currentUrl)) {
        await logError('❌ Clicked Terms of Use but was redirected to login page (user may not be authenticated)');
        throw new Error('Redirected to login page instead of terms page');
      } else {
        await logError(`❌ Clicked Terms of Use but landed on unexpected page: ${currentUrl}`);
        throw new Error(`Unexpected navigation after clicking Terms of Use: ${currentUrl}`);
      }

      // ✅ Wait for known content (optional)
      await page.waitForSelector('body', { timeout: 9000 });
      await page.waitForTimeout(9000);

      // ✅ Now check the expected terms content
      await checkTextExist(page, [
        "Welcome to Emmanuel TV!",
        "Términos de Uso",
        "Términos y Condiciones",
        "Data categories",
        "Acceptance of Terms",
        "Effective Date",
        'FlexFlix Terms of Use'
      ]);

      // 🛑 Now move to privacy policy **only after above check passes**
      await privacyPolicy(page,action);

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

async function privacyPolicy(page,action) {
  try {
    // ✅ Check and click Privacy Policy
    let privacyLink;
    let privacyText
    if (action === 'gols') {
       privacyLink = page.getByRole('link', { name: /privacy policy|política de privacidad/i }).nth(3);
    }else{
       privacyLink = page.getByRole('link', { name: /privacy policy|política de privacidad/i });
    }
    await privacyLink.waitFor({ state: 'visible', timeout: 8000 });
    privacyText = await privacyLink.textContent();
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
       bodyText.includes('Avisos Legales') || 
       bodyText.includes('Data categories') ||
       bodyText.includes('Introduction') ||
       bodyText.includes('Platform Name: Game Stream Media') ||
       bodyText.includes('Privacy statement');
    });

    // ✅ Check privacy page content
    await checkTextExist(page, [
      "Privacy Policy Effective Since",
      "Política de Privacidad",
      "Avisos Legales",
      "Políticas de Privacidad",
      "Data categories",
      "Introduction",
      "Platform Name: Game Stream Media",
      "Privacy statement"
    ]);
  } catch (err) {
    logError(`❌ An error occurred in privacyPolicy: ${err.message}`);
    throw err;
  }
}

async function contactUs(page, action) {
  try {

    let contactLink;
    if (action === 'panamsport' || action === 'gols' || action === 'gamestreammedia' || action === 'prtv') {
       contactLink = page.locator('a', { hasText: /contact us|contáctenos/i }).first();
      await expect(contactLink).toBeVisible();
      console.log('Contact Us link href:', await contactLink.getAttribute('href'));
    }else{
       contactLink = page.getByText(/contact us|contáctenos/i, { exact: false }).first();
    }
    await expect(contactLink).toBeVisible();
    const contactUsText = await contactLink.textContent();
    await logSuccess(`Found Contact Us link: "${contactUsText?.trim()}"`);

    if (action !== 'okgol' && action !== 'gols') {
      await Promise.all([
        contactLink.click(),
       page.waitForURL(/\/contact-us/, { timeout: 20000 })
      ]);
      expect(page.url()).toContain('/contact-us');
      await logSuccess('✅ Clicked Contact Us and navigated to Contact Us Page');
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
    }else if ( action === 'gols'){
      const originalPage = page;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await Promise.all([
        contactLink.click(),
      ]);
      // Check and print if redirected correctly
      const expectedUrl = 'https://gols.co/contact/';
      if (page.url() === expectedUrl) {
        console.log('✅ Redirected to contact page');
        
        // Go back in browser
        await page.goBack();

        // Wait for the previous page to load
        await originalPage.bringToFront();
       await originalPage.waitForLoadState('domcontentloaded');

        // Wait until the URL is correct (retry if needed)
      let retries2 = 10;
      while (retries2-- > 0) {
        const currentUrl = await originalPage.url();
        if (currentUrl === 'https://gols-v3-dev.streann.tech/privacy') break;
        await originalPage.waitForTimeout(5000);
      }
      expect(await originalPage.url()).toBe('https://gols-v3-dev.streann.tech/privacy');
      // Print the URL after going back
      console.log('🔙 Went back to:', page.url());
      } else {
        console.log(`❌ Not redirected correctly. Current URL: ${page.url()}`);
      }
    }
  } catch (err) {
    logError(`❌ An error occurred in contactUs: ${err.message}`);
    throw err;
  }
}



module.exports = {
  checkFooterLinks
};

