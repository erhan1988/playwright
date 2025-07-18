const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const { checkElementExists ,selectDropdownByVisibleText,checkAriaInvalid,generateEmail,redirectUrl,checkDinamiclyPopUP, logOutUser} = require('./helper'); 
const {landingPageRegisterButton} = require ('./landing');
const {checkHeaderElements} = require ('./header');

async function registrationScreen(page, action, stepNumber) {
  await test.step(`${stepNumber}. Registration Screen check Different Scenario: 1. Scenario check if exist all fields`, async () => {
  logStep(`${stepNumber}. Registration Screen Different Scenario: 1. Scenario check if exist all fields`);

    // CLick to redirect to Registration Screen from the Header
    if ( action === 'gols'){
      await page.waitForTimeout(4000); // or better: wait for a container element
    }
    if (action !== 'okgol' && action !== 'televicentro') {
      const subscribeButton = page.locator(`xpath=//*[contains(normalize-space(text()), 'Subscribe Now') or contains(normalize-space(text()), 'Suscríbase Ahora') or contains(normalize-space(text()), '¡Hazte Miembro!') or contains(normalize-space(text()), 'Register') or contains(normalize-space(text()), 'Regístrate gratis')]`);
      if (await subscribeButton.count()) {
        await subscribeButton.first().click();
        console.log("Subscribe button clicked in the header!");
      } else {
        throw new Error("❌ Subscribe button not found!");
      }
    }else{
      // Here in the registration screen we go from the header login screen
       const loginbutton = page.locator(`xpath=//*[contains(normalize-space(text()), 'Log In') or contains(normalize-space(text()), 'Iniciar sesión') or contains(normalize-space(text()), 'Ingresar')]`);
      if (await loginbutton.count()) {
        await loginbutton.first().click();
        console.log("Login button clicked in the header!");
      } else {
        throw new Error("❌ Login button not found!");
      }
      // Wait for the Registration screen to load
      await page.waitForSelector('#login-button', { state: 'visible' });

      // Check first Title
       const h1 = page.locator('h1');
      try {
        await expect(h1).toHaveText(/Log in|Ingresar/i);
        const headingText = await h1.textContent();
        logSuccess(`✅ Found Title: "${headingText?.trim()}"`);
      } catch (error) {
        const actualText = await h1.textContent();
        logError(`❌ Heading did not match expected text. Found: "${actualText?.trim()}"`);
        throw error;
      }

      const link = await page.locator('a[href="/subscribe"]');
      const text = await link.textContent();
      console.log('Link text:', text?.trim());
      if (await link.isVisible()) {
        logSuccess('✅ Sign Up link is visible.');
        await link.click();
        logSuccess('✅ Sign Up link clicked.');
      } else {
        logError('❌ Sign Up link is not visible.');
      }
    }

    // Wait for the Registration screen to load
    await page.waitForSelector('#subscribe-button', { state: 'visible' });
    try {
      // Check first Title
    const h1 = page.locator('h1');
      try {
          await expect(h1).toHaveText(/Registration|Registro|Register/i);
          const headingText = await h1.textContent();
          logSuccess(`✅ Found Title: "${headingText?.trim()}"`);
        } catch (error) {
          const actualText = await h1.textContent();
          logError(`❌ Heading did not match expected text. Found: "${actualText?.trim()}"`);
          throw error;
        }

      let requiredFields = [];
      if (action === 'emmanuel') {
        // Check if all input fields exist on the Contact Us page
        // requiredFields = [
        //   { locator: '#firstname', name: 'First Name' },
        //   { locator: '#lastname', name: 'Last Name' },
        //   { locator: '#email', name: 'Email' },
        //   { locator: '#password', name: 'Password' },
        //   { locator: '#confirmPassword', name: 'Confirm Password' },
        //   { locator: '//mat-select[@aria-label="Default select example"]', name: 'Dropdown Select Country' },
        //   { locator: '#termsOfUseCheckBox', name: 'Checkbox Terms of Use' },
        //   { locator: '#receiveEmailsCheckBox', name: 'receiveEmailsCheckBox' },
        //   { locator: '#subscribe-button', name: 'Submit Button' },
        // ];
      }else if (action === 'amorir' || action === 'gols' || action === 'gamestreammedia') {
        requiredFields = [
          { locator: '#firstname', name: 'First Name' },
          { locator: '#lastname', name: 'Last Name' },
          { locator: '#email', name: 'Email' },
          { locator: '#password', name: 'Password' },
          { locator: '#confirmPassword', name: 'Confirm Password' },
          { locator: '//mat-select[@aria-label="Default select example"]', name: 'Dropdown Select Country' },
          { locator: '#termsOfUseCheckBox', name: 'Checkbox Terms of Use' },
          { locator: '#subscribe-button', name: 'Submit Button' }
        ];
      }else if (action === 'prtv'){
        requiredFields = [
          { locator: '#firstname', name: 'First Name' },
          { locator: '#lastname', name: 'Last Name' },
          { locator: '#phone', name: 'Phone' },
          { locator: '#email', name: 'Email' },
          { locator: '#password', name: 'Password' },
          { locator: '#confirmPassword', name: 'Confirm Password' },
          { locator: '//mat-select[@aria-label="Default select example"]', name: 'Dropdown Select Country' },
          { locator: '//mat-label[text()="Fecha de nacimiento"]', name: 'Date' },
          { locator: '#voucherCode', name: 'Voucher Code' },
          { locator: '#termsOfUseCheckBox', name: 'Checkbox Terms of Use' },
          { locator: '#subscribe-button', name: 'Submit Button' },
        ];
      }else if (action === 'okgol' || action === 'televicentro') {
          requiredFields = [
            { locator: '#firstname', name: 'First Name' },
            { locator: '#email', name: 'Email' },
            { locator: '#password', name: 'Password' },
            { locator: '#confirmPassword', name: 'Confirm Password' },
            { locator: '//mat-select[@aria-label="Default select example"]', name: 'Dropdown Select Country' },
            { locator: '#termsOfUseCheckBox', name: 'Checkbox Terms of Use' },
            { locator: '#subscribe-button', name: 'Submit Button' }
          ];
      }else if ( action === 'panamsport') {
          requiredFields = [
            { locator: '#email', name: 'Email' },
            { locator: '#password', name: 'Password' },
            { locator: '#confirmPassword', name: 'Confirm Password' },
            { locator: '//mat-select[@aria-label="Default select example"]', name: 'Dropdown Select Country' },
            { locator: '#termsOfUseCheckBox', name: 'Checkbox Terms of Use' },
            { locator: '#subscribe-button', name: 'Submit Button' }
          ];
      }else if ( action === 'tdmax'){
        requiredFields = [
          { locator: '#email', name: 'Email' },
          { locator: '#confirmEmail', name: 'Confirm Email' },
          { locator: '#password', name: 'Password' },
          { locator: '#confirmPassword', name: 'Confirm Password' },
          { locator: 'input[data-mat-calendar="mat-datepicker-0"]', name: 'Pick Date' },
          { locator: '//mat-select[@aria-label="Default select example"] >> nth=0', name: 'Dropdown Select Country' },
          { locator: '#termsOfUseCheckBox', name: 'Checkbox Terms of Use' },
          { locator: 'mat-select[role="combobox"] >> nth=1', name: 'Male/Female  ' },
          { locator: '#subscribe-button', name: 'Submit Button' },
          { locator: '#button-cancel', name: 'Cancel Button' }
        ];
      }

      for (const element of requiredFields) {
          await checkElementExists(page, element.locator, element.name);
      }

      // Check if exist link for Sign In
      const signInLink = page.locator('a.sign_in.text-decoration-none.reseller-color-link');
      if (await signInLink.isVisible()) {
        const title = await page.title();
        logSuccess('✅ Sign-in link is found and visible.', title);
      } else {
        logError('Sign-in link is not visible.');
        throw new Error("❌ Sign-in link not found!");
      }

      // Check if button subscribe is disabled
      await checkSubscribeButtonDisabled(page, action);
      console.log('All fields are empty. Now checking if the subscribe button is disabled...');

      stepNumber += 1;
      await regScreenSecondScenario(page, action, stepNumber);

      stepNumber += 1;
      await regScreenThirdcenario(page, action, stepNumber);

      stepNumber += 1;
      await regScreenFourcenario(page, action, stepNumber);

      stepNumber += 1;
      await regScreenFivecenario(page, action, stepNumber);

      if(action === 'tdmax'){
        stepNumber +=1;
       await landingPageRegisterButton (page,action,stepNumber)
      }

      stepNumber += 1;
      await regScreenSixcenario(page, action, stepNumber);

      if(action === 'tdmax'){
        stepNumber += 1;
        await checkHeaderElements(page,action,stepNumber);
      }

    } catch (err) {
      logError(`❌ An error occurred in registrationScreen: ${err.message}`);
      throw new Error(`❌ An error occurred in registrationScreen: ${err.message}`);
    }
  });
}

