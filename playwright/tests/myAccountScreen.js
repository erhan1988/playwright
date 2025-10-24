const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index');
const { checkElementExists, checkAriaInvalid, checkDinamiclyPopUP, generateEmail, logOutUser } = require('./helper');
const { checkLoginButtonDisabled } = require('./login');

async function loggedUserMyAccount(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 1. First login in the Web Site `, async () => {
    logStep(`${stepNumber}. My Account Screen: 1. First login in the Web Site `);

    try {
      // Check if page is already closed before starting
      if (page.isClosed()) {
        throw new Error('❌ Page is already closed before loggedUserMyAccount starts');
      }

      // Wait a bit for any pending operations from previous test
      await page.waitForTimeout(1000);

      // Navigate to the Login screen and wait for the login button by text
      const baseUrl = `https://${reseller.name}-v3-dev.streann.tech/login`;
      console.log(`Navigating to: ${baseUrl}`);

      const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      console.log('Goto response status:', response && response.status());
      console.log('Current URL after goto:', page.url());

      // Check if page got closed during navigation
      if (page.isClosed()) {
        throw new Error('Page closed during navigation to login page');
      }

      // Wait for the page to be interactive
      await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
      console.log('Page is ready');

      // Wait for login form to be ready
      await page.waitForSelector('#username', { state: 'visible', timeout: 30000 });
      await page.waitForSelector('#password', { state: 'visible', timeout: 30000 });
      console.log('Login form is visible');

      // Fill credentials
      if (reseller.name === 'emmannuel') {
        await page.locator('#username').fill('erhan+1115@streann.com');
        const email = await page.locator('#username').inputValue();
        console.log(`Email has Value: ${email}`);
        await page.locator('#password').fill('123123');
        const password = await page.locator('#password').inputValue();
        console.log(`Password has Value: ${password}`);
      } else {
        const baseEmail = "test+@streann.com";
        const emailWithDate = generateEmail(baseEmail);
        console.log(`Generated email: ${emailWithDate}`);
        console.log('Current URL before filling:', page.url());
        await page.locator('#username').fill(emailWithDate);
        const email = await page.locator('#username').inputValue();
        console.log(`Email has Value: ${email}`);
        await page.locator('#password').fill('123123');
        const password = await page.locator('#password').inputValue();
        console.log(`Password has Value: ${password}`);
      }

      await checkLoginButtonDisabled(page, reseller, 'enabled');
      console.log('Now checking if the login button is Enabled...');

      // After login, wait for profile or home page
     // if (action === 'emmannuel' || action === 'televicentro' || action === 'flexflix' || action === 'tvin') {
     if (reseller.selectProfile){
        const profileUrl = `https://${reseller.name}-v3-dev.streann.tech/profile/select-profile`;
        try {
            console.log(`Waiting for profile selection page: ${profileUrl}`);
            await page.waitForURL(profileUrl, { timeout: 30000 });
            await expect(page).toHaveURL(profileUrl);
            console.log(`Successfully navigated to ${profileUrl}`);

            // Check if page is still open
            if (page.isClosed()) {
              throw new Error('Page closed after reaching profile page');
            }

            // Wait for the card to be visible before clicking
            const card = page.locator('.card.mx-2.d-flex.flex-column.align-items-center.ng-star-inserted');
            await expect(card).toBeVisible({ timeout: 15000 });
            console.log('Profile card is visible, clicking it...');
            await card.click();
            console.log('Profile card clicked');
        } catch (err) {
          if (!page.isClosed()) {
            try {
              await page.screenshot({ path: `profile_select_error_${Date.now()}.png` });
              console.log('Current URL:', page.url());
            } catch (screenshotErr) {
              console.log('Could not take screenshot:', screenshotErr.message);
            }
          } else {
            console.log('Page is closed, cannot take screenshot');
          }
          throw new Error(`Failed to reach or interact with profile selection page: ${err.message}`);
        }
      }
      // Wait for home page
    const homeUrl = reseller.baseUrl;

    try {
      console.log(`Waiting for home page: ${homeUrl}`);
      // Wait until the page has navigated and URL includes the expected value
      await page.waitForURL(url => url.href.includes(`${reseller.name}-v3-dev.streann.tech`), { timeout: 30000 });

      // Check if page is still open
      if (page.isClosed()) {
        throw new Error('Page closed while waiting for home page');
      }

      // Extra check just in case
      await expect(page).toHaveURL(homeUrl, { timeout: 5000 });
      console.log(`Successfully navigated to ${homeUrl}`);

      // Wait for page to be fully loaded
      await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
        console.log('Load state timeout, continuing...');
      });
    } catch (error) {
      console.error(`Failed to navigate to ${homeUrl}`);
      console.error(error);
      throw error;
    }

      stepNumber += 1;
      await myAccountPage(page, reseller, stepNumber);

      stepNumber += 1;
      await myUserScreen(page, reseller, stepNumber);

      stepNumber += 1;
      await myUserChangePassword(page, reseller, stepNumber);

      stepNumber += 1;
      await myAccountScreenPage(page, reseller, stepNumber);

    } catch (err) {
      // Only take screenshot if page is still open
      if (!page.isClosed()) {
        try {
          await page.screenshot({ path: `loggedUserMyAccount_error_${Date.now()}.png` });
          console.log('📸 Screenshot saved for debugging');
        } catch (screenshotErr) {
          console.log('⚠️ Could not take screenshot:', screenshotErr.message);
        }
      } else {
        console.log('❌ Page is closed, cannot take screenshot');
      }

      // Log detailed error information
      console.log('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        url: page.isClosed() ? 'Page closed' : page.url()
      });

      logError(`❌ An error occurred in loggedUserMyAccount: ${err.message}`);
      throw new Error(`❌ An error occurred in loggedUserMyAccount: ${err.message}`);
    }
  });
}

