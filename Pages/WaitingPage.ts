import { Page } from '@playwright/test';

export class WaitingPage {

  constructor(private page: Page) {}

  async waitForAcceptanceWithRetry(maxRetries: number = 2): Promise<'ACCEPTED' | 'FAILED'> {

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

      console.log(`⏳ Waiting attempt ${attempt}`);

      const acceptedText = this.page.getByText(
        'Doctor has been accepted',
        { exact: true }
      );

      const tryAgainBtn = this.page.getByRole('button', {
        name: 'Try Again',
        exact: true
      });

      const unavailableMessage = this.page.getByText(
        'Doctor not available at this moment',
        { exact: false }
      );

      // Wait for either acceptance OR timeout
      await Promise.race([
        acceptedText.waitFor({ state: 'visible', timeout: 5 * 60 * 1000 }),
        tryAgainBtn.waitFor({ state: 'visible', timeout: 5 * 60 * 1000 })
      ]);

      // ✅ If doctor accepted
      if (await acceptedText.isVisible().catch(() => false)) {
        console.log('✅ Doctor accepted');
        return 'ACCEPTED';
      }

      // ⏳ If timeout happened
      if (await tryAgainBtn.isVisible().catch(() => false)) {

        console.log('⏳ Timeout detected');

        // Validate message before retry
        await unavailableMessage.waitFor({ state: 'visible' });

        console.log('📝 Unavailable message verified');

        if (attempt < maxRetries) {
          console.log('🔁 Clicking Try Again');
          await tryAgainBtn.click();

          // IMPORTANT: small wait to allow timer to reset
          await this.page.waitForTimeout(2000);

        } else {
          console.log('❌ Max retries reached');
          return 'FAILED';
        }
      }
    }

    return 'FAILED';
  }

  async clickGetStarted() {
    await this.page.getByRole('button', { name: 'Get Started' }).click();
  }
}