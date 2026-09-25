// Loads each app in a real browser and checks that it runs cleanly, then runs its self-test if it has one.
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const { apps } = require('./apps');

// A tiny stand-in for the web-features dataset, so web-features-report.html renders without the network.
const WEB_FEATURES = {
  'package.json': { version: '3.0.0' },
  'data.json': {
    groups: {},
    features: {
      example: { kind: 'feature', name: 'Example feature', status: { baseline: 'high', support: { chrome: '1', firefox: '1', safari: '1' } } },
    },
  },
};

async function open(page, app, hash = '') {
  const problems = [];
  page.on('pageerror', (e) => problems.push('uncaught error: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') problems.push('console.error: ' + m.text()); });
  // The CSP blocks requests before they reach the network, so a violation here is a real one.
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.error('CSP violation: ' + e.violatedDirective + ' blocked ' + (e.blockedURI || 'inline code'));
    });
  });
  await page.route(/^https?:/, (route) => {
    const url = new URL(route.request().url());
    const name = url.pathname.split('/').pop();
    if (/^\/(npm\/)?web-features@3\//.test(url.pathname) && WEB_FEATURES[name]) {
      return route.fulfill({ json: WEB_FEATURES[name], headers: { 'access-control-allow-origin': '*' } });
    }
    problems.push('unexpected network request: ' + url.href);
    return route.abort();
  });
  await page.goto(pathToFileURL(app.file).href + hash);
  await page.waitForLoadState('networkidle');
  return problems;
}

for (const app of apps) {
  test.describe(app.name, () => {
    test('loads without errors', async ({ page }) => {
      const problems = await open(page, app);
      expect(problems).toEqual([]);
    });

    test('passes its self-test (#test)', async ({ page }) => {
      test.skip(!app.hasSelfTest, 'no self-test: the source never mentions #test or portaTestResult');
      const problems = await open(page, app, '#test');
      const result = await page.evaluate(() => window.portaTestResult);
      expect(problems).toEqual([]);
      expect(result, 'window.portaTestResult was not set').toBeDefined();
      expect(result.failures).toEqual([]);
      expect(result.total).toBeGreaterThan(0);
    });
  });
}
