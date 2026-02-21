import { Page, expect } from '@playwright/test';

export class PackagesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ✅ Method to select Eclinics department (used for Virtual Consultations)
  async verifyEclinicsLoaded() {

  const heading = this.page
    .getByRole('heading', { name: 'Virtual Clinics', exact: true })
    .first();

  await expect(heading).toBeVisible({ timeout: 20000 });
}
  async selectEclinicsDepartment() {

    // Click Family Medicine
    await this.page
      .getByRole('heading', { name: 'Family Medicine', exact: true })
      .click();
  }

  async verifyLabLoaded() {
    await expect(
      this.page.getByText('Test & Packages', { exact: true })
    ).toBeVisible();
  }

  //  ✅ Method to select package by name (used for Lab tests)
  async selectPackage(packageName: string) {

    // 1️⃣ Click readonly Search Packages box
    await this.page.getByRole('textbox', { name: 'Search Packages' }).click();

    // 2️⃣ Click active Search input inside popup
    const activeSearch = this.page.getByRole('textbox', { name: 'Search' });
    await activeSearch.waitFor({ state: 'visible' });
    await activeSearch.click();

    // 3️⃣ Type package name
    await activeSearch.fill(packageName);

    // 4️⃣ Click first result (+ icon)
    await this.page.locator('.icon-plus').first().click();

    // 5️⃣ Click Continue
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

   // ✅ NEW METHOD → Radiology procedure selection
    async verifyRadiologyLoaded() {
    await expect(
      this.page.getByText('Radiology At Home', { exact: true })
    ).toBeVisible();
  }

    async selectRadiologyProcedure(procedureName: string) {

    // Click procedure text
    await this.page.getByText(procedureName).waitFor({ state: 'visible' });
    await this.page.getByText(procedureName).click();

    // Click Select button
    const selectBtn = this.page.getByRole('button', { name: 'Select' });
    await selectBtn.waitFor({ state: 'visible' });
    await selectBtn.click();
  }

  async searchLocation() {
    const locationSearch = this.page
      .locator('#mapbox')
      .getByRole('textbox', { name: 'Search' });

    await locationSearch.waitFor({ state: 'visible' });
    await locationSearch.click();
  }

    // ✅ NEW METHOD → Vitamin IV package selection

      async verifyVitaminIVLoaded() {
    await expect(
      this.page.getByText('Vitamin IV Drips', { exact: true })
    ).toBeVisible();
  }

     async selectVitaminIVPackage(procedureName: string) {

    // Locate the close icon using its CSS class and click it
    await this.page.waitForTimeout(1000); // Wait for potential popups to load
    const closeIcon = this.page.locator('i.icon-close');
    await closeIcon.click();


    // Click procedure text
    await this.page.getByText(procedureName).waitFor({ state: 'visible' });
    await this.page.getByText(procedureName).click();

    // Click Select button
    const selectBtn = this.page.getByRole('button', { name: 'Select' });
    await selectBtn.waitFor({ state: 'visible' });
    await selectBtn.click();

    // Click Continue
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

    // ✅ NEW METHOD → Home visit doctor package selection
      async verifyHomeVisitDoctorLoaded() {
    await expect(
      this.page.getByText('Home visit doctor', { exact: true })
    ).toBeVisible();
  }
    async selectHomeVisitDoctor() {
      await this.page.waitForTimeout(1000); // Wait for page to load
    const detailsTab = this.page.getByText('Details', { exact: true });
    const bookNowBtn = this.page.getByRole('button', { name: 'Book Now', exact: true });

    await detailsTab.click();
    await this.page.waitForTimeout(1000); // Wait for details to load
    await bookNowBtn.waitFor({ state: 'visible' });
    await bookNowBtn.click();
  }

}
