import { createCanvas } from 'canvas';
import fs from 'fs';
function textToImage(text) {
    // Create a 1080x1080 canvas
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 1080, 1080);

    // Configure text style
    ctx.fillStyle = 'black';
    ctx.font = '72px Arial'; // Starting font size, will be adjusted if needed
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate padding (10% of canvas size)
    const padding = 108;
    const maxWidth = 1080 - (padding * 2);

    // Word wrap function
    function wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Split input text into paragraphs and wrap each paragraph
    const paragraphs = text.split('\\n');
    let lines = [];
    paragraphs.forEach(paragraph => {
        lines = lines.concat(wrapText(paragraph, maxWidth));
    });
    
    // Measure and adjust text size to fit
    let fontSize = 72;
    let maxTextWidth = 0;
    
    // Find the widest line
    for (const line of lines) {
        const width = ctx.measureText(line).width;
        maxTextWidth = Math.max(maxTextWidth, width);
    }
    
    while ((maxTextWidth > maxWidth || (fontSize * 1.2 * lines.length) > (1080 - padding * 2)) && fontSize > 12) {
        fontSize -= 2;
        ctx.font = `${fontSize}px Arial`;
        
        // Recalculate wrapped lines with new font size
        lines = [];
        paragraphs.forEach(paragraph => {
            lines = lines.concat(wrapText(paragraph, maxWidth));
        });
        
        maxTextWidth = 0;
        for (const line of lines) {
            const width = ctx.measureText(line).width;
            maxTextWidth = Math.max(maxTextWidth, width);
        }
    }

    // Calculate line height and total height
    const lineHeight = fontSize * 1.2;
    const totalHeight = lineHeight * lines.length;
    const startY = (1080 - totalHeight) / 2 + fontSize / 2;

    // Draw each line of text
    lines.forEach((line, index) => {
        const y = startY + (lineHeight * index);
        ctx.fillText(line, 1080/2, y);
    });

    return canvas;
}

// Get text from command line arguments
const text = process.argv[2];

if (!text) {
    console.error('Please provide text as a command line argument');
    process.exit(1);
}

// Create image from text
const canvas = textToImage(text);

const out = fs.createWriteStream('out/output.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('Image saved as output.png'));
