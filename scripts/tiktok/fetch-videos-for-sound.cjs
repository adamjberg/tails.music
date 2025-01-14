const fetch = require('node-fetch');
const { cookie, commonParams } = require('./tiktok-request-data.cjs');
const fs = require('fs');
const path = require('path');

async function fetchVideosForSound(url) {
  // Extract music ID from URL
  const musicId = url.split('-').pop();
  // First request - music details
  const detailParams = new URLSearchParams({
    ...commonParams,
    musicId: musicId
  });
  
  const detailUrl = `https://www.tiktok.com/api/music/detail/?${detailParams.toString()}`;
  const detailResponse = await fetch(detailUrl, {
    headers: {
      'Accept': 'application/json',
      cookie,
      'priority': 'u=1, i',
      'referer': 'https://www.tiktok.com/music/original-sound-7396833524533250858'
    }
  });

  const detailData = await detailResponse.json();
  const totalVideos = detailData.musicInfo.stats.videoCount;
  const videosPerPage = 30;
  const totalPages = Math.ceil(totalVideos / videosPerPage);

  let allVideos = [];
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Fetch all pages of videos
  for (let cursor = 0; cursor < totalPages; cursor++) {
    console.log(`Fetching page ${cursor + 1} of ${totalPages}...`);
    
    const listParams = new URLSearchParams({
      ...commonParams,
      count: videosPerPage.toString(),
      coverFormat: '2',
      cursor: (cursor * videosPerPage).toString(),
      musicID: musicId
    });

    const listUrl = `https://www.tiktok.com/api/music/item_list/?${listParams.toString()}`;
    const listResponse = await fetch(listUrl, {
      headers: {
        cookie,
      }
    });

    const listData = await listResponse.json();
    if (listData.itemList) {
      allVideos = allVideos.concat(listData.itemList);
      console.log(`Retrieved ${listData.itemList.length} videos`);
      
      // Write current page data to file
      const filePath = path.join(dataDir, `${musicId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(allVideos, null, 2));
      console.log(`Saved ${allVideos.length} total videos to ${filePath}`);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return {
    details: detailData,
    videos: {
      itemList: allVideos,
      statusCode: 0
    }
  };
}

// If called from command line with URL argument
if (require.main === module) {
  const url = process.argv[2];
  if (url) {
    fetchVideosForSound(url)
      .then(data => console.log(data))
      .catch(err => console.error('Error:', err));
  } else {
    console.error('Please provide a TikTok sound URL as an argument');
  }
}

module.exports = { fetchVideosForSound };
