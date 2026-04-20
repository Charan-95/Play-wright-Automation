import { test, expect } from '@playwright/test';
import { DashboardPage } from '../Pages/DashboardPage';
import { PackagesPage } from '../Pages/PackagesPage';
import { LocationPage } from '../Pages/LocationPage';
import { SlotPage } from '../Pages/SlotPage';
import { PatientPage } from '../Pages/PatientPage';
import { PaymentPage } from '../Pages/PaymentPage';
import { ConfirmationPage } from '../Pages/ConfirmationPage';

test('User can book Kids Vaccination service end-to-end', async ({ page }) => {

  // 1️⃣ Open Dashboard
  await page.goto('/');

  const dashboard = new DashboardPage(page);
  await dashboard.verifyDashboardLoaded();

  // ✅ Select Kids Vaccination service
  await dashboard.selectService('Kids Vaccination');

  // 2️⃣ Packages / Vaccination page
  const packagesPage = new PackagesPage(page);
  await packagesPage.verifyKidsVaccinationLoaded();

  // ✅ Select vaccination (example)
  await packagesPage.selectVaccination('4 Months');

  await packagesPage.verifyEligibilityLoaded();

  // 3️⃣ Location
  const location = new LocationPage(page);
  await location.verifyLoaded();
  await location.searchAndSelectLocation('Riyadh Park');

  // 4️⃣ Slot
  const slotPage = new SlotPage(page);
  await slotPage.verifyNurseVisitLoaded();
  await slotPage.selectFirstHospital();
  await slotPage.verifySlotsLoaded('kids');
  await slotPage.selectFirstAvailableSlot1('kids');
  await slotPage.clickNext();

  // 5️⃣ Patient
  const patientPage = new PatientPage(page);
  await patientPage.verifyLoaded();
  await patientPage.selectFirstPatient();
  await patientPage.handleInsurancePopup('Yes');

  // 6️⃣ Payment (FINAL)
  await patientPage.clickContinueToReachPayment();

  const paymentPage = new PaymentPage(page);

  await paymentPage.verifyLoaded();
  await paymentPage.selectCardOption();
  await paymentPage.addNewCard();
  await paymentPage.enterCardDetails(
    'Ayoub AL YUSUF',
    '4242424242424242',
    '12/27',
    '123'
  );
  await paymentPage.clickPay();
  await paymentPage.handle3DSAuthentication();

  // 7️⃣ Confirmation
  const confirmationPage = new ConfirmationPage(page);
  await confirmationPage.verifyLoaded();
  await confirmationPage.goToHome();

  // 8️⃣ Pause (optional)
  await page.pause();
});