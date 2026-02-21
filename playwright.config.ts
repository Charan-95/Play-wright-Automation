import { defineConfig } from '@playwright/test';
import users from './test-data/users.json';

export default defineConfig({

  // Maximum time allowed for each test
  timeout: 90000,

  // HTML report configuration
  reporter: [['html', { open: 'never' }]],

  // Default settings for all tests
  use: {
    // Base URL of Sanar UAT
    baseURL: 'https://m.litedev.com',

        // ✅ Block location permission globally
    contextOptions: {
      permissions: []
    },

    // Run browser in visible mode
    headless: false,

    // Browser window size
    // viewport: { width: 1280, height: 720 },
    viewport: null,
    
    launchOptions: {
    args: ['--start-maximized']
  },

    // Take screenshot only when test fails
    screenshot: 'only-on-failure',

    // Record video only when test fails
    video: 'retain-on-failure' ,
        actionTimeout: 30000,
    ignoreHTTPSErrors: true
  },

  // Define multiple test projects
  projects: [

    // Setup project to perform login and save session
    {
      name: 'setup',
      testMatch: /auth\.setup\.spec\.ts/
    },

    // Main project to run all tests using saved login session
 // One project per user
    ...users.map(user => ({
      name: `user-${user.mobile}`,
      testIgnore: /auth\.setup\.spec\.ts/,
      use: {
        storageState: `auth-${user.mobile}.json`
      }
    }))

  ]
});
