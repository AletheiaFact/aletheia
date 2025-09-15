# Session Management

## Overview
The Session Management system handles user authentication sessions, ensuring secure access control and proper session lifecycle management with enhanced validation between Ory Kratos and MongoDB.

## Purpose
- Manage user authentication sessions
- Validate session integrity
- Ensure data consistency between identity and database layers
- Handle session lifecycle events
- Provide secure session storage

## Key Features

### Enhanced Session Validation
- **Dual-Layer Validation**: Checks both Ory Kratos identity and MongoDB user record
- **Automatic Cleanup**: Initiates logout for invalid sessions
- **Graceful Redirection**: Routes users appropriately based on session state
- **Comprehensive Logging**: Detailed error tracking for debugging

### Session Guard Implementation
The SessionGuard class provides:
- Ory Kratos session validation
- MongoDB user existence verification
- Affiliation checking for multi-tenant support
- Automatic logout flow handling
- Context-aware redirection

## Technical Implementation

### Backend Components

#### Session Guard
- **File**: `server/auth/session.guard.ts`
- **Dependencies**:
  - Ory Client SDK for session validation
  - UsersService for MongoDB validation
  - ConfigService for environment configuration
  - Reflector for metadata handling

#### Key Methods

##### `canActivate(context: ExecutionContext)`
Main validation flow:
1. Check if route is public
2. Validate Ory Kratos session
3. Verify MongoDB user exists
4. Check affiliation matches
5. Set request user object
6. Handle redirects as needed

##### `logoutUser(ory: FrontendApi, request: any)`
Graceful logout implementation:
```typescript
private async logoutUser(ory: FrontendApi, request: any): Promise<void> {
    try {
        const { data } = await ory.createBrowserLogoutFlow({
            cookie: request.header("Cookie"),
        });
        await ory.updateLogoutFlow({
            cookie: request.header("Cookie"),
            token: data.logout_token,
        });
    } catch (e) {
        this.logger.error("Error during logout flow", e);
    }
}
```

### Validation Flow

#### Step 1: Ory Kratos Validation
```typescript
const { data: session } = await ory.toSession({
    cookie: request.header("Cookie"),
});
```

#### Step 2: MongoDB User Validation
```typescript
const mongoUserId = session?.identity?.traits?.user_id;
try {
    await this.usersService.getById(mongoUserId);
} catch (e) {
    this.logger.error(`User not found for ID: ${mongoUserId}`);
    await this.logoutUser(ory, request);
    return this.checkAndRedirect(request, response, isPublic, "/signup-invite");
}
```

#### Step 3: Affiliation Validation
```typescript
const expectedAffiliation = this.configService.get<string>("app_affiliation");
const appAffiliation = session?.identity?.traits?.affiliation;
if (expectedAffiliation && appAffiliation !== expectedAffiliation) {
    await this.logoutUser(ory, request);
    return this.checkAndRedirect(request, response, isPublic, "/unauthorized");
}
```

### Request User Object
After successful validation, sets user context:
```typescript
request.user = {
    isM2M: false,
    _id: session?.identity?.traits?.user_id,
    name: session?.identity?.traits?.name,
    affiliation: session?.identity?.traits?.affiliation,
    role: session?.identity?.traits?.role,
    status: session?.identity.state,
};
```

## Session Lifecycle

### Session Creation
1. User successfully authenticates via Ory Kratos
2. Session cookie set in browser
3. User record linked to identity

### Session Validation
1. Each request triggers session guard
2. Validates against Ory Kratos
3. Confirms MongoDB user exists
4. Checks affiliation matches
5. Proceeds or redirects accordingly

### Session Termination
1. User logout initiated
2. Ory logout flow created
3. Session tokens invalidated
4. Browser cookies cleared
5. Redirect to appropriate page

## Error Handling

### User Not Found
- **Scenario**: Ory session valid but MongoDB user missing
- **Action**: Logout and redirect to `/signup-invite`
- **Logging**: Error logged with user ID

### Affiliation Mismatch
- **Scenario**: User from different organization
- **Action**: Logout and redirect to `/unauthorized`
- **Logging**: Mismatch details logged

### Session Invalid
- **Scenario**: No valid Ory session
- **Action**: Redirect to login or allow public access
- **Logging**: Standard authentication flow

## Configuration

### Environment Variables
- `app_affiliation`: Expected organization identifier
- `override_public_routes`: Special handling for regular users
- Ory SDK configuration parameters

### Integration Points
- **Ory Kratos**: Identity and session management
- **MongoDB**: User data persistence
- **ConfigService**: Environment configuration
- **Logger**: Error and audit logging

## Security Considerations
- Session cookies are httpOnly and secure
- Regular session validation on each request
- Automatic cleanup of orphaned sessions
- Protection against session fixation
- Multi-layer validation approach

## Performance Optimizations
- Cached user lookups where appropriate
- Efficient database queries
- Minimal session validation overhead
- Graceful error handling

## Related Features
- [Login System](./login-system.md)
- [Registration Invite](./registration-invite.md)
- [Two-Factor Auth](./two-factor-auth.md)
- [API Authentication](./api-authentication.md)