# Image Claims

## Overview
Image claims handle visual content that requires fact-checking, including manipulated images, misleading contexts, and false visual information.

## Capabilities

### Image Analysis
- Visual content extraction
- Text extraction from images (OCR)
- Metadata analysis
- Reverse image search support

### Supported Formats
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

## Features

### Upload & Storage
- Direct image upload
- URL-based import
- AWS S3 storage
- Thumbnail generation
- Compression optimization

### Image Processing
- Resolution analysis
- EXIF data extraction
- Modification detection
- Hash generation for duplicates

### Annotation Tools
- Region marking
- Text overlay
- Comparison views
- Before/after displays

## Use Cases
- Doctored images
- Misleading photo contexts
- Fake screenshots
- Manipulated infographics
- Meme fact-checking

## Review Features
- Side-by-side comparison
- Overlay analysis
- Metadata inspection
- Source tracking

## Technical Details
- **Module**: `image.module.ts`
- **Controller**: `image.controller.ts`
- **Component**: `ImageClaim.tsx`
- **Storage**: AWS S3 or LocalStack
- **Max Size**: 10MB per image