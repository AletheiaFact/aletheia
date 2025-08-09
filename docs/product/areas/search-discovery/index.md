# Search & Discovery System

## Overview
The Search & Discovery System provides advanced search capabilities across all platform content, enabling users to quickly find claims, reviews, sources, and personalities using powerful filtering and ranking algorithms.

## Purpose
- Enable fast content discovery
- Support complex search queries
- Provide relevant results
- Facilitate research
- Improve navigation

## Key Capabilities
- Full-text search
- Advanced filtering
- Autocomplete suggestions
- Federated search
- Result ranking

## Features

### Search Functionality
- [Full-Text Search](./features/full-text-search.md) - MongoDB Atlas Search
- [Advanced Filters](./features/advanced-filters.md) - Multi-criteria filtering
- [Autocomplete](./features/autocomplete.md) - Search suggestions
- [Search Analytics](./features/search-analytics.md) - Usage tracking

### Search Interfaces
- [Overlay Search](./features/overlay-search.md) - Quick search overlay
- [Search Page](./features/search-page.md) - Full search experience
- [Inline Search](./features/inline-search.md) - Contextual search
- [Mobile Search](./features/mobile-search.md) - Mobile-optimized

### Result Features
- [Result Ranking](./features/result-ranking.md) - Relevance scoring
- [Result Highlighting](./features/result-highlighting.md) - Match highlighting
- [Result Grouping](./features/result-grouping.md) - Category organization
- [Saved Searches](./features/saved-searches.md) - Search persistence

## Search Capabilities

### Content Types
- Claims (all types)
- Claim reviews
- Personalities
- Sources
- Topics
- Users

### Search Operators
- Exact phrase matching
- Boolean operators (AND, OR, NOT)
- Wildcard searches
- Proximity searches
- Field-specific searches

### Filters
- Date ranges
- Status filters
- Category filters
- Language filters
- Author filters
- Rating filters

## Technical Architecture

### Search Engine
- **Database**: MongoDB Atlas Search
- **Indexing**: Automatic index updates
- **Analyzers**: Language-specific analyzers
- **Scoring**: TF-IDF and BM25

### Performance
- Sub-second response times
- Result caching
- Query optimization
- Pagination support

## Integration Points
- Claims Management for content
- Review System for fact-checks
- User Management for permissions
- Analytics for search metrics

## Technical Implementation
- **Backend Module**: `server/search/`
- **Frontend Components**: `src/components/Search/`
- **Controller**: `search.controller.ts`
- **API**: `/api/search/*`