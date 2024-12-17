
const { setWorldConstructor, World, Before, After, setDefaultTimeout} = require("@cucumber/cucumber");
const { chromium } = require('playwright')
const {_android} = require("playwright");
const cp = require('child_process');
require('dotenv').config({ path: '.env' });
const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];
setDefaultTimeout(120 * 1000)


module.exports = { default: '--publish-quiet' }
module.exports = {
  default: {
    require: ['features/steps/*.js'], // Path to your step definitions
    format: ['json:./cucumber-report.json'], // JSON report output
    paths: ['features/*.feature'], // Path to your feature files
    parallel: 0, // Set to 1 or more for parallel execution
    publishQuiet: true, // Avoid publishing logs
  },
};


const MOBILE = process.env.MOBILE ? process.env.MOBILE === 'true' : false;
const LT_USERNAME = process.env.LT_USERNAME || 'username';
const LT_ACCESS_KEY = process.env.LT_ACCESS_KEY || 'accesskey';

// console.log("Mobile is " + MOBILE)
// console.log("USERNAME is " + LT_USERNAME)
// console.log("KEY is " + LT_ACCESS_KEY)

class CustomWorld extends World{
  async setTestStatus(status, remark) {
    reporter: [['html', { open: 'never' }]],
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status, remark } })}`)
  }
}

Before(async (scenario) => {
  if (MOBILE == true){
    const capabilities = {
      'LT:Options': {
        'platformVersion': '14',
        'deviceName': 'Pixel.*',
        'platformName': 'Android',
        'isRealMobile': true,
        'build': 'Playwright Cucumber-JS Build',
        'name': scenario.pickle.name,
        'user': LT_USERNAME,
        'accessKey': LT_ACCESS_KEY,
        'network': true,
        'video': true,
        'console': true,
        'tunnel': false, // Add tunnel configuration if testing locally hosted webpage
        'tunnelName': '', // Optional
        'geoLocation': '', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
        'playwrightClientVersion': playwrightClientVersion
      }
    }
  
    // Create page and browser globals to be used in the scenarios
    device = await _android.connect(`wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`);
    await device.shell("am force-stop com.android.chrome");

    const context = await device.launchBrowser();
    global.page = await context.newPage();

  }else{
  const capabilities = {
    'browserName': 'Chrome', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 10',
      'build': 'Playwright Cucumber-JS Build',
      'name': scenario.pickle.name,
      'user': 'varunkumarb',
      'accessKey': 'GhGShOYHz1jODWE9qDvkJK4nPDR3n2lc0gNp9VknalhwtUineG',
      'network': true,
      'video': true,
      'console': true,
      'tunnel': false, // Add tunnel configuration if testing locally hosted webpage
      'tunnelName': '', // Optional
      'geoLocation': '', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
      'playwrightClientVersion': playwrightClientVersion
    }
  }

  // Create page and browser globals to be used in the scenarios
  global.browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  })

  const context = await global.browser.newContext();
  global.page = await context.newPage();
}
})

After(async () => {
  await global.browser.close()
})

setWorldConstructor(CustomWorld);
