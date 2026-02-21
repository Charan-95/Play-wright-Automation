import { Page, expect } from '@playwright/test';

export class BookingOptionsPage {
  constructor(private page: Page) {}

  // Verify booking options page loaded (returns true/false)
  async verifyLoaded(timeout = 3000): Promise<boolean> {
    try {
      await expect(
        this.page.getByText(/Continue Without Insurance/i)
      ).toBeVisible({ timeout });
      return true; // Page is visible
    } catch {
      return false; // Page not visible within timeout
    }
  }

  // Click Go to Packages and Lab Tests
  async continueWithoutInsurance() {
    await this.page
      .getByRole('button', { name: 'Go to Packages and Lab Tests' })
      .click();
  }
}
