// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  // The default is half the CPUs, which is 1 on a 2-core CI runner. The tests mostly wait on browser startup,
  // so 2 workers still help there.
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  projects: [
    // Source checks read the files directly, so they run once, not once per browser.
    { name: 'static', testMatch: /static\.spec\.js/ },
    { name: 'chromium', testMatch: /pages\.spec\.js/, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testMatch: /pages\.spec\.js/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testMatch: /pages\.spec\.js/, use: { ...devices['Desktop Safari'] } },
  ],
});
