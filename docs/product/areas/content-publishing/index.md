# Content Publishing System

## Overview
The Content Publishing System manages the publication, distribution, and optimization of fact-checked content, ensuring maximum reach and impact.

## Purpose
- Publish verified fact-checks
- Optimize content for discovery
- Enable social sharing
- Support SEO
- Track engagement

## Key Capabilities
- Multi-format publishing
- SEO optimization
- Social media integration
- Content versioning
- Distribution tracking

## Features

### Publishing
- [Publication Workflow](./features/publication-workflow.md) - Publishing process
- [Content Formats](./features/content-formats.md) - Output types
- [Version Control](./features/version-control.md) - Content versioning
- [Embargo System](./features/embargo-system.md) - Scheduled publishing

### SEO & Discovery
- [SEO Optimization](./features/seo-optimization.md) - Search engine optimization
- [JSON-LD Markup](./features/json-ld-markup.md) - Structured data
- [Sitemap Generation](./features/sitemap-generation.md) - XML sitemaps
- [Meta Tags](./features/meta-tags.md) - Social and SEO tags

### Distribution
- [Social Sharing](./features/social-sharing.md) - Platform sharing
- [RSS Feeds](./features/rss-feeds.md) - Content syndication
- [API Access](./features/api-access.md) - Programmatic access
- [Embed Codes](./features/embed-codes.md) - Widget embedding

## Content Types

### Published Formats
- Claim reviews
- Sentence reports
- Image fact-checks
- Debate analyses
- Summary reports

### Output Formats
- Web pages
- JSON-LD
- RSS/Atom
- Social cards
- API responses

## SEO Features

### Optimization
- Title optimization
- Meta descriptions
- Canonical URLs
- Schema markup
- Open Graph tags

### Performance
- Page speed optimization
- Image optimization
- Lazy loading
- CDN integration

## Social Integration

### Platforms
- Twitter/X
- Facebook
- WhatsApp
- LinkedIn
- Telegram

### Features
- Share buttons
- Social cards
- Preview optimization
- Click tracking

## Integration Points
- Review System for content
- SEO tools for optimization
- Analytics for tracking
- CDN for distribution

## Technical Implementation
- **Backend Modules**: Various publishing services
- **Frontend Components**: `src/components/SocialMediaShare.tsx`
- **SEO**: `Seo.tsx`, `JsonLd.tsx`
- **Sitemap**: `sitemap.module.ts`