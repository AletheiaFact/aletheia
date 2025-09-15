# Registration Invite System

## Overview
The Registration Invite System provides a controlled onboarding mechanism for new users, ensuring proper validation and authorization before granting platform access.

## Purpose
- Control user registration flow
- Validate user eligibility
- Provide clear onboarding messaging
- Integrate with existing authentication system

## Key Features

### Signup Invite Page
- **Route**: `/signup-invite`
- **Purpose**: Landing page for users who need registration approval
- **Components**:
  - Clear messaging about registration requirements
  - CTA button for requesting platform access
  - Localized content (PT/EN support)

### Session Validation
- **Enhanced Session Guard**: Validates MongoDB user existence
- **Automatic Redirection**: Routes invalid users to signup invite page
- **Graceful Logout**: Handles session cleanup for invalid users
- **Error Logging**: Comprehensive logging for debugging

### User Validation Flow
1. User attempts to access protected route
2. Session guard checks Ory Kratos session
3. Validates MongoDB user record exists
4. If user not found:
   - Initiates logout flow
   - Redirects to `/signup-invite`
   - Logs error for admin review

## Technical Implementation

### Backend Components
- **Session Guard**: `server/auth/session.guard.ts`
  - User validation logic
  - Logout flow handling
  - Redirect coordination

### Frontend Components
- **Registration Invite Page**: `src/pages/signup-invite.tsx`
- **Registration Invite Component**: `src/components/RegistrationInvite/RegistrationInvitePage.tsx`
  - Uses Material-UI Box components
  - Implements CTAButton component
  - Supports i18n translations

### API Integration
- Integrates with Ory Kratos for session management
- Uses UsersService for MongoDB validation
- Implements proper error handling

## User Experience

### For New Users
1. Receive invitation or referral link
2. Attempt platform access
3. Redirected to signup invite page
4. View registration requirements
5. Request access through CTA

### For Invalid Sessions
1. System detects invalid user record
2. Automatic logout initiated
3. Redirect to signup invite page
4. Clear messaging about next steps

## Configuration
- Requires proper Ory Kratos setup
- MongoDB user records must be synchronized
- Localization files must include signup invite translations

## Security Considerations
- Prevents access for users without valid MongoDB records
- Ensures data consistency between Ory Kratos and MongoDB
- Implements proper session cleanup
- Logs all validation failures for audit

## Related Features
- [Session Management](./session-management.md)
- [Login System](./login-system.md)
- [User Profiles](./user-profiles.md)