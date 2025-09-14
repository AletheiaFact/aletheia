# Umami Analytics Tracking

## Overview
Enhanced analytics tracking implementation using Umami v2 for privacy-focused, GDPR-compliant user behavior analytics across the platform.

## Purpose
- Track user interactions and engagement
- Measure feature adoption and usage
- Provide insights for product decisions
- Maintain user privacy compliance

## Implementation

### About Page Tracking
Comprehensive event tracking added to all About page sections for better understanding of visitor engagement.

#### Tracked Events

##### Awards Section
- **Event**: `about-awards-learn-wsis`
  - **Category**: `external_link`
  - **Trigger**: Learn about WSIS button click
  
- **Event**: `about-awards-view-nomination`
  - **Category**: `external_link`
  - **Trigger**: View nomination button click

##### Hero Section
- **Event**: `about-hero-access-platform`
  - **Category**: `navigation`
  - **Trigger**: Access platform CTA click
  
- **Event**: `about-hero-download-manual`
  - **Category**: `download`
  - **Trigger**: Download manual button click

##### Final CTA Section
- **Event**: `about-final-cta-access-platform`
  - **Category**: `navigation`
  - **Trigger**: Platform access button click
  
- **Event**: `about-final-cta-get-training`
  - **Category**: `contact`
  - **Trigger**: Training request button click

##### Impact Section
- **Event**: `about-impact-download-reports`
  - **Category**: `download`
  - **Trigger**: Download reports button click

##### Partners Section
- **Event**: `about-partners-propose-collaboration`
  - **Category**: `contact`
  - **Trigger**: Propose collaboration button click

##### Resources Section
- **Event**: `about-download-methodology`
  - **Category**: `download`
  - **Trigger**: Methodology PDF download
  
- **Event**: `about-download-toolkit`
  - **Category**: `download`
  - **Trigger**: Toolkit download
  
- **Event**: `about-access-docs`
  - **Category**: `navigation`
  - **Trigger**: Documentation access

## Technical Implementation

### Frontend Integration
- **Utility Function**: `trackUmamiEvent(eventName, category)`
- **Location**: `src/lib/umami.ts`
- **Implementation Pattern**:
```javascript
onClick={() => trackUmamiEvent("event-name", "category")}
```

### Event Categories
- **navigation**: Internal navigation events
- **download**: File download actions
- **external_link**: External site navigation
- **contact**: Contact or communication actions

### Component Integration
All About page components enhanced with tracking:
- `AwardsSection.tsx`
- `FinalCTASection.tsx`
- `HeroSection.tsx`
- `ImpactSection.tsx`
- `PartnersSection.tsx`
- `ResourcesSection.tsx`

## Configuration

### Environment Setup
```env
NEXT_PUBLIC_UMAMI_SITE_ID=your-site-id
NEXT_PUBLIC_UMAMI_URL=your-umami-instance
```

### Umami Dashboard
- Custom events appear in Umami dashboard
- Filter by event name or category
- Track conversion funnels
- Monitor engagement metrics

## Analytics Insights

### Key Metrics
- **Engagement Rate**: Track CTA effectiveness
- **Download Conversions**: Measure resource interest
- **Navigation Patterns**: Understand user journey
- **External Link Clicks**: Monitor outbound traffic

### Reporting Capabilities
- Event frequency analysis
- User flow visualization
- Conversion tracking
- A/B testing support

## Privacy Compliance
- No personally identifiable information collected
- Cookie-free tracking
- GDPR compliant
- User privacy respected

## Best Practices

### Event Naming
- Use descriptive, hierarchical names
- Include section context
- Maintain consistency across pages
- Use lowercase with hyphens

### Category Usage
- Group related events logically
- Use standard categories
- Enable cross-page analysis
- Support filtering needs

### Implementation Guidelines
- Add tracking to significant user actions
- Avoid over-tracking minor interactions
- Test events in development
- Document new events

## Monitoring and Maintenance

### Regular Reviews
- Monthly event audit
- Unused event cleanup
- Performance impact check
- Privacy compliance review

### Performance Considerations
- Minimal JavaScript overhead
- Asynchronous event sending
- No blocking operations
- Graceful failure handling

## Related Features
- [Admin Dashboard](../../administrative-tools/features/admin-dashboard.md)
- [Performance Metrics](../../administrative-tools/features/performance-metrics.md)
- [User Activity Tracking](../features/activity-tracking.md)