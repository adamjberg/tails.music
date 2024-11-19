import fs from 'fs';
import fsp from 'fs/promises';
import { textToImage } from './textToImage.mjs';

const filename = process.argv[2];

if (!filename) {
    console.error('Please provide a markdown filename as argument');
    process.exit(1);
}

async function processFile() {
    try {
        const content = await fsp.readFile(filename, 'utf-8');
        const lines = content
            .split('\n')
            .map(line => line.replace(/^#+\s*/, '').trim())
            .filter(line => line.length > 0);

        for (const line of lines) {
            const canvas = textToImage(line);
            const out = fs.createWriteStream(`out/${Date.now()}.png`);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            await new Promise((resolve) => out.on('finish', resolve));
            console.log(`Created image for: ${line.substring(0, 50)}...`);
        }
    } catch (error) {
        console.error('Error processing file:', error);
        process.exit(1);
    }
}

processFile();
