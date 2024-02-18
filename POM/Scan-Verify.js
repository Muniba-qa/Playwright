import { browser, context, expect, test } from "@playwright/test";
const testData = require("../testData.json");

class ScanVerify {
  constructor(page, testInfo) {
    this.page = page;
    this.testInfo = testInfo;

    this.getHeaderScanVerify = page.locator("text=Scan & Verify");
    this.scanInputField = page.locator('[data-component-name="searchOrder"]');
    this.alreadyMessage = page.locator(
      "//div[contains(text(),'The order has already been scanned')]"
    );
    this.searchField = page.locator('[autocapitalize="sentences"]');
  }

  async restartOrder() {
    await this.page.locator('[data-testid="restartOrder"]').click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.getByText("Ok").click();
    1;
  }

  async scanItemAndVerify() {
    const passbutton = this.page.getByTestId("passButton").filter({has: this.page.getByText("Pass") });
    await expect(passbutton).toBeVisible()
    await passbutton.click();
   
    await expect
      .soft(this.page.getByTestId('boxItemList'))
      .toBeVisible();
  }

  async removeOrderAndVerify() {
    const removeBox = await this.page.getByTestId("removeBox").locator("i");
    // await expect(removeBox).toBeVisible()
    await removeBox.click({force: true});
    await this.page.waitForLoadState("networkidle");

    await expect(
      this.page.getByTestId('boxItemList')
    ).not.toBeVisible();
  }

  async alreadyMessageVisible() {
    await expect(this.alreadyMessage).toBeVisible();
  }
  async headerScanVerify() {
    await expect(this.getHeaderScanVerify).toBeVisible();
  }

  async menuSearch() {
    await this.page.locator('[data-testid="menuIcon"]').nth("0").click();
    await this.page
      .getByTestId("redirectToOrderSearch")
      .getByText("Search")
      .click();
  }
  async scanInput(text) {
    await this.scanInputField.fill(text, { delay: 500 });
    await this.clickSearch();
  }
  async scanInputVisible() {
    await expect(this.scanInputField).toBeVisible();
  }
  async getSearchField(text) {
    await this.searchField.fill(text, { delay: 500 });
    await this.page.keyboard.press("Enter");
  }

  async quickScanBtnClick() {
    const loginButton = await this.page.locator(
      ' div[data-testid="quickSearch"]'
    );
    await loginButton.click();
  }

  async clickSearch() {
    const orderSearchBtn = await this.page.locator(
      '[data-testid="rfoSearchBtn"]'
    );
    await orderSearchBtn.click();

    await this.page.waitForTimeout(3000);

    ("search btn pressed");
  }

  async continueSession() {
    const acceptBtn = 'div[data-testid="logoutEveryone"] ';

    const acceptBtnMain = 'div[data-testid="logoutEveryone"]';

    const isTooltipVisible1 = await this.page.isVisible(acceptBtnMain);

    if (isTooltipVisible1) {
      const AccountNameTooltip = await this.page.locator(acceptBtn);
      await AccountNameTooltip.click();
      ("Session was continued");
    } else {
    }
  }

  async verifyRegularOrder() {
    const ele = await this.page
      .locator('[data-testid="copyUPC"]')
      .last()
      .innerText();
    const skuCode = ele.split(":");

    const products = await this.page
      .locator('[data-component-name="nextItemImageCount"]')
      .innerText();
    products;
    const digits = products.match(/\d+/g);
    const noOfProducts = digits.slice(0, 2);

    for (let i = 0; i < noOfProducts[1]; i++) {
      let body;
      await this.page
        .getByPlaceholder("Ready For Product Scan")
        .fill(skuCode[1]);
      const [resp] = await Promise.all([
        this.page.waitForResponse(
          (resp) => resp.url().includes("/scan_pack") && resp.status() === 200
        ),
        await this.page.getByTestId("passButton").getByText("Pass").click(),
      ]);
      body = await resp.json();
      await expect(body.status).toEqual("OK");
    }
    ("Successfully Passed");
  }
  async verifyMultiPackOrderBarCode() {
    let body;

    await this.page
      .getByPlaceholder("Ready For Product Scan")
      .fill(testData.multiPackOrderBarCode);
    const [resp] = await Promise.all([
      this.page.waitForResponse((resp) => resp.status() === 200),
      await this.page.getByTestId("passButton").getByText("Pass").click(),
    ]);
    body = await resp.json();
    await expect(body.status).toEqual("OK");
  }

  async verifyKitSingleBarCode() {
    let count = 0;
    for (let i = 0; i < 3; i++) {
      const products = await this.page
        .locator('[data-component-name="productUnscannedKitCount"]')
        .nth(`${i}`)
        .innerText();
      const digits = products.match(/\d+/g);
      const noOfProducts = digits.slice(0, 2);
      count += parseInt(noOfProducts[1]);
    }

    for (let i = 0; i < count; i++) {
      let body;
      // await this.page.getByPlaceholder('Ready For Product Scan').fill(skuCode[1])
      const [resp] = await Promise.all([
        this.page.waitForResponse(
          (resp) => resp.url().includes("/orders/") && resp.status() === 200
        ),
        await this.page.getByTestId("passButton").getByText("Pass").click(),
      ]);
      body = await resp.json();
      await expect(body.status).toEqual(true);
    }
  }