async function regScreenSecondScenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Registration Screen Second Scenario: Need to appear warning message in Email , Password and Confirm Password`, async () => {
    logStep(`${stepNumber}.Registration Screen Second Scenario: Need to appear warning message in Email , Password and Confirm Password`);
    try {

       // Fill First Name 
       if (action !== 'panamsport' && action !=='tdmax'){
        await page.locator('#firstname').fill('Test');
        const firstName = await page.locator('#firstname').inputValue();
        console.log(`First Name has Value: ${firstName}`);
       }

       //Fill Last Name
       if (action !== 'okgol' && action !== 'televicentro' && action !== 'panamsport' && action !== 'tdmax') {
          await page.locator('#lastname').fill('Test');
          const lastName = await page.locator('#lastname').inputValue();
          console.log(`Last Name has Value: ${lastName}`);
       }
       //Fill Phone 
       if (action === 'prtv') {
         await page.locator('#phone').fill('1234567890');
         const phone = await page.locator('#phone').inputValue();
         console.log(`Phone has Value: ${phone}`);
       }
      // Fill Select Country
      if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=0', 'Albania');
      }else{
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'Albania');
      }

      // Fill Email Not Valid
      await page.locator('#email').fill('test@');
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

      //fill confirm email tdmax
      if (action === 'tdmax'){
        await page.locator('#confirmEmail').fill('test@streann.com');
        const email = await page.locator('#confirmEmail').inputValue();
        console.log(`Confirm Email has Value: ${email}`);
      }
      
      // Fill Password Not Valid
      await page.locator('#password').fill('123');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has Value: ${password}`);

      // Fill Confirm Password Not Valid    
      await page.locator('#confirmPassword').fill('123');
      const confirmPassword = await page.locator('#confirmPassword').inputValue();  
      console.log(`Confirm Password has Value: ${confirmPassword}`);
      await page.locator('#confirmPassword').blur();

      if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=1', 'Femenino');
      }

      const invalidFields = [
        { id: '#email', name: 'Email'},
        { id: '#password', name: 'Password' },
        { id: '#confirmPassword', name: 'Confirm Password' },
      ];

      for (const field of invalidFields) {
        await checkAriaInvalid(page, field); // <-- Use helper function here
      }

      await termsOfUseCheckBox(page, action,false);

      // Check if button subscribe is disabled
      await checkSubscribeButtonDisabled(page, action);
      console.log('Now checking if the subscribe button is disabled...');

    } catch (err) {
      logError(`❌ An error occurred in regScreenSecondScenario: ${err.message}`);
      throw new Error(`❌ An error occurred in regScreenSecondScenario: ${err.message}`);
    }
  });
}

