

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async visit() {
    await this.page.goto('/', { waitUntil: 'networkidle' });
  }

  async successfulLogin(accountName, userName, password) {
    await this.enterAccountName(accountName);
    await this.enterUsername(userName);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async enterAccountName(accountName) {
    await this.closeVisibleTooltips();
    const accountNameInput = await this.page.locator('input[data-component-name="tenent"]');
    await accountNameInput.fill(accountName);
  }

  async enterUsername(userName) {
    await this.closeVisibleTooltips();
    const usernameInput = await this.page.locator('input[data-component-name="username"]');
    await usernameInput.fill(userName);
  }

  async enterPassword(password) {
    await this.closeVisibleTooltips();
    const passwordInput = await this.page.locator('input[data-component-name="password"]');
    await passwordInput.fill(password);
  }

  async clickLoginButton() {
    const loginButton = await this.page.locator('[data-testid="logInButton"]');
    await loginButton.click();
    ('login button was clicked');
  }

  async getErrorMessage() {
    const errorMessage = await this.page.locator('div[data-testid="notification"] div[data-testid="message"]');
    await errorMessage.waitFor({ state: 'visible' });
    const errorMessageContext = await errorMessage.textContent();
    return errorMessageContext;
  }

  async AccountNameInputError() {
    const errorMessage = await this.page.locator('div[data-component-name="tenet"] div[data-testid="accountNameError"]');
    await errorMessage.waitFor({ state: 'visible' });
    const errorMessageContext = await errorMessage.textContent();
    'the error message states:', errorMessageContext;
    return errorMessageContext;
  }

  async closeMessage() {
    const closeErrorMessageButton = await this.page.locator('div[data-testid="notification"] div[data-testid="closeButton"]');
    await closeErrorMessageButton.click();
    ('message was closed');
  }

  async saveUsernameMessage() {
    const saveUserName = await this.page.locator('div[data-component-name="username"] div[data-testid="saveUserName"]');
    await saveUserName.waitFor({ state: 'visible' });
    const savedUserName = await saveUserName.textContent();
    'the saved username message states:', savedUserName;
    return savedUserName;
  }

  async clickAccountNameTooltip() {
    try {
      const AccountNameTooltipSelector = 'div[data-component-name="tenet"] div[data-testid="accountToolTipBtn"]';
      await this.page.waitForSelector(AccountNameTooltipSelector, { visible: true });

      const AccountNameTooltip = await this.page.locator(AccountNameTooltipSelector);
      await AccountNameTooltip.click();
      ('AccountNameTooltip was clicked');
    } catch (error) {
      console.error('Error clicking AccountNameTooltip:', error);
    }
  }

  async clickUsernameTooltip() {
    try {
      const UsernameTooltipSelector = 'div[data-component-name="username"] div[data-component-name="userNameToolTipBtn"]';
      await this.page.waitForSelector(UsernameTooltipSelector, { visible: true });

      const UsernameTooltip = await this.page.locator(UsernameTooltipSelector);
      await UsernameTooltip.click();
      ('UsernameTooltip was clicked');
    } catch (error) {
      console.error('Error clicking UsernameTooltip:', error);
    }
  }

  async saveUserName() {
    try {
      await this.closeVisibleTooltips();

      const saveUsernameBtn = 'div[data-component-name="username"] div[data-component-name="saveUserName"]';
      await this.page.waitForSelector(saveUsernameBtn, { visible: true });

      const saveUsername = await this.page.locator(saveUsernameBtn);
      await saveUsername.click();
      ('saveUsername was clicked');
    } catch (error) {
      console.error('Error clicking saveUsername button:', error);
    }
  }

  async closeVisibleTooltips() {
    const AccountNameTooltipSelector = 'div[data-component-name="tenet"] div[data-testid="accountToolTipBtn"]';
    const UsernameTooltipSelector = 'div[data-component-name="username"] div[data-component-name="userNameToolTipBtn"]';

    const AccountNameTooltipmain = 'div[data-component-name="tenet"] div[data-testid="accountToolTip"]';
    const UsernameTooltipmain = 'div[data-component-name="username"] div[data-testid="userNameToolTip"]';

    const isTooltipVisible1 = await this.page.isVisible(AccountNameTooltipmain);
    const isTooltipVisible2 = await this.page.isVisible(UsernameTooltipmain);

    if (isTooltipVisible1) {
      const AccountNameTooltip = await this.page.locator(AccountNameTooltipSelector);
      await AccountNameTooltip.click();
      ('AccountNameTooltip was closed');
    } else if (isTooltipVisible2) {
      const UsernameTooltip = await this.page.locator(UsernameTooltipSelector);
      await UsernameTooltip.click();
      ('UsernameTooltip was closed');
    } else {
      ('Tooltips are not visible. No action taken.');
    }
  }

  async toggleShowHideBtn() {
    try {
      await this.closeVisibleTooltips();

      const toggleShowHideSelector = 'div[data-component-name="password"] div[data-component-name="icon-eye-off"]';
      await this.page.waitForSelector(toggleShowHideSelector, { visible: true });
      const toggleShowHide = await this.page.locator(toggleShowHideSelector);
      await toggleShowHide.click();
      ('hide show was clicked');
    } catch (error) {
      console.error('Error toggling Show/Hide button:', error);
    }
  }

  async clickAccountNameTooltip() {
    try {
      const AccountNameTooltipSelector = 'div[data-component-name="tenet"] div[data-testid="accountToolTipBtn"]';
      await this.page.waitForSelector(AccountNameTooltipSelector, { visible: true });

      const AccountNameTooltip = await this.page.locator(AccountNameTooltipSelector);
      await AccountNameTooltip.click();
      ('AccountNameTooltip was clicked');
    } catch (error) {
      console.error('Error clicking AccountNameTooltip:', error);
    }
  }

  async clickResetPasswordBtn() {
    const resetYourPasswordSelector = 'div[data-component-name="ResetPassword"] div';
    await this.page.waitForSelector(resetYourPasswordSelector, { visible: true });

    const resetYourPasswordButton = await this.page.locator(resetYourPasswordSelector).and(this.page.getByText('Reset Your Password'));
    await resetYourPasswordButton.click();
    // await this.page.waitForTimeout(3000);
    ('Reset Your Password button was clicked');
    const promtInput = 'div[data-testid="CommonPrompt"] input[data-testid="inputElement"]';
    await this.page.waitForSelector(promtInput, { visible: true });
    await this.page.locator(promtInput).click();
  }

  //   async submitResetPasswordPrompt() {
  //     const resetYourPasswordSelector = 'div[data-testid="CommonPrompt"] div[data-component-name="ButtonContainer"]';
  //     await this.page.waitForSelector(resetYourPasswordSelector, { visible: true });

  //     const resetYourPasswordButton = await this.page.locator(resetYourPasswordSelector).and(this.page.getByText('Submit'));
  //     await resetYourPasswordButton.click();

  //      ('Reset Your Password button was clicked');
  // }

  async submitResetPasswordPrompt() {
    const buttonContainerSelector = 'div[data-component-name="ButtonContainer"]';
    await this.page.waitForSelector(buttonContainerSelector, { visible: true });

    // Locate the 'Submit' text specifically within the ButtonContainer
    const submitButton = await this.page.locator('div[data-component-name="ButtonContainer"] div[aria-disabled="true"] div[aria-label="Submit"]');
    if (submitButton) {
      await submitButton.click();
      ('Reset Your Password button was clicked');
    } else {
      console.error('Submit button not found');
    }
  }

  async resetPasswordPromptInput(Username) {
    const promtInput = 'div[data-testid="CommonPrompt"] input[data-testid="inputElement"]';
    await this.page.waitForSelector(promtInput, { visible: true });
    await this.page.locator(promtInput).fill(Username);
    await this.page.waitForTimeout(3000);
  }

  async getResetPasswordPromptMessage() {
    const errorMessage = await this.page.locator('div[data-testid="notification"] div[data-testid="message"]');
    await errorMessage.waitFor({ state: 'visible' });
    const errorMessageContext = await errorMessage.textContent();
    'the error message states:', errorMessageContext;
    return errorMessageContext;
  }

  async getUserDetail() {
    await this.page.waitForSelector('div[data-testid="userDetail"]');
    const userDetailDiv = await this.page.locator('div[data-testid="userDetail"]');
    return userDetailDiv.textContent();
  }
}

module.exports = LoginPage;
