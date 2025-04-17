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
                try {
                    await page.waitForFunction(
                        (url) => window.location.href !== url,
                        initialUrl,
                        { timeout: 10000 }
                    );
                    const newUrl = page.url();
                logSuccess(`New URL: ${newUrl}`);
                } catch (err) {
                    console.error(`Error waiting for URL to change: ${err.message}`);
                }
                break; // Exit the loop after checking the URL change
            }
             // Check for "Suscribirse" and "Compartir" when action is "amorir"
            if (action === 'amorir') {
                if (trimmedText.toLowerCase() === 'suscribirse') {
                    logSuccess(`✅ Found "Suscribirse" button at Details screen`);
                    suscribirseFound = true;
                }
                if (trimmedText.toLowerCase() === 'compartir') {
                    logSuccess(`✅ Found "Compartir" button at Details screen`);
                    compartirFound = true;
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
module.exports = { 
    checkElementExists, 
    GobackLink,
    titleDetailsScreen,
    backgroundImageDetailsScreen,
    buttonsDetailsScreen
};

