import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to Sanar application
  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Perform login flow
   * @param mobile - mobile number
   * @param otp - OTP code
   * @param skipOtp - set true to skip OTP step (for automation / test env)
   */
  async login(mobile: string, otp: string, skipOtp = false) {

    // Open language selector
    const langButton = this.page.locator('header').getByText('EN', { exact: true });
    await langButton.waitFor({ state: 'visible', timeout: 30000 });
    await langButton.click();

    // Select English language
    const englishOptions = this.page.getByText('English');
    for (let i = 0; i < await englishOptions.count(); i++) {
      const opt = englishOptions.nth(i);
      if (await opt.isVisible()) {
        await opt.click();
        break;
      }
    }

    // Click Sign In button
    const signInBtn = this.page.getByRole('button', { name: /sign in/i });
    await signInBtn.waitFor({ state: 'visible', timeout: 30000 });
    await signInBtn.click();

    // Open country code dropdown
    const countryDropdown = this.page.locator('#countryCode');
    await countryDropdown.waitFor({ state: 'visible', timeout: 30000 });
    await countryDropdown.click();

    // Select India country
    const indiaOption = this.page.locator('text=India').first();
    await indiaOption.waitFor({ state: 'visible', timeout: 30000 });
    await indiaOption.click();

    // Wait for mobile number input
    const mobileInput = this.page.locator('input[type="tel"]');
    await mobileInput.waitFor({ state: 'visible', timeout: 30000 });

    // Enter mobile number
    await mobileInput.fill(mobile);

    // Click Continue button
    const continueBtn = this.page.locator("button[type='button']");
    await continueBtn.waitFor({ state: 'visible', timeout: 30000 });
    await continueBtn.click();


    // Handle OTP only if not skipped
    if (!skipOtp) {
      const otpInputs = this.page.locator('#otpfield');
      await otpInputs.first().waitFor({ state: 'visible', timeout: 30000 });

      for (let i = 0; i < otp.length; i++) {
        await otpInputs.nth(i).fill(otp[i]);
      }

      const continueButton = this.page.getByRole('button', { name: 'Continue' });
      await continueButton.click();
    }
  }
}
