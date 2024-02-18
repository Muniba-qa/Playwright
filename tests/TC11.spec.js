const { test, expect } = require('@playwright/test');
const LoginPage = require('../POM/Login.js'); // Import the LoginPage class
const ScanVerify = require('../POM/Scan-Verify.js'); // Import the Scan-Verify class
const testData = require('../testData.json');

let loginPage;
let scanVerify;

const order = 'GP-Manual-Order-80'

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page,request }) => {
  const token = 'Bearer 4f17d6044acb0cc9adbfb4c53cb95e5bbc4df2ac920548b7af0d7b3ff184df83';
  const url = `https://gpxpw1.groovepackerapi.com/orders/update_order_list.json`;

  const response = request.post(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: token,
    },
    data: {
      id: 82,
      var: 'status',
      value: 'awaiting',
    },
  });
  const body = await response;
  console.log("Check Body=>", body)
  expect(body.status()).toBe(200);

  scanVerify = new ScanVerify(page);
  loginPage = new LoginPage(page);
  await loginPage.visit();
  await loginPage.successfulLogin('gpxpw1', testData.validUsername, testData.validPassword);
});

test('Verify Pass Button', async () => {
  await scanVerify.scanInput(order);
  await scanVerify.verifyPassButton();
});

test('Verify Bar Code Pass Button', async () => {
  await scanVerify.scanInput(order);
  await scanVerify.verifyBarCodePassButton();
});
