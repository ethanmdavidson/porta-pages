// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  projects: [
    // Source checks read the files directly, so they run once, not once per browser.
    { name: 'static', testMatch: /static\.spec\.js/ },
    { name: 'chromium', testMatch: /pages\.spec\.js/, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testMatch: /pages\.spec\.js/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testMatch: /pages\.spec\.js/, use: { ...devices['Desktop Safari'] } },
  ],
});