async function regScreenThirdcenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Registration Screen Third Scenario: Need to appear warning message in Confirm Password all others to be filled`, async () => {
    logStep(`${stepNumber}.Registration Screen Third Scenario: Need to appear warning message in Confirm Password all others to be filled`);
    try {

      //Refresh the page to reset the form
      await page.reload();
      await page.waitForSelector('#subscribe-button', { state: 'visible' });

       // Fill First Name 
       if (action !== 'panamsport' && action !== 'tdmax'){
        await page.locator('#firstname').fill('Test');
        const firstName = await page.locator('#firstname').inputValue();
        console.log(`First Name has Value: ${firstName}`);
       }
       //Fill Last Name
       if (action !== 'okgol' && action !== 'televicentro' && action !== 'panamsport' && action !== 'tdmax') {
          await page.locator('#lastname').fill('Test');
          const lastName = await page.locator('#lastname').inputValue();
          console.log(`Last Name has Value: ${lastName}`);
       }
      //Fill Phone 
      if (action === 'prtv') {
        await page.locator('#phone').fill('1234567890');
        const phone = await page.locator('#phone').inputValue();
        console.log(`Phone has Value: ${phone}`);
      }

       // Fill Select Country
      if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=0', 'Albania');
      }else{
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'Albania');
      }

      // Fill Email Valid
      await page.locator('#email').fill('test@streann.com');
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

       //fill confirm email tdmax
      if (action === 'tdmax'){
        await page.locator('#confirmEmail').fill('test@streann.com');
        const email = await page.locator('#confirmEmail').inputValue();
        console.log(`Confirm Email has Value: ${email}`);
      }
      
      // Fill Password  Valid
      await page.locator('#password').fill('123123');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has Value: ${password}`);

      // Fill Confirm Password Not Valid    
      await page.locator('#confirmPassword').fill('123');
      const confirmPassword = await page.locator('#confirmPassword').inputValue();  
      console.log(`Confirm Password has  Value: ${confirmPassword}`);
      await page.locator('#confirmPassword').blur();

       if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=1', 'Femenino');
      }

      const invalidFields = [
        { id: '#confirmPassword', name: 'Confirm Password' },
      ];

      for (const field of invalidFields) {
        await checkAriaInvalid(page, field); // <-- Use helper function here
      }

      await termsOfUseCheckBox(page, action,false);

      // Check if button subscribe is disabled
      await checkSubscribeButtonDisabled(page, action);
      console.log('Now checking if the subscribe button is disabled...');

    } catch (err) {
      logError(`❌ An error occurred in regScreenThirdcenario: ${err.message}`);
      throw new Error(`❌ An error occurred in regScreenThirdcenario: ${err.message}`);
    }
  });
}

