const { test, expect } = require('@playwright/test');
const LoginPage = require('../POM/Login.js'); // Import the LoginPage class
const ScanVerify = require('../POM/Scan-Verify.js'); // Import the Scan-Verify class
const testData = require('../testData.json');

let loginPage;
let scanVerify;

const order = 'TR-92882';

// test.beforeEach(async ({ request }) => {
//   const token = 'Bearer f9bd88e73d963df55d8392c488c4cabe8c96978680ee9b2dc661b2a194f4b622';
//   const url = `https://abubakar.groovepackerapi.com/orders/update_order_list.json`;

//   const response = await request.post(url, {
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//       Authorization: token
//     },
//     data: {
//       id: 1128,
//       var: 'status',
//       value: 'awaiting',
//     },
//   });
//   const body2 = await response;
//   expect(body2.status()).toBe(200);
// });

test('Verify Shipping Label Print working or not', async ({page,context}) => {
  scanVerify = new ScanVerify(page);
  loginPage = new LoginPage(page);
  await loginPage.visit();
  await loginPage.successfulLogin('abubakar', testData.validUsername, testData.validPassword);

  await scanVerify.scanInput(order);
  await scanVerify.verifyShippingLabelPrintWorking(context);
  console.log('TC 22 Successfully Passed');
});
