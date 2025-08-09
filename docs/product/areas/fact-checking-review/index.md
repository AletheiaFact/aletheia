# Fact-Checking Review System

## Overview
The Fact-Checking Review System provides a comprehensive workflow for analyzing, verifying, and publishing fact-checks. It supports multi-stage reviews, collaborative editing, and quality assurance processes.

## Purpose
- Ensure thorough and accurate fact-checking
- Enable collaborative review processes
- Maintain quality standards
- Track review progress and metrics
- Publish verified fact-checks

## Key Capabilities
- Multi-stage review workflow
- Real-time collaborative editing
- Evidence management
- Cross-checking mechanisms
- Automated quality checks

## Features

### Review Workflow
- [Review Tasks](./features/review-tasks.md) - Task assignment and management
- [Review Stages](./features/review-stages.md) - Multi-stage workflow
- [Classification System](./features/classification-system.md) - Truth ratings
- [Cross-Checking](./features/cross-checking.md) - Quality assurance

### Collaboration
- [Collaborative Editing](./features/collaborative-editing.md) - Real-time review editing
- [Comments System](./features/comments-system.md) - Reviewer discussions
- [Draft Management](./features/draft-management.md) - Auto-save and versioning

### Evidence & Reporting
- [Evidence Collection](./features/evidence-collection.md) - Source management
- [Review Reports](./features/review-reports.md) - Detailed fact-check reports
- [Summary Generation](./features/summary-generation.md) - Key findings

## Workflow Stages
1. **Assignment** - Task distribution to reviewers
2. **Research** - Evidence gathering and analysis
3. **Review** - Fact-checking and classification
4. **Cross-Check** - Quality assurance review
5. **Publication** - Final approval and publishing

## Integration Points
- Claims Management for source content
- Source Management for evidence
- User Management for reviewer assignment
- AI Assistance for research support
- Publishing System for distribution

## Technical Implementation
- **Backend Module**: `server/claim-review/`, `server/review-task/`
- **Frontend Components**: `src/components/ClaimReview/`
- **State Management**: XState for workflow states
- **Real-time**: WebSocket with Yjs for collaboration