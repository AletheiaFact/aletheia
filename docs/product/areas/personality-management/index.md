# Personality Management System

## Overview
The Personality Management System tracks and analyzes public figures, organizations, and entities whose statements are fact-checked on the platform. It integrates with Wikidata for comprehensive entity data.

## Purpose
- Track public figure statements
- Analyze credibility patterns
- Maintain entity profiles
- Connect claims to sources
- Provide historical context

## Key Capabilities
- Wikidata integration
- Statement tracking
- Credibility scoring
- Relationship mapping
- Historical analysis

## Features

### Profile Management
- [Personality Profiles](./features/personality-profiles.md) - Entity information
- [Wikidata Integration](./features/wikidata-integration.md) - External data sync
- [Biography Management](./features/biography-management.md) - Background info
- [Social Media Tracking](./features/social-media-tracking.md) - Online presence

### Analytics
- [Credibility Scoring](./features/credibility-scoring.md) - Accuracy metrics
- [Statement History](./features/statement-history.md) - Claim tracking
- [Topic Analysis](./features/topic-analysis.md) - Subject patterns
- [Trend Detection](./features/trend-detection.md) - Pattern recognition

### Discovery
- [Personality Search](./features/personality-search.md) - Find entities
- [Personality Cards](./features/personality-cards.md) - Profile display
- [Relationship Mapping](./features/relationship-mapping.md) - Entity connections

## Entity Types

### Supported Categories
- Politicians
- Journalists
- Organizations
- Celebrities
- Experts
- Institutions

### Profile Components
- Basic information
- Photo/avatar
- Biography
- Social links
- Claim history
- Credibility metrics

## Data Sources

### Wikidata Fields
- Name variations
- Birth/death dates
- Occupations
- Nationality
- Education
- Positions held

### Platform Data
- Claim count
- Review history
- Accuracy rate
- Topic distribution
- Recent activity

## Integration Points
- Claims Management for statement attribution
- Review System for fact-check results
- Search System for discovery
- Analytics for metrics

## Technical Implementation
- **Backend Module**: `server/personality/`, `server/wikidata/`
- **Frontend Components**: `src/components/Personality/`
- **Database**: personalities collection
- **External API**: Wikidata SPARQL endpoint