async function regScreenFourcenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Registration Screen Four Scenario: Filled all fields only checkbox not checked button Submit need to be Disable `, async () => {
    logStep(`${stepNumber}.Registration Screen Four Scenario: Filled all fields only checkbox not checked button Submit need to be Disable`);
    try {

      //Refresh the page to reset the form
      await page.reload();
      await page.waitForSelector('#subscribe-button', { state: 'visible' });

       // Fill First Name ( NOTES ALL FIELDS ARE FILLED only checkbox not checked)
       if (action !== 'panamsport' && action !== 'tdmax'){
        await page.locator('#firstname').fill('Test');
        const firstName = await page.locator('#firstname').inputValue();
        console.log(`First Name has Value: ${firstName}`);
       }

       //Fill Last Name
       if ( action !== 'okgol' && action !== 'televicentro' && action !== 'panamsport' && action !== 'tdmax') {
        await page.locator('#lastname').fill('Test');
        const lastName = await page.locator('#lastname').inputValue();
        console.log(`Last Name has Value: ${lastName}`);
      }
      //Fill Phone 
      if (action === 'prtv') {
        await page.locator('#phone').fill('1234567890');
        const phone = await page.locator('#phone').inputValue();
        console.log(`Phone has Value: ${phone}`);
      }

      // Fill Select Country
      if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=0', 'Albania');
      }else{
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'Albania');
      }

      // Fill Email  Valid
      await page.locator('#email').fill('test@streann.com');
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

        //fill confirm email tdmax
      if (action === 'tdmax'){
        await page.locator('#confirmEmail').fill('test@streann.com');
        const email = await page.locator('#confirmEmail').inputValue();
        console.log(`Confirm Email has Value: ${email}`);
      }
      
      // Fill Password Valid
      await page.locator('#password').fill('123123');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has Value: ${password}`);

      // Fill Confirm Password  Valid    
      await page.locator('#confirmPassword').fill('123123');
      const confirmPassword = await page.locator('#confirmPassword').inputValue();  
      console.log(`Confirm Password has  Value: ${confirmPassword}`);
      await page.locator('#confirmPassword').blur();

      if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=1', 'Femenino');
      }

      await termsOfUseCheckBox(page, action, false);

      // Check if button subscribe is disabled
      await checkSubscribeButtonDisabled(page, action);
      console.log('Now checking if the subscribe button is disabled...');

    } catch (err) {
      logError(`❌ An error occurred in regScreenFourcenario: ${err.message}`);
      throw new Error(`❌ An error occurred in regScreenFourcenario: ${err.message}`);
    }
  });
}

