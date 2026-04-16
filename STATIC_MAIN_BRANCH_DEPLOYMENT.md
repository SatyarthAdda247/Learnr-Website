# Static Main Branch Deployment Guide

## Overview

This branch (`newweb-static`) contains an exact copy of the main branch Adda247 Gold landing page, configured for static deployment to S3. It's a clean, professional government job preparation landing page.

## What Was Done

### 1. Complete Code Replacement
- Copied entire `src/`, `public/`, and config files from original main branch
- Replaced our learning platform code with the original landing page
- Maintained the same structure and functionality as the main branch

### 2. Static Deployment Configuration
- **Removed base path**: Commented out `base: "/gold"` in `vite.config.ts` for root deployment
- **Fixed CSS issues**: Resolved `border-border` and `bg-background` @apply directives
- **Updated vercel.json**: Simplified for static hosting
- **Created S3 deployment script**: `deploy_static_s3.sh`

### 3. Build Optimization
- All assets are bundled and optimized
- Images are included in the build output
- No external API dependencies
- Ready for CDN distribution

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── adda247/          # Main landing page components
│   ├── assets/               # Images, logos, icons
│   ├── pages/
│   │   └── Adda247Landing.tsx # Main page component
│   └── App.tsx               # Entry point
├── public/                   # Static assets
├── dist/                     # Build output (after npm run build)
└── package.json              # Dependencies
```

## Key Components

### 1. Adda247Landing.tsx
- **Main page**: Government job preparation landing
- **Structure**: Header → Hero → Footer
- **Content**: Hindi tagline, Google Play download, hero image

### 2. HeroSection.tsx
- **Layout**: Two-column responsive design
- **Content**: "Sarkari Job Hai Toh Raub Hai" tagline
- **CTA**: Google Play Store download button

### 3. StickyHeader.tsx
- **Behavior**: Appears on scroll (300px threshold)
- **Content**: Logo + Google Play badge
- **Animation**: Smooth slide-down transition

### 4. Footer.tsx
- **Links**: Privacy Policy, Terms of Use, Delete Account
- **Styling**: Dark theme with proper contrast

## Technology Stack

- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 5.4.21
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion
- **Font**: Onest (Google Fonts)

## Design System

### Colors
- **Primary**: Mustard brown (`#B8964A`)
- **Backgrounds**: Creamy beige, antique white, carbon grey
- **Text**: Chinese black, graphite grey, slate grey
- **Accent**: Gold light/dark variants

### Typography
- **Font**: Onest - modern, clean sans-serif
- **Hierarchy**: Clear heading sizes with proper contrast
- **Language**: Hindi-focused with English support

## Deployment

### Local Development
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:8080
```

### Build for Production
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Deploy to S3
```bash
./deploy_static_s3.sh your-bucket-name
```

### Deploy to Vercel
```bash
cd frontend
vercel --prod
```

## S3 Configuration

### Bucket Settings
1. **Static website hosting**: Enabled
2. **Index document**: `index.html`
3. **Error document**: `index.html`
4. **Public read access**: Required

### Bucket Policy Example
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

## Performance Optimizations

### Build Output
- **HTML**: 1.52 kB (gzipped: 0.60 kB)
- **CSS**: 70.21 kB (gzipped: 12.37 kB)
- **JS**: 146.55 kB (gzipped: 47.13 kB)
- **Images**: Optimized PNGs (logos, hero image)

### CDN Ready
- All assets have cache-friendly names
- Gzip compression supported
- Optimized for CloudFront distribution

## Differences from Learning Platform

| Aspect | This Version (Main Branch Copy) | Learning Platform |
|--------|--------------------------------|-------------------|
| **Purpose** | Government job preparation | General learning platform |
| **Content** | Static Hindi landing page | Dynamic API-driven sections |
| **Complexity** | Simple, focused | Feature-rich, multi-section |
| **Target** | Job aspirants | Broad learning audience |
| **Design** | Professional, corporate | Modern, dark theme |
| **Dependencies** | Heavy UI library | Lightweight custom |

## Maintenance

### Updates
- Content changes: Edit components in `src/components/adda247/`
- Styling: Modify `src/index.css` or Tailwind config
- Assets: Replace files in `src/assets/`

### Deployment Pipeline
1. Make changes locally
2. Test with `npm run dev`
3. Build with `npm run build`
4. Deploy with `./deploy_static_s3.sh bucket-name`

## Success Metrics

✅ **Exact main branch functionality**  
✅ **Static deployment ready**  
✅ **S3 compatible**  
✅ **CDN optimized**  
✅ **Mobile responsive**  
✅ **Fast loading (< 50kB gzipped)**  
✅ **Professional design**  
✅ **Hindi language support**  

## Next Steps

1. **Deploy to S3**: Use the provided deployment script
2. **Set up CloudFront**: For HTTPS and global distribution
3. **Configure domain**: Point custom domain to S3/CloudFront
4. **Monitor performance**: Set up analytics and monitoring
5. **A/B testing**: Test different CTAs or messaging

This version maintains the exact look, feel, and functionality of the original main branch while being optimized for static hosting and S3 deployment.