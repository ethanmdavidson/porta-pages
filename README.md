# porta-pages

A collection of apps that are built as a single HTML file (sometimes referred to as a Single File Web App, or SFWA). Each file is entirely self-contained, with inline CSS and JS.

The apps are

- local first
- mobile friendly
- support all modern browsers
- can be hosted at a real domain or loaded from your filesystem

## How to use

Download the files and open them in your browser. They aren't hosted anywhere public yet.

Each file is also its own README: it should have a comment block at the top that describes what it is and how to use it.

## Development

Use [web-features-report.html](web-features-report.html) to see which features can be relied upon to meet our criteria.

### Conventions

Every `.html` file at the repo root is treated as an app and must:

- start with a `<!-- ... -->` comment right after `<!DOCTYPE html>` that says what the app is and how to use it
- declare a `<meta http-equiv="Content-Security-Policy">` with `default-src 'none'` before any `<script>` or `<style>`, so the browser itself blocks anything that isn't inline (loosen only the directives an app truly needs, like `connect-src` in the web-features report)
- load no external scripts or stylesheets
- use LF line endings, no trailing whitespace, and end with a newline
- have a self-test that runs only when the URL ends in `#test` (see below)

The self-test must set `window.portaTestResult = { total, failures }` (a number and an array of failure messages, or a Promise of that object) before the page's `load` event, and should show the result on the page. See `runTestsIfRequested()` in [window-calculator.html](window-calculator.html).

### Checks

The checks live in [tools/](tools/) so the apps themselves stay dependency-free. They need Node 22 or newer.

```sh
cd tools
npm install
npx playwright install    # downloads Chromium, Firefox and WebKit, once
npm test                  # or: npm run test:chromium
```

This checks each app's source against the conventions above, then loads it in Chromium, Firefox and WebKit to make sure it runs cleanly and passes its `#test` self-test. The same checks run in CI. To see an app's self-test by hand, open it with `#test` at the end of the URL.