async function myAccountPage(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 2. Click in My Account Need to redirect to the page /user `, async () => {
    logStep(`${stepNumber}. My Account Screen: 2. Click in My Account Need to redirect to the page /user`);
    try {
      const dropdownButton = await page.waitForSelector('#accountMenu', { timeout: 30000 });
      if (await dropdownButton.isVisible()) {
        logSuccess("Dropdown My Account is visible, clicking it now...");
        await dropdownButton.click();
      } else {
        throw new Error("❌ The dropdown button exists but is not visible.");
      }

      const myAccountSpan = await page.waitForSelector("//span[contains(text(), ' Mi Cuenta') or contains(text(), 'My Account')]", { timeout: 10000, state: 'visible' });
      const text = await myAccountSpan.textContent();
      console.log('Found MyAccount text:', text.trim());

      if (await myAccountSpan.isVisible()) {
        console.log("The MyAccount span is visible. Clicking it now...");
        const url = `https://${reseller.name}-v3-dev.streann.tech/user`;
        await Promise.all([
          page.waitForURL(url, { timeout: 20000 }),
          myAccountSpan.click(),
        ]);
        logSuccess("MyAccount clicked and navigation detected.");
        console.log('Current URL after click:', page.url());
      } else {
        throw new Error("❌ The MyAccount span exists but is not visible.");
      }
    } catch (err) {
      if (!page.isClosed()) {
        try {
          await page.screenshot({ path: `myAccountPage_error_${Date.now()}.png` });
        } catch (screenshotErr) {
          console.log('⚠️ Could not take screenshot:', screenshotErr.message);
        }
      } else {
        console.log('❌ Page is closed, cannot take screenshot');
      }
      logError(`❌ An error occurred in myAccountPage: ${err.message}`);
      throw new Error(`❌ An error occurred in myAccountPage: ${err.message}`);
    }
  });
}

async function myUserScreen(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 3. Check in /user page if exist user Change user Details `, async () => {
    logStep(`${stepNumber}. My Account Screen: 3. Check in /user page if exist user Change user Details `);

    try {
      const changeDetailsButton = page.getByText(/Cambiar Detalle de Usuario|Change User Details/);
      await expect(changeDetailsButton).toBeVisible({ timeout: 30000 });
      await changeDetailsButton.click();
      await page.waitForURL(`**/user/user-email`, { timeout: 30000 });
      expect(page.url()).toBe(`https://${reseller.name}-v3-dev.streann.tech/user/user-email`);

      const requiredFields = [
        { locator: '#back-button', name: 'Go Back Link' },
        { locator: '#firstname', name: 'First Name Field' },
        { locator: '#lastname', name: 'Last Name Field' },
        { locator: '#email', name: 'Email Field' },
        { locator: '#state', name: 'State Field' },
        { locator: '#city', name: 'City Field' },
        { locator: '#address', name: 'Address Field' },
        { locator: '#user-email-button', name: 'Button Change' },
        { locator: '#button-cancel', name: 'Button Cancel' },
      ];

      for (const element of requiredFields) {
        await checkElementExists(page, element.locator, element.name);
      }
      const backButton = page.locator('#back-button');
      console.log('Clicking Go Back Link');
      await backButton.click();
      expect(page.url()).toBe(`https://${reseller.name}-v3-dev.streann.tech/user`);

    } catch (err) {
      if (!page.isClosed()) {
        try {
          await page.screenshot({ path: `myUserScreen_error_${Date.now()}.png` });
        } catch (screenshotErr) {
          console.log('⚠️ Could not take screenshot:', screenshotErr.message);
        }
      } else {
        console.log('❌ Page is closed, cannot take screenshot');
      }
      logError(`❌ An error occurred in myUserScreen: ${err.message}`);
      throw new Error(`❌ An error occurred in myUserScreen: ${err.message}`);
    }
  });
}

