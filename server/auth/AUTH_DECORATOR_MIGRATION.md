# Auth Decorator Migration Guide

## Problem Statement

The codebase had **3 different patterns** for achieving authentication/authorization:

1. **Pattern 1** (Most common - 20+ usages):
   ```typescript
   @UseGuards(AbilitiesGuard)
   @CheckAbilities(new AdminUserAbility())
   ```

2. **Pattern 2** (Rarely used - 4 usages):
   ```typescript
   @M2MOrAbilities(new AdminUserAbility())
   ```

3. **Pattern 3** (Public routes):
   ```typescript
   @IsPublic()
   ```

### Issues:
- ❌ Inconsistent patterns across controllers
- ❌ Pattern 1 doesn't support M2M auth (but Pattern 2 does)
- ❌ Verbose and repetitive code
- ❌ Easy to forget combining decorators correctly
- ❌ No clear standard for the team

## Solution: Unified `@Auth()` Decorator

A single, flexible decorator that handles all authentication and authorization scenarios.

### Location
`server/auth/decorators/auth.decorator.ts`

---

## Migration Examples

### 1. Public Routes

**Before:**
```typescript
@IsPublic()
@Get("verification-request")
public async verificationRequestPage() {}
```

**After:**
```typescript
@Public()  // or @Auth({ public: true })
@Get("verification-request")
public async verificationRequestPage() {}
```

---

### 2. Admin-Only Routes (Session Auth)

**Before:**
```typescript
@UseGuards(AbilitiesGuard)
@CheckAbilities(new AdminUserAbility())
@Put("api/verification-request/:id")
async updateVerificationRequest() {}
```

**After:**
```typescript
@AdminOnly()  // or @Auth({ abilities: [new AdminUserAbility()] })
@Put("api/verification-request/:id")
async updateVerificationRequest() {}
```

---

### 3. Admin-Only with M2M Support

**Before:**
```typescript
@M2MOrAbilities(ADMIN_USER_ABILITY)
@Post("api/ai-task")
async createAITask() {}
```

**After:**
```typescript
@AdminOnly({ allowM2M: true })
// or @Auth({ abilities: [new AdminUserAbility()], allowM2M: true })
@Post("api/ai-task")
async createAITask() {}
```

---

### 4. Fact-Checker Routes

**Before:**
```typescript
@UseGuards(AbilitiesGuard)
@CheckAbilities(new FactCheckerUserAbility())
@Post("api/comment")
async createComment() {}
```

**After:**
```typescript
@FactCheckerOnly()
// or @Auth({ abilities: [new FactCheckerUserAbility()] })
@Post("api/comment")
async createComment() {}
```

---

### 5. Authenticated Routes (Any User)

**Before:**
```typescript
// No decorator - relies on global SessionGuard
@Get("api/verification-request")
public async listAll() {}
```

**After:**
```typescript
@Auth()  // Explicit is better than implicit!
@Get("api/verification-request")
public async listAll() {}
```

---

### 6. Multiple Abilities (Advanced)

**Before:**
```typescript
@UseGuards(AbilitiesGuard)
@CheckAbilities(
    new FactCheckerUserAbility(),
    new AdminUserAbility()
)
@Post("api/special-action")
async specialAction() {}
```

**After:**
```typescript
@Auth({
    abilities: [
        new FactCheckerUserAbility(),
        new AdminUserAbility()
    ]
})
@Post("api/special-action")
async specialAction() {}
```

---

## Available Shortcuts

### `@Public()`
For publicly accessible routes (no authentication)

### `@AdminOnly(options?)`
For admin-only routes
- `@AdminOnly()` - Session auth only
- `@AdminOnly({ allowM2M: true })` - Session or M2M auth

### `@FactCheckerOnly()`
For fact-checker and reviewer roles

### `@RegularUserOnly()`
For regular users (read-only access)

---

## Full `@Auth()` Options

```typescript
interface AuthOptions {
    /**
     * Make this route publicly accessible
     * @default false
     */
    public?: boolean;

    /**
     * Required abilities for this endpoint
     * Empty array = only authentication required
     */
    abilities?: RequiredRule[];

    /**
     * Allow M2M authentication in addition to session
     * @default false when abilities specified
     * @default true when no abilities (just auth)
     */
    allowM2M?: boolean;
}
```

---

## Decision Tree

```
Is the route public?
├─ YES → @Public()
└─ NO → Does it require specific abilities?
    ├─ YES → Is it admin-only?
    │   ├─ YES → Does it need M2M support?
    │   │   ├─ YES → @AdminOnly({ allowM2M: true })
    │   │   └─ NO  → @AdminOnly()
    │   └─ NO → Is it fact-checker?
    │       ├─ YES → @FactCheckerOnly()
    │       └─ NO  → @Auth({ abilities: [...] })
    └─ NO → Just needs authentication?
        └─ YES → @Auth()
```

---

## Migration Steps

### Step 1: Import the new decorator
```typescript
// Add to your controller imports
import { Auth, Public, AdminOnly, FactCheckerOnly } from "../auth/decorators/auth.decorator";
```

### Step 2: Remove old imports
```typescript
// REMOVE these:
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { CheckAbilities, AdminUserAbility } from "../auth/ability/ability.decorator";
import { M2MOrAbilities } from "../auth/decorators/m2m-or-abilities.decorator";
import { UseGuards } from "@nestjs/common";
```

### Step 3: Replace decorators using the examples above

### Step 4: Test your endpoints
- Verify public routes are still accessible
- Verify authenticated routes require login
- Verify admin routes properly restrict access
- Verify M2M routes accept OAuth2 tokens (if applicable)

---

## Benefits

✅ **Consistency**: One pattern for all auth/authz scenarios
✅ **Clarity**: Explicit and self-documenting
✅ **Flexibility**: Supports all current and future auth patterns
✅ **Type Safety**: Proper TypeScript types
✅ **Maintainability**: Easier to update auth logic in one place
✅ **Less Code**: Fewer lines, cleaner controllers
✅ **M2M Support**: Easy to enable when needed

---

## Example Controller (Full Before/After)

See `verification-request.controller.EXAMPLE.ts` for a complete migrated controller example.

---

## FAQ

**Q: Do I need to migrate everything at once?**
A: No! The old decorators still work. Migrate controllers gradually.

**Q: What about custom ability checks?**
A: Use the full `@Auth()` syntax:
```typescript
@Auth({
    abilities: [{ action: Action.Custom, subject: CustomEntity }]
})
```

**Q: Can I still use `@UseGuards()` directly?**
A: Yes, but it's discouraged for auth. Use `@Auth()` for consistency.

**Q: Does this change the guard behavior?**
A: No! It uses the exact same guards under the hood, just with a cleaner API.

**Q: What about the global SessionGuard?**
A: It still applies. `@Public()` routes bypass it, others go through it.

---

## Rollout Plan

1. ✅ Create unified `@Auth()` decorator
2. ✅ Create migration guide (this document)
3. ✅ Migrate one controller as example
4. ⏳ Review and test thoroughly
5. ⏳ Gradually migrate other controllers
6. ⏳ Update team documentation
7. ⏳ Deprecate old patterns in code reviews

---

## Questions or Issues?

If you encounter any issues during migration or have questions about the new pattern, please:
1. Check this guide first
2. Review the example controller
3. Ask the team for clarification
