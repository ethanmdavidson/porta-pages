// Repo conventions checked against each app's source. See "Conventions" in the README.
const { test, expect } = require('@playwright/test');
const { apps } = require('./apps');

// Script and style bodies can mention markup in strings (e.g. "<script src=…>"), so blank them out before
// looking for tags.
function markupOnly(src) {
  return src
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>')
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, '$1</style>');
}

function scriptBodies(src) {
  return [...src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
}

for (const app of apps) {
  test.describe(app.name, () => {
    const src = app.src;
    const markup = markupOnly(src);

    test('starts with a header comment describing the app', () => {
      const m = /^<!DOCTYPE html>\n<!--([\s\S]*?)-->/i.exec(src);
      expect(m, 'expected <!-- ... --> right after <!DOCTYPE html>').not.toBeNull();
      expect(m[1].trim(), 'header comment is empty').not.toBe('');
    });

    test('declares a Content-Security-Policy before any script or style', () => {
      const csp = /<meta\s+http-equiv=["']Content-Security-Policy["']\s+content=(["'])(.*?)\1/i.exec(markup);
      expect(csp, 'expected <meta http-equiv="Content-Security-Policy" content="...">').not.toBeNull();
      expect(csp[2]).toContain("default-src 'none'");
      const firstResource = markup.search(/<(script|style|link)\b/i);
      expect(firstResource === -1 || csp.index < firstResource, 'the CSP meta tag must come before any <script>, <style> or <link>').toBe(true);
    });

    test('loads no external scripts or stylesheets', () => {
      expect(markup).not.toMatch(/<script\b[^>]*\bsrc\s*=/i);
      expect(markup).not.toMatch(/<link\b[^>]*\brel\s*=\s*["']?(stylesheet|modulepreload|preload)\b/i);
    });

    test('uses LF line endings, no trailing whitespace, and a final newline', () => {
      expect(src.includes('\r'), 'found CRLF line endings').toBe(false);
      const trailing = src.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /[ \t]$/.test(l)).map(([n]) => n);
      expect(trailing, 'lines with trailing whitespace').toEqual([]);
      expect(src.endsWith('\n'), 'missing final newline').toBe(true);
    });

    // Only the shape can be checked here. pages.spec.js runs the self-test and checks the result it produces.
    test('has a #test self-test that sets window.portaTestResult', () => {
      const js = scriptBodies(src);
      // Booleans, so a failure prints the message rather than every script in the file.
      expect(/\bwindow\.portaTestResult\s*=(?!=)/.test(js), 'a self-test must assign window.portaTestResult in an inline script').toBe(true);
      expect(/\blocation\.hash\s*[!=]==?\s*(["'])#test\1/.test(js), "a self-test must run only when location.hash is '#test'").toBe(true);
    });
  });
}
