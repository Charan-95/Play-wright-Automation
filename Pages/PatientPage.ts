import { Page, expect } from '@playwright/test';

export class PatientPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ---------------- Common Loader Wait ----------------
  async waitForLoaderToDisappear() {
    const loader = this.page.locator('.sa-loader-bg');
    try {
      await loader.waitFor({ state: 'hidden', timeout: 20000 });
    } catch {
      // loader not present
    }
  }

  // ---------------- Verify Patient Page ----------------
  async verifyLoaded() {
    const patients = this.page.locator('ul.sa-carousel li');
    await patients.first().waitFor({ state: 'visible', timeout: 20000 });
  }

  // ---------------- Select First Patient ----------------
  async selectFirstPatient() {
    const patients = this.page.locator('ul.sa-carousel li:visible');

    await patients.first().waitFor({ state: 'visible', timeout: 20000 });

    await this.waitForLoaderToDisappear();

    await patients.first().scrollIntoViewIfNeeded();
    await patients.first().click();
  }

  // ---------------- Insurance Popup (UPDATED) ----------------
  async handleInsurancePopup(option: 'Yes' | 'No') {

    const popupText = this.page.getByText(
      'Would you like to continue with insurance ?',
      { exact: true }
    );

    const button = this.page.getByRole('button', { name: option, exact: true }).first();

    await this.waitForLoaderToDisappear();

    // ✅ Check if popup appears
    if (await popupText.isVisible({ timeout: 5000 }).catch(() => false)) {

      await popupText.waitFor({ state: 'visible', timeout: 20000 });

      await this.waitForLoaderToDisappear(); // extra safety

      await button.waitFor({ state: 'visible', timeout: 20000 });
      await button.click();
    }
  }

  // ---------------- Health Info ----------------
  async fillHealthInfo() {
    await this.page.getByText('Required health information', { exact: true })
      .waitFor({ timeout: 30000 });

    await this.waitForLoaderToDisappear();

    await this.page.locator('input[name="Height"]').fill('166');
    await this.page.locator('input[name="Weight"]').fill('61');

    // Chronic disease → No
    await this.page
      .locator('div')
      .filter({ hasText: 'Are you a chronic disease patient' })
      .locator('label[for^="no"]')
      .first()
      .click();

    // Surgery last 3 months → No
    await this.page
      .locator('div')
      .filter({ hasText: 'have u had surgery' })
      .locator('label[for^="no"]')
      .first()
      .click();

    // Undergo surgeries → Yes
    await this.page
      .locator('div')
      .filter({ hasText: 'Did you undergo any surgeries' })
      .locator('label[for^="yes"]')
      .first()
      .click();

    const saveBtn = this.page.getByRole('button', { name: 'Save' });

    await this.waitForLoaderToDisappear();
    await saveBtn.click();
    await this.waitForLoaderToDisappear();
  }

  // ---------------- Continue Button ----------------
  async clickContinueButton() {
    const continueBtn = this.page.getByRole('button', { name: 'Continue' });

    await this.waitForLoaderToDisappear();

    await continueBtn.waitFor({ state: 'visible', timeout: 20000 });
    await continueBtn.click();
  }

  // ---------------- Continue to Payment ----------------
  async clickContinueToReachPayment() {
    const continueBtn = this.page.getByRole('button', { name: 'Continue' });

    await this.waitForLoaderToDisappear();

    await continueBtn.waitFor({ state: 'visible', timeout: 20000 });
    await continueBtn.click();
  }
}