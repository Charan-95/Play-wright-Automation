import { test, expect } from '@playwright/test';
import { DashboardPage } from '../Pages/DashboardPage';
import { PackagesPage } from '../Pages/PackagesPage';
import { LocationPage } from '../Pages/LocationPage';
import { SlotPage } from '../Pages/SlotPage';
import { PatientPage } from '../Pages/PatientPage';
import { ConfirmationPage } from '../Pages/ConfirmationPage';

test('User can book Caregiver service end-to-end', async ({ page }) => {

    // 1️⃣ Open Dashboard
    await page.goto('/');

    const dashboard = new DashboardPage(page);
    await dashboard.verifyDashboardLoaded();

    // ✅ Select Caregiver
    await dashboard.selectService('Caregiver');

    // 2️⃣ Location
    const location = new LocationPage(page);
    await location.verifyLoaded();
    await location.searchAndSelectLocation('Riyadh Park');

    // 3️⃣ Caregiver Packages
    const packagesPage = new PackagesPage(page);
    await packagesPage.verifyCaregiverLoaded();

    // ✅ Select caregiver package
    await packagesPage.selectCaregiverPackage('Babysitter');
    await packagesPage.selectPackageDetailsLoaded();

    // ✅ Select caregiver duration
    await packagesPage.selectCaregiverDuration();


    // 4️⃣  Patient (FINAL STEP for Caregiver)
    const patientPage = new PatientPage(page);
    await patientPage.verifyLoaded();
    await patientPage.selectFirstPatient();
    await patientPage.clickSendRequest();

    // 5️⃣ Confirmation
    const confirmationPage = new ConfirmationPage(page);
    await confirmationPage.verifyCaregiverConfirmation();



});