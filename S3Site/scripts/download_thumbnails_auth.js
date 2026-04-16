// Download thumbnails with auth headers for api.ustaad.tv URLs
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const contentData = JSON.parse(fs.readFileSync('S3Site/data/content.json', 'utf8'));
const thumbnailsDir = 'S3Site/images/thumbnails';

if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

const AUTH_HEADERS = {
  'X-Auth-Token': 'fpoa43edty5',
  'x-oi': '2',
  'X-JWT-Token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwiYXVkIjoiNTA5MDg4NyIsImlhdCI6MTc3NTIwNzQ3MCwiaXNzIjoiYWRkYTI0Ny5jb20iLCJwaG9uZSI6Ijg2MDEwNjM1NjkiLCJ1c2VySWQiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwibG9naW5BcGlWZXJzaW9uIjoyLCJlbmMiOnRydWV9.EYKqKg3w9nTtPJZQoWJTFnK3bn3Fk6jcPdvZFZo_XNmItUTZcrzd_R0jaM5-d9cShazF-ToleGUL_nFOcj9cSw',
  'AND_APP_VERSION': '30',
  'cp-origin': '1',
  'Api-Key': '5072ae3aab918de11a4e95c183999076c1936c107c6128bcd1970062fadf4ed9',
  'Api-Username': '5090887',
  'business-name': 'AddaSocial',
  'User-Agent': 'androidapp',
};

function getFilenameFromUrl(url) {
  const parsedUrl = new URL(url);
  let filename = path.basename(parsedUrl.pathname);
  if (!path.extname(filename)) filename += '.jpg';
  filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return filename;
}

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const needsAuth = url.includes('api.ustaad.tv') || url.includes('api.adda247.com');
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: needsAuth ? AUTH_HEADERS : {},
    };

    const file = fs.createWriteStream(filename);
    client.get(options, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        file.close();
        fs.unlink(filename, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// Collect all URLs that still need downloading (remote URLs only)
const urlMapping = {};
const toDownload = new Set();

contentData.sections.forEach(section => {
  section.items.forEach(item => {
    ['thumbnailUrl', 'iconUrl'].forEach(key => {
      const url = item[key];
      if (url && url.startsWith('http')) toDownload.add(url);
    });
  });
});

console.log(`📥 Found ${toDownload.size} URLs to download...`);

async function run() {
  let ok = 0, fail = 0;
  for (const url of toDownload) {
    const filename = getFilenameFromUrl(url);
    const filepath = path.join(thumbnailsDir, filename);
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Exists: ${filename}`);
      urlMapping[url] = `images/thumbnails/${filename}`;
      ok++;
      continue;
    }
    try {
      await downloadFile(url, filepath);
      urlMapping[url] = `images/thumbnails/${filename}`;
      console.log(`✅ ${filename}`);
      ok++;
    } catch (e) {
      console.log(`❌ ${filename} — ${e.message}`);
      fail++;
    }
    await new Promise(r => setTimeout(r, 80));
  }

  console.log(`\n📊 Done: ${ok} ok, ${fail} failed`);

  // Update content.json with local paths
  contentData.sections.forEach(section => {
    section.items.forEach(item => {
      ['thumbnailUrl', 'iconUrl'].forEach(key => {
        if (item[key] && urlMapping[item[key]]) {
          item[key] = urlMapping[item[key]];
        }
      });
    });
  });

  fs.writeFileSync('S3Site/data/content.json', JSON.stringify(contentData, null, 2));
  console.log('✅ content.json updated with local paths');
}

run().catch(console.error);
