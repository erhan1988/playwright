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

module.exports = { checkElementExists };

