import { Page, expect } from '@playwright/test';

export class LocationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyLoaded() {
    await expect(
      this.page.locator('#mapbox').getByRole('textbox', { name: 'Search' })
    ).toBeVisible();
  }

  async searchAndSelectLocation(locationName: string) {
    const searchBox = this.page.locator('#mapbox').getByRole('textbox', { name: 'Search' });

    // Click and type location
    await searchBox.click();
    await searchBox.fill(locationName);

    // Select location from suggestions
    const locationResult = this.page.getByText(locationName, { exact: true });
    await locationResult.waitFor({ state: 'visible', timeout: 100000 });
    await locationResult.click();

    // Wait for Confirm Location button to appear
    const confirmBtn = this.page.getByRole('button', { name: 'Confirm location' });
    await confirmBtn.waitFor({ state: 'visible', timeout: 100000 });

    // 🔹 Extra wait for map animation / backend update
    await this.page.waitForTimeout(2000);   // 2 seconds pause

    // Click Confirm Location
    await confirmBtn.click();
  }
}