async function regScreenFivecenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Registration Screen Five Scenario:Create new User success `, async () => {
    logStep(`${stepNumber}. Registration Screen Five Scenario:Create new User success`);
    try {

      //Refresh the page to reset the form
      await page.reload();
      await page.waitForSelector('#subscribe-button', { state: 'visible' });

       // Fill First Name ( NOTES ALL FIELDS ARE FILLED)
        if (action !== 'panamsport' && action !== 'tdmax'){
          await page.locator('#firstname').fill('Test');
          const firstName = await page.locator('#firstname').inputValue();
          console.log(`First Name has Value: ${firstName}`);
        }

       //Fill Last Name
       if (action !== 'okgol' && action !== 'televicentro' && action !== 'panamsport' && action !== 'tdmax') {
        await page.locator('#lastname').fill('Test');
        const lastName = await page.locator('#lastname').inputValue();
        console.log(`Last Name has Value: ${lastName}`);
       }
      //Fill Phone 
      if (action === 'prtv') {
        await page.locator('#phone').fill('1234567890');
        const phone = await page.locator('#phone').inputValue();
        console.log(`Phone has Value: ${phone}`);
      }
      // Fill Select Country
      if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=0', 'Albania');
      }else{
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'Albania');
      }

     // Fill Email 
      const baseEmail = "test+@streann.com";
      const emailWithDate = generateEmail(baseEmail);
      console.log(emailWithDate); 
      await page.locator('#email').fill(emailWithDate);
      const email = await page.locator('#email').inputValue();
      console.log(`Email has Value: ${email}`);

      //fill confirm email tdmax
      if (action === 'tdmax'){
        await page.locator('#confirmEmail').fill(emailWithDate);
        const email = await page.locator('#confirmEmail').inputValue();
        console.log(`Confirm Email has Value: ${email}`);
      }
      
      // Fill Password  Valid
      await page.locator('#password').fill('123123');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has Value: ${password}`);

      // Fill Confirm Password  Valid    
      await page.locator('#confirmPassword').fill('123123');
      const confirmPassword = await page.locator('#confirmPassword').inputValue();  
      console.log(`Confirm Password has  Value: ${confirmPassword}`);
      await page.locator('#confirmPassword').blur();

      if (action === 'tdmax'){
         await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=1', 'Femenino');
      }

      // Check termd of use checkbox
      await termsOfUseCheckBox(page, action,true);

      // Check if button subscribe is disabled
      console.log('Now checking if the subscribe button is enabled...');
      await checkSubscribeButtonDisabled(page, action,'enabled');

      await redirectionAfterRegistration(page, action);
     
    } catch (err) {
      logError(`❌ An error occurred in regScreenFivecenario: ${err.message}`);
      throw new Error(`❌ An error occurred in regScreenFivecenario: ${err.message}`);
    }
  });
}

