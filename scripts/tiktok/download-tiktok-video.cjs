const fs = require('fs');
const path = require('path');

async function downloadTikTokVideo(url, page, id, filepath) {
    try {
        // Navigate to the TikTok video page
        await page.goto(url);

        // Wait for video element to load
        const videoElement = await page.waitForSelector('video', { timeout: 500 }).catch(() => {
            console.log('Video element not found, skipping...');
            throw new Error('Video element not found');
        });

        // Create parent directory if it doesn't exist
        const downloadDir = path.dirname(filepath);
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Right click and download video
        await videoElement.click({ button: 'right' });
        
        // Try to find download button with timeout
        const downloadButton = await page.locator('span', { hasText: 'Download video' }).first();
        try {
            await downloadButton.click({ timeout: 500 });
        } catch (err) {
            console.log(`Download button not found for video ${id}, creating empty file...`);
            // Create empty mp4 file
            fs.writeFileSync(filepath, '');
            throw new Error('Download button not found');
        }

        // Wait for download to start and save file
        const download = await page.waitForEvent('download');
        await download.saveAs(filepath);

        console.log(`Video downloaded successfully to: ${filepath}`);
        return filepath;

    } catch (error) {
        console.error('Error downloading video:', error);
        throw error;
    }
}

module.exports = downloadTikTokVideo;
