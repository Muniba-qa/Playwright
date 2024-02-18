const { test, expect } = require('@playwright/test');
const LoginPage = require('../POM/Login.js'); // Import the LoginPage class
const ScanVerify = require('../POM/Scan-Verify.js'); // Import the Scan-Verify class
const testData = require('../testData.json');

const validAccountName = 'abubakar';
const validUsername = 'iosios';
const validPassword = 'iosios';

const order = 'CSV-100187';

test('Verify stability of the Create Shipping Page', async ({ page }) => {
  const scanVerify = new ScanVerify(page);
  const loginPage = new LoginPage(page);
  await loginPage.visit();
  await loginPage.successfulLogin(validAccountName, validUsername, validPassword);
  
  await page.locator('[data-testid="menuIcon"]').click();
  await page.getByTestId('redirectToOrderSearch').getByText('Search').click();
  await scanVerify.verifyStabilityOfShippingLabel(order);
  console.log('TC 13 Successfully Passed');
});
