const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const reportPath = './cucumber-report.json';

if (!fs.existsSync(reportPath)) {
    console.error(`Report not found at ${reportPath}`);
    process.exit(1);
}

const options = {
    theme: 'bootstrap',
    jsonFile: './cucumber-report.json',
    output: './cucumber-report.html',
    reportSuiteAsScenarios: true,
    launchReport: true,
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "STAGING",
        "Browser": "Chrome 114.0.5735.199",
        "Platform": "Windows 10",
        "Parallel": "Scenarios",
        "Executed": "Remote"
    }
};

reporter.generate(options);