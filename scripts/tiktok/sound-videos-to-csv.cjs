const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a JSON file path as argument');
  process.exit(1);
}

try {
  // Read and parse JSON file
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Define fields for CSV
  const fields = [
    'ID',
    'Original Sound',
    'URL',
    'Username',
    'Creator',
    'Bio',
    'Email', 
    'IG Username',
    'Saves',
    'Comment',
    'Likes',
    'Play',
    'Share',
    'Engagements',
    'Engage Ratio',
    'Save Ratio',
    'Comment Ratio',
    'Like Ratio',
    'Share Ratio'
  ];

  // Transform data
  const csvData = jsonData.map(item => {
    const data = {
      'ID': item.id || '',
      'Original Sound': item.music?.id ? `https://www.tiktok.com/music/original-sound-${item.music.id}` : '',
      'URL': `https://tiktok.com/@${item.author?.uniqueId || ''}/video/${item.id || ''}`,
      'Username': item.author?.uniqueId || '',
      'Creator': item.author?.nickname || '',
      'Bio': item.author?.signature || '',
      'Email': item.author?.signature?.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.toString() || '',
      'IG Username': item.author?.signature?.match(/(?:ig|insta|instagram)[\s-:]+([a-zA-Z0-9._@-]{3,})/i)?.slice(1)?.[0] || '',
      'Saves': item.stats?.collectCount || 0,
      'Comment': item.stats?.commentCount || 0,
      'Likes': item.stats?.diggCount || 0,
      'Play': item.stats?.playCount || 0,
      'Share': item.stats?.shareCount || 0,
      'Engagements': 0,
      'Engage Ratio': 0,
      'Save Ratio': 0,
      'Comment Ratio': 0,
      'Like Ratio': 0,
      'Share Ratio': 0
    };

    // Calculate total engagements
    data.Engagements = data.Saves + data.Comment + data.Likes + data.Share;

    // Calculate ratios if play count exists
    if (data.Play > 0) {
      data['Engage Ratio'] = (data.Engagements / data.Play * 100).toFixed(2);
      data['Save Ratio'] = (data.Saves / data.Play * 100).toFixed(2);
      data['Comment Ratio'] = (data.Comment / data.Play * 100).toFixed(2);
      data['Like Ratio'] = (data.Likes / data.Play * 100).toFixed(2);
      data['Share Ratio'] = (data.Share / data.Play * 100).toFixed(2);
    }

    return data;
  });

  // Generate CSV using Papa Parse
  const csv = Papa.unparse({
    fields: fields,
    data: csvData
  });

  // Write to file
  const outputDir = path.dirname(filePath);
  const outputFile = path.join(outputDir, 'kennedy.ryon.csv');
  fs.writeFileSync(outputFile, csv);

  console.log(`CSV data written to ${outputFile}`);

} catch (err) {
  console.error('Error processing file:', err);
  process.exit(1);
}
