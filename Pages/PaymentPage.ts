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

    /* ---------- Card Holder (NORMAL FIELD, NOT IFRAME) ---------- */
    const holder = this.page.locator('#noc:visible');
    await holder.waitFor({ state: 'visible', timeout: 30000 });
    await holder.fill(cardHolder);


    /* ---------- Card Number (iframe id="cardNumber") ---------- */
    const cardNumberFrame = this.page.frameLocator('#cardNumber');
    const cardNumberInput = cardNumberFrame.getByPlaceholder('Card number');

    await cardNumberInput.waitFor({ state: 'visible', timeout: 30000 });
    await cardNumberInput.fill(cardNumber);


    /* ---------- Expiry (iframe id="expiryDate") ---------- */
    const expiryFrame = this.page.frameLocator('#expiryDate');
    const expiryInput = expiryFrame.getByPlaceholder('MM/YY');

    await expiryInput.waitFor({ state: 'visible', timeout: 30000 });
    await expiryInput.fill(expiry);


    /* ---------- CVV (iframe name="checkout-frames-cvv") ---------- */
  const cvvFrame = this.page.frameLocator('iframe[name="checkout-frames-cvv"]');
  const cvvInput = cvvFrame.getByPlaceholder('CVV');

  await cvvInput.waitFor({ state: 'visible', timeout: 30000 });
  await cvvInput.fill(cvv);
  }

  // Click Pay button
  async clickPay() {
    const payBtn = this.page.getByRole('button', { name: 'Pay with Credit/debit card' });
    await payBtn.waitFor({ state: 'visible', timeout: 30000 });
    await payBtn.click();
  }

// Handle 3DS Authentication (INSIDE IFRAME)
async handle3DSAuthentication() {

  // Wait until redirected to 3DS URL
  await this.page.waitForURL(/authentication-devices\.sandbox\.checkout\.com/, {
    timeout: 90000
  });

  // 3DS is inside an iframe → get the frame
  const threeDSFrame = this.page.frameLocator('iframe');

  // Wait for password field inside iframe
  const passwordInput = threeDSFrame.locator('#password');
  await passwordInput.waitFor({ state: 'visible', timeout: 30000 });

  // Fill password
  await passwordInput.fill('Checkout1!');

  // Click Continue button
  const continueBtn = threeDSFrame.locator('#txtButton');
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
