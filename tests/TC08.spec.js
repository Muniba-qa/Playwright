const { test, expect } = require('@playwright/test');
const LoginPage = require('../POM/Login.js'); // Import the LoginPage class
const ScanVerify = require('../POM/Scan-Verify.js'); // Import the Scan-Verify class
const testData = require('../testData.json');

let loginPage;
let scanVerify;

const order = 'GP-Manual-Order-83'

test.beforeEach(async ({ request }) => {
  const token = 'Bearer 4f17d6044acb0cc9adbfb4c53cb95e5bbc4df2ac920548b7af0d7b3ff184df83';
  const url = `https://gpxpw1.groovepackerapi.com/orders/update_order_list.json`;

  const response = await request.post(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: token,
    },
    data: {
      id: 85,
      var: 'status',
      value: 'awaiting',
    },
  });
  const body2 = await response;
  expect(body2.status()).toBe(200);
});

test('Multi Bar Code', async ({page}) => {
  const scanVerify = new ScanVerify(page);
  const loginPage = new LoginPage(page);
  await loginPage.visit();
  await loginPage.successfulLogin('gpxpw1', testData.validUsername, testData.validPassword);

  await scanVerify.scanInput(order);
  await scanVerify.verifyMultiPackOrderBarCode();
  console.log('TC 08 Successfully Passed');
});
