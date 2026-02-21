import { Page, expect } from '@playwright/test';

export class SlotPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Verify slot page loaded (wait until any slot appears)
  async verifyLoaded() {
    // Wait for slot list / modal to appear
    await this.page.waitForTimeout(2000); // allow API + animation

    const slots = this.page.locator('p.sa-time-slot');

    // Wait until at least one slot is present
    await expect(slots.first()).toBeVisible({ timeout: 20000 });
  }

  // Select first available dynamic slot (no hardcoded time)
  async selectFirstAvailableSlot() {
    const slots = this.page.locator('p.sa-time-slot');

    // Wait until slots are loaded
    await slots.first().waitFor({ state: 'visible', timeout: 20000 });

    const count = await slots.count();
    console.log(`🕒 Slots found: ${count}`);

    // Click the first visible slot safely
    for (let i = 0; i < count; i++) {
      const slot = slots.nth(i);

      if (await slot.isVisible()) {
        // Small pause to avoid modal intercept issue
        await this.page.waitForTimeout(500);

        await slot.scrollIntoViewIfNeeded();
        await slot.click();
        return;
      }
    }

    throw new Error('❌ No available slot found to select');
  }
}
