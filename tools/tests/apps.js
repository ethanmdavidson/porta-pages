// The apps are the .html files at the repo root.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

// An app has a self-test if its source mentions the result global or the #test hash (but not ids like #test-report).
const SELF_TEST = /portaTestResult|#test(?![\w-])/;

const apps = fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .sort()
  .map((name) => {
    const file = path.join(ROOT, name);
    const src = fs.readFileSync(file, 'utf8');
    return { name, file, src, hasSelfTest: SELF_TEST.test(src) };
  });

module.exports = { ROOT, apps };
