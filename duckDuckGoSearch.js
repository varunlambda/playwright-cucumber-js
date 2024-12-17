const {Given, When, Then} = require("@cucumber/cucumber");
const assert = require("assert");

Given("Open Google Website", {timeout: 60 * 1000}, async function() {
  await page.goto("https://www.google.com");
});

When("Search for LambdaTest", async function() {
  let element = await page.locator("//*[@id='APjFqb']");
  await element.click();
  await element.type("LambdaTest");
  await element.press("Enter");
});

Then("Title should match", async function() {
  const title = await page.title()

  try {
    assert.equal(title,
        "LambdaTest - Google Search");

    await this.setTestStatus("passed", "Title matched");
  } catch (e) {
    await this.setTestStatus("failed", e);
    throw(e);
  }
});
