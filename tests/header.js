const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers
const axios = require('axios');

async function navigatetoURL(page, action) {
    await test.step('1. Open the Site', async () => { 
        try {
            let url;
            if (action) {
                url = `https://${action}-v3-dev.streann.tech/`;
            } else {
                throw new Error('Invalid action provided. Use "emmanuel" or "amorir".');
            }

            console.log(`Navigating to URL: ${url}`); // Debug the URL

            // Navigate to the appropriate site
            await page.goto(url, { timeout: 60000, waitUntil: 'load' });

            // Wait for the page to fully load
            await page.waitForLoadState('load');
            logSuccess(`Navigated to ${url} and fully loaded the site`);
        } catch (err) {
            logError(`Error in navigatetoURL: ${err.message}`);
            throw err; // Re-throw the error to fail the test
        }
    });
}

async function checkFaviconIcon(page, action) {
    await test.step('2. Check if Favicon exists in the browser', async () => { 
        logStep('Checking if Favicon exists in the browser'); // Log the step
        try {
            const domain = action; // Dynamically set based on your action
            const faviconUrl = getFaviconUrl(domain);

            // Use Axios to check if the URL exists
            const response = await axios.head(faviconUrl); // Sending a HEAD request to avoid downloading the file

            // Validate the response status and Content-Type
            expect(response.status).toBe(200); // Assert that the response status is 200
            expect(response.headers['content-type']).toContain('image'); // Assert that the Content-Type is an image
            logSuccess(`Favicon exists in the browser tab. URL is: ${faviconUrl}`);
        } catch (error) {
            // Log the error and fail the test
            logError(`Favicon does not exist or is not a valid image file. Error: ${error.response?.status || error.message}`);
            expect(error).toBeNull(); // Force the test to fail and include the error in the report
        }
    });
}

function getFaviconUrl(domain) {
    return `https://${domain}-v3-dev.streann.tech/assets/images/favicon.ico`;
}

async function checkHomeLinkHeader(page) {
    await test.step('3. Find link Home in the Header and click', async () => { 
        logStep('Executing step: 3. Find link Home in the Header and click'); // Use logStep for yellow-colored text
        try {
            const homeOrInicioLink = page.locator("//a[contains(text(),'Home') or contains(text(),'Inicio')]");
            const menuButton = page.locator('.navbar-toggler'); 
    
            // Ensure the link is visible, otherwise check menu
            if (!(await homeOrInicioLink.isVisible())) {
                logError("Home/Inicio link is not visible. Checking menu...");
                if (await menuButton.isVisible()) {
                    await menuButton.click();
    
                    // Wait dynamically for menu animation (instead of hardcoded timeout)
                    await page.waitForSelector("//a[contains(text(),'Home') or contains(text(),'Inicio')]", { state: "visible", timeout: 5000 });
                }
            }
            // Final check after opening menu
            await homeOrInicioLink.waitFor({ state: 'visible', timeout: 20000 });
    
            if (await homeOrInicioLink.isVisible()) {
                const linkText = await homeOrInicioLink.textContent();
                logSuccess(`Found link text: "${linkText.trim()}"`); // Use logSuccess for green-colored text
    
                let initialUrl = page.url();
                logStep('Clicking Home/Inicio link...');
                await homeOrInicioLink.click();
    
                // Wait for navigation
                await page.waitForFunction(({ initUrl }) => window.location.href !== initUrl, { initUrl: initialUrl }, { timeout: 5000 });
                let currentUrlLogin = page.url();
                logSuccess(`Current URL after clicking: ${currentUrlLogin}`);
            } else {
                logError("Home or Inicio link not found.");
            }
        } catch (err) {
            logError(`Error in checkHomeLinkHeader: ${err.message}`);
        }
    });
}

module.exports = { checkHomeLinkHeader, navigatetoURL , checkFaviconIcon};

