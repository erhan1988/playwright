const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers

async function checkElementExists(page, locator, name, timeout = 20000) {
    try {
        const elements = page.locator(locator);

        // Wait for at least one element to appear (or timeout)
        await elements.first().waitFor({ timeout });
        const count = await elements.count();

        if (count > 1) {
            logError(`❌ Found multiple elements (${count}) for ${name}. Locator: ${locator}`);
            return { name, status: 'error', error: `Multiple elements found (${count})` };
        } else if (count === 0) {
            logError(`❌ No elements found for ${name}. Locator: ${locator}`);
            return { name, status: 'not visible' };
        }

        const isVisible = await elements.first().isVisible();
        expect(isVisible).toBeTruthy(); // Assert that the element is visible
        logSuccess(`✅ ${name} exists and is visible.`);
        return { name, status: 'visible' }; // Return success result

    } catch (error) {
        logError(`Error while checking ${name}: ${error.message}`);
        return { name, status: 'error', error: error.message }; // Return error result
    }
}


async function GobackLink(page, value) {
    console.log('Checking for the "Go Back" link in the Details screen...');
    try {
        const goBackLink = page.locator('a.my-1.d-flex.align-items-center.fs-5');

        // Wait for the "Go Back" link to appear
        await goBackLink.waitFor({ state: 'visible', timeout: 5000 });

        const text = await goBackLink.textContent();
        logSuccess(`1. "GO BACK" link exists in the Details screen. Text: ${text.trim()}`);

        if (value === 'click') {
            logStep('Clicking the "Go Back" link...');
            await goBackLink.click();

            const initialUrl = page.url();
            await page.waitForFunction(
                (initialUrl) => window.location.href !== initialUrl,
                initialUrl,
                { timeout: 10000 }
            );
            const currentUrl = page.url();
            console.log('Current URL:', currentUrl);

            const expectedUrl = 'https://amorir-v3-dev.streann.tech/content/inicio/JnuxRZ0OclyIuaxox2SYLYLY2';
            if (currentUrl === expectedUrl) {
                logSuccess('2. The current URL matches the expected URL after clicking "Go Back".');
            } else {
                logError(`2. ❌ URL mismatch after clicking "Go Back". Expected: ${expectedUrl}, but got: ${currentUrl}`);
                throw new Error(`URL mismatch: Expected ${expectedUrl}, got ${currentUrl}`);
            }
        }
    } catch (err) {
        const message = err.message.includes('Timeout') ?
        '❌ "Go Back" link not found within timeout. It may not exist on this screen.' :
        `❌ An unexpected error occurred in GobackLink: ${err.message}`;
        logError(`1. ${message}`);
        throw new Error(message); // Throw 
    }
}

async function titleDetailsScreen(page,action) {
    logStep('Checking for the title on the Details screen...');
    try {
        let titleLocator;
        if (action === 'okgol' || action === 'gols' || action === 'gamestreammedia' || action === 'tdmax'){
            titleLocator = page.locator('h5.title-title');
        }
        else {
            titleLocator = page.locator('h1.title-title.fs-3');
        }
        await titleLocator.waitFor({ state: 'visible', timeout: 30000 });
        const titleElements = await titleLocator.all();

        if (titleElements.length === 0) {
            const msg = "No Title found on the Details page.";
            logError(msg);
            throw new Error(msg);
        }

        for (let i = 0; i < titleElements.length; i++) {
            const text = await titleElements[i].textContent();
            logSuccess(`✅ Title in the Details screen exists: ${i + 1}: ${text.trim()}`);
        }

        logSuccess('✅ Title found on the Details page.');
    } catch (err) {
        logError(`❌ An error occurred in titleDetailsScreen: ${err.message}`);
        throw err;
    }
}

