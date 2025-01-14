const { chromium } = require('playwright');

(async () => {
  try {
    // Connect to existing Chrome instance
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const page = await browser.newPage();

    // Navigate to TikTok sound URL
    await page.goto('https://www.tiktok.com/music/original-sound-7396833524533250858');

    // Wait for the page to load
    await page.waitForTimeout(2000);

    // Count videos using this sound
    const videoCount = await page.locator('div[data-e2e="music-item"]').count();
    console.log(`Found ${videoCount} videos using this sound`);

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
})();
