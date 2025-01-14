const fs = require('fs');
const path = require('path');

// If called from command line with username argument
if (require.main === module) {
  const username = process.argv[2];
  
  if (!username) {
    console.error('Please provide a username as an argument');
    process.exit(1);
  }

  const userDir = path.join(__dirname, '../../data', username);
  const outputFile = path.join(userDir, `${username}.json`);

  if (!fs.existsSync(userDir)) {
    console.error(`Directory not found: ${userDir}`);
    process.exit(1);
  }

  let allEntries = [];

  // Read all JSON files in user directory
  const files = fs.readdirSync(userDir);
  for (const file of files) {
    if (file.endsWith('.json') && file !== `${username}.json`) {
      const filePath = path.join(userDir, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const entries = JSON.parse(fileContent);
        if (Array.isArray(entries)) {
          allEntries = allEntries.concat(entries);
          console.log(`Added ${entries.length} entries from ${file}`);
        }
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }

  // Write combined entries to output file
  fs.writeFileSync(outputFile, JSON.stringify(allEntries, null, 2));
  console.log(`Wrote ${allEntries.length} total entries to ${outputFile}`);
}
