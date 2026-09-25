// The apps are the .html files at the repo root.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

const apps = fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .sort()
  .map((name) => {
    const file = path.join(ROOT, name);
    return { name, file, src: fs.readFileSync(file, 'utf8') };
  });

module.exports = { ROOT, apps };
