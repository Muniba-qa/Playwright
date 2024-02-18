const { test, expect } = require('@playwright/test');
const LoginPage = require('../POM/Login.js'); // Import the LoginPage class
const ScanVerify = require('../POM/Scan-Verify.js'); // Import the Scan-Verify class
const testData = require('../testData.json');

const order = 'CSV-100187';

test.beforeEach(async ({request }) => {
  const token = 'Bearer f9bd88e73d963df55d8392c488c4cabe8c96978680ee9b2dc661b2a194f4b622';
  const url = `https://abubakar.groovepackerapi.com/orders/update_order_list.json`;

  const response = await request.post(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: token,
    },
    data: {
      id: 996,
      var: 'status',
      value: 'awaiting',
    },
  });
  const body2 = await response;
  expect(body2.status()).toBe(200);
});

test('Verify Shipping Label Creation Tab', async ({page}) => {
  const scanVerify = new ScanVerify(page);
  const loginPage = new LoginPage(page);
  await loginPage.visit();
  await loginPage.successfulLogin('abubakar', testData.validUsername, testData.validPassword);
  await scanVerify.scanInput(order);
  await scanVerify.verifyShippingLabelCreationTab();
  console.log('TC 19 Successfully Passed');
});
