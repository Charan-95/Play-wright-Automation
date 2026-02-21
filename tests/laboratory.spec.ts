import { test, expect } from '@playwright/test';
import { DashboardPage } from '../Pages/DashboardPage';
import { BookingOptionsPage } from '../Pages/BookingOptionsPage';
import { PackagesPage } from '../Pages/PackagesPage';
import { LocationPage } from '../Pages/LocationPage';
import { SlotPage } from '../Pages/SlotPage';
import { PatientPage } from '../Pages/PatientPage';
import { PaymentPage } from '../Pages/PaymentPage';
import { ConfirmationPage } from '../Pages/ConfirmationPage';

// Future pages:
// import { PatientPage } from '../Pages/PatientPage';
// import { PaymentPage } from '../Pages/PaymentPage';

test('User can book Laboratory service end-to-end', async ({ page }) => {

  // 1️⃣ Open Dashboard directly (using storageState)
  await page.goto('/');

  const dashboard = new DashboardPage(page);

  // Verify dashboard loaded
  await dashboard.verifyDashboardLoaded();

  // Select Laboratory service
  await dashboard.selectService('Laboratory');

  // 2️⃣ Booking Options page
const bookingOptions = new BookingOptionsPage(page);

const isBookingOptionsVisible = await bookingOptions.verifyLoaded();

if (isBookingOptionsVisible) {
  console.log('Booking Options page detected, continuing...');
  await bookingOptions.continueWithoutInsurance();
} else {
  console.log('Booking Options page not present, skipping...');
}


  // 3️⃣ Packages page
  const packagesPage = new PackagesPage(page);
  await packagesPage.verifyLabLoaded(); // Optional verification
  await packagesPage.selectPackage('Health Check packages'); //Diabete 1st Visit

    // 4️⃣ Location page
  const location = new LocationPage(page);
  await location.verifyLoaded();
  await location.searchAndSelectLocation('Riyadh Gallery Mall');

    // 5️⃣ Slot Selection (no POM yet — handled safely here)
  const slotPage = new SlotPage(page);
  await slotPage.verifyLoaded();
  await slotPage.selectFirstAvailableSlot();

    // 6️⃣ Patient details page
  const patientPage = new PatientPage(page);
  await patientPage.verifyLoaded();
  await patientPage.selectFirstPatient();
  await patientPage.clickContinueToReachPayment();
    
    // 7️⃣ Payment page
  const paymentPage = new PaymentPage(page);
  // await paymentPage.verifyLoaded();
  // await paymentPage.enableWallet();
  // await paymentPage.verifyWalletMode();
  // await paymentPage.completeBookingWithWallet();
  await paymentPage.selectCardOption();
  await paymentPage.addNewCard();
  await paymentPage.enterCardDetails('Ayoub AL YUSUF', '4242424242424242', '12/27', '123');
  await paymentPage.clickPay();
  await paymentPage.handle3DSAuthentication();

   // 8️⃣ Confirmation page
  const confirmationPage = new ConfirmationPage(page);
  await confirmationPage.verifyLoaded();
  // optional
  await confirmationPage.goToHome();
  // or
  // await confirmationPage.goToMyBooking();
  
});
