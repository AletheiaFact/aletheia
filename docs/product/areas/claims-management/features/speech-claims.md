# Speech Claims

## Overview
Speech claims capture and analyze spoken statements from public figures, including speeches, interviews, and public addresses.

## Features

### Transcript Management
- Full speech transcription
- Timestamp synchronization
- Speaker identification
- Paragraph segmentation

### Speech Metadata
- Event information
- Date and location
- Audience details
- Recording source

### Content Structure
- Introduction section
- Body paragraphs
- Conclusion section
- Q&A segments

## Processing Capabilities

### Import Methods
- Manual transcript entry
- Audio file processing
- Video transcript extraction
- API imports

### Analysis Tools
- Key phrase extraction
- Topic identification
- Sentiment analysis
- Fact-checkable statement detection

## Use Cases
- Political speeches
- Press conferences
- Public debates
- Corporate presentations
- Academic lectures

## Review Features
- Claim extraction from speeches
- Context preservation
- Timeline navigation
- Source video/audio linking

## Technical Details
- **Module**: `speech.module.ts`
- **Controller**: `speech.controller.ts`
- **Component**: `ClaimSpeechBody.tsx`
- **Database**: Speech collection with transcript storage