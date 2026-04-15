#!/bin/bash

# Deploy Learnr Website to S3
# Usage: ./deploy_to_s3.sh <bucket-name>

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Bucket name required"
  echo "Usage: ./deploy_to_s3.sh <bucket-name>"
  exit 1
fi

BUCKET_NAME=$1

echo "🚀 Deploying Learnr Website to S3..."
echo "📦 Bucket: $BUCKET_NAME"
echo ""

# Navigate to frontend directory
cd frontend

echo "📥 Installing dependencies..."
npm install

echo "🔨 Building production bundle..."
npm run build

echo "☁️  Syncing to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

echo "🔧 Setting content types..."
# Set HTML content type
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
  --recursive \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html" \
  --metadata-directive REPLACE

# Set JSON content type
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
  --recursive \
  --exclude "*" \
  --include "*.json" \
  --content-type "application/json" \
  --metadata-directive REPLACE

# Set CSS content type
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
  --recursive \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  --metadata-directive REPLACE

# Set JS content type
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
  --recursive \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  --metadata-directive REPLACE

echo ""
echo "✅ Deployment complete!"
echo "🌐 Website URL: http://$BUCKET_NAME.s3-website-$(aws configure get region).amazonaws.com"
echo ""
echo "📝 Next steps:"
echo "   1. Enable static website hosting in S3 bucket settings"
echo "   2. Set index document to: index.html"
echo "   3. Set error document to: index.html"
echo "   4. Configure bucket policy for public read access"
echo "   5. (Optional) Set up CloudFront distribution for HTTPS"
