# Claims Management System

## Overview
The Claims Management System is the central hub for managing and processing fact-checkable claims from various sources. It provides comprehensive tools for importing, organizing, and tracking claims throughout their lifecycle.

## Purpose
- Centralize all fact-checkable content in one manageable system
- Support multiple content formats and sources
- Maintain claim history and relationships
- Enable efficient claim processing workflows

## Key Capabilities
- Multi-format claim support (text, image, speech, debate)
- Automated claim import and parsing
- Claim attribution to public figures
- Version control and revision tracking
- Duplicate detection and merging

## Features

### Claim Types
- [Text Claims](./features/text-claims.md) - Sentences and paragraphs
- [Image Claims](./features/image-claims.md) - Visual content analysis
- [Speech Claims](./features/speech-claims.md) - Transcript-based claims
- [Debate Claims](./features/debate-claims.md) - Multi-party discussions
- [Unattributed Claims](./features/unattributed-claims.md) - Anonymous content

### Claim Management
- [Claim Creation](./features/claim-creation.md) - Manual and automated import
- [Claim Organization](./features/claim-organization.md) - Categorization and tagging
- [Revision History](./features/revision-history.md) - Version tracking
- [Duplicate Detection](./features/duplicate-detection.md) - Similarity analysis
- [Claim Status Workflow](./features/claim-status-workflow.md) - Lifecycle management

## Integration Points
- Personality Management for attribution
- Source Management for references
- Review System for fact-checking
- Search System for discovery
- AI Assistance for analysis

## Technical Implementation
- **Backend Module**: `server/claim/`
- **Frontend Components**: `src/components/Claim/`
- **Database Collections**: claims, claim_revisions
- **API Endpoints**: `/api/claim/*`