async function backgroundImageDetailsScreen(page,action) {
    logStep('Checking for background images in the Details screen...');
    try {
        let imageLocator;
        if (action === 'okgol' || action === 'gols' || action === 'gamestreammedia'|| action === 'tdmax') {
            imageLocator = page.locator('img.img-fluid').nth(1);
        } else {
            imageLocator = page.locator('div.details-image.details-image-desktop');
        }
        await imageLocator.waitFor({ state: 'visible', timeout: 15000 });
        const imageCount = await imageLocator.count();
        logSuccess(`✅ Found ${imageCount} background image(s).`);

        if (imageCount > 0) {
            for (let i = 0; i < imageCount; i++) {
                const backgroundImage = await imageLocator.nth(i).evaluate(el => getComputedStyle(el).backgroundImage);
                logSuccess(`✅ Background Image in details screen is ${i + 1}: ${backgroundImage}`);
            }
        } else {
            const msg = 'No background images found in the Details screen.';
            logError(msg);
            throw new Error(msg);
        }
    } catch (err) {
        logError(`❌ An error occurred in backgroundImageDetailsScreen: ${err.message}`);
        throw new Error(err.message);
    }
}

async function buttonsDetailsScreen(page, action, loggedUser) {
    logStep('Checking for buttons in Details screen...');
    try {

        await page.evaluate(() => window.scrollBy(0, 200));
       await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('button')).some(
            btn => btn.textContent && btn.textContent.trim().length > 0
        ),
        null,
        { timeout: 10000 }
        );
        
        if (action !== 'panamsport' && action !== 'prtv' && action !== 'tdmax') {
            await page.waitForSelector("//button[.//span[contains(text(), 'Suscribirse') or contains(text(), 'Subscribe')]]", { state: 'visible', timeout: 10000 });
            await page.waitForSelector('span.mdc-button__label', { state: 'visible', timeout: 15000 });
        }
        let buttons;
        if (action === 'panamsport' && loggedUser || action === 'gols' && loggedUser || action === 'prtv' && !loggedUser || action === 'prtv' && loggedUser || action === 'tdmax'
            && loggedUser
        ) {
           await page.waitForSelector("xpath=//*[text()='Watch now' or text()='Ver ahora']", { timeout: 20000 });
            await page.waitForSelector("//button[.//span[contains(@class,'mdc-button__label')]]", { timeout: 20000 });
            buttons = page.locator('button');
        } else {
            buttons = page.locator("//button[.//span[contains(@class,'mdc-button__label')] ]");
        }
        const buttonCount = await buttons.count();
        logSuccess(`✅ Found ${buttonCount} buttons in the Details screen.`);

        let watchNowFound = false;
        let suscribirseFound = false;

        for (let i = 0; i < buttonCount; i++) {
            const button = buttons.nth(i);
            const buttonText = await button.textContent();
            const trimmedText = buttonText.trim();
            console.log(`Button ${i}: "${trimmedText}"`);

            // "Watch Now" for prtv Panamsport
            const lowerText = trimmedText.toLowerCase();    
            if (
            (action === 'prtv' && (lowerText.includes('watch now') || lowerText.includes('ver ahora'))) ||
            (loggedUser && lowerText.includes('watch now') && action === 'panamsport') ||
            (action === 'gols' && loggedUser && lowerText.includes('watch now')) || 
            (action === 'tdmax' && (lowerText.includes('watch now') || lowerText.includes('ver ahora')))
            ){
                const isVisible = await button.isVisible();
                const isEnabled = await button.isEnabled();
                if (!isVisible || !isEnabled) {
                    await page.screenshot({ path: `watchnow_button_not_enabled_${i + 1}.png` });
                    throw new Error(`"Watch Now" button at index ${i} is not enabled or not visible.`);
                }
                logSuccess(`✅ Found "Watch Now" button at Details screen`);
                if ( action === 'gols' && loggedUser) {
                    return;
                }
                watchNowFound = true;
                    // Here we don't check player for gols becuase they Deleted and some vods will not work
                if ( loggedUser && action !== 'gols' || !loggedUser && action === 'prtv' || loggedUser && action === 'tdmax') {
                    logStep(`Clicking on "Watch Now" button at Details screen...`);
                    await button.click();
                    await redirectUrl(page, '/player');
                    return;
                }
            }
            // "Suscribirse" for other actions
            if (['amorir', 'okgol', 'televicentro','panamsport','gols','gamestreammedia'].includes(action) &&
                (trimmedText.toLowerCase() === 'suscribirse' || trimmedText.toLowerCase() === 'subscribe' || trimmedText.toLowerCase().includes('buy now'))) {
                const isVisible = await button.isVisible();
                const isEnabled = await button.isEnabled();
                if (!isVisible || !isEnabled) continue; // Skip hidden/disabled buttons

                if (action === 'gols' && !loggedUser){
                    logSuccess(`✅ Found "Buy Now" button at Details screen`);
                    suscribirseFound = true;
                    logStep(`Clicking on "Buy Now" button at Details screen...`);
                }else{
                    logSuccess(`✅ Found "Suscribirse" button at Details screen`);
                    suscribirseFound = true;
                    logStep(`Clicking on "Suscribirse" button at Details screen...`);
                }
                try {
                    await button.click();
                    if (loggedUser) {
                        await redirectUrl(page,'/user/choose-plan');
                    } else {
                        await redirectUrl(page,'/login');
                    }

                    // Go back to the details screen
                    logStep('Navigating back to the Details screen...');
                    await page.goBack();
                    const backUrl = page.url();
                    await page.waitForSelector('a.my-1.d-flex.align-items-center.fs-5', { state: 'visible' });
                    logSuccess(`✅ Returned to Details screen. Current URL: ${backUrl}`);

                    // Only continue with "Share" if action is 'amorir', 'okgol', or 'televicentro'
                    logStep('Looking for the "Share" button...');
                    const compartirButton = page.locator("//button[.//span[contains(text(), 'Compartir') or contains(text(), 'Share')]]").first();
                    try {
                        await compartirButton.waitFor({ state: 'visible', timeout: 5000 });
                        logSuccess(`✅ Found "Share" button at Details screen`);
                        logStep(`Clicking on "Share" button at Details screen...`);
                        await compartirButton.click();
                        await page.waitForTimeout(2000); // If you expect a popup, wait for it or use waitForSelector
                        await checkSharePopup(page, 'cdk-overlay-0');
                    } catch (error) {
                        await page.screenshot({ path: `share_button_not_found_${action}.png` });
                        logError(`❌ "Share" button not found or not visible after returning to the Details screen.`);
                        throw new Error(`"Share" button not found or not visible.`);
                    }
                } catch (err) {
                    await page.screenshot({ path: `suscribirse_button_click_error_${action}.png` });
                    console.log('Button click failed at index', i, 'Error:', err.message);
                    throw err;
                }
                break;
            }
        }
        if (!watchNowFound && action === 'prtv' || !watchNowFound && loggedUser && action === 'panamsport' || !watchNowFound && loggedUser && action === 'gols' ||
            !watchNowFound && loggedUser && action === 'tdnax') {
            const msg = `❌ "Watch Now" button not found for action: ${action}`;
            await page.screenshot({ path: `watch_now_button_not_found_${action}.png` });
            logError(msg);
            throw new Error(msg);
        }
        if (['amorir', 'okgol', 'televicentro','panamsport','gols','gamestreammedia'].includes(action) && !suscribirseFound) {
            await page.screenshot({ path: `suscribirse_button_not_found_${action}.png` });
            const msg = `❌ "Suscribirse" button not found for action: ${action}`;
            logError(msg);
            throw new Error(msg);
        }
    } catch (err) {
        logError(`❌ An error occurred in buttonsDetailsScreen: ${err.message}`);
        throw new Error(err.message);
    }
}

