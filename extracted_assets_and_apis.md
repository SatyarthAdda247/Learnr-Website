# Extracted Learnr App Data

This document contains a comprehensive list of everything extracted from the `gold xapk` source, including backend API endpoints, static assets, remote thumbnail images, and media endpoints found via Native Binary analysis.

## 1. Local Image & Outline Assets
A massive suite of SVG and PNG images (roughly 300+ files) representing the actual UI icons, placeholders, and banners of the app were physically unzipped from the dart native storage tree. 

**Where to find them locally:**
All of these extracted images have been safely exported to:
> `/Users/adda247/Downloads/Learnr Website/frontend/public/images/`

*(Includes directories like `svg/`, `png/`, and Lottie files which you can browse via your filesystem).*

---

## 2. Remote Thumbnails & Images (Hardcoded in App)
The application fetches various dynamic subject and categorization thumbnails directly from the `learnr.co.in` domains. Additionally, payment gateway icons are fetched from `storecdn`.

**Category / Goal Thumbnails:**
- https://www.learnr.co.in/Maths.png
- https://www.learnr.co.in/English.png
- https://www.learnr.co.in/Geography.png
- https://www.learnr.co.in/Science.png
- https://www.learnr.co.in/reasoning.png
- https://www.learnr.co.in/5-to-10.png
- https://www.learnr.co.in/10pass.png
- https://www.learnr.co.in/12th_pass.png
- https://www.learnr.co.in/Graduate.png
- https://www.learnr.co.in/post_graduate.png

**Promo / Interaction Thumbnails:**
- https://www.learnr.co.in/Abhi_sure_nhi_hu.png
- https://www.learnr.co.in/padhai_start_krne_ki.png
- https://www.learnr.co.in/easy_and_fun_way.png
- https://www.learnr.co.in/carrer_ki_guidance.png
- https://www.learnr.co.in/Gov_job_ki_jankari.png
- https://www.learnr.co.in/unnamed-12.png

**Payment & Provider Icons:**
- https://storecdn.adda247.com/PhonePe.png
- https://storecdn.adda247.com/GooglePay.png
- https://storecdn.adda247.com/Paytm.png
- https://storecdn.adda247.com/BHIM_UPI.png
- https://www.learnr.co.in/FamPay-Logo-SVG-Real-Company-Alphabet-Letter-F-Logo.jpg
- https://www.learnr.co.in/Navi-UPI_idqS5vJKL0_0.png

---

## 3. Extracted REST APIs
The Flutter binary communicates extensively with the Adda247 backend. Below are the primary microservice endpoint hosts uncovered.

*Production APIs:*
- `https://api.adda247.com/` (Primary REST logic endpoint)
- `https://userapi.adda247.com/` (Client User Data)
- `https://store.adda247.com/` (Storefront and Purchases)
- `https://gold-ai-prod.adda247.com/` (Internal AI/Recommendation engine)
- `https://lcs-service-prod.adda247.com/` (Live Class Services)
- `https://user-profiling-prod.adda247.com/` (Telemetry/Audience Profiling)
- `https://dataanalytics.studyiq.net/` (Analytics Logging)
- `https://dataengg.studyiq.com/dataengg-ws/` (Data Engineering WebSockets)

*Media / Uploader APIs:*
- `https://media-uploader-prod.adda247.com/`
- Example HLS Video Stream Route: `https://videocdn.adda247.com/short-videos/.../masterpl.m3u8`

*Testing / Staging Environments (Leaked in binary):*
- `https://stagingapi.adda247.com/`
- `https://devapi.adda247.com/`
- `https://qa-api.adda247.com/`
- `https://staginguserapi.adda247.com/`
- `https://devuserapi.adda247.com/`
- `https://sigmaqauserapi.adda247.com/`
- `https://stagingstore.adda247.com/`
- `https://store-qa.adda247.com/`
- `https://devstore.adda247.com/`
- `https://stagingapi.ustaad.tv`

---

## 4. Web URLs Found
- `https://applink.learnr.co.in` (Universal Application routing)
- `https://www.learnr.co.in/privacy-policy.html`
- `https://www.learnr.co.in/term-of-use.html`
- `https://www.adda247.com/chat_bot.html` (Support Bot Webview)
