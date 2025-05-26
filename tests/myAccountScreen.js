const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists,checkAriaInvalid,checkDinamiclyPopUP,generateEmail,logOutUser} = require('./helper'); 
const { checkLoginButtonDisabled} = require('./login');

async function loggedUserMyAccount(page, action, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 1. First login in the Web Site `, async () => {
  logStep(`${stepNumber}. My Account Screen: 1. First login in the Web Site `);

  try {
      // navigate to the Login screen
      const baseUrl = `https://${action}-v3-dev.streann.tech/login`;
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });      // Wait for the login screen to load
      await page.waitForSelector('#login-button', { state: 'visible', timeout: 20000 });  
     // Login in the WEB 
      if (action === 'emmannuel'){
         await page.locator('#username').fill('erhan+1115@streann.com');
         const email = await page.locator('#username').inputValue();
         console.log(`Email has Value: ${email}`);
          //Fill the Password
         await page.locator('#password').fill('123123');
         const password = await page.locator('#password').inputValue();
         console.log(`Password has  Value: ${password}`);
      }else {
        // Fill Email 
        const baseEmail = "test+@streann.com";
        const emailWithDate = generateEmail(baseEmail);
        console.log(emailWithDate); 
        await page.locator('#username').fill(emailWithDate);
        const email = await page.locator('#username').inputValue();
        console.log(`Email has Value: ${email}`);

        //Fill the Password
        await page.locator('#password').fill('123123');
        const password = await page.locator('#password').inputValue();
        console.log(`Password has  Value: ${password}`);
      }

      await checkLoginButtonDisabled(page, action,'enabled');
      console.log('Now checking if the login button is Enabled...');

       // Emmanuel when is logged is redirect to the Profile Page
      if (action === 'emmannuel'){
        // after Login be sure that is redirect to the Profile Page
        const url = `https://${action}-v3-dev.streann.tech/profile/select-profile`;
        await expect(page).toHaveURL(url);
        console.log(`✅ Successfully navigated to ${url}`);
        await page.click('.card.mx-2.d-flex.flex-column.align-items-center.ng-star-inserted');
        // await page.waitForTimeout(5000); // Wait for 5 seconds
      }
       
      // after Login be sure that is redirect to the Home Page
      const url = `https://${action}-v3-dev.streann.tech/`;
      await expect(page).toHaveURL(url);
      console.log(`✅ Successfully navigated to ${url}`);

      stepNumber += 1;
      await myAccountPage(page, action, stepNumber);

      stepNumber += 1;
      await myUserScreen(page, action, stepNumber);

      stepNumber += 1;
      await myUserChangePassword(page, action, stepNumber);

      stepNumber += 1;
      await myAccountScreenPage(page,action,stepNumber)
  } catch (err) {
    logError(`❌ An error occurred in loggedUserMyAccount: ${err.message}`);
    throw new Error(`❌ An error occurred in loggedUserMyAccount: ${err.message}`);
    }
  });
}

async function myAccountPage(page, action, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 2. CLick in My Account Need to redirect th the page /user `, async () => {
  logStep(`${stepNumber}. My Account Screen: 2. CLick in My Account Need to redirect th the page /user`);

  try {
    // Wait for the dropdown button
    const dropdownButton = await page.waitForSelector('#accountMenu', { timeout: 30000 });
     
    // Check if the button is visible
    if (await dropdownButton.isVisible()) {
      logSuccess("Dropdown My Account is visible, clicking it now...");
      await dropdownButton.click();
    } else {
      logError("The dropdown button exists but is not visible.");
      throw new Error("❌ The dropdown button exists but is not visible.");
    }
  
    // Wait for the "MyAccount" Dropdown
    const myAccountSpan = await page.waitForSelector("//span[contains(text(), ' Mi Cuenta') or contains(text(), 'My Account')]",{ timeout: 10000, state: 'visible' });
        
    const text = await myAccountSpan.textContent();
    console.log('Found MyAccount text:', text.trim());
  
    // Confirm it is visible and enabled
    if (await myAccountSpan.isVisible()) {
      console.log("The MyAccount span is visible. Clicking it now...");
      await myAccountSpan.click();
      logSuccess("MyAccount clicked successfully.");
      await page.waitForTimeout(3000); // Wait for 3 
      const url = `https://${action}-v3-dev.streann.tech/user`;
      await page.waitForURL(url, { timeout: 20000 });
    } else {
      logError("The MyAccount span exists but is not visible.");
      throw new Error("❌ The MyAccount span exists but is not visible.");
    }
  } catch (err) {
    logError(`❌ An error occurred in myAccountPage: ${err.message}`);
    throw new Error(`❌ An error occurred in myAccountPage: ${err.message}`);
    }
  });
}

async function myUserScreen(page, action, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 3. Check in /user page if exist user Change user Details `, async () => {
  logStep(`${stepNumber}. My Account Screen: 3. Check in /user page if exist user Change user Details `);

  try {
     // Click the element by class
    await page.getByText(/Cambiar Detalle de Usuario|Change User Details/).click();
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`https://${action}-v3-dev.streann.tech/user/user-email`);

    // Check in the Change User Details if exist all fields 
    let requiredFields = [];
      requiredFields = [
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
    // Now click Back 
    const backButton = page.locator('#back-button');
    console.log('Clicking Go Back Link');
    await backButton.click();
     expect(page.url()).toBe(`https://${action}-v3-dev.streann.tech/user`);

  } catch (err) {
    logError(`❌ An error occurred in myUserScreen: ${err.message}`);
    throw new Error(`❌ An error occurred in myUserScreen: ${err.message}`);
    }
  });
}

async function myUserChangePassword(page, action, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 4. Check in /user page if exist user Change user Password and change the password`, async () => {
  logStep(`${stepNumber}. My Account Screen: 4. Check in /user page if exist user Change user Password and change the password`);

  try {
     // Click the element by class
    await page.getByText(/Cambiar Contraseña|Change Password/).click();
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`https://${action}-v3-dev.streann.tech/user/user-password`);

    // Check in the Change User Password if exist all fields 
    let requiredFields = [];
      requiredFields = [
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
    // Change the Password 
    await page.locator('#password').fill('123123');
    const password = await page.locator('#password').inputValue();
    console.log(`Password has  Value: ${password}`);

    await page.locator('#newPassword').fill('111111');  
    const newPassword = await page.locator('#newPassword').inputValue();
    console.log(`New Password has  Value: ${newPassword}`);

    await page.locator('#confirmPassword').fill('111111'); 
    const confirmPassword = await page.locator('#confirmPassword').inputValue();
    console.log(`Confirm Password has  Value: ${confirmPassword}`);

    // click the Change Password Button
    const changePasswordButton = page.locator('#user-email-button');
    console.log('Clicking Change Password Button');
    await changePasswordButton.click();

    await checkDinamiclyPopUP(page, action,'#toast-container');

    await page.waitForURL(`https://${action}-v3-dev.streann.tech/user`, { timeout: 20000 });
    console.log(`✅ Successfully navigated to https://${action}-v3-dev.streann.tech/user after changing password`)
    expect(page.url()).toBe(`https://${action}-v3-dev.streann.tech/user`);

  } catch (err) {
    logError(`❌ An error occurred in myUserChangePassword: ${err.message}`);
    throw new Error(`❌ An error occurred in myUserChangePassword: ${err.message}`);
    }
  });
}
async function myAccountScreenPage(page, action, stepNumber) {
  await test.step(`${stepNumber}. My Account Screen: 5. Check in /user page if exist Button Plans and Form for contact Us`, async () => {
  logStep(`${stepNumber}. My Account Screen: 5. Check in /user page if exist Button Plans and Form for contact Us`);

  try {
      // Check if exist button for Plans 
      const link = page.locator('[routerlink="/user/choose-plan"]');
      if (await link.count() > 0) {
        const title = await link.textContent();
        console.log("Element exists. Title:", title?.trim());
      } else {
        console.log("Element does not exist.");
      }
    // Check in the Change User Password if exist all fields 
    let requiredFields = [];
      requiredFields = [
        { locator: '#customer-service', name: 'Form Contact Us' },
        { locator: '#subject', name: 'Subject' },
        { locator: '#issue', name: 'Text Area'},
        { locator: '#submit-button', name: 'Submit Button'},
      ];
    for (const element of requiredFields) {
      await checkElementExists(page, element.locator, element.name);
    }
    // Not log out the user
    await logOutUser(page, action);

  } catch (err) {
    logError(`❌ An error occurred in myAccountScreenPage: ${err.message}`);
    throw new Error(`❌ An error occurred in myAccountScreenPage: ${err.message}`);
    }
  });
}

module.exports = {
  loggedUserMyAccount,
};








