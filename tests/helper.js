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
    console.log('Checking for the title on the Details screen...');
    try {
        // Wait for the title element to appear
        const titleLocator = page.locator('h1.title-title.fs-3');
        await titleLocator.waitFor({ state: 'visible', timeout: 10000 });

        // Find all matching elements
        const titleElements = await titleLocator.all();

        if (titleElements.length === 0) {
            const msg = "No Title found on the Details page.";
            console.error(msg);
            throw new Error(msg); // Fail the test
        }

        // Loop through each title element and log its text
        for (let i = 0; i < titleElements.length; i++) {
            const text = await titleElements[i].textContent();
            logSuccess(`2. Title in the Details screen exists: ${i + 1}: ${text.trim()}`);
        }

        console.log('✅ Title found on the Details page.');
    } catch (err) {
        console.error(`❌ An error occurred in titleDetailsScreen: ${err.message}`);
        throw err; // Re-throw the error to fail the test
    }
}

async function backgroundImageDetailsScreen(page) {
    console.log('Checking for background images in the Details screen...');
    try {
        // Wait for the background image elements to appear
        const imageLocator = page.locator('div.details-image.details-image-desktop');
        await imageLocator.waitFor({ state: 'visible', timeout: 5000 });

        // Get the count of matching elements
        const imageCount = await imageLocator.count();
        console.log(`- Found ${imageCount} background image(s).`);

        if (imageCount > 0) {
            // Loop through each image element and log its background-image property
            for (let i = 0; i < imageCount; i++) {
                const backgroundImage = await imageLocator.nth(i).evaluate(el => getComputedStyle(el).backgroundImage);
                logSuccess(`3. Background Image in details screen is ${i + 1}: ${backgroundImage}`);
            }
        } else {
            const msg = 'No background images found in the Details screen.';
            console.error(msg);
            throw new Error(msg); // Fail the test
        }
    } catch (err) {
        console.error(`❌ An error occurred in backgroundImageDetailsScreen: ${err.message}`);
        throw new Error(`❌ An error occurred in backgroundImageDetailsScreen: ${err.message}`);
    }
}

async function buttonsDetailsScreen(page,action) {
    console.log('Checking for buttons in Details screen');
    try {

        await page.evaluate(() => window.scrollBy(0, 200)); // Scroll down by 300 pixels
        await page.waitForTimeout(2000); // Wait for 2 seconds
        const buttons = page.locator("//button[.//span[@class='mat-mdc-button-touch-target']]");
        await page.waitForTimeout(2000); // Wait for 2 seconds
        // Get the count of matching buttons

        let watchNowFound = false; // Flag to track if "Watch Now" is found
        const buttonCount = await buttons.count();

        for (let i = 0; i < buttonCount; i++) {
            const buttonText = await buttons.nth(i).textContent();
            const trimmedText = buttonText.trim();
           console.log('er',trimmedText);
            if (action === 'emmanuel' && trimmedText.toLowerCase() === 'watch now') {
              logSuccess(`✅ Found "Watch Now" button at index ${i + 1}`);
              watchNowFound = true; // Set the flag to true
            }
        }
        // After the loop, check if "Watch Now" was found
        if (!watchNowFound && action === 'emmanuel') {
            const msg = '❌ "Watch Now" button not found for action: emmanuel';
            console.error(msg);
            logError(msg);
            throw new Error(msg); // Fail the test
        }
    } catch (err) {
        console.error(`❌ An error occurred in buttonsDetailsScreen: ${err.message}`);
        throw new Error(`❌ An error occurred in buttonsDetailsScreen: ${err.message}`);
    }
}

module.exports = { checkElementExists, GobackLink,titleDetailsScreen,backgroundImageDetailsScreen,buttonsDetailsScreen};

