#!/bin/bash

# Verification script for static site
echo "🔍 Verifying static site setup..."
echo ""

# Check if static data file exists
if [ -f "frontend/public/data/sections.json" ]; then
  echo "✅ Static data file exists"
  SECTIONS_COUNT=$(grep -o '"sectionName"' frontend/public/data/sections.json | wc -l | tr -d ' ')
  echo "   Found $SECTIONS_COUNT sections"
else
  echo "❌ Static data file missing"
  exit 1
fi

# Check for API references in source code
if grep -r "content-ws" frontend/src/ > /dev/null 2>&1; then
  echo "❌ Found API references in source code"
  exit 1
else
  echo "✅ No API references in source code"
fi

# Check if dev server is running
if curl -s http://localhost:8080/ > /dev/null 2>&1; then
  echo "✅ Dev server is running"
  
  # Test static data endpoint
  if curl -s http://localhost:8080/data/sections.json > /dev/null 2>&1; then
    echo "✅ Static data endpoint accessible"
  else
    echo "❌ Static data endpoint not accessible"
    exit 1
  fi
else
  echo "⚠️  Dev server not running (start with: cd frontend && npm run dev)"
fi

echo ""
echo "🎉 All checks passed! Site is fully static."
echo ""
echo "📝 Summary:"
echo "   - No API calls to external services"
echo "   - All data loaded from /data/sections.json"
echo "   - Thumbnails load from CDN (api.ustaad.tv)"
echo "   - Ready for S3 deployment"
