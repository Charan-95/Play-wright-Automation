import { Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Verify dashboard is loaded
  async verifyDashboardLoaded() {
    await this.page.waitForSelector('img[title="Laboratory"]', {
      state: 'attached'
    });
  }

  // Click any service by title attribute (Laboratory, Radiology, etc.)
  async selectService(serviceName: string) {
    const serviceCard = this.page.locator(`img[title="${serviceName}"]`);
    await expect(serviceCard).toBeVisible();
    await serviceCard.click();
  }
}
