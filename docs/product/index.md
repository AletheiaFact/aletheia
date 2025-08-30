# Aletheia Platform - Product Documentation

## Overview
Aletheia is a comprehensive crowd-sourced fact-checking platform designed to analyze public figure statements and combat misinformation. The platform combines advanced collaborative tools, AI assistance, and structured workflows to enable effective fact-checking at scale.

## Product Areas

### Core Fact-Checking
- [Claims Management](./areas/claims-management/index.md) - Central hub for managing fact-checkable claims
- [Fact-Checking Review](./areas/fact-checking-review/index.md) - Comprehensive review workflow system
- [Verification Requests](./areas/verification-requests/index.md) - Public submission and tracking system

### Content & Personalities
- [Personality Management](./areas/personality-management/index.md) - Public figure tracking and analysis
- [Source Management](./areas/source-management/index.md) - Evidence and reference repository
- [Content Publishing](./areas/content-publishing/index.md) - Content management and distribution

### Collaboration & AI
- [AI Assistance](./areas/ai-assistance/index.md) - AI-powered fact-checking tools
- [Collaborative Editing](./areas/collaborative-editing/index.md) - Real-time team collaboration
- [Community Features](./areas/community-features/index.md) - Social and engagement features

### User & Administration
- [User Management](./areas/user-management/index.md) - Authentication and authorization
- [Administrative Tools](./areas/administrative-tools/index.md) - Platform administration
- [Analytics & Reporting](./areas/analytics-reporting/index.md) - Insights and metrics

### Platform Infrastructure
- [Search & Discovery](./areas/search-discovery/index.md) - Advanced search capabilities
- [Communications](./areas/communications/index.md) - Notifications and messaging
- [File Management](./areas/file-management/index.md) - Media and document handling
- [Integrations](./areas/integrations/index.md) - External service connections
- [Mobile Experience](./areas/mobile-experience/index.md) - Cross-device accessibility
- [Chatbot System](./areas/chatbot-system/index.md) - Automated assistance

## Technical Architecture

### Backend
- **Framework**: NestJS (Node.js 20.18.0+)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Ory Kratos with enhanced session validation
- **Real-time**: WebSocket with Yjs

### Frontend
- **Framework**: Next.js with React
- **UI Library**: Material-UI
- **State Management**: Jotai, XState
- **Styling**: Styled-components
- **Analytics**: Umami v2 with enhanced event tracking

### Infrastructure
- **Containerization**: Docker
- **Monitoring**: New Relic
- **Analytics**: Umami v2
- **Testing**: Jest, Cypress
- **Package Management**: Yarn with workspace tools plugin