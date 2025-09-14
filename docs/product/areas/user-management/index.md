# User Management System

## Overview
The User Management System handles all aspects of user authentication, authorization, profiles, and access control. It integrates with Ory Kratos for identity management and implements role-based access control.

## Purpose
- Secure user authentication
- Granular authorization control
- User profile management
- Organization/namespace support
- Activity tracking and metrics

## Key Capabilities
- Multi-factor authentication
- Role-based access control (RBAC)
- Enhanced session management with user validation
- Organization namespaces with advanced filtering
- User analytics with Umami event tracking
- Registration invite system for controlled onboarding

## Features

### Authentication
- [Login System](./features/login-system.md) - Email/password authentication
- [Two-Factor Auth](./features/two-factor-auth.md) - TOTP support
- [Session Management](./features/session-management.md) - Enhanced secure sessions with MongoDB user validation
- [Password Recovery](./features/password-recovery.md) - Reset flows
- [Registration Invite](./features/registration-invite.md) - Controlled user onboarding system

### Authorization
- [Role Management](./features/role-management.md) - User roles and permissions
- [CASL Integration](./features/casl-integration.md) - Ability-based access
- [Namespace System](./features/namespace-system.md) - Enhanced organization support with user filtering
- [API Authentication](./features/api-authentication.md) - M2M auth

### User Features
- [User Profiles](./features/user-profiles.md) - Profile management
- [User Dashboard](./features/user-dashboard.md) - Personal workspace
- [Activity Tracking](./features/activity-tracking.md) - User metrics
- [Achievements](./features/achievements.md) - Badges and gamification

## User Roles

### Standard Roles
- **Admin** - Full system access
- **Moderator** - Content moderation
- **Reviewer** - Fact-checking privileges
- **Contributor** - Basic contribution
- **User** - Standard access

### Permissions Matrix
- Content creation
- Review assignment
- Publication approval
- User management
- System configuration

## Integration Points
- Ory Kratos for identity management
- Review System for role-based access
- Notification System for user communications
- Analytics for user metrics

## Technical Implementation
- **Backend Module**: `server/users/`, `server/auth/`
- **Frontend Components**: `src/components/Login/`, `src/components/Profile/`
- **Authentication**: Ory Kratos integration
- **Authorization**: CASL ability system
- **Database**: users collection