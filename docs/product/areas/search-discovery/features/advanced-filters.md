# Advanced Filters

## Overview
Advanced Filters enable users to refine search results using multiple criteria, making it easy to find specific content within large result sets.

## Filter Categories

### Content Type Filters
- **Claims** - All claim types
- **Reviews** - Completed fact-checks
- **Personalities** - Public figures
- **Sources** - Reference materials
- **Topics** - Subject categories

### Date Range Filters
- **Today** - Last 24 hours
- **This Week** - Last 7 days
- **This Month** - Last 30 days
- **This Year** - Current year
- **Custom Range** - User-defined dates
- **Specific Date** - Exact date match

### Status Filters
- **Published** - Public content
- **Under Review** - In progress
- **Draft** - Unpublished
- **Archived** - Historical
- **Pending** - Awaiting action

### Classification Filters
- **True** - Verified accurate
- **False** - Verified inaccurate
- **Misleading** - Partially true
- **Unverifiable** - Cannot verify
- **Mixed** - Multiple ratings

## Advanced Options

### Language Filters
- Portuguese (PT)
- English (EN)
- Multi-language
- Auto-detected

### Source Filters
- News media
- Social media
- Government
- Academic
- User-submitted

### Author Filters
- Specific reviewer
- Verified reviewers
- Organization
- Community

## Filter Combinations

### Boolean Logic
- **AND** - All conditions must match
- **OR** - Any condition matches
- **NOT** - Exclude matches
- **Nested** - Complex combinations

### Saved Filters
- Save filter combinations
- Name custom filters
- Share with team
- Set as default
- Quick access menu

## User Interface

### Filter Panel
- Expandable sections
- Checkbox selections
- Range sliders
- Date pickers
- Search within filters

### Active Filters
- Filter chips display
- Quick removal
- Clear all option
- Filter count badge

### Mobile Filters
- Bottom sheet design
- Touch-optimized
- Simplified options
- Swipe gestures

## Performance

### Optimization
- Index-based filtering
- Cached filter results
- Progressive loading
- Facet counting

### Real-time Updates
- Instant result refresh
- Result count preview
- No-results handling
- Suggestion engine

## Filter Persistence

### Session Storage
- Maintain during session
- Browser refresh safe
- Tab synchronization
- History support

### User Preferences
- Default filters
- Recent filters
- Favorite filters
- Filter history

## Technical Implementation
- **Component**: `AdvancedSearch.tsx`
- **Component**: `ActiveFilters.tsx`
- **State Management**: Filter state in URL
- **API**: Query parameter based