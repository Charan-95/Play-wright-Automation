import { test, expect } from '@playwright/test';
import { DashboardPage } from '../Pages/DashboardPage';
import { PackagesPage } from '../Pages/PackagesPage';
import { SlotPage } from '../Pages/SlotPage';
import { PatientPage } from '../Pages/PatientPage';
import { PaymentPage } from '../Pages/PaymentPage';
import { ConfirmationPage } from '../Pages/ConfirmationPage';

test('User can book Virtual Consultations service end-to-end', async ({ page }) => {

  // 1️⃣ Open Dashboard
  await page.goto('/');

  const dashboard = new DashboardPage(page);
  await dashboard.verifyDashboardLoaded();

  // ✅ Select Virtual Consultations
  await dashboard.selectService('Virtual Consultations');

  // 2️⃣ Eclinics Page
  const eClinicsPage = new PackagesPage(page);
  await eClinicsPage.verifyEclinicsLoaded();
  eClinicsPage.selectEclinicsDepartment();

  // 3️⃣ Slot
  const slotPage = new SlotPage(page);
  await slotPage.verifyLoaded();
  await slotPage.selectFirstAvailableSlot();

  // 4️⃣ Patient    
  const patientPage = new PatientPage(page);
  await patientPage.verifyLoaded();
  await patientPage.selectFirstPatient();
  await patientPage.handleInsurancePopup();
  await patientPage.clickContinueToReachPayment();

  // 5️⃣ Payment 
  const paymentPage = new PaymentPage(page);
  await paymentPage.selectCardOption();
  await paymentPage.addNewCard();
  await paymentPage.enterCardDetails('Ayoub AL YUSUF', '4242424242424242', '12/27', '123');
  await paymentPage.clickPay();
  await paymentPage.handle3DSAuthentication();

  // 6️⃣ Confirmation
  const confirmationPage = new ConfirmationPage(page);
  await confirmationPage.verifyLoaded();
  await confirmationPage.goToHome();


});
