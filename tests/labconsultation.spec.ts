import { test, expect } from '@playwright/test';
test.setTimeout(10 * 60 * 1000); // Set timeout to 10 minutes for the entire test
import { DashboardPage } from '../Pages/DashboardPage';
import { BookingOptionsPage } from '../Pages/BookingOptionsPage';
import { PatientPage } from '../Pages/PatientPage';
import { PaymentPage } from '../Pages/PaymentPage';
import { WaitingPage } from '../Pages/WaitingPage';

// Future pages:
// import { PatientPage } from '../Pages/PatientPage';
// import { PaymentPage } from '../Pages/PaymentPage';

test('User can book Lab consultation service end-to-end', async ({ page }) => {

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
  await bookingOptions.continueWithInsurance();
} else {
  console.log('Booking Options page not present, skipping...');
}


  //  Patient details page
  const patientPage = new PatientPage(page);
  await patientPage.verifyLoaded();
  await patientPage.selectFirstPatient();
  await patientPage.handleInsurancePopup();
  await patientPage.clickContinueToReachPayment();
    
  //Payment page
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

// Waiting for doctor acceptance
const waitingPage = new WaitingPage(page);
const result = await waitingPage.waitForAcceptanceWithRetry(2);

if (result === 'ACCEPTED') {
  await waitingPage.clickGetStarted();
} else {
  throw new Error('Doctor did not accept after retry attempts');
}
  await page.pause();
  
});
