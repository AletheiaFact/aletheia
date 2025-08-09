# Verification Request System

## Overview
The Verification Request System enables the public to submit fact-checking requests, which are then prioritized, assigned, and tracked through the verification process.

## Purpose
- Accept public fact-check requests
- Prioritize verification needs
- Track request status
- Engage community
- Provide transparency

## Key Capabilities
- Public submission portal
- Request prioritization
- Duplicate detection
- Progress tracking
- Result notification

## Features

### Request Management
- [Request Submission](./features/request-submission.md) - Public submission form
- [Request Validation](./features/request-validation.md) - Quality checks
- [Priority Scoring](./features/priority-scoring.md) - Importance ranking
- [Group Requests](./features/group-requests.md) - Batch management

### Workflow
- [Request Queue](./features/request-queue.md) - Processing pipeline
- [Assignment System](./features/assignment-system.md) - Reviewer allocation
- [Status Tracking](./features/status-tracking.md) - Progress monitoring
- [Result Publication](./features/result-publication.md) - Outcome sharing

### Discovery
- [Request Search](./features/request-search.md) - Find requests
- [Recommendations](./features/recommendations.md) - Similar requests
- [Request Filters](./features/request-filters.md) - Advanced filtering

## Request Lifecycle

### Stages
1. **Submission** - Public request creation
2. **Validation** - Quality and duplicate check
3. **Prioritization** - Importance scoring
4. **Assignment** - Reviewer allocation
5. **Verification** - Fact-checking process
6. **Publication** - Result sharing

### Status Types
- Pending review
- Under verification
- Additional info needed
- Verified
- Rejected
- Duplicate

## Prioritization Factors

### Scoring Criteria
- Public interest level
- Potential impact
- Timeliness
- Source credibility
- Request quality

### Priority Levels
- Critical
- High
- Medium
- Low
- Deferred

## User Engagement

### Requester Features
- Submit requests
- Track status
- Receive notifications
- View results
- Provide feedback

### Community Features
- Vote on requests
- Add supporting info
- Report duplicates
- Share results

## Integration Points
- Claims Management for processing
- Review System for verification
- User Management for access
- Notifications for updates

## Technical Implementation
- **Backend Module**: `server/verification-request/`
- **Frontend Components**: `src/components/VerificationRequest/`
- **Database**: verification_requests collection
- **API**: `/api/verification-request/*`