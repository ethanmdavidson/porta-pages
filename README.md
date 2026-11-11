# porta-pages

A collection of apps that are built as a single HTML file (sometimes referred to as a Single File Web App, or SFWA). Each file is entirely self-contained, with inline CSS and JS.

The apps are

- local first
- mobile friendly
- support all modern browsers
- can be hosted at a real domain or loaded from your filesystem

## How to use

Open [porta-pages.pages.dev](https://porta-pages.pages.dev/) and pick an app, or download any of the `.html` files and open it in your browser.

Each file is also its own README: it should have a comment block at the top that describes what it is and how to use it.

## Development

Use [web-features-report.html](web-features-report.html) to see which features can be relied upon to meet our criteria.

### Browser support

An app may rely on a web platform feature if it is Baseline Widely available, or if it is supported in current Chrome, Firefox and Safari (including iOS), as the web-features report shows. Anything newer is progressive enhancement only: feature-detect it, and make sure the app still works without it. No polyfills.

### Conventions

Every `.html` file at the repo root is treated as an app and must:

- start with a `<!-- ... -->` comment right after `<!DOCTYPE html>` that says what the app is and how to use it
- declare a `<meta http-equiv="Content-Security-Policy">` with `default-src 'none'` before any `<script>` or `<style>`, so the browser itself blocks anything that isn't inline (loosen only the directives an app truly needs, like `connect-src` in the web-features report)
- load no external scripts or stylesheets
- use LF line endings, no trailing whitespace, and end with a newline
- have a self-test that runs only when the URL ends in `#test` (see below)
- be listed in [index.html](index.html), the site's front page, which is itself an app and follows these rules too

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

### Publishing

Merging a change into `main` publishes to the `porta-pages` project on Cloudflare Pages, and a pull request gets a preview deployment (see [.github/workflows/pages.yml](.github/workflows/pages.yml)).
