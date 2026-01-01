const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function takeScreenshots(iteration = '0') {
  const dir = path.join(__dirname, '..', 'screenshots', `iteration-${iteration}`);
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/root/Felix-Home/.cache/ms-playwright/chromium-1200/chrome-linux/chrome'
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    const url = process.argv[3] || 'https://beta.becker.im';

    // Desktop screenshot (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000); // Wait for animations
    await page.screenshot({ path: path.join(dir, 'desktop.png'), fullPage: true });
    console.log(`Saved: ${dir}/desktop.png`);

    // Mobile screenshot (iPhone 12 Pro)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(dir, 'mobile.png'), fullPage: true });
    console.log(`Saved: ${dir}/mobile.png`);

  } finally {
    await browser.close();
  }
}

const iteration = process.argv[2] || '0';
takeScreenshots(iteration).catch(console.error);
