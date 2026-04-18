import { Page, expect } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Verify payment page loaded
  async verifyLoaded() {
    // Target ONLY the heading, not the button
    await expect(
      this.page.getByRole('heading', { name: 'Payment Method' })
    ).toBeVisible({ timeout: 60000 });
  }
  // Select Credit / Debit card radio
  async selectCardOption() {
    const radio = this.page.getByText('Credit/debit card');
    await radio.waitFor({ state: 'visible', timeout: 30000 });
    await radio.click();
  }

  // Click Add new card
  async addNewCard() {
    const addCard = this.page.getByText('Add new card');
    await addCard.waitFor({ state: 'visible', timeout: 30000 });
    await addCard.click();
  }
  // Enter card details (Checkout Frames)
  async enterCardDetails(
    cardHolder: string,
    cardNumber: string,
    expiry: string,
    cvv: string
  ) {

    // Switch to Cardholder iframe
    const cardHolderFrame = this.page.frameLocator('iframe[data-testid="cardholder-name"]');

    // Locate input
    const holder = cardHolderFrame.locator('input[name="cardholder-name"]');

    // Wait & fill
    await holder.waitFor({ state: 'visible' });
    await holder.fill(cardHolder);


    // Card Number
    const cardNumberFrame = this.page.frameLocator('iframe[data-testid="card-number"]');

    const cardNo = cardNumberFrame.locator('input[name="card-number"]');

    await cardNo.waitFor({ state: 'visible' });
    await cardNo.fill(cardNumber); // test card


    // Expiry Date
    const expiryFrame = this.page.frameLocator('iframe[data-testid="card-expiry-date"]');

    const expiryDate = expiryFrame.locator('input[name="card-expiry-date"]');

    await expiryDate.waitFor({ state: 'visible' });
    await expiryDate.fill(expiry); // MM/YY


    // CVV
    const cvvFrame = this.page.frameLocator('iframe[data-testid="card-cvv"]');

    const securityCode = cvvFrame.locator('input[name="card-cvv"]');

    await securityCode.waitFor({ state: 'visible' });
    await securityCode.fill(cvv);
  }

  // Click Pay button
  async clickPay() {

    const payBtn = this.page.getByRole('button', { name: 'Pay', exact: true });
    await payBtn.waitFor({ state: 'visible', timeout: 30000 });
    await payBtn.click();

  }

  // Handle 3DS Authentication (INSIDE IFRAME)
  async handle3DSAuthentication() {
    const password = 'Checkout1!';

    // 1. Wait for outer iframe
    const outerFrame = this.page.frameLocator('iframe#threeDS-modal-iframe');

    // 2. Wait for ANY iframe inside it (important step)
    const innerFrame = outerFrame.frameLocator('iframe');

    // 3. Now locate password inside inner frame
    const input = innerFrame.locator('input[type="password"]');

    await expect(input).toBeVisible({ timeout: 60000 });

    await input.fill(password);

    const continueBtn = innerFrame.locator('button, input[type="submit"]').first();
    await continueBtn.click();
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
