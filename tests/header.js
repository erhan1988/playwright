const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); // Import logging helpers

async function navigatetoURL(page, action) {
    await test.step('1. Open the Site', async () => { 
        await logStep('Executing step: 1. Open the Site'); // Await logStep for yellow-colored text
        try {
            let url;
            if (action === 'emmanuel') {
                url = 'https://emmanuel-v3-dev.streann.tech/';
            } else if (action === 'amorir') {
                url = 'https://amorir-v3-dev.streann.tech/';
            } else {
                throw new Error('Invalid action provided. Use "emmanuel" or "amorir".');
            }

            // Navigate to the appropriate site
            await page.goto(url, { timeout: 60000, waitUntil: 'load' });
            await logSuccess(`Navigated to ${url}`); // Await logSuccess for green-colored text
        } catch (err) {
            await logError(`Error in navigatetoURL: ${err.message}`); // Await logError for red-colored text
        }
    });
}

async function checkHomeLinkHeader(page) {
    await test.step('2. Find link Home in the Header and click', async () => { 
        logStep('Executing step: 2. Find link Home in the Header and click'); // Use logStep for yellow-colored text
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

module.exports = { checkHomeLinkHeader, navigatetoURL };

