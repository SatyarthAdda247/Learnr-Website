// Fetch missing ustaad.tv thumbnails using auth headers
const fs = require('fs');
const https = require('https');
const path = require('path');

const thumbnailsDir = 'S3Site/images/thumbnails';

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

// These are the original ustaad.tv URLs mapped to their local filenames
const missing = [
  { url: 'https://api.ustaad.tv/images/fe06c561-c630-45a9-82a7-4a03da0ca792.png', file: 'fe06c561-c630-45a9-82a7-4a03da0ca792.png' },
  { url: 'https://api.ustaad.tv/images/52dcfe2b-8546-4a66-818b-5f115239b5e0.png', file: '52dcfe2b-8546-4a66-818b-5f115239b5e0.png' },
  { url: 'https://api.ustaad.tv/images/38a56965-eafd-45d4-9ade-f8499920dde8.png', file: '38a56965-eafd-45d4-9ade-f8499920dde8.png' },
  { url: 'https://api.ustaad.tv/images/168d46ee-9e3f-4400-8508-a4fa00ae9600.jpg', file: '168d46ee-9e3f-4400-8508-a4fa00ae9600.jpg' },
  { url: 'https://api.ustaad.tv/images/a9814a96-e481-49c1-b277-59c5a7d98b3b.jpg', file: 'a9814a96-e481-49c1-b277-59c5a7d98b3b.jpg' },
  { url: 'https://api.ustaad.tv/images/76710539-ab75-4ba9-bdf8-3534252221ae.jpg', file: '76710539-ab75-4ba9-bdf8-3534252221ae.jpg' },
  { url: 'https://api.ustaad.tv/images/7835c7ea-d528-452b-bebd-cc52be14b5e5.png', file: '7835c7ea-d528-452b-bebd-cc52be14b5e5.png' },
  { url: 'https://api.ustaad.tv/images/138a31e3-317c-4f62-baeb-6be4e1a69fb5.png', file: '138a31e3-317c-4f62-baeb-6be4e1a69fb5.png' },
  { url: 'https://api.ustaad.tv/images/c59d3247-ff71-4347-af4a-57fa4204319c.png', file: 'c59d3247-ff71-4347-af4a-57fa4204319c.png' },
  { url: 'https://api.ustaad.tv/images/fc45eaef-1cdb-46b0-91cf-6753917d5047.png', file: 'fc45eaef-1cdb-46b0-91cf-6753917d5047.png' },
  { url: 'https://api.ustaad.tv/images/ff6a214c-18a9-4665-8be9-aa0cc48e0ac0.png', file: 'ff6a214c-18a9-4665-8be9-aa0cc48e0ac0.png' },
  { url: 'https://api.ustaad.tv/images/68f8ab88-2b20-40f9-ae7c-0c0aa4a7b091.jpg', file: '68f8ab88-2b20-40f9-ae7c-0c0aa4a7b091.jpg' },
  { url: 'https://api.ustaad.tv/images/5f10a1bd-2aa8-49a1-93da-d753a9fc70f7.png', file: '5f10a1bd-2aa8-49a1-93da-d753a9fc70f7.png' },
];

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      headers: AUTH_HEADERS,
    };
    const file = fs.createWriteStream(filepath);
    https.get(options, (res) => {
      console.log(`  Status ${res.statusCode} for ${path.basename(filepath)}`);
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        resolve(false);
      }
    }).on('error', (e) => { file.close(); fs.unlink(filepath, () => {}); resolve(false); });
  });
}

async function run() {
  let ok = 0, fail = 0;
  for (const { url, file } of missing) {
    const filepath = path.join(thumbnailsDir, file);
    process.stdout.write(`Downloading ${file}... `);
    const result = await download(url, filepath);
    if (result) { console.log('✅'); ok++; }
    else { console.log('❌'); fail++; }
    await new Promise(r => setTimeout(r, 100));
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  
  // Check sizes
  console.log('\nFile sizes:');
  missing.forEach(({ file }) => {
    const fp = path.join(thumbnailsDir, file);
    if (fs.existsSync(fp)) {
      const size = fs.statSync(fp).size;
      console.log(`  ${file}: ${size} bytes`);
    }
  });
}

run().catch(console.error);
