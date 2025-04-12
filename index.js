// Helper function for logging steps in yellow
async function logStep(message) {
    const chalk = (await import('chalk')).default; // Dynamically import chalk
    console.log(chalk.yellow(message));
}

// Helper function for logging success messages in green
async function logSuccess(message) {
    const chalk = (await import('chalk')).default; // Dynamically import chalk
    console.log(chalk.green(`✅ ${message}`));
}

// Helper function for logging error messages in red
async function logError(message) {
    const chalk = (await import('chalk')).default; // Dynamically import chalk
    console.log(chalk.red(`🚨 ${message}`));
}

module.exports = { logStep, logSuccess, logError };
