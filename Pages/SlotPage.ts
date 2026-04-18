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

// ---------------- Nurse Visit specific methods ----------------
      async verifyNurseVisitLoaded() {
    await expect(
      this.page.getByText('Select Center', { exact: true })
    ).toBeVisible();
  } 

// ---------------- Select First Hospital ----------------
async selectFirstHospital() {

  // Select first hospital
const firstHospital = this.page.locator('li.sa-nurse-det').first();
await firstHospital.click();
}

  // Wait for slots to load
 async verifyNurseslotsLoaded() {
  const slotContainer = this.page.locator('ul.sa-slot-btn.sa-available-slots');
  const slots = slotContainer.locator('li');

  // Wait for container
  await expect(slotContainer).toBeVisible({ timeout: 20000 });

  // Wait until at least one slot is visible
  await expect(slots.first()).toBeVisible({ timeout: 20000 });
}
  // Select first av slot
async selectNurseFirstAvailableSlot() {
  const slotContainer = this.page.locator('ul.sa-slot-btn.sa-available-slots');
  const slots = slotContainer.locator('li');

  // Wait until slots are loaded
  await expect(slots.first()).toBeVisible({ timeout: 20000 });

  const count = await slots.count();
  console.log(`🕒 Slots found: ${count}`);

  for (let i = 0; i < count; i++) {
    const slot = slots.nth(i);

    if (await slot.isVisible()) {
      await slot.scrollIntoViewIfNeeded();
      await slot.click();
      return;
    }
  }

  throw new Error('❌ No available slot found to select');

}


  // Click Next
  async clickNext() {
const nextButton = this.page.getByRole('button', { name: 'Next' });

// Wait until button is enabled (important)
await expect(nextButton).toBeEnabled({ timeout: 10000 });

await nextButton.click();

}

// ---------------- End of Nurse Visit specific methods ----------------

// Physiotherapy specific methods can be added here similarly

async verifyPhysiotherapyLoaded() {
    await expect(
      this.page.getByText('Select Physiotherapist', { exact: true })
    ).toBeVisible();
  } 

// ---------------- Select First Hospital ----------------
async selectFirstPhysiotherapyHospital() {

  // Select first hospital
const firstHospital = this.page.locator('div.sa-doct-det').locator('div').nth(0);
await firstHospital.click();

const bookNowBtn = this.page.getByRole('button', { name: 'Book Now', exact: true }).first();
await bookNowBtn.waitFor({ state: 'visible' });
await bookNowBtn.click();

const therapySessions = await this.page.locator('span:has-text("1 Therapy Sessions")');
await therapySessions .waitFor({ state: 'visible', timeout: 10000 });
await therapySessions.click();

const nextButton = this.page.getByRole('button', { name: 'Next' });
await expect(nextButton).toBeEnabled({ timeout: 10000 });
await nextButton.click();

}

  // Wait for slots to load
 async verifyPhysiotherapySlotsLoaded() {
  const slotContainer = this.page.locator('ul.sa-slot-btn.sa-available-slots');
  const slots = slotContainer.locator('li');

  // Wait for container
  await expect(slotContainer).toBeVisible({ timeout: 20000 });

  // Wait until at least one slot is visible
  await expect(slots.first()).toBeVisible({ timeout: 20000 });
}
  // Select first av slot
async selectPhysiotherapyFirstAvailableSlot() {
  const slotContainer = this.page.locator('ul.sa-slot-btn.sa-available-slots');
  const slots = slotContainer.locator('li');

  // Wait until slots are loaded
  await expect(slots.first()).toBeVisible({ timeout: 20000 });

  const count = await slots.count();
  console.log(`🕒 Slots found: ${count}`);

  for (let i = 0; i < count; i++) {
    const slot = slots.nth(i);

    if (await slot.isVisible()) {
      await slot.scrollIntoViewIfNeeded();
      await slot.click();
      return;
    }
  }

  throw new Error('❌ No available slot found to select');

}


  // Click Next
  async clickNext1() {
const nextButton = this.page.getByRole('button', { name: 'Next' }).nth(1);

// Wait until button is enabled (important)
await expect(nextButton).toBeEnabled({ timeout: 10000 });

await nextButton.click();

}

  async clickDone() {
    const doneButton = this.page.getByRole('button', { name: 'Done' });

    // Wait until button is enabled (important)
    await expect(doneButton).toBeEnabled({ timeout: 10000 });     
    await doneButton.click();
}
}