async function regScreenSixcenario(page, action, stepNumber) {
  await test.step(`${stepNumber}. Registration Screen Six Scenario:Try to create new User with already exist email `, async () => {
    logStep(`${stepNumber}. Registration Screen Six Scenario:Try to create new User with already exist email`);
    try {

      await page.waitForSelector('#navbarToggler', { state: 'visible', timeout: 70000 });

      if (action === 'okgol'|| action === 'televicentro') {
         const baseUrl = `https://${action}-v3-dev.streann.tech/subscribe`;
         await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });      // Wait for the login screen to load
      }else{
        // CLick to redirect to Registration Screen from the Header
        await page.waitForTimeout(5000); // Wait for 5 seconds
        const subscribeButton = page.getByText(/subscribe now|suscr[ií]base ahora|¡hazte miembro!|register|reg[íi]strate gratis/i,{ exact: false });
        if (await subscribeButton.count()) {
          await subscribeButton.first().click();
          console.log("Subscribe button clicked in the header!");
        } else {
          throw new Error("❌ Subscribe button not found!");
        }
      }

      // Wait for the Registration screen to load
      await page.waitForSelector('#subscribe-button', { state: 'visible', timeout: 20000 });  

      // Fill First Name ( NOTES ALL FIELDS ARE FILLED)
      if (action !== 'panamsport' && action !== 'tdmax') {
        await page.locator('#firstname').fill('Test');
        const firstName = await page.locator('#firstname').inputValue();
        console.log(`First Name has Value: ${firstName}`);
      }

       //Fill Last Name
      if (action !== 'okgol' && action !== 'televicentro' && action !== 'panamsport' && action !== 'tdmax') {
        await page.locator('#lastname').fill('Test');
        const lastName = await page.locator('#lastname').inputValue();
        console.log(`Last Name has Value: ${lastName}`);
      }
      //Fill Phone 
      if (action === 'prtv') {
        await page.locator('#phone').fill('1234567890');
        const phone = await page.locator('#phone').inputValue();
        console.log(`Phone has Value: ${phone}`);
      }

      // Fill Select Country
      if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=0', 'Albania');
      }else{
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"]', 'Albania');
      }

      // Fill Email
      let emailWithDate1 = '';
      if (action === 'emmanuel'){
        await page.locator('#email').fill('erhan+1115@streann.com'); 
        const email = await page.locator('#email').inputValue();
        console.log(`Email has Value: ${email}`);
      }else {
        const baseEmail = "test+@streann.com";
        emailWithDate1 = generateEmail(baseEmail);
        console.log(emailWithDate1); 
        await page.locator('#email').fill(emailWithDate1); 
        const email = await page.locator('#email').inputValue();
        console.log(`Email has Value: ${email}`);
      }

      //fill confirm email tdmax
      if (action === 'tdmax'){
        await page.locator('#confirmEmail').fill(emailWithDate1);
        const email = await page.locator('#confirmEmail').inputValue();
        console.log(`Confirm Email has Value: ${email}`);
      }
      // Fill Password  Valid
      await page.locator('#password').fill('123123');
      const password = await page.locator('#password').inputValue();
      console.log(`Password has Value: ${password}`);

      // Fill Confirm Password  Valid    
      await page.locator('#confirmPassword').fill('123123');
      const confirmPassword = await page.locator('#confirmPassword').inputValue();  
      console.log(`Confirm Password has  Value: ${confirmPassword}`);
      await page.locator('#confirmPassword').blur();

      if (action === 'tdmax'){
        await selectDropdownByVisibleText(page, '//mat-select[@aria-label="Default select example"] >> nth=1', 'Femenino');
      }

      // Check termd of use checkbox
      await termsOfUseCheckBox(page, action,true);

      // Check if button subscribe is disabled
      console.log('Now checking if the subscribe button is enabled...');
      await checkSubscribeButtonDisabled(page, action,'enabled');

      // Check if error pop up is visible
     await checkDinamiclyPopUP(page, action,'#toast-container');
     console.log('Now checking if the error pop up is visible...');

    } catch (err) {
      logError(`❌ An error occurred in regScreenSixcenario: ${err.message}`);
      throw new Error(`❌ An error occurred in regScreenSixcenario: ${err.message}`);
    }
  });
}

async function termsOfUseCheckBox(page, action, checkedCheckbox) {
  logStep(`Terms of Use CheckBox`);
  try {
    const termsOfUseCheckBox = page.locator('#termsOfUseCheckBox-input');

    if (checkedCheckbox) {
      await termsOfUseCheckBox.click(); 
    }

    const isChecked = await termsOfUseCheckBox.evaluate((el) => el.checked);
    await page.waitForTimeout(4000); // Wait for 1 seconds to ensure the checkbox state is updated
    if (isChecked) {
      console.log('✅ Terms of Use checkbox is checked.');
    } else {
      console.log('❌ Terms of Use checkbox is not checked.');
    }
  } catch (err) {
    logError(`❌ An error occurred in termsOfUseCheckBox: ${err.message}`);
    throw new Error(`❌ An error occurred in termsOfUseCheckBox: ${err.message}`);
  }
}

async function checkSubscribeButtonDisabled(page, action, enabled) {
    if (enabled) {
      // Should be enabled
      const isDisabled = await page.locator('#subscribe-button').isDisabled();
      if (!isDisabled) {
          logSuccess('✅ Subscribe button is enabled as expected.');
          console.log('Click in the Subscribe button');
          //await page.waitForTimeout(7000); // Wait for 5 seconds 
          await page.waitForSelector('#subscribe-button', { state: 'visible' });
          await page.locator('#subscribe-button').click();
      } else {
          logError('❌ Subscribe button is disabled when it should be enabled.');
          throw new Error('❌ Subscribe button is disabled when it should be enabled.');
      }
    } else {
      // Should be disabled
      const isDisabled = await page.locator('#subscribe-button').isDisabled();
      if (isDisabled) {
          logSuccess('✅ Subscribe button is disabled as expected.');
      } else {
          logError('❌ Subscribe button is enabled when it should be disabled.');
          throw new Error('❌ Subscribe button is enabled when it should be disabled.');
      }
    }
}

