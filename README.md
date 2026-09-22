# OneKit

Every digital file tool you need — free.

OneKit merges and splits PDFs, turns pictures into a PDF, and compresses, converts, or resizes images in the browser. Video and audio tools accept an upload from your device and convert it locally with ffmpeg.wasm. There is no account and no paywall.

OneKit does not download media from YouTube, TikTok, Instagram, or other links.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Next.js.

```bash
npm test
npm run lint
npm run build
```

## Tools

| Tool | Route |
| --- | --- |
| Merge PDF | `/tools/pdf/merge` |
| Split PDF | `/tools/pdf/split` |
| Compress PDF | `/tools/pdf/compress` |
| Images to PDF | `/tools/pdf/images-to-pdf` |
| Compress image | `/tools/image/compress` |
| Convert image | `/tools/image/convert` |
| Resize image | `/tools/image/resize` |
| Video to MP4 | `/tools/video/compress` |
| Convert audio | `/tools/audio/convert` |

PDF and image work stays in the browser (`pdf-lib`, canvas, `browser-image-compression`). PDF compress is a best-effort repack: text stays selectable, and image-heavy files may not shrink. Background removal is not included.

Video and audio load `@ffmpeg/ffmpeg` and `@ffmpeg/core` from a CDN the first time you convert. If that download fails, the page shows an error and does not upload your file.

## Google AdSense

Copy the example env file and fill in your publisher id and ad slot:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT=1234567890
```

Restart the dev server after changing env vars. `AdSlot` reads these public variables. When either one is empty, the slot renders a labeled placeholder instead of calling AdSense.

The AdSense script tag is added in the root layout only when `NEXT_PUBLIC_ADSENSE_CLIENT` is set.
