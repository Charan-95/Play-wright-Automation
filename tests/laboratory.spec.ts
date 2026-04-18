import { test, expect } from '@playwright/test';
import { DashboardPage } from '../Pages/DashboardPage';
import { BookingOptionsPage } from '../Pages/BookingOptionsPage';
import { PackagesPage } from '../Pages/PackagesPage';
import { LocationPage } from '../Pages/LocationPage';
import { SlotPage } from '../Pages/SlotPage';
import { PatientPage } from '../Pages/PatientPage';
import { PaymentPage } from '../Pages/PaymentPage';
import { ConfirmationPage } from '../Pages/ConfirmationPage';

test.setTimeout(10 * 60 * 1000); // 10 minutes

// Define the payment methods to test
const paymentMethods: ('card' | 'wallet')[] = ['card', 'wallet'];

test.describe('Laboratory service booking flow', () => {
  for (const method of paymentMethods) {
    test(`User can book Laboratory service end-to-end with ${method} payment`, async ({ page }) => {
      // 1️⃣ Dashboard
      await page.goto('/');
      const dashboard = new DashboardPage(page);
      await dashboard.verifyDashboardLoaded();
      await dashboard.selectService('Laboratory');

      // 2️⃣ Booking Options
      const bookingOptions = new BookingOptionsPage(page);
      if (await bookingOptions.verifyLoaded()) {
        await bookingOptions.continueWithoutInsurance();
      }

      // 3️⃣ Packages
      const packagesPage = new PackagesPage(page);
      await packagesPage.verifyLabLoaded();
      await packagesPage.selectPackage('Full Body Health Checkup');

      // 4️⃣ Location
      const location = new LocationPage(page);
      await location.verifyLoaded();
      await location.searchAndSelectLocation('Riyadh Gallery Mall');

      // 5️⃣ Slot
      const slotPage = new SlotPage(page);
      await slotPage.verifyLoaded();
      await slotPage.selectFirstAvailableSlot();

      // 6️⃣ Patient
      const patientPage = new PatientPage(page);
      await patientPage.verifyLoaded();
      await patientPage.selectFirstPatient();
      await patientPage.clickContinueToReachPayment();

      // 7️⃣ Payment
      const paymentPage = new PaymentPage(page);

      if (method === 'wallet') {
        await paymentPage.enableWallet();
        await paymentPage.verifyWalletMode();
        await paymentPage.completeBookingWithWallet();
      } else {
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
      }

      // 8️⃣ Confirmation
      const confirmationPage = new ConfirmationPage(page);
      await confirmationPage.verifyLoaded();
      await confirmationPage.goToHome(); // or confirmationPage.goToMyBooking();
    });
  }
});
