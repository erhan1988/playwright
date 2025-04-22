const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers

async function checkElementExists(page, locator, name) {
    try {
        const elements = page.locator(locator);
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

async function titleDetailsScreen(page) {
    logStep('Checking for the title on the Details screen...');
    try {
        const titleLocator = page.locator('h1.title-title.fs-3');
        await titleLocator.waitFor({ state: 'visible', timeout: 10000 });

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

async function backgroundImageDetailsScreen(page) {
    logStep('Checking for background images in the Details screen...');
    try {
        const imageLocator = page.locator('div.details-image.details-image-desktop');
        await imageLocator.waitFor({ state: 'visible', timeout: 5000 });

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

async function buttonsDetailsScreen(page, action) {
    logStep('Checking for buttons in Details screen...');
    try {
        await page.evaluate(() => window.scrollBy(0, 200));
        await page.waitForTimeout(2000);

        const buttons = page.locator("//button[.//span[@class='mat-mdc-button-touch-target']]");
        const buttonCount = await buttons.count();
        //logSuccess(`✅ Found ${buttonCount} buttons in the Details screen.`);

        let watchNowFound = false;
        let suscribirseFound = false; // Declare the variable
        let compartirFound = false;  // Declare the variable
        for (let i = 0; i < buttonCount; i++) {
            const buttonText = await buttons.nth(i).textContent();
            const trimmedText = buttonText.trim();
            //logStep(`Button ${i + 1} text: '${trimmedText}'`);
            if (action === 'emmanuel' && trimmedText.toLowerCase() === 'watch now') {
                logSuccess(`✅ Found "Watch Now" button at Details screen`);
                watchNowFound = true;

                const initialUrl = page.url(); // Get the current URL before the action
                console.log(`Initial URL: ${initialUrl}`); // Log the initial URL

                // Click the "Watch Now" button
                logStep(`Clicking on "Watch Now" button at Details screen...`);
                await buttons.nth(i).click();

                // Wait for the URL to change
                await redirectUrl(page,'/player');
                break; // Exit the loop after checking the URL change
            }
             // Check for "Suscribirse" and "Compartir" when action is "amorir"
            if (action === 'amorir') {
                let buttons1 = page.locator("//button[.//span[contains(text(), 'Compartir')]]"); // 🟢 Declare early!
            
                if (trimmedText.toLowerCase() === 'suscribirse') {
                    logSuccess(`✅ Found "Suscribirse" button at Details screen`);
                    suscribirseFound = true;
            
                    // Click the "Suscribirse" button
                    logStep(`Clicking on "Suscribirse" button at Details screen...`);
                    await buttons.nth(i).click();
                    await page.waitForTimeout(4000);
            
                    // Wait for the URL to change
                    await redirectUrl(page, '/login');
            
                    // Go back to the details screen
                    logStep('Navigating back to the Details screen...');
                    await page.goBack();
                    const backUrl = page.url();
                    logSuccess(`✅ Returned to Details screen. Current URL: ${backUrl}`);
                    await page.waitForTimeout(2000);
            
                    // After returning to the details screen, click the "Compartir" button
                    logStep('Looking for the "Compartir" button...');
                    const compartirButton = buttons1.first();
                    try {
                        await compartirButton.waitFor({ state: 'visible', timeout: 5000 });
                        logSuccess(`✅ Found "Compartir" button at Details screen`);
                    } catch (error) {
                        logError(`❌ "Compartir" button not found or not visible after returning to the Details screen.`);
                        throw new Error(`"Compartir" button not found or not visible.`);
                    }
                    logStep(`Clicking on "Compartir" button at Details screen...`);
                    await compartirButton.click();
                    await page.waitForTimeout(2000);
                    await checkSharePopup(page,'cdk-overlay-0');
                    logSuccess(`✅ "Compartir" button clicked successfully.`);
                    break; // Exit the loop after handling "Suscribirse" and "Compartir"
                }
            }
        }
        if (!watchNowFound && action === 'emmanuel') {
            const msg = '❌ "Watch Now" button not found for action: emmanuel';
            logError(msg);
            throw new Error(msg);
        }
        if (action === 'amorir') {
            if (!suscribirseFound) {
                const msg = '❌ "Suscribirse" button not found for action: amorir';
                logError(msg);
                throw new Error(msg);
            }
        }
    } catch (err) {
        logError(`❌ An error occurred in buttonsDetailsScreen: ${err.message}`);
        throw new Error(err.message);
    }
}

async function redirectUrl(page, expectedPartOfUrl) {
    try {
        const currentUrl = page.url(); // Get the current URL
        console.log(`🌐 Current URL: ${currentUrl}`); // Log the current URL

        if (currentUrl.includes(expectedPartOfUrl)) {
            logSuccess(`✅ URL contains the expected path: ${expectedPartOfUrl}`);
        } else {
            const message = `❌ URL does not contain the expected path "${expectedPartOfUrl}". Current URL: "${currentUrl}"`;
            logError(message);
            throw new Error(message);
        }
    } catch (err) {
        logError(`❌ redirectUrl error: ${err.message}`);
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
            await page.waitForTimeout(4000);
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

            //6 .Check Share Icon in the Player screen
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
                const buttonText = (await button.innerText()).trim().toLowerCase();

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
            await closeIcon.waitFor({ timeout: 5000 });
            await closeIcon.click();
            console.log('- Clicked to close the popup');
            await page.waitForTimeout(2000);

            // Verify the popup is closed
            const popupGone = await page.locator(popupSelector).isVisible().catch(() => false);

            if (!popupGone) {
                logSuccess("Popup is closed");
                await page.waitForTimeout(2000);
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



module.exports = { 
    checkElementExists, 
    GobackLink,
    titleDetailsScreen,
    backgroundImageDetailsScreen,
    buttonsDetailsScreen,
    checkPlayerScreen,
    redirectUrl
};

