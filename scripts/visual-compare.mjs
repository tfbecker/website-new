import puppeteer from 'puppeteer';
import { resolve } from 'path';

const dir = resolve(import.meta.dirname, '..');

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Freeze torus in face-on position
  await page.evaluate(() => {
    const ctrl = window.__torusCtrl;
    if (ctrl) {
      ctrl.setAngle(0, 0.35); // face-on with slight tilt
      ctrl.freeze();
    }
  });
  // Wait for a few frames to render at the new angle
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: resolve(dir, 'screenshots/ours.png') });
  await page.screenshot({
    path: resolve(dir, 'screenshots/ours-center.png'),
    clip: { x: 250, y: 50, width: 780, height: 550 },
  });

  await browser.close();
  console.log('Saved screenshots/ours.png + ours-center.png');
}

main().catch(console.error);
