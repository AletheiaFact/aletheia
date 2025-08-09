# Collaborative Editing Platform

## Overview
The Collaborative Editing Platform enables real-time collaboration between fact-checkers, allowing multiple users to work simultaneously on reviews with live updates and shared context.

## Purpose
- Enable team-based fact-checking
- Provide real-time collaboration
- Maintain consistency across edits
- Track contributor changes
- Facilitate communication

## Key Capabilities
- Real-time synchronization
- Multi-cursor support
- Conflict resolution
- Version tracking
- Presence awareness

## Features

### Editor Features
- [Visual Editor](./features/visual-editor.md) - Rich text editing interface
- [Real-time Sync](./features/real-time-sync.md) - WebSocket synchronization
- [Multi-cursor](./features/multi-cursor.md) - See other users' cursors
- [Presence System](./features/presence-system.md) - Active user tracking

### Collaboration Tools
- [Comment Threads](./features/comment-threads.md) - Inline discussions
- [Change Tracking](./features/change-tracking.md) - Edit history
- [Mention System](./features/mention-system.md) - User notifications
- [Live Preview](./features/live-preview.md) - Real-time preview

### Content Cards
- [Question Cards](./features/question-cards.md) - Investigation tracking
- [Report Cards](./features/report-cards.md) - Finding documentation
- [Summary Cards](./features/summary-cards.md) - Key insights
- [Verification Cards](./features/verification-cards.md) - Evidence cards

## Collaboration Workflow

### Session Management
1. Create or join editing session
2. Establish WebSocket connection
3. Sync initial document state
4. Enable presence tracking
5. Begin collaborative editing

### Conflict Resolution
- Operational Transformation (OT)
- Automatic merge strategies
- Conflict highlighting
- Manual resolution options

## Technical Architecture

### Core Technologies
- **Editor**: TipTap (ProseMirror-based)
- **Sync Protocol**: Yjs CRDT
- **Transport**: WebSocket
- **Presence**: Yjs Awareness

### Performance
- Sub-100ms latency
- Automatic reconnection
- Offline capability
- Delta synchronization

## Integration Points
- Review System for fact-checking workflow
- User Management for permissions
- Source Management for references
- Comment System for discussions

## Technical Implementation
- **Backend**: `server/yjs-websocket/`, `server/editor/`
- **Frontend**: `src/components/Collaborative/`
- **Editor Config**: `getEditorConfig.tsx`
- **WebSocket**: `createWebsocketConnection.ts`