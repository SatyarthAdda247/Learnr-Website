import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/images/thumbnails');
const STATIC_DATA_FILE = path.join(__dirname, '../src/api/staticSections.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchSections() {
  const url = 'https://api.adda247.com/content-ws/app/sections?pageNo=0&pageSize=20&src=and';
  
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'X-Auth-Token': 'fpoa43edty5',
        'x-oi': '2',
        'X-JWT-Token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwiYXVkIjoiNTA5MDg4NyIsImlhdCI6MTc3NTIwNzQ3MCwiaXNzIjoiYWRkYTI0Ny5jb20iLCJwaG9uZSI6Ijg2MDEwNjM1NjkiLCJ1c2VySWQiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwibG9naW5BcGlWZXJzaW9uIjoyLCJlbmMiOnRydWV9.EYKqKg3w9nTtPJZQoWJTFnK3bn3Fk6jcPdvZFZo_XNmItUTZcrzd_R0jaM5-d9cShazF-ToleGUL_nFOcj9cSw',
        'jwt-token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwiYXVkIjoiNTA5MDg4NyIsImlhdCI6MTc3NTIwNzQ3MCwiaXNzIjoiYWRkYTI0Ny5jb20iLCJwaG9uZSI6Ijg2MDEwNjM1NjkiLCJ1c2VySWQiOiJhZGRhLnYxLmQ1MjkyM2I2ZWYxNWYwZmI5NTVhNDA3MWYwMTYyZTU1IiwibG9naW5BcGlWZXJzaW9uIjoyLCJlbmMiOnRydWV9.EYKqKg3w9nTtPJZQoWJTFnK3bn3Fk6jcPdvZFZo_XNmItUTZcrzd_R0jaM5-d9cShazF-ToleGUL_nFOcj9cSw',
        'AND_APP_VERSION': '30',
        'cp-origin': '1',
        'AND_APP_VERSION_NAME': '1.2.0',
        'sid': '6176c75ba4746167',
        'Api-Key': '5072ae3aab918de11a4e95c183999076c1936c107c6128bcd1970062fadf4ed9',
        'Content-Type': 'application/json',
        'Api-Username': '5090887',
        'business-name': 'AddaSocial',
        'service-name': 'AddaSocial',
        'client-name': 'androidapp',
        'User-Agent': 'androidapp',
        'dName': 'POCO M2007J20CI',
        'dID': '6176c75ba4746167'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data?.content || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(null);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filepath);
        });
      } else {
        resolve(null);
      }
    }).on('error', () => resolve(null));
  });
}

function sanitizeFilename(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const filename = pathname.split('/').pop() || 'image.jpg';
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function main() {
  console.log('Fetching sections from API...');
  const sections = await fetchSections();
  console.log(`Found ${sections.length} sections`);

  const urlMap = new Map();
  let imageCount = 0;

  // Collect all unique image URLs
  for (const section of sections) {
    for (const item of section.items || []) {
      if (item.thumbnailUrl && !urlMap.has(item.thumbnailUrl)) {
        urlMap.set(item.thumbnailUrl, null);
      }
      if (item.videoThumbnailUrl && !urlMap.has(item.videoThumbnailUrl)) {
        urlMap.set(item.videoThumbnailUrl, null);
      }
      if (item.categoryThumbnailUrl && !urlMap.has(item.categoryThumbnailUrl)) {
        urlMap.set(item.categoryThumbnailUrl, null);
      }
    }
  }

  console.log(`Found ${urlMap.size} unique images to download`);

  // Download all images
  for (const [url] of urlMap) {
    const filename = sanitizeFilename(url);
    const filepath = path.join(OUTPUT_DIR, filename);
    
    if (fs.existsSync(filepath)) {
      console.log(`Skipping (exists): ${filename}`);
      urlMap.set(url, `/images/thumbnails/${filename}`);
      continue;
    }

    console.log(`Downloading: ${filename}`);
    const result = await downloadImage(url, filepath);
    
    if (result) {
      urlMap.set(url, `/images/thumbnails/${filename}`);
      imageCount++;
    } else {
      console.log(`Failed: ${filename}`);
    }
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Update sections with local paths
  const updatedSections = sections.map(section => ({
    ...section,
    items: (section.items || []).map(item => ({
      ...item,
      thumbnailUrl: item.thumbnailUrl ? (urlMap.get(item.thumbnailUrl) || item.thumbnailUrl) : item.thumbnailUrl,
      videoThumbnailUrl: item.videoThumbnailUrl ? (urlMap.get(item.videoThumbnailUrl) || item.videoThumbnailUrl) : item.videoThumbnailUrl,
      categoryThumbnailUrl: item.categoryThumbnailUrl ? (urlMap.get(item.categoryThumbnailUrl) || item.categoryThumbnailUrl) : item.categoryThumbnailUrl,
    }))
  }));

  // Save static data
  fs.writeFileSync(STATIC_DATA_FILE, JSON.stringify(updatedSections, null, 2));
  
  console.log(`\n✅ Downloaded ${imageCount} images`);
  console.log(`✅ Saved static data to ${STATIC_DATA_FILE}`);
}

main().catch(console.error);
