# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aletheia is a crowd-sourced fact-checking platform for analyzing public figure statements and combating fake news. The application uses a hybrid architecture with:
- **Backend**: NestJS (Node.js framework) with MongoDB
- **Frontend**: Next.js with React and Material-UI
- **Authentication**: Ory Kratos
- **Real-time**: WebSocket support for collaborative editing

## Essential Commands

### Development
```bash
# Install dependencies
yarn install

# Start development server (runs both backend and frontend)
yarn dev

# Run tests
yarn test

# Run specific test file
yarn test path/to/test.spec.ts

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Type checking (important to run before commits)
yarn build-ts
```

### Building
```bash
# Full production build
yarn build

# Individual build steps
yarn build-ts      # TypeScript compilation
yarn build-nest    # NestJS backend build
yarn build-next    # Next.js frontend build
```

### Database Operations
```bash
# Seed database with initial data
yarn seed

# Create new migration
yarn migrate:create <migration-name>

# Run migrations
yarn migrate

# Check migration status
yarn migrate:status
```

### Testing
```bash
# Run all tests
yarn test

# Run e2e tests
yarn test:e2e:cy

# Open Cypress for interactive testing
yarn cypress-open
```

## Architecture Overview

### Backend Structure (server/)
The backend uses NestJS with a modular architecture:

- **Core Modules**:
  - `claim/` - Handles fact-checking claims and different content types (debates, images, speeches)
  - `claim-review/` - Manages reviews and fact-checking processes
  - `personality/` - Public figures and personalities management
  - `users/` - User management and profiles
  - `auth/` - Authentication with Ory Kratos integration, including guards and abilities
  - `review-task/` - Task management for review workflows
  - `notifications/` - Notification system using Novu

- **Supporting Modules**:
  - `source/` - Source and reference management
  - `stats/` - Analytics and statistics
  - `search/` - Search functionality with MongoDB Atlas Search
  - `file-management/` - AWS S3 integration for file storage
  - `editor/` - Collaborative editing features
  - `copilot/` - AI assistant integration

### Frontend Structure (src/)
The frontend uses Next.js with React:

- **Core Components**:
  - `components/Claim/` - Claim display and creation components
  - `components/ClaimReview/` - Review interface components
  - `components/Personality/` - Personality profiles and cards
  - `components/Collaborative/` - Real-time collaborative editing
  - `components/Copilot/` - AI assistant UI

- **State Management**:
  - Uses Jotai for atomic state management
  - XState for complex state machines (review workflows)

- **API Layer** (`api/`):
  - Centralized API calls for all backend endpoints
  - Consistent error handling and type safety

### Database Schema
- MongoDB with Mongoose ODM
- Soft delete support
- Atlas Search indexes for advanced search functionality
- Key collections: claims, claimreviews, users, personalities, sources

### Authentication Flow
- Ory Kratos for identity management
- Session-based authentication
- Role-based access control (RBAC) with CASL
- Support for TOTP 2FA

## Key Technical Considerations

1. **TypeScript**: The project uses TypeScript but with `strict: false`. Be cautious about type safety.

2. **Internationalization**: Full i18n support with next-i18next (pt/en locales)

3. **Real-time Features**: WebSocket integration for collaborative editing using Yjs

4. **File Uploads**: AWS S3 integration (can use LocalStack for local development)

5. **Feature Flags**: GitLab feature flag integration for controlled rollouts

6. **Monitoring**: New Relic integration for production monitoring

7. **Email**: Nodemailer for transactional emails with Handlebars templates

8. **Analytics**: Umami v2 for privacy-focused analytics (configured via NEXT_PUBLIC_UMAMI_SITE_ID)

## Development Setup Prerequisites

1. MongoDB running (via Docker or local)
2. Ory Kratos configured and running
3. AWS credentials or LocalStack for file uploads
4. Environment variables configured (see config.example.yaml)

## Common Patterns

1. **API Routes**: Follow RESTful conventions with NestJS decorators
2. **Component Structure**: Functional components with hooks, styled-components for styling
3. **Testing**: Jest for unit tests, Cypress for e2e tests
4. **Error Handling**: Centralized error filters in NestJS
5. **Validation**: class-validator DTOs for request validation

## Important Files

- `config.yaml` - Main configuration file (copy from config.example.yaml)
- `migrate-mongo-config.ts` - Database migration configuration
- `.env` - Environment variables for frontend
- `server/app.module.ts` - Main backend module registration
- `src/pages/_app.tsx` - Next.js app initialization
- don't import things from the dist folder