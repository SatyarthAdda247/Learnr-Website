// Script to download all thumbnails locally for S3 deployment
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

// Read the content.json file
const contentData = JSON.parse(fs.readFileSync('S3Site/data/content.json', 'utf8'));

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = 'S3Site/images/thumbnails';
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const file = fs.createWriteStream(filename);
    
    client.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filename)}`);
          resolve();
        });
      } else {
        console.log(`❌ Failed to download ${url}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${url}:`, err.message);
      reject(err);
    });
  });
}

// Function to get filename from URL
function getFilenameFromUrl(url) {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  let filename = path.basename(pathname);
  
  // If no extension, add .jpg
  if (!path.extname(filename)) {
    filename += '.jpg';
  }
  
  // Clean filename
  filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return filename;
}

// Collect all thumbnail URLs
const thumbnailUrls = new Set();

// Process all sections
contentData.sections.forEach(section => {
  section.items.forEach(item => {
    if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) {
      thumbnailUrls.add(item.thumbnailUrl);
    }
    if (item.iconUrl && item.iconUrl.startsWith('http')) {
      thumbnailUrls.add(item.iconUrl);
    }
  });
});

console.log(`📥 Found ${thumbnailUrls.size} unique thumbnails to download...`);

// Download all thumbnails
async function downloadAllThumbnails() {
  const urlMapping = {};
  let downloaded = 0;
  let failed = 0;

  for (const url of thumbnailUrls) {
    try {
      const filename = getFilenameFromUrl(url);
      const filepath = path.join(thumbnailsDir, filename);
      
      await downloadFile(url, filepath);
      urlMapping[url] = `images/thumbnails/${filename}`;
      downloaded++;
    } catch (error) {
      console.log(`❌ Failed to download ${url}`);
      failed++;
    }
  }

  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`❌ Failed: ${failed}`);

  // Update content.json with local paths
  updateContentWithLocalPaths(urlMapping);
}

// Update content.json to use local thumbnail paths
function updateContentWithLocalPaths(urlMapping) {
  console.log('\n🔄 Updating content.json with local paths...');

  // Update sections
  contentData.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.thumbnailUrl && urlMapping[item.thumbnailUrl]) {
        item.thumbnailUrl = urlMapping[item.thumbnailUrl];
      }
      if (item.iconUrl && urlMapping[item.iconUrl]) {
        item.iconUrl = urlMapping[item.iconUrl];
      }
    });
  });

  // Save updated content.json
  fs.writeFileSync('S3Site/data/content.json', JSON.stringify(contentData, null, 2));
  
  console.log('✅ Updated content.json with local thumbnail paths');
  console.log('🎉 Static site is now ready for S3 deployment!');
}

// Start the download process
downloadAllThumbnails().catch(console.error);