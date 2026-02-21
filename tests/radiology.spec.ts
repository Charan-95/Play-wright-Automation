import { test, expect } from '@playwright/test';
import { DashboardPage } from '../Pages/DashboardPage';
import { PackagesPage } from '../Pages/PackagesPage';
import { LocationPage } from '../Pages/LocationPage';
import { SlotPage } from '../Pages/SlotPage';
import { PatientPage } from '../Pages/PatientPage';
import { PaymentPage } from '../Pages/PaymentPage';
import { ConfirmationPage } from '../Pages/ConfirmationPage';

test('User can book Radiology service end-to-end', async ({ page }) => {

  // 1️⃣ Open Dashboard
  await page.goto('/');

  const dashboard = new DashboardPage(page);
  await dashboard.verifyDashboardLoaded();

  // ✅ Select Radiology
  await dashboard.selectService('Radiology');

  // 2️⃣ Packages / Procedures page
  const packagesPage = new PackagesPage(page);
  await packagesPage.verifyRadiologyLoaded();

  // ✅ Radiology procedure
  await packagesPage.selectRadiologyProcedure('Removal of Stitches');

  // 3️⃣ Location
  const location = new LocationPage(page);
  await location.verifyLoaded();
  await location.searchAndSelectLocation('Riyadh Park');

  // 4️⃣  Slot
  const slotPage = new SlotPage(page);
  await slotPage.verifyLoaded();
  await slotPage.selectFirstAvailableSlot();

  // 5️⃣ Patient
  const patientPage = new PatientPage(page);
  await patientPage.verifyLoaded();
  await patientPage.selectFirstPatient();
  await patientPage.clickContinueToReachPayment();

  // 6️⃣ Payment 
  const paymentPage = new PaymentPage(page);
  await paymentPage.selectCardOption();
  await paymentPage.addNewCard();
  await paymentPage.enterCardDetails('Ayoub AL YUSUF', '4242424242424242', '12/27', '123');
  await paymentPage.clickPay();
  await paymentPage.handle3DSAuthentication();

  // 7️⃣ Confirmation
  const confirmationPage = new ConfirmationPage(page);
  await confirmationPage.verifyLoaded();
  await confirmationPage.goToHome();

  // 8️⃣ Pause (optional)
  await page.pause();
});
