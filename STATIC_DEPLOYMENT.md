# Static Deployment Guide

## Overview

The website has been converted to a fully static site that can be deployed directly to S3 or any static hosting service. All API dependencies have been removed.

## Changes Made

### 1. Static Data
- API response is now cached in `/frontend/public/data/sections.json`
- The site loads data from this static JSON file instead of making API calls
- Thumbnails are loaded directly from their CDN URLs (api.ustaad.tv)

### 2. Configuration Updates
- **vite.config.ts**: Removed `/content-ws` proxy and `/gold` base path
- **vercel.json**: Removed API proxy rewrite
- **sections.ts**: Updated to fetch from `/data/sections.json` instead of API

### 3. Build Output
- Run `npm run build` in the `frontend` directory
- Static files are generated in `frontend/dist/`
- All assets including the JSON data file are included

## Deployment to S3

### Prerequisites
- AWS CLI installed and configured
- S3 bucket created with static website hosting enabled
- Appropriate bucket policy for public read access

### Deploy Steps

1. **Build the site:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Sync to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name/ --delete
   ```

3. **Set correct content types:**
   ```bash
   aws s3 cp s3://your-bucket-name/ s3://your-bucket-name/ \
     --recursive \
     --exclude "*" \
     --include "*.html" \
     --content-type "text/html" \
     --metadata-directive REPLACE
   
   aws s3 cp s3://your-bucket-name/ s3://your-bucket-name/ \
     --recursive \
     --exclude "*" \
     --include "*.json" \
     --content-type "application/json" \
     --metadata-directive REPLACE
   ```

4. **Configure bucket for SPA routing:**
   - In S3 bucket properties → Static website hosting
   - Set Index document: `index.html`
   - Set Error document: `index.html` (for client-side routing)

### Example S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## CloudFront Setup (Optional but Recommended)

For better performance and HTTPS support:

1. Create a CloudFront distribution
2. Set origin to your S3 bucket website endpoint
3. Configure custom error responses:
   - 403 → /index.html (200)
   - 404 → /index.html (200)
4. Enable compression
5. Set up custom domain and SSL certificate if needed

## Updating Content

To update the static data:

1. Run the download script (if you want fresh data from API):
   ```bash
   cd frontend
   node scripts/download-thumbnails.js
   ```

2. The script will:
   - Fetch latest data from the API
   - Save it to `src/api/staticSections.json`
   - Copy it to `public/data/sections.json`

3. Rebuild and redeploy:
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name/ --delete
   ```

## Kubernetes Deployment

The site can still be deployed to Kubernetes, but the health check probes need to be updated:

### Update Deployment Manifest

Change the probe paths from `/` to `/index.html` or remove the base path requirement:

```yaml
livenessProbe:
  httpGet:
    path: /index.html  # Changed from /
    port: 4173
    
readinessProbe:
  httpGet:
    path: /index.html  # Changed from /
    port: 4173
    
startupProbe:
  httpGet:
    path: /index.html  # Changed from /
    port: 4173
```

Or update the Vite preview server to serve at root by removing the `base` config.

## Notes

- Thumbnails are still loaded from `api.ustaad.tv` CDN
- If you need fully offline capability, you'd need to download and host all images
- The site is now completely static - no server-side rendering or API calls
- Perfect for S3, CloudFront, Netlify, Vercel, or any static host
