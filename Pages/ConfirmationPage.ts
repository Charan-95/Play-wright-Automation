import { Page, expect } from '@playwright/test';

export class ConfirmationPage {
  constructor(private page: Page) {}

  async verifyLoaded() {
    // 1️⃣ Confirm correct page
    await this.page.waitForURL(/confirmation/, { timeout: 100000 });

    // 2️⃣ DOM is enough (avoid networkidle)
    await this.page.waitForLoadState('domcontentloaded');

    // 3️⃣ Capture Appointment ID
    const appointmentIdValue = this.page
      .locator('ul.sa-apt-det li')
      .filter({ hasText: 'Appointment ID' })
      .locator('span >> nth=1');

    await appointmentIdValue.waitFor({ state: 'visible', timeout: 50000 });

    const appointmentId = (await appointmentIdValue.textContent())?.trim();
    console.log('✅ Appointment ID:', appointmentId);

    // 4️⃣ Wait for visible confirmation UI
    const homeBtn = this.page.getByText('Home', { exact: true });
    const myBookingBtn = this.page.getByText('My Booking', { exact: true });

    await expect(homeBtn).toBeVisible({ timeout: 30000 });
    await expect(myBookingBtn).toBeVisible({ timeout: 30000 });
  }

  async goToHome() {
    await this.page.getByText('Home', { exact: true }).click();
  }

  async goToMyBooking() {
    await this.page.getByText('My Booking', { exact: true }).click();
  }
}