  async verifyKitMultiBarCode() {
    let body;
    const skuCode = [
      testData.combMultiPackOrderBarCode,
      testData.pamoliveMultiPackOrderBarCode,
      testData.carPolishMultiPackOrderBarCode,
    ];

    for (let i = 0; i < 3; i++) {
      await this.page
        .getByPlaceholder("Ready For Product Scan")
        .fill(skuCode[i]);
      const [resp] = await Promise.all([
        this.page.waitForResponse(
          (resp) => resp.url().includes("scan_pack_v2") && resp.status() === 200
        ),
        await this.page.getByTestId("passButton").getByText("Pass").click(),
      ]);
      body = await resp.json();
      await expect(body.status).toEqual("OK");
    }
  }

  async verifyPassButton() {
    const button = await this.page
      .getByTestId("passButton")
      .filter({ has: this.page.getByText("Pass") });
    await expect(button).toBeVisible();
    const [resp] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes("/scan_pack") && resp.status() === 200
      ),
      await button.click(),
    ]);
    const body = await resp.json();
    expect(body?.status).toEqual("OK");
  }

  async verifyBarCodePassButton() {
    await this.page
      .getByPlaceholder("Ready For Product Scan")
      .fill(testData.singlePerfumeBarCode);
    const [resp] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes("/scan_pack") && resp.status() === 200
      ),
      await this.page.keyboard.press("Enter"),
    ]);
    const body = await resp.json();
    expect(body?.status).toEqual("OK");
  }

  // Test Case 12
  async verifyTypeInCount() {
    let body;
    const products = await this.page
      .locator('[data-component-name="nextItemImageCount"]')
      .innerText();
    const digits = products.match(/\d+/g);
    let quantity = digits.slice(0, 2);
    await this.page.getByTestId("passButton").getByText("Pass").click();
    await this.page.getByPlaceholder("Ready For Product Scan").fill("*");
    await this.page.keyboard.press("Enter");
    await this.page
      .locator('[data-testid="inputElement"]')
      .fill(`${quantity[1]}`);
    const [resp] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes("/scan_pack") && resp.status() === 200
      ),
      await this.page.keyboard.press("Enter"),
    ]);
    body = await resp.json();
    await expect(body.status).toEqual("OK");
  }

  async verifyStabilityOfShippingLabel(orderNO) {
    await this.getSearchField(orderNO);
    //await this.page.locator('[data-component-name="orderNumberSearchList"]').first().click();
    await this.page
      .locator('[data-component-name="shippingLabelActiveBtn"]')
      .click();
    await this.page.waitForTimeout(3000);

    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 10000));
    const eventEmittedPromise = await this.page.evaluate(() =>
      window.hasEmittedAnotherPageEvent ? "true" : "false"
    );

    await expect(this.page.getByText(`Order ${orderNO}`)).toBeVisible();
    await expect(
      this.page.locator('[data-testid="orderStatusBtn"]')
    ).toBeVisible();

    Promise.race([timeoutPromise, eventEmittedPromise]).then(
      (result) => {
        result;
        if (result === "true") {
          ('"another page" event detected!');
          test.fail(
            'Expected "another page" event not to be emitted, but it was.'
          );
        } else {
          ("Page is stable");
        }
      },
      (error) => {
        error;
      }
    );
  }

  async verifyScanAllButton() {
   
    const upcChilds = this.page.getByTestId("copyUPC");
    await expect(upcChilds.first()).toBeVisible();

    const UPCContent = await upcChilds.first().innerText();
    const upcSplitedContent = UPCContent.split(":");

    const productScanInput = await this.page.getByPlaceholder(
      "Ready For Product Scan"
    );
    await expect(productScanInput).toBeVisible();
    await productScanInput.fill(upcSplitedContent[1]);

    const passButton = await this.page
      .getByTestId("passButton")
      .filter({ has: this.page.getByText("Pass", { exact: true }) });
    await expect(passButton).toBeVisible();
    await passButton.click();

    const scanAllButton = await this.page.getByTestId("scanAllButton");
    await expect(scanAllButton).toBeVisible();
    const scanAllButtonScreenshot = await this.page.screenshot();
    await this.testInfo.attach('Scan All Button', { body: scanAllButtonScreenshot, contentType: 'image/png' });
    await scanAllButton.click();

    const [resp] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes("scan_pack_v2") && resp.status() === 200
      ),
    ]);
    const body = await resp.json();
    expect(body.status).toEqual("OK");
  }

  async verifyRecordSerialForFinalItem(product) {
    let body;
    await this.page.getByTestId("passButton").getByText("Pass").click();
    await this.page.waitForLoadState("networkidle");
    await this.page.getByTestId("passButton").getByText("Pass").click();
    await this.page.waitForLoadState("networkidle");
    const ele = await this.page
      .getByTestId("serialRecord")
      .getByTestId("inputElement");
    await expect(ele).toBeVisible();
    await ele.fill("1234");
    await this.page.keyboard.press("Enter");
    await this.page.waitForTimeout(3000);

    await this.menuSearch();
    await this.getSearchField(product);
    await this.page.waitForTimeout(3000);
    await expect(
      this.page.locator('[data-testid="orderStatusBtn"]')
    ).toHaveText("Awaiting");
  }

  async verifyRemoveRegularItem() {
    const passButton =  this.page.getByTestId("passButton").filter({has: this.page.getByText("Pass")});
    await expect(passButton).toBeVisible()
    await passButton.click();

    await expect(
      this.page.getByTestId('boxItemList')
    ).toBeVisible();

    await this.page.waitForLoadState("networkidle");

    await this.removeOrderAndVerify();
  }
  async verifyRemoveKitItem() {
    await this.scanItemAndVerify();
    const addBoxIcon = this.page.getByTestId('addBoxIcon');
    // await expect(addBoxIcon).toBeVisible()
    await addBoxIcon.click({force: true});

    await this.page.waitForLoadState("domcontentloaded");
    
    await this.page.waitForTimeout(2000);

    await this.scanItemAndVerify();
    await this.removeOrderAndVerify();

    const goPreviousIcon = this.page.getByTestId('goPrevIcon');
    await expect(goPreviousIcon).toBeVisible()
    await goPreviousIcon.click();

    await this.removeOrderAndVerify();

    await this.restartOrder();
  }

  async verifyShippingLabelCreationTab() {
    await this.page.locator('[data-testid="orderDetail"]').click();
    const btn = await this.page.locator(
      '[data-component-name="shippingLabelActiveBtn"]'
    );
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(this.page.getByText("Ship Date")).toBeVisible();
  }

  async verifyWeightShortcutKey() {
    class TimeoutError extends Error {}
    await this.verifyShippingLabelCreationTab();
    let apiCallCount = 0;
    const response = await this.page.waitForResponse(
      "https://abubakar.groovepackerapi.com/stores/fetch_label_related_data.json"
    );
    if (response) {
      apiCallCount++;
    }
    if (apiCallCount == 1) {
      try {
        response;
        await this.page.waitForTimeout(4000);
      } catch (error) {
        if (error instanceof TimeoutError) {
          console.error("API request timed out");
        } else {
          console.error("Error waiting for response:", error);
        }
      }
    }
    //await this.page.waitForTimeout(4000)
    await this.page.keyboard.press("c");
    await this.page.keyboard.press("2");
    await this.page.getByText("Ship Date").click();

    await this.page.keyboard.press("y");
    await this.page.keyboard.press("0");
    await this.page.getByText("Ship Date").click();

    // const ele = this.page.locator('[placeholder="Weight"]').innerText()
    // console.log('element',ele)
    //await expect(this.page.locator('[placeholder="Weight"]')).toHaveText('2');
    //await expect(this.page.locator('[placeholder="WeightOunces"]')).toHaveText('4');
  }

  async verifyShippingLabelPrint(context) {
    await this.verifyWeightShortcutKey();
    await this.page.keyboard.press("Enter");
    await this.page.waitForResponse(
      "https://abubakar.groovepackerapi.com/orders/update_ss_label_order_data"
    );
    await this.page.waitForTimeout(10000);

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await this.page.getByText("USPS Media Mail - Package").click(),
    ]);
    await newPage.waitForLoadState("networkidle");
    await newPage.waitForTimeout(4000);
    console.log("newPage", newPage.url());
    expect(await newPage.locator(':text("USPS MEDIA MAIL")'));
    //expect(await newPage.locator('[original-url="https://s3-us-west-2.amazonaws.com/groove-prod/abubakar/pdf/SS_Label_1132067961_1706303465.pdf"]')).toBeHidden();
  }

  async verifyShippingLabelPrintWorking(context) {
    await this.verifyWeightShortcutKey();
    await this.page.keyboard.press("Enter");
    await this.page.waitForResponse(
      "https://abubakar.groovepackerapi.com/orders/update_ss_label_order_data"
    );
    await this.page.waitForTimeout(10000);

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await this.page.getByText("USPS Media Mail - Package").click(),
    ]);
    await newPage.waitForLoadState("networkidle");
    await newPage.waitForTimeout(4000);
    console.log("newPage", newPage.url());
    expect(await newPage.locator(':text("USPS MEDIA MAIL")'));
    //expect(await newPage.locator('[original-url="https://s3-us-west-2.amazonaws.com/groove-prod/abubakar/pdf/SS_Label_1132067961_1706303465.pdf"]')).toBeHidden();
  }
}

module.exports = ScanVerify;
