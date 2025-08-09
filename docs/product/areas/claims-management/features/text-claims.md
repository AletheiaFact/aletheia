# Text Claims

## Overview
Text claims are the foundation of fact-checking, supporting both sentence-level and paragraph-level textual content that needs verification.

## Types

### Sentence Claims
- Single statement extraction
- Direct quotes from public figures
- Social media posts
- Headlines and titles

### Paragraph Claims
- Multi-sentence statements
- Context-preserving claims
- Article excerpts
- Press release segments

## Features

### Text Processing
- Automatic text extraction
- Language detection (PT/EN)
- Quote attribution
- Context preservation

### Formatting Support
- Rich text formatting
- Hyperlink preservation
- Emphasis markers
- Citation references

### Metadata
- Original source tracking
- Publication date
- Author attribution
- Word count statistics

## Use Cases
- Political statements
- News article claims
- Social media posts
- Academic assertions
- Corporate announcements

## Technical Details
- **Modules**: `sentence.module.ts`, `paragraph.module.ts`
- **Components**: `ClaimSentence.tsx`, `ClaimParagraph.tsx`
- **Max Length**: 5000 characters
- **Supported Languages**: Portuguese, English