async function redirectUrl(page, expectedPartOfUrl, timeout = 20000) {
    try {
        const initialUrl = page.url();
        console.log(`🌐 Initial URL: ${initialUrl}`);

        // Wait for the URL to contain the expected part
        await page.waitForFunction(
            (expected) => window.location.href.includes(expected),
            expectedPartOfUrl,
            { timeout }
        );

        const currentUrl = page.url();
        console.log(`🌐 Current URL after wait: ${currentUrl}`);

        if (currentUrl.includes(expectedPartOfUrl)) {
            logSuccess(`✅ URL contains the expected path: ${expectedPartOfUrl}`);
        } else {
            const message = `❌ URL does not contain the expected path "${expectedPartOfUrl}". Current URL: "${currentUrl}"`;
            await page.screenshot({ path: `redirectUrl_error_${Date.now()}.png` });
            logError(message);
            throw new Error(message);
        }
    } catch (err) {
        logError(`❌ redirectUrl error: ${err.message}`);
        await page.screenshot({ path: `redirectUrl_exception_${Date.now()}.png` });
        throw err;
    }
}

async function checkPlayerScreen(page, action, stepNumber, value) {
    await test.step(`${stepNumber}. Checking Player screen...`, async () => {
        logStep(`${stepNumber}. Checking Player screen...`);
        try {
            const video = await page.waitForSelector('#vjsplayer_html5_api', { timeout: 20000 });
            expect.soft(video, 'Video element should be in the DOM').not.toBeNull();
            if (video) {
                logSuccess('✅ Video element exists');
            } else {
                logError('❌ Video element is null or not found in DOM');
            }

            const isVisible = await video.evaluate(el => el.offsetParent !== null);
            expect.soft(isVisible, 'Video player should be visible on screen').toBe(true);
            isVisible ? logSuccess('✅ Video is visible on screen') : logError('❌ Video is not visible');

            let isReady = false;
            for (let i = 0; i < 10; i++) {
                isReady = await video.evaluate(el => el.readyState > 2);
                if (isReady) {
                    console.log('Video is ready to play.');
                    break;
                }
                console.log('...Waiting for video to be ready...');
                await page.waitForTimeout(8000);
            }
            expect.soft(isReady, 'Video should become ready to play').toBe(true);
            isReady ? logSuccess('✅ Video is ready to play') : logError('❌ Video did not become ready to play');

            const initialTime = await video.evaluate(el => el.currentTime);
            await page.waitForTimeout(5000);
            const laterTime = await video.evaluate(el => el.currentTime);
            const isPlaying = laterTime > initialTime;
            const playedDuration = (laterTime - initialTime).toFixed(2); // Optional: round to 2 decimal places
            expect.soft(isPlaying, `Video should be playing. Initial: ${initialTime}, Later: ${laterTime}`).toBe(true);
            isPlaying ? logSuccess(`✅ Video is playing — advanced by ${playedDuration} seconds`) : logError('❌ Video is not playing');

            const pauseButton = await page.waitForSelector('button.vjs-play-control.vjs-control.vjs-button.vjs-playing', { timeout: 10000 });
            const titlePause = await pauseButton.getAttribute('title');
            expect.soft(titlePause).toBe('Pause');
            titlePause === 'Pause' ? logSuccess('✅ Pause button exists and labeled correctly') : logError(`❌ Pause button label mismatch. Found: ${titlePause}`);

            await video.evaluate(el => el.pause());

            const playButton = await page.waitForSelector('button.vjs-play-control.vjs-control.vjs-button.vjs-paused', { timeout: 10000 });
            const titlePlay = await playButton.getAttribute('title');
            expect.soft(titlePlay).toBe('Play');
            titlePlay === 'Play' ? logSuccess('✅ Play button appears after pausing') : logError(`❌ Play button label mismatch. Found: ${titlePlay}`);

            const volumeButton = await page.waitForSelector('button.vjs-mute-control.vjs-control.vjs-button.vjs-vol-3', { timeout: 10000 });
            const volumeTitle = await volumeButton.getAttribute('title');
            expect.soft(volumeTitle).toBe('Mute');
            volumeTitle === 'Mute' ? logSuccess('✅ Volume button is visible and labeled "Mute"') : logError(`❌ Volume button label mismatch. Found: ${volumeTitle}`);
            await volumeButton.click();

            const muteButton = await page.waitForSelector('button.vjs-mute-control.vjs-control.vjs-button.vjs-vol-0', { timeout: 10000 });
            const muteTitle = await muteButton.getAttribute('title');
            expect.soft(muteTitle).toBe('Unmute');
            muteTitle === 'Unmute' ? logSuccess('✅ Mute button is visible and labeled "Unmute"') : logError(`❌ Mute button label mismatch. Found: ${muteTitle}`);

            // 5. Check for progress bar
            const progressBar = await page.$('div.vjs-progress-control.vjs-control');
            expect.soft(progressBar, 'Progress bar should be present').not.toBeNull();
            if (progressBar) {
                logSuccess('✅ Progress bar exists.');
            } else {
                logError('❌ Progress bar not found.');
            }

            //6 .Check Share Icon in the Player screen For PRTV we don't have Share in te player
            if (action !== 'prtv'){
                const shareIcon = await page.$("//button[@type='button' and contains(@class, 'share-content-icon')]");
                // Soft assertion for reporting (won't fail the test)
                expect.soft(shareIcon, 'Share icon should be present').not.toBeNull();
                // Only click if it exists
                if (shareIcon) {
                await shareIcon.click();
                logSuccess('✅ Share icon clicked.');
                await page.waitForTimeout(2000);
                await checkSharePopup(page,'cdk-overlay-0');
                } else {
                logError('❌ Share icon not found.');
                }
            }
            
            if (action === 'emmanuel') {
                // 7. Check for Bible toggle
                const bibleToggle = await page.$('text=Bible'); // Visible text match
                expect.soft(bibleToggle, 'Bible toggle should be present').not.toBeNull();
                if (bibleToggle) {
                    logSuccess('✅ Bible toggle exists.');
                } else {
                    logError('❌ Bible toggle not found.');
                }

                // 8. Check for chat button
                const chatBtn = await page.$('button.btn.chat-icon.btn-active');
                expect.soft(chatBtn, 'Chat button should be present').not.toBeNull();
                if (chatBtn) {
                    await chatBtn.click();
                    logSuccess('✅ Chat button exists and was clicked.');
                    await page.waitForTimeout(2000);
                    await redirectUrl(page,'/login');

                    await page.goBack(); // Go back in browser history
                    await page.waitForTimeout(2000); // Wait for 2 seconds
                    // Capture the current URL after clicking back
                    const newURL = page.url();
                    console.log('New URL after back:', newURL);
                } else {
                    logError('❌ Chat button not found.');
                }
            }
            // Back Button in the player
            const backButton = await page.$('#player-back-button');
            // Soft assertion for reporting
            expect.soft(backButton, 'Back button should be present').not.toBeNull();

            if (backButton) {
                logSuccess('✅ Back button exist.');
                await backButton.click();
                logSuccess('✅ Back button clicked.');
                await page.waitForTimeout(2000);
                await redirectUrl(page,'/title')
            } else {
            logError('❌ Back button not found.');
            }
            
        } catch (err) {
            logError(`❌ An error occurred in checkPlayerScreen: ${err.message}`);
            throw new Error(`❌ An error occurred in checkPlayerScreen: ${err.message}`);
        }
    });
}

async function checkSharePopup(page, popupId) {
    try {
        const popupSelector = `#${popupId}`;
        const popupShare = page.locator(popupSelector); // Use Locator

        // Wait until the popup is visible
        await popupShare.waitFor({ state: 'visible', timeout: 30000 });

        const isVisible = await popupShare.isVisible();
        
        if (isVisible) {
            logSuccess(`- Share Popup is shown: ${isVisible}`);

            // Check for buttons inside the popup
            const buttons = await popupShare.locator('button').all();

            for (const button of buttons) {
                let buttonText = '';
                try {
                    buttonText = (await button.innerText({ timeout: 5000 })).trim().toLowerCase();
                } catch (err) {
                    console.log('Failed to get button text:', err.message);
                    continue; // Skip this button if it fails
                }

                if (buttonText === 'facebook') {
                    console.log('-. Facebook button is present in the popup');
                } else if (buttonText === 'whatsapp') {
                    console.log('-. WhatsApp button is present in the popup');
                } else if (buttonText === 'x') {
                    console.log('-. Twitter button is present in the popup');
                } else if (buttonText === 'copy link') {
                    console.log('-. Copy Link button is present in the popup');
                }
            }

            // Check for image with specific alt attribute
            const imageLocator = popupShare.locator('img.share-modal-image[alt="share-modal-image"]');
            const imageCount = await imageLocator.count();

            if (imageCount > 0) {
                console.log("Image exists in the popup.");

                for (let i = 0; i < imageCount; i++) {
                    const src = await imageLocator.nth(i).getAttribute('src');
                    console.log(`- Image ${i + 1} src in the popup: ${src}`);
                }
            } else {
                console.log("Image element does not exist.");
                logError('Image element does not exist.');
                throw new Error('Image element does not exist.');
            }

            // Close the popup
            const closeIcon = page.locator('i.bi.bi-x-lg.btn.text-white');
            try {
                await closeIcon.waitFor({ state: 'visible', timeout: 5000 });
                await closeIcon.click();
                console.log('- Clicked to close the popup');
                await page.waitForTimeout(4000);
            } catch (err) {
                console.log('❌ Close icon not found or not clickable:', err.message);
                await page.screenshot({ path: 'close_icon_debug.png' });
                throw err;
            }

            // Verify the popup is closed
            const popupGone = await page.locator(popupSelector).isVisible().catch(() => false);

            if (!popupGone) {
                logSuccess("Popup is closed");
               // await page.waitForTimeout(3000);
            }
        } else {
            console.log("Share Popup did not appear within 30 seconds.");
            logError( 'Share Popup did not appear within 30 seconds.');
        }
    } catch (err) {
        logError(`❌ An error occurred in checkSharePopup: ${err.message}`);
        throw new Error(`❌ An error occurred in checkSharePopup: ${err.message}`);
    }
}

// Function to select a dropdown by visible text
async function selectDropdownByVisibleText(page, dropdownSelector, visibleText) {
    // Wait for the dropdown to be visible and click it
    const dropdown = await page.locator(dropdownSelector);
    await dropdown.click();
  
    // Wait for the option to be visible and click it
    const option = await page.locator(`//mat-option//span[text()="${visibleText}"]`);
    await option.click();
  
    // Get the selected value from the dropdown
    const selectedValue = await dropdown.innerText();
    
    // Check if a value was selected
    if (selectedValue) {
      console.log('- -.Selected Value in Dropdown is:', selectedValue);
    } else {
     logError('is not Selected any value in the Dropdown')
     process.exit(1);
    }
  }
  async function checkAriaInvalid(page, field) {
    const input = page.locator(field.id);
  
    // Wait for the input field to be visible
    await input.waitFor({ state: 'visible', timeout: 5000 });
   
    const ariaInvalid = await input.getAttribute('aria-invalid');
  
    if (ariaInvalid === 'true' || ariaInvalid === null) {
      logSuccess(`✅ Field "${field.name}" is invalid (aria-invalid=${ariaInvalid})`);
    } else if (ariaInvalid === 'false') {
      logError(`❌ Field "${field.name}" is valid (aria-invalid=${ariaInvalid})`);
    } else {
      logError(`❌ Unexpected value for "aria-invalid" on field "${field.name}": ${ariaInvalid}`);
    }
  }

  function generateEmail(baseEmail) {
    // Use a static variable to store the generated value
    if (!generateEmail.generatedEmail) {
        // Get the current date and time
        const now = new Date();
        const year = now.getFullYear();         // YYYY
        const month = String(now.getMonth() + 1).padStart(2, '0'); // MM (0-based index, so add 1)
        const day = String(now.getDate()).padStart(2, '0');        // DD
        const hours = String(now.getHours()).padStart(2, '0');     // HH
        const minutes = String(now.getMinutes()).padStart(2, '0'); // MM
        const seconds = String(now.getSeconds()).padStart(2, '0'); // SS

        // Construct the email with the date and time
        generateEmail.generatedEmail = baseEmail.replace('+', `+${year}${month}${day}${hours}${minutes}${seconds}`);
    }
    return generateEmail.generatedEmail;
}

async function checkDinamiclyPopUP(page, action, selector) {
    try {
        logStep(`Checking popup: ${selector}`);

        // Instead of assuming it already exists, wait *if it appears* for up to 15 seconds
        const toastContainer = await page.waitForSelector(selector, { timeout: 12000, state: 'visible' });
         if (toastContainer) {
            const message = await toastContainer.textContent();
            if (message && message.trim()) {
            logSuccess(`Captured message: ${message.trim()}`);
            } else {
            logError('Toast container appeared but no message found.');
            }
        }        
    } catch (err) {
        logError(`❌ An error occurred in checkDinamiclyPopUP with selector ${selector}: ${err.message}`);
        throw err;
    }
}

async function logOutUser(page,action) {
    logStep(`Log Out User`);
    try {
      // Wait for the dropdown button
        const dropdownButton = await page.waitForSelector('#accountMenu', { timeout: 60000 });
  
        // Check if the button is visible
        if (await dropdownButton.isVisible()) {
            logSuccess("Dropdown My Account is visible, clicking it now...");
            await dropdownButton.click();
        } else {
            logError("The dropdown button exists but is not visible.");
            throw new Error("❌ The dropdown button exists but is not visible.");
        }
  
        // Wait for the "Salir" (Logout) span
        const logoutSpan = await page.waitForSelector(
          "//span[contains(text(), 'Salir') or contains(text(), 'Logout')]",
          { timeout: 20000, state: 'visible' }
        );
        
        const text = await logoutSpan.textContent();
        console.log('Found span text:', text.trim());
  
        // Confirm it is visible and enabled
        if (await logoutSpan.isVisible()) {
            console.log("The Logout span is visible. Clicking it now...");
            await logoutSpan.click();
            logSuccess("Logout clicked successfully.");

            await page.waitForSelector('#accountMenu', { state: 'detached', timeout: 20000 });
            //await page.waitForTimeout(3000);
            const url = `https://${action}-v3-dev.streann.tech/`;
            await page.waitForURL(url, { timeout: 20000 });

            const accountMenu = page.locator('#accountMenu');
            if (await accountMenu.count() === 0 || !(await accountMenu.first().isVisible())) {
                logSuccess('✅ Account menu is not visible after logout (user is logged out).');
            } else {
                await page.screenshot({ path: 'logout_debug.png' });
                logError('❌ Account menu is still visible after logout (user may not be logged out).');
                throw new Error('Account menu is still visible after logout.');
            }

            // Now check the URL
            const currentUrl = page.url();
            console.log('Current URL after logout:', currentUrl);
            if (currentUrl === url) {
                logSuccess(`✅ Successfully redirected to: ${currentUrl}`);
            } else {
                logError(`❌ Not redirected to expected URL. Current URL: ${currentUrl}`);
                throw new Error(`Not redirected to expected URL. Current URL: ${currentUrl}`);
            }
          } else {
            logError("The Logout span exists but is not visible.");
            throw new Error("❌ The Logout span exists but is not visible.");
        }
    } catch (err) {
      logError(`❌ An error occurred in logOutUser: ${err.message}`);
      throw new Error(`❌ An error occurred in logOutUser: ${err.message}`);
    }
  }


    
module.exports = { 
    checkElementExists, 
    GobackLink,
    titleDetailsScreen,
    backgroundImageDetailsScreen,
    buttonsDetailsScreen,
    checkPlayerScreen,
    redirectUrl,
    selectDropdownByVisibleText,
    checkAriaInvalid,
    generateEmail,
    checkDinamiclyPopUP,
    logOutUser
};

