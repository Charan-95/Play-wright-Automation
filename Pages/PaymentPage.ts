import { Page, expect } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  // ---------------- Wait for Payment Page ----------------
  async verifyLoaded() {
    // Target ONLY the heading, not the button 
    await expect(this.page.getByRole('heading', { name: 'Payment Method' })).toBeVisible({ timeout: 60000 });
  }

  // ---------------- Select Card Option ----------------
  async selectCardOption() {
    const radio = this.page.getByText('Credit/debit card');

    await radio.waitFor({ state: 'visible', timeout: 30000 });
    await radio.click();
  }

  // ---------------- Add New Card ----------------
  async addNewCard() {
    const addCard = this.page.getByText('Add new card');

    await addCard.waitFor({ state: 'visible', timeout: 30000 });
    await addCard.click();
  }

  // ---------------- Enter Card Details ----------------
  async enterCardDetails(
    cardHolder: string,
    cardNumber: string,
    expiry: string,
    cvv: string
  ) {
    // Cardholder Name
    await this.page
      .frameLocator('iframe[data-testid="cardholder-name"]')
      .locator('input[name="cardholder-name"]')
      .waitFor({ state: 'visible' });

    await this.page
      .frameLocator('iframe[data-testid="cardholder-name"]')
      .locator('input[name="cardholder-name"]')
      .fill(cardHolder);

    // Card Number
    await this.page
      .frameLocator('iframe[data-testid="card-number"]')
      .locator('input[name="card-number"]')
      .waitFor({ state: 'visible' });

    await this.page
      .frameLocator('iframe[data-testid="card-number"]')
      .locator('input[name="card-number"]')
      .fill(cardNumber);

    // Expiry
    await this.page
      .frameLocator('iframe[data-testid="card-expiry-date"]')
      .locator('input[name="card-expiry-date"]')
      .waitFor({ state: 'visible' });

    await this.page
      .frameLocator('iframe[data-testid="card-expiry-date"]')
      .locator('input[name="card-expiry-date"]')
      .fill(expiry);

    // CVV
    await this.page
      .frameLocator('iframe[data-testid="card-cvv"]')
      .locator('input[name="card-cvv"]')
      .waitFor({ state: 'visible' });

    await this.page
      .frameLocator('iframe[data-testid="card-cvv"]')
      .locator('input[name="card-cvv"]')
      .fill(cvv);
  }

  // ---------------- Click Pay ----------------
  async clickPay() {
    const payBtn = this.page.locator("//button[@type='button']//span[contains(text(),'Pay')]")

    await payBtn.waitFor({ state: 'visible', timeout: 30000 });
    // Ensure button is enabled (important for payment UI)
    // await expect(payBtn).toBeEnabled({ timeout: 30000 });
    await payBtn.click();
  }

  // ---------------- Handle 3DS ----------------
  async handle3DSAuthentication() {
    const password = 'Checkout1!';

    const outerFrame = this.page.frameLocator('iframe#threeDS-modal-iframe');
    const innerFrame = outerFrame.frameLocator('iframe');

    const input = innerFrame.locator('input[type="password"]');

    await expect(input).toBeVisible({ timeout: 60000 });
    await input.fill(password);

    const continueBtn = innerFrame.locator('button, input[type="submit"]').first();
    await continueBtn.click();
  }

  async handlePaymentRedirect() {

  const redirectText = this.page.getByText('Completing your payment');
  const clickHere = this.page.getByText('Click here');

  // Check if redirect screen appears
  if (await redirectText.isVisible({ timeout: 5000 }).catch(() => false)) {

    console.log('Redirect screen detected');

    // Wait for auto redirect
    try {
      await this.page.waitForSelector(
        'text=Your appointment has been booked successfully',
        { timeout: 15000 }
      );
    } catch {

      // Fallback → click manually
      if (await clickHere.isVisible()) {
        await clickHere.click();
      }

      // Wait again after manual click
      await this.page.waitForSelector(
        'text=Your appointment has been booked successfully',
        { timeout: 20000 }
      );
    }
  }
}

  // ---------------- Wallet Payment Flow ----------------

  // Enable Wallet toggle (handles hidden checkbox)
  async enableWallet() {
    const walletCheckbox = this.page.locator('#wallet');

    const isChecked = await walletCheckbox.isChecked();
    if (!isChecked) {
      // Trigger click via JS for hidden checkbox
      await walletCheckbox.evaluate((el: HTMLInputElement) => el.click());
      console.log('Wallet toggled ON via JS click');

      // Optional: wait for checkbox to actually be checked
      await expect(walletCheckbox).toBeChecked({ timeout: 5000 });
    } else {
      console.log('Wallet already ON');
    }
  }

  // Verify Wallet mode is active (checkbox + button)
  async verifyWalletMode() {
    const walletCheckbox = this.page.locator('#wallet');
    const completeBtn = this.page.getByRole('button', { name: 'Complete the booking' });

    // Verify underlying checkbox is checked
    await expect(walletCheckbox).toBeChecked({ timeout: 5000 });

    // Verify button is visible
    await expect(completeBtn).toBeVisible({ timeout: 30000 });
  }

  // Click "Complete the booking" button for wallet
  async completeBookingWithWallet() {
    const completeBtn = this.page.getByRole('button', { name: 'Complete the booking' });
    await completeBtn.waitFor({ state: 'visible', timeout: 30000 });
    await completeBtn.click();
  }

}
