const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); 
const axios = require('axios');
const { checkElementExists } = require('./helper'); 

async function navigatetoURL(page, action) {
    await test.step('1. Open the Site', async () => { 
        logStep('1.Opening the site...'); // Log the step
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
        logStep('2.Checking if Favicon exists in the browser'); // Log the step
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
        logStep('Executing step: 3. Find link Home in the Header and click');
        try {
            const homeOrInicioLink = page.locator("//a[contains(text(),'Home') or contains(text(),'Inicio')]");
            const menuButton = page.locator('.navbar-toggler'); 

            // Ensure the link is visible, otherwise check menu
            if (!(await homeOrInicioLink.isVisible())) {
                logError("Home/Inicio link is not visible. Checking menu...");
                if (await menuButton.isVisible()) {
                    await menuButton.click();
                    await page.waitForSelector("//a[contains(text(),'Home') or contains(text(),'Inicio')]", { state: "visible", timeout: 10000 });
                }
            }

            // Final check after opening menu
            await homeOrInicioLink.waitFor({ state: 'visible', timeout: 10000 });

            if (await homeOrInicioLink.isVisible()) {
                const linkText = await homeOrInicioLink.textContent();
                logSuccess(`Found link text: "${linkText.trim()}"`);

                let initialUrl = page.url();
                logStep('Clicking Home/Inicio link...');
                await Promise.all([
                    page.waitForNavigation({ timeout: 10000 }), // Wait for navigation to complete
                    homeOrInicioLink.click() // Trigger the navigation
                ]);

                let currentUrlLogin = page.url();
                logSuccess(`Current URL after clicking: ${currentUrlLogin}`);
            } else {
                logError("Home or Inicio link not found.");
            }
        } catch (err) {
            logError(`Error in checkHomeLinkHeader: ${err.message}`);
            throw err; // Re-throw the error to fail the test
        }
    });
}

async function checkHeaderElements(page, action) {
    await test.step('4. Check in header in top bar are exist Logo, Buttons: Register, Login, Search Icon, and Home Link', async () => { 
        logStep('4.Checking if header elements exist in the top bar'); // Log the step
        try {
            // Define an array of elements to check
            const headerElements = [
                { locator:'a.navbar-brand img.img-fluid[alt="logo"]' , name: 'Logo' },
                { locator: "//*[contains(text(),'Log In') or contains(text(),' Iniciar sesión ')]", name: 'Login Button' },
                { locator: "//*[contains(text(),'Subscribe Now') or contains(text(),' Suscríbase Ahora ')]", name: 'Register Button' },      
                { locator: '#search-button', name: 'Search Button' },
                { locator: "//a[contains(text(),'Home') or contains(text(),'Inicio')]", name: 'Home Link' }
            ];
            // Collect results for each element
            const results = [];
            for (const element of headerElements) {
                const result = await checkElementExists(page, element.locator, element.name);
                results.push(result); // Store the result
            }

            // Log the final results
            logStep('Header elements check completed. Results:');
            results.forEach(result => {
                if (result.status === 'visible') {
                    logSuccess(`✅ ${result.name} is visible.`);
                } else if (result.status === 'not visible') {
                    logError(`❌ ${result.name} is not visible.`);
                } else if (result.status === 'error') {
                    logError(`❌ Error checking ${result.name}: ${result.error}`);
                }
            });
            //return results; // Return the results to the caller
        } catch (error) {
            logError(`Error while checking header elements: ${error.message}`);
            throw error; // Fail the test if an error occurs
        }
    });
}



module.exports = { checkHomeLinkHeader, navigatetoURL , checkFaviconIcon, checkHeaderElements, checkElementExists };

