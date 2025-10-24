const { test, expect } = require('@playwright/test');
const { logStep, logSuccess, logError } = require('../index'); 
const axios = require('axios');
const { checkElementExists } = require('./helper'); 

async function navigatetoURL(page, reseller, stepNumber) {
    await test.step(`${stepNumber}. Open the Site`, async () => { 
        logStep(`${stepNumber}. Opening the site...`); // Log the step
        try {
            let url;
            if (reseller.baseUrl) {
                url = reseller.baseUrl;
            } else {
                throw new Error('Invalid action provided. Use "okGol,Televicentro,Prtv,Gols" or "Amorir".');
            }
            console.log(`Navigating to URL: ${url}`); // Debug the URL
            // Navigate to the appropriate site
            await page.goto(url, { timeout: 60000, waitUntil: 'load' });

            // Wait for the page to fully load
            await page.waitForLoadState('load');
            logSuccess(`Navigated to ${url} and fully loaded the site`);

            const finalUrl = page.url();
            console.log(`📍 Final URL after navigation: ${finalUrl}`);
              // Special check for tdmax
            if (reseller.name === 'tdmax') {
                // Wait up to 10 seconds for the redirect to /page/landing
                await page.waitForURL('**/page/landing', { timeout: 10000 });

                const finalUrl = page.url();
                if (!finalUrl.includes('page/landing')) {
                    throw new Error(`Expected to be redirected to /page/landing for tdmax, but got: ${finalUrl}`);
                }
                logSuccess(`✅ tdmax correctly redirected to: ${finalUrl}`);
            } else {
                const finalUrl = page.url();
                logSuccess(`✅ Navigated to ${finalUrl} and site fully loaded`);
            }
        } catch (err) {
            logError(`Error in navigatetoURL: ${err.message}`);
            throw err; // Re-throw the error to fail the test
        }
    });
}

async function checkFaviconIcon(page, reseller, stepNumber) {
    await test.step(`${stepNumber}. Check if Favicon exists in the browser`, async () => {
        logStep(`${stepNumber}. Checking if Favicon exists in the browser`); // Log the step
        try {
            const domain = reseller.name; // Dynamically set based on your action
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

// Helper to safely escape strings for XPath
function xpathLiteral(str) {
  if (str.includes("'")) {
    // If string contains single quotes, use concat() in XPath
    const parts = str.split("'").map(s => `'${s}'`);
    return `concat(${parts.join(", \"'\", ")})`;
  } else {
    return `'${str}'`;
  }
}

async function checkHomeLinkHeader(page, reseller, stepNumber) {
  await test.step(`${stepNumber}. Find link Home in the Header and click`, async () => {
    logStep(`${stepNumber}. Executing step: Find link Home in the Header and click`);
    try {
        const label = reseller.homeLinkHeader?.[0];

        if (!label) {
          throw new Error("homeLinkHeader is empty or undefined for this reseller");
        }

        const xpath = `xpath=//a[contains(normalize-space(.), ${xpathLiteral(label)})]`;
        const homeOrInicioLink = page.locator(xpath).first();
        const menuButton = page.locator(".navbar-toggler");

        // Make sure the element exists in DOM first
        await homeOrInicioLink.waitFor({ state: "attached", timeout: 10000 });

        // If hidden, open the menu
        if (!(await homeOrInicioLink.isVisible())) {
          logStep("Home/Inicio link is hidden, opening menu...");
          if (await menuButton.isVisible()) {
            await menuButton.click();
            await page.waitForTimeout(500); // give animation a moment
          }
        }

        // Now wait for it to be visible
        await homeOrInicioLink.waitFor({ state: "visible", timeout: 10000 });

        const linkText = (await homeOrInicioLink.textContent())?.trim();
        logSuccess(`Found link text: "${linkText}"`);

        logStep("Clicking Home/Inicio link...");
        await Promise.all([
          page.waitForURL(/home|inicio|wipr|on-demand/i, { timeout: 10000 }),
          homeOrInicioLink.click()
        ]);

        logSuccess(`Current URL after clicking: ${page.url()}`);
    } catch (err) {
      logError(`Error in checkHomeLinkHeader: ${err.message}`);
      throw err;
    }
  });
}

async function checkHeaderElements(page, reseller, stepNumber) {
    await test.step(`${stepNumber}. Check in header in top bar are exist Logo, Buttons: Register, Login, Search Icon, and Home Link`, async () => { 
        logStep(`${stepNumber}. Checking if header elements exist in the top bar`); // Log the step
        try {
            let headerElements = [];
            if (reseller.name === 'tdmax'){
                headerElements = [
                    { locator:'a.navbar-brand img.img-fluid[alt="logo"]' , name: 'Logo' },
                    {locator: "button:has-text('Log in'), button:has-text('Log In'), button:has-text('Iniciar sesión'), button:has-text('Ingresar')",
                    name: 'Login Button'},   
                    { locator: '#search-button', name: 'Search Button' },
                    {locator: "button:has-text(' Regístrate gratis '), button:has-text('Register'), button:has-text('Subscribe Now')",
                    name: 'Register Button'},        
                ];
            }else{
                // Define an array of elements to check
                headerElements = [
                    { locator:'a.navbar-brand img.img-fluid[alt="logo"]' , name: 'Logo' },
                    { locator: "//*[contains(text(),'Log in') or contains(text(),'Log In') or contains(text(),'Iniciar sesión') or contains(text(),'Ingresar')]",  name: 'Login Button' },   
                    { locator: '#search-button', name: 'Search Button' },
                    { locator: "//a[contains(text(),'Home') or contains(text(),'Inicio') or contains(text(),'WIPR') or contains(text(),'On Demand')]", name: 'Home Link' }
                ];
                // Only add the Register Button if not okgol and televicentro
                // This is becuase okgol and Televicentro does not have Register Button in the header
                if (reseller.registerButtonHeader) {
                    headerElements.splice(2, 0, { 
                        locator: "//*[.//text()[contains(.,'Subscribe') or contains(.,'Subscribe Now') or contains(.,'Suscríbase Ahora') or contains(.,'¡Hazte Miembro!') or contains(.,'Register') or contains(.,'Become a Member')]]",
                        name: 'Register Button' 
                    });
                }
            }
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

            // Add this log to indicate the next step should be checking category title
           // logStep('Now checking category title on the home page...');
        } catch (error) {
            logError(`Error while checking header elements: ${error.message}`);
            throw error; // Fail the test if an error occurs
        }
    });
};


module.exports = { 
    checkHomeLinkHeader, 
    navigatetoURL, 
    checkFaviconIcon, 
    checkHeaderElements, 
    checkElementExists 
};