async function redirectionAfterRegistration(page, action) {
  try {
    if  (action === 'amorir' || action === 'okgol' || action === 'televicentro' || action === 'tdmax' ) {
        // Wait for the URL to change to the expected one
        await page.waitForURL(/\/user\/choose-plan/, { timeout: 10000 });
        // Check if the URL contains the expected path
        const currentUrl = page.url();  
        if (currentUrl.includes('/user/choose-plan')) {
          logSuccess('✅ Successfully redirected to the choose plan page after registration.');
        } else {
          logError('❌ Failed to redirect to the choose plan page after registration.');
          throw new Error('❌ Failed to redirect to the choose plan page after registration.');
        }

        // Check if the title is as expected
        await expect(page.locator('h1.d-flex.justify-content-center.text-center.mt-1.title.mb-1.pt-1')).toHaveText('Elige Tu Plan', { timeout: 10000 });
        const headingText = await page.locator('h1.d-flex.justify-content-center.text-center.mt-1.title.mb-1.pt-1').textContent();
        logSuccess(`✅ Found Title: "${headingText?.trim()}"`);

        // Check if the "Choose Plan Screen" button Continue is visible
        const buttonContinueWithoutPlan = page.locator(
          "//button[.//span[text()='Continuar sin suscripción'] or .//span[text()='No quiero un plan ahora']]"
        );
        await buttonContinueWithoutPlan.waitFor({ timeout: 20000 }); // wait for up to 20 seconds
        await buttonContinueWithoutPlan.click(); // click it
        logSuccess('✅ Clicked "Choose Plan" Continue button and navigated to the Home Page');

        // Be sure that is navigated to the Home Page
        const url = `https://${action}-v3-dev.streann.tech/`;
        await expect(page).toHaveURL(url);
        console.log(`✅ Successfully navigated to ${url}`);

        // Log Out the user then check for six scenario od registration screen create new user with already existing email
        await logOutUser(page, action);
    }else if (action === 'emmanuel') {
       // Check here if will Appear pop up for email verification
      await emailVerificationPopup(page,action);
    }else if (action === 'panamsport' || action === 'gols' || action === 'gamestreammedia' || action === 'prtv') {
      const url = `https://${action}-v3-dev.streann.tech/`;
      await expect(page).toHaveURL(url, { timeout: 20000 }); // waits up to 20 seconds
      console.log(`✅ Successfully navigated to ${url}`);
        // Log Out the user then check for six scenario od registration screen create new user with already existing email
        await logOutUser(page, action);
    }
  } catch (err) {
    logError(`❌ An error occurred in redirectionAfterRegistration: ${err.message}`);
    throw new Error(`❌ An error occurred in redirectionAfterRegistration: ${err.message}`);
  }
}

async function emailVerificationPopup(page,action) {
  logStep(`Email Verification Popup`);
  try {
    // Wait for the email verification modal to appear
    await page.waitForSelector('.mat-mdc-dialog-surface', { timeout: 20000 });
    logSuccess('✅ Email verification modal is displayed.');

    // Click the "Continue" button
    await page.click('#continue-button');
    console.log('Clicked the "Continue" button in the email verification modal.');

    // Wait for the modal to disappear
    await page.waitForSelector('#continue-button', { state: 'detached', timeout: 10000 });
    logSuccess('✅ Email verification modal is closed.');

    // Check if redirected to the login screen
    await page.waitForURL('**/login', { timeout: 10000 });
    const currentUrl = page.url();
    await redirectUrl(page,'/login');
  } catch (err) {
    logError(`❌ An error occurred in emailVerificationPopup: ${err.message}`);
    throw new Error(`❌ An error occurred in emailVerificationPopup: ${err.message}`);
  }
}



module.exports = {
  registrationScreen,
};








