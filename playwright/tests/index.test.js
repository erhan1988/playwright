
const { test, expect } = require('@playwright/test');
const {checkHomeLinkHeader, navigatetoURL, checkFaviconIcon, checkHeaderElements } = require('./header');
const { checkCategoryTitleHomeScreen, checkVodsInHome, UserDetailsScreen, checkRelatedContentInDetailsScreen } = require('./homeContent');
const { checkPlayerScreen } = require('./helper');
const { checkFooterLinks } = require('./footer');
const { contactUsFirstScenario } = require('./contactUs');
const { registrationScreen } = require('./registration');
const { loginScreen, loginScreenNewPassword } = require('./login');
const { forgotScreen } = require('./forgotScreen');
const { loggedUserMyAccount } = require('./myAccountScreen');
const { logSuccess } = require('../index'); // logging helper
const { checkButtonsLandingPage } = require('./landing');

// get the action from env or CLI
const action = process.env.ACTION || process.argv[2];

// Load reseller config to drive test runs
const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, '..', 'config', 'resellers.json');
let resellerConfig = null;
try {
    resellerConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
    console.error(`Failed to load reseller config at ${configPath}: ${e.message}`);
}

// find the reseller config
function findReseller(key) {
    if (!resellerConfig || !key) return null;
    const k = key.toLowerCase();
    return (resellerConfig.resellers || []).find(r => (r.name && r.name.toLowerCase() === k) || (r.id && r.id.toLowerCase() === k));
}

const reseller = findReseller(action);
if (!reseller) {
    console.log('No valid action provided. Check your reseller name.');
    process.exit(1);
}

// reusable function to run all steps
async function runTestSteps(page, reseller ) {

    const timeout = reseller.settings?.timeout || 200000;
    test.setTimeout(timeout);

    let stepNumber = 1;

    // Step: Open URL
    if (reseller.testSuites.includes('navigatetoURL')) {
        await navigatetoURL(page, reseller, stepNumber++);
    }
    
    // Step: Landing page buttons
    if (reseller.testSuites.includes('checkButtonsLandingPage')) {
        await checkButtonsLandingPage(page, action, stepNumber++);
    }

    // Step: Favicon
    if (reseller.testSuites.includes('checkFaviconIcon')) {
        await checkFaviconIcon(page, reseller, stepNumber++);
    }

    // Step: Home link
    if (reseller.testSuites.includes('checkHomeLinkHeader')) {
        await checkHomeLinkHeader(page, reseller, stepNumber++);
    }

    // Step: Header
    if (reseller.testSuites.includes('checkHeaderElements')) {
        await checkHeaderElements(page, reseller, stepNumber++);
        await page.waitForTimeout(4000);
    }

    // Step: Home screen categories ( Need to print title of all category)
    if (reseller.testSuites.includes('checkCategoryTitleHomeScreen')) {
        await checkCategoryTitleHomeScreen(page, reseller, stepNumber++);
    }

    // Step: VODS ( Checking the Vods in Home Screen)
    if (reseller.testSuites.includes('checkVodsInHome')) {
        await checkVodsInHome(page, reseller, stepNumber++);
    }

    // Step: Details screen // not logged user checking Details screen contains Go back Title background Image Subscribe etc'
    if (reseller.testSuites.includes('UserDetailsScreen')) {
        await UserDetailsScreen(page, reseller, stepNumber++);
    }

    // Step: Player screen for PRTV (only if applicable)
    if (reseller.testSuites.includes('checkPlayerScreen')) {
        await checkPlayerScreen(page, reseller, stepNumber++, 'undefined');
    }

    // Step: Related content (skip if not available)
    if (!reseller.skipRelatedContent) {
        await checkRelatedContentInDetailsScreen(page, reseller, stepNumber++);
    } else {
        logSuccess(`Notes: ${reseller.name} does not have related content VODs added.`);
    }

    // Step: Footer
    if (reseller.testSuites.includes('checkFooterLinks')) {
        await checkFooterLinks(page, reseller, stepNumber++);
    }

    // Step: Contact Us check different scenarios
    if (reseller.testSuites.includes('contactUs')) {
        await contactUsFirstScenario(page, reseller, stepNumber++);
    }

    // Step: Registration screen check different scenarios
    if (reseller.testSuites.includes('registrationScreen')) {
        await registrationScreen(page, reseller, stepNumber++);
    }

    // Step: Login screen
    if (reseller.testSuites.includes('loginScreen')) {
        await loginScreen(page, reseller, stepNumber++);
    }

    // Step: Forgot Screen
    if (reseller.testSuites.includes('forgotScreen')) {
        await forgotScreen(page, reseller, stepNumber++);
        // Wait for page to be fully stable after forgotScreen navigation
        await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            console.log('⚠️ Load state timeout after forgotScreen, continuing...');
        });
        await page.waitForTimeout(2000);
    }

    // Step: Logged user My Account
    if (reseller.testSuites.includes('loggedUserMyAccount')) {
        await loggedUserMyAccount(page, reseller, stepNumber++);
        await page.waitForTimeout(2000);
    }

    // Step: Login Screen New Password logged
    if (reseller.testSuites.includes('loginScreenNewPassword')) {
        await loginScreenNewPassword(page, reseller, stepNumber++);
    }

}

// describe block dynamically
test.describe(`Website Tests for ${reseller.name}`, () => {
    test('Website Tests', async ({ page }) => {
        await runTestSteps(page, reseller);
    });
});
