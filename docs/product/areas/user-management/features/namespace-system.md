# Namespace System

## Overview
The Namespace System provides organization-level isolation and management capabilities, allowing multiple groups to use the platform with separated data and permissions.

## Purpose
- Enable multi-tenancy support
- Provide organizational boundaries
- Manage user access per namespace
- Support role-based permissions within namespaces

## Key Features

### Enhanced API Endpoints
- **GET `/api/name-space`**: List all namespaces
- **GET `/api/name-space?userId={userId}`**: Filter namespaces by user
- **PUT `/api/name-space/{id}`**: Update namespace configuration
- **POST `/api/name-space`**: Create new namespace

### User Filtering
- Query namespaces by specific user ID
- Returns all namespaces where user is a member
- Supports MongoDB ObjectId validation
- Efficient database queries with proper indexing

### Admin Management Interface
Enhanced user edit form capabilities:
- **Namespace Assignment**: Add/remove users from namespaces
- **Role Synchronization**: Automatic role updates across namespaces
- **Visual Management**: Autocomplete interface for namespace selection
- **Bulk Operations**: Handle multiple namespace changes simultaneously

## Technical Implementation

### Backend Components

#### Controller
- **File**: `server/auth/name-space/name-space.controller.ts`
- **New Endpoint**: `findAllOrFiltered` method
  - Supports optional userId query parameter
  - Returns filtered or complete namespace list
  - Protected by admin abilities

#### Service
- **File**: `server/auth/name-space/name-space.service.ts`
- **New Method**: `findByUser(userId: string)`
  - Queries namespaces containing specific user
  - Uses MongoDB ObjectId for proper matching
  - Returns populated namespace documents

### Frontend Components

#### User Edit Form
- **File**: `src/components/adminArea/Drawer/UserEditForm.tsx`
- **Features**:
  - Namespace selection autocomplete
  - Dynamic loading of available namespaces
  - Synchronization of user-namespace relationships
  - Role management per namespace

#### API Client
- **File**: `src/api/namespace.ts`
- **Methods**:
  - `getAllNameSpaces()`: Fetch all namespaces
  - `getNameSpacesById(userId)`: Get user's namespaces
  - `updateNameSpace(data)`: Update namespace configuration

## Data Model

### Namespace Schema
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  users: [ObjectId], // User references
  settings: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### User-Namespace Relationship
- Users can belong to multiple namespaces
- Each namespace maintains a user list
- Roles are namespace-specific
- Synchronization ensures consistency

## Admin Workflows

### Adding User to Namespace
1. Admin opens user edit form
2. Selects namespaces from autocomplete
3. System validates selections
4. Updates namespace user lists
5. Synchronizes role assignments
6. Saves changes to database

### Removing User from Namespace
1. Admin deselects namespace in edit form
2. System identifies removed namespaces
3. Filters user from namespace user lists
4. Removes namespace-specific roles
5. Updates database records

### Bulk Namespace Management
- Select multiple namespaces simultaneously
- Apply changes in single operation
- Automatic conflict resolution
- Transaction-like behavior for consistency

## API Usage Examples

### Filter Namespaces by User
```http
GET /api/name-space?userId=507f1f77bcf86cd799439011
```

Response:
```json
[
  {
    "_id": "namespace1",
    "name": "Organization A",
    "slug": "org-a",
    "users": ["507f1f77bcf86cd799439011", "..."]
  }
]
```

### Update Namespace Users
```http
PUT /api/name-space/namespace1
{
  "users": ["user1", "user2", "user3"]
}
```

## Security Considerations
- Admin-only access for namespace management
- Validated ObjectId parameters
- Proper authorization checks
- Audit logging for changes

## Performance Optimizations
- Indexed queries for user filtering
- Efficient bulk operations
- Cached namespace lookups
- Optimized population strategies

## Related Features
- [Role Management](./role-management.md)
- [User Management](../administrative-tools/features/user-management.md)
- [CASL Integration](./casl-integration.md)