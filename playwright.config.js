// @ts-check
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config'

export default defineConfig({
  testDir: './tests',
  timeout: 2 * 60 * 1000,
  workers: process.env.CI ? 3 : 1,
  
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  //workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],

  use: {
    headless: false,
    actionTimeout: 0,
    baseURL: process.env.BASE_URL, // Set the base URL here
    trace: 'on-first-retry',
    screenshot: 'on',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  expect: {
    timeout: 30 * 1 * 1000, // Set assertion timeout to 10 seconds
  },


  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    {
      name: 'Google Chrome',
      use: {
        channel: 'chrome',
        viewport: { width: 1920, height: 872 },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

