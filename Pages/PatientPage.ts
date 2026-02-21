import { Page, expect } from '@playwright/test';

export class PatientPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Verify patient page loaded
  async verifyLoaded() {
    // Wait a little for animation + API
    await this.page.waitForTimeout(2000);

    // Patient cards usually inside horizontal container
    const patientCards = this.page.locator('div.sa-patient-card, div[class*="patient"]');

    // Wait until at least one patient appears
    await expect(patientCards.first()).toBeVisible({ timeout: 20000 });
  }

  // Select first patient (main patient)
  async selectFirstPatient() {

  const patientCards = this.page.locator(
    'div.sa-patient-card, div[class*="patient"]'
  );

  // Wait until at least one card is visible
  await patientCards.first().waitFor({ state: 'visible', timeout: 20000 });

  const count = await patientCards.count();

  for (let i = 0; i < count; i++) {
    const card = patientCards.nth(i);

    if (await card.isVisible()) {
      await card.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(300);
      await card.click();
      break;
    }
  }
}
async handleInsurancePopup() {
await this.page.waitForTimeout(1000); // Wait for potential popup to appear
await this.page.getByRole('button', { name: 'No' }).first().click();

}

async fillHealthInfo() {
// Wait until Required health information popup appears
await this.page.getByText('Required health information', { exact: true })
  .waitFor({ timeout: 30000 });

/* ---------------- Height ---------------- */
await this.page.locator('input[name="Height"]').fill('166');

/* ---------------- Weight ---------------- */
await this.page.locator('input[name="Weight"]').fill('61');

/* ---- Are you a chronic disease patient? ---- */
await this.page
  .locator('div')
  .filter({ hasText: 'Are you a chronic disease patient' })
  .locator('label[for^="no0"]')
  .first()
  .click();

/* ---- Have you had surgery within last 3 month ---- */
await this.page
  .locator('div')
  .filter({ hasText: 'have u had surgery' })
  .locator('label[for^="no1"]')
  .first()
  .click();

/* ---- Did you undergo any surgeries ---- */
await this.page
  .locator('div')
  .filter({ hasText: 'Did you undergo any surgeries' })
  .locator('label[for^="yes2"]')
  .first()
  .click();


/* ---------------- Save ---------------- */
await this.page.getByRole('button', { name: 'Save' }).click();
await this.page.waitForTimeout(2000); // Wait for save to process

}

async clickContinueButton(){
 
  const continueButton = this.page.locator('button').filter({ hasText: 'Continue' }).first();
  await continueButton.waitFor({ state: 'visible', timeout: 2000 });
  await continueButton.click();
}

   // ---------------- Common Continue (All services) ----------------
  async clickContinueToReachPayment() {
    const continueBtn1 = this.page.getByRole('button', { name: 'Continue' });

    await continueBtn1.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(500);
    await continueBtn1.click();
  }
}
