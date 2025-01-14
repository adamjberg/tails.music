const fs = require('fs');
const Papa = require('papaparse');
const downloadTikTokVideo = require('./download-tiktok-video.cjs');
const path = require('path');
const playwright = require('playwright');

// Helper function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    // Get CSV file path from command line argument
    const csvPath = process.argv[2];
    if (!csvPath) {
        console.error('Please provide a CSV file path as argument');
        process.exit(1);
    }

    let browser;
    let page;
    
    try {
        console.log('Starting browser session...');
        // Start the browser session
        browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
        const context = await browser.contexts()[0];
        page = await context.newPage();
        console.log('Browser session started successfully');

        console.log('Reading CSV file...');
        const fileContent = fs.readFileSync(csvPath, 'utf8');
        const results = Papa.parse(fileContent, { header: true });
        const records = results.data;
        console.log(`Found ${records.length} videos to process`);
        
        // Create downloads directory in same folder as CSV
        const downloadDir = path.join(path.dirname(csvPath), 'downloads');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
            console.log(`Created downloads directory at: ${downloadDir}`);
        }
        
        let count = 0;
        let successCount = 0;
        let skipCount = 0;
        let failCount = 0;
        
        for (const record of records) {
            count++;
            const id = record.ID;
            const expectedFilename = `tiktok-${id}.mp4`;
            const expectedPath = path.join(downloadDir, expectedFilename);
            
            console.log(`\nProcessing video ${count}/${records.length} (ID: ${id})`);
            
            try {
                let filepath;
                
                // Check if file already exists
                if (fs.existsSync(expectedPath)) {
                    console.log(`Video ${id} already exists, skipping download`);
                    filepath = expectedPath;
                    skipCount++;
                } else {
                    console.log(`Downloading video ${id}...`);
                    filepath = await downloadTikTokVideo(record.URL, page, id, expectedPath);
                    await delay(500);
                    successCount++;
                    console.log(`Successfully downloaded video ${id}`);
                }
            } catch (err) {
                console.error(`Failed to download video ${record.URL}:`, err);
                failCount++;
                continue;
            }
        }

        console.log('\nDownload Summary:');
        console.log(`Total videos processed: ${count}`);
        console.log(`Successfully downloaded: ${successCount}`);
        console.log(`Skipped (already exists): ${skipCount}`);
        console.log(`Failed downloads: ${failCount}`);
        
    } catch (error) {
        console.error('Failed to download video:', error);
    } finally {
        if (browser) {
            console.log('Closing browser session...');
            await browser.close();
            console.log('Browser session closed');
        }
    }
}

main();
