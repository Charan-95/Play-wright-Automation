import { test } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import users from '../test-data/users.json';

// console.log('USERS FROM JSON => ', users);

for (const user of users) {
  test(`Authenticate user ${user.mobile}`, async ({ page }) => {

    console.log('Running for mobile =>', user.mobile);

    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(user.mobile, user.otp, false);

    await page.context().storageState({
      path: `auth-${user.mobile}.json`
    });
  });
}
