# Collaborative Review Editing

## Overview
Collaborative editing enables multiple fact-checkers to work simultaneously on the same review, with real-time synchronization and conflict resolution.

## Real-Time Features

### Live Collaboration
- Multiple users editing simultaneously
- Real-time cursor positions
- Live text updates
- Instant synchronization
- Presence awareness

### User Presence
- Active user avatars
- Colored cursors
- User names display
- Activity indicators
- Typing notifications

## Collaboration Tools

### Shared Editing
- Concurrent editing
- Auto-save drafts
- Version tracking
- Change history
- Rollback capability

### Communication
- Inline comments
- @mentions
- Discussion threads
- Change annotations
- Review notes

## Conflict Resolution

### Automatic Merging
- Operational transformation
- CRDT algorithms
- Non-conflicting changes
- Smart merge strategies

### Manual Resolution
- Conflict highlighting
- Side-by-side comparison
- Accept/reject changes
- Merge assistance

## Workflow Integration

### Review Stages
- Draft collaboration
- Review editing
- Cross-checking edits
- Final approval
- Publication review

### Permissions
- Edit access control
- Read-only viewing
- Comment-only mode
- Suggestion mode

## Technical Architecture

### Synchronization
- WebSocket connections
- Yjs CRDT framework
- Delta updates
- Offline support
- Reconnection handling

### Performance
- Sub-100ms latency
- Efficient diff algorithms
- Minimal bandwidth usage
- Scalable architecture

## Features in Editor

### Formatting Tools
- Rich text editing
- Link insertion
- Source citations
- Media embedding
- Table support

### Review Elements
- Evidence blocks
- Classification selection
- Summary sections
- Source references
- Methodology notes

## Session Management

### Connection
- WebSocket establishment
- Authentication
- Session recovery
- Heartbeat monitoring

### State Sync
- Initial state load
- Incremental updates
- Checkpoint saves
- State recovery

## Technical Details
- **Framework**: Yjs for CRDT
- **Transport**: WebSocket
- **Editor**: TipTap/ProseMirror
- **Backend**: `yjs-websocket` module