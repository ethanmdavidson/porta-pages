// The apps are the .html files at the repo root.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

const apps = fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .sort()
  .map((name) => ({ name, file: path.join(ROOT, name) }));

module.exports = { ROOT, apps };