async function myUserChangePassword(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 4. Check in /user page if exist user Change user Password and change the password`, async () => {
    logStep(`${stepNumber}. My Account Screen: 4. Check in /user page if exist user Change user Password and change the password`);

    try {
      const changePasswordButton1 = page.getByText(/Cambiar Contraseña|Change Password/);
      await expect(changePasswordButton1).toBeVisible({ timeout: 10000 });
      await expect(changePasswordButton1).toBeEnabled();
      console.log('URL before click:', page.url());

      await Promise.all([
        page.waitForURL('**/user/user-password', { timeout: 30000 }),
        changePasswordButton1.click()
      ]);
      console.log('URL after click:', page.url());
      expect(page.url()).toBe(`https://${reseller.name}-v3-dev.streann.tech/user/user-password`);

      const requiredFields = [
        { locator: '#back-button', name: 'Go Back Link' },
        { locator: '#password', name: 'Password Field' },
        { locator: '#newPassword', name: 'New Password Field' },
        { locator: '#confirmPassword', name: 'Confirm Password Field' },
        { locator: '#user-email-button', name: 'Button Change' },
        { locator: '#button-cancel', name: 'Button Cancel' },
      ];
      for (const element of requiredFields) {
        await checkElementExists(page, element.locator, element.name);
      }

      await page.locator('#password').fill('123123');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has Value: ${password}`);

      await page.locator('#newPassword').fill('111111');
      const newPassword = await page.locator('#newPassword').inputValue();
      console.log(`New Password has Value: ${newPassword}`);

      await page.locator('#confirmPassword').fill('111111');
      const confirmPassword = await page.locator('#confirmPassword').inputValue();
      console.log(`Confirm Password has Value: ${confirmPassword}`);

      const changePasswordButton = page.locator('#user-email-button');
      console.log('Clicking Change Password Button');
      await changePasswordButton.click();

      await checkDinamiclyPopUP(page, reseller, '#toast-container');

      await page.waitForURL(`https://${reseller.name}-v3-dev.streann.tech/user`, { timeout: 20000 });
      console.log(`✅ Successfully navigated to https://${reseller.name}-v3-dev.streann.tech/user after changing password`);
      expect(page.url()).toBe(`https://${reseller.name}-v3-dev.streann.tech/user`);

    } catch (err) {
      if (!page.isClosed()) {
        try {
          await page.screenshot({ path: `myUserChangePassword_error_${Date.now()}.png` });
        } catch (screenshotErr) {
          console.log('⚠️ Could not take screenshot:', screenshotErr.message);
        }
      } else {
        console.log('❌ Page is closed, cannot take screenshot');
      }
      logError(`❌ An error occurred in myUserChangePassword: ${err.message}`);
      throw new Error(`❌ An error occurred in myUserChangePassword: ${err.message}`);
    }
  });
}

async function myAccountScreenPage(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 5. Check in /user page if exist Button Plans and Form for contact Us`, async () => {
    logStep(`${stepNumber}. My Account Screen: 5. Check in /user page if exist Button Plans and Form for contact Us`);

    try {
       // if (action !== "panamsport" && action !== "gols" && action !== "prtv" && action !== 'tvin' && action !== 'gamestreammedia') {
        if (reseller.choosePlanMyAccount){
          const link = page.locator('[routerlink="/user/choose-plan"]');
          try {
            await expect(link).toBeVisible({ timeout: 10000 });
            const title = await link.textContent();
            console.log("Element exists. Title:", title?.trim());
          } catch (err) {
            await page.screenshot({ path: `choose_plan_link_error_${Date.now()}.png` });
            console.log('Current URL:', page.url());
            throw new Error("❌ [routerlink=\"/user/choose-plan\"] element does not exist or is not visible.");
          }
        }

      if (reseller.name === 'okgol') {
        const whatsappButton = page.getByText(/contactar por whatsapp/i, { exact: false });
        if (await whatsappButton.count() > 0) {
          const title = await whatsappButton.first().textContent();
          console.log('WhatsApp button title:', title?.trim());
        } else {
          throw new Error("❌ WhatsApp button does not exist.");
        }
        logSuccess('for OkGol is not exist Form Contact US im my Account Screen /user');
      }

      if (reseller.name !== 'okgol') {
        const requiredFields = [
          { locator: '#customer-service', name: 'Form Contact Us' },
          { locator: '#subject', name: 'Subject' },
          { locator: '#issue', name: 'Text Area' },
          { locator: '#submit-button', name: 'Submit Button' },
        ];
        for (const element of requiredFields) {
          await checkElementExists(page, element.locator, element.name);
        }
      }
      await logOutUser(page, reseller);

    } catch (err) {
      if (!page.isClosed()) {
        try {
          await page.screenshot({ path: `myAccountScreenPage_error_${Date.now()}.png` });
        } catch (screenshotErr) {
          console.log('⚠️ Could not take screenshot:', screenshotErr.message);
        }
      } else {
        console.log('❌ Page is closed, cannot take screenshot');
      }
      logError(`❌ An error occurred in myAccountScreenPage: ${err.message}`);
      throw new Error(`❌ An error occurred in myAccountScreenPage: ${err.message}`);
    }
  });
}

module.exports = {
  loggedUserMyAccount,
};