const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots(iteration) {
  const dir = path.join(__dirname, '..', 'screenshots', `iteration-${iteration}`);
  fs.mkdirSync(dir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Mobile screenshot (iPhone 12 Pro size)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({ path: path.join(dir, 'mobile.png'), fullPage: true });
    console.log(`Saved: ${dir}/mobile.png`);

    // Desktop screenshot
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({ path: path.join(dir, 'desktop.png'), fullPage: true });
    console.log(`Saved: ${dir}/desktop.png`);

  } finally {
    await browser.close();
  }
}

const iteration = process.argv[2] || '1';
takeScreenshots(iteration).catch(console.error);
