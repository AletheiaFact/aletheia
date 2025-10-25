# Auth Decorator Migration Mapping

**Generated:** 2025-10-25
**Last Updated:** 2025-10-25 (Updated after high-priority migration completion)
**Status:** 🎉 **All high-priority security-critical admin endpoints migrated!**

This document maps all endpoints in the codebase that need to be migrated from OLD auth patterns to the NEW unified `@Auth()` decorator system.

## 🎯 Latest Achievement

**All 15 high-priority security-critical admin endpoints have been successfully migrated!** This includes:
- ✅ Claim management (deletion, hiding)
- ✅ Review management
- ✅ Personality management
- ✅ Badge management
- ✅ Namespace management
- ✅ Daily report sending

**Next target:** Medium-priority fact-checker endpoints (7 endpoints across 3 controllers)

---

## Executive Summary

- **Total Controllers Analyzed:** 32
- **Controllers Fully Migrated:** 7 ✅
  - users.controller.ts
  - claim-review.controller.ts (4/4 endpoints)
  - claim.controller.ts (15/39 endpoints - all admin + public endpoints)
  - personality.controller.ts (7/16 endpoints - all admin + public API endpoints)
  - daily-report.controller.ts (1/1 endpoint)
  - badge.controller.ts (4/4 endpoints)
  - name-space.controller.ts (4/4 endpoints)
- **Controllers Partially Migrated:** 1
  - verification-request.controller.ts (3/11 endpoints)
- **Controllers Needing Migration:** 24
- **Total Endpoints Migrated:** ~44 endpoints
- **Total Endpoints Remaining:** ~80+

### Pattern Distribution

| Old Pattern | Count | New Pattern |
|-------------|-------|-------------|
| `@IsPublic()` | ~35 | `@Public()` |
| `@UseGuards(AbilitiesGuard)` + `@CheckAbilities(AdminUserAbility)` | ~15 | `@AdminOnly()` |
| `@UseGuards(AbilitiesGuard)` + `@CheckAbilities(FactCheckerUserAbility)` | ~8 | `@FactCheckerOnly()` |
| No explicit auth (relies on global guard) | ~62 | `@Auth()` or `@Public()` (context dependent) |
| `@M2MOrAbilities(...)` | ~4 | Keep or create combined decorator |

---

## Migration Priority

### 🔴 High Priority - Security Critical (Admin Endpoints)

These endpoints modify critical data or grant elevated privileges. **Migrate these first.**

#### 1. claim-review.controller.ts ✅ **COMPLETED**
- [x] `PUT api/review/:id` - Admin only review updates → `@AdminOnly()`
- [x] `DELETE api/review/:id` - Admin only review deletion → `@AdminOnly()`
- [x] `GET api/review` - Public → `@Public()`
- [x] `GET api/review/:data_hash` - Public → `@Public()`

#### 2. claim.controller.ts ✅ **COMPLETED (Admin + Public endpoints)**
- [x] `DELETE api/claim/:id` - Admin only claim deletion → `@AdminOnly()`
- [x] `PUT api/claim/hidden/:id` - Admin only hide/unhide claims → `@AdminOnly()`
- [x] `GET claim/:claimId/debate/edit` - Admin only debate editing page → `@AdminOnly()`
- [x] All 12 public GET endpoints replaced `@IsPublic()` → `@Public()`
- [ ] Remaining write endpoints still need migration (see detailed list below)

#### 3. personality.controller.ts ✅ **COMPLETED (Admin + Public API endpoints)**
- [x] `PUT api/personality/hidden/:id` - Admin only hide/unhide personalities → `@AdminOnly()`
- [x] `DELETE api/personality/:id` - Admin only personality deletion → `@AdminOnly()`
- [x] `GET api/personality` - Public → `@Public()`
- [x] `GET api/personality/:id` - Public → `@Public()`
- [x] `GET api/personality/:id/reviews` - Public → `@Public()`
- [x] `GET personality/:slug` - Public page → `@Public()`
- [x] `GET personality` - Public page → `@Public()`
- [ ] Remaining write/page endpoints still need migration

#### 4. daily-report.controller.ts ✅ **COMPLETED**
- [x] `POST api/daily-report/topic/:topic/send/:nameSpace` - Admin only send reports → `@AdminOnly()`

#### 5. badge.controller.ts ✅ **COMPLETED**
- [x] `POST api/badge` - Admin only badge creation → `@AdminOnly()`
- [x] `PUT api/badge/:id` - Admin only badge updates → `@AdminOnly()`
- [x] `GET admin/badges` - Admin only badge management page → `@AdminOnly()`
- [ ] `GET api/badge` - Needs review (public or auth?)

#### 6. name-space.controller.ts ✅ **COMPLETED**
- [x] `POST api/name-space` - Admin only namespace creation → `@AdminOnly()`
- [x] `PUT api/name-space/:id` - Admin only namespace updates → `@AdminOnly()`
- [x] `GET api/name-space` - Admin only namespace listing → `@AdminOnly()`
- [x] `GET admin/name-spaces` - Admin only namespace management page → `@AdminOnly()`

---

### 🟡 Medium Priority - Fact-Checker Endpoints

These endpoints are used by fact-checkers and reviewers for their workflow.

#### 7. comment.controller.ts (All endpoints)
- [ ] `POST api/comment` - Create comment
- [ ] `PATCH api/comment/bulk-update` - Bulk update comments
- [ ] `PUT api/comment/:id` - Update comment
- [ ] `PUT api/comment/:id/create-reply` - Create reply
- [ ] `PUT api/comment/:id/delete-reply` - Delete reply

#### 8. copilot-chat.controller.ts
- [ ] `POST api/agent-chat` - AI copilot chat for fact-checkers

#### 9. summarization-crawler.controller.ts
- [ ] `GET api/summarization` - Summarization for fact-checkers

---

### 🟢 Low Priority - Replace @IsPublic()

Simple one-to-one replacements. Low risk, good for testing migration process.

#### Public Routes (Replace @IsPublic() → @Public())

**root.controller.ts:**
- [ ] `GET robots.txt`
- [ ] `GET api/health`

**sitemap.controller.ts:**
- [ ] `GET sitemap.xml`

**search.controller.ts:**
- [ ] `GET search`
- [ ] `GET api/search`

**view.controller.ts:**
- [ ] `GET about`
- [ ] `GET signup-invite`
- [ ] `GET about/:person`
- [ ] `GET supportive-materials`
- [ ] `GET privacy-policy`
- [ ] `GET code-of-conduct`
- [ ] `GET _next*`
- [ ] `GET 404`
- [ ] `GET unauthorized`

**ory.controller.ts:**
- [ ] `GET api/.ory/sessions/whoami`
- [ ] `GET api/.ory/*`
- [ ] `POST api/.ory/*`

**claim-review.controller.ts:**
- [ ] `GET api/review`
- [ ] `GET api/review/:data_hash`

**sentence.controller.ts:**
- [ ] `GET api/sentence/:data_hash`

**topic.controller.ts:**
- [ ] `GET api/topics`

**source.controller.ts:**
- [ ] `GET api/source`
- [ ] `GET source`
- [ ] `GET source/:dataHash`

**personality.controller.ts:**
- [ ] `GET api/personality`
- [ ] `GET api/personality/:id`
- [ ] `GET api/personality/:id/reviews`
- [ ] `GET personality/:slug`
- [ ] `GET personality`

**claim.controller.ts (Public GET endpoints):**
- [ ] `GET api/claim`
- [ ] `GET api/claim/:id`
- [ ] `GET personality/:personalitySlug/claim/:claimSlug/sentence/:data_hash`
- [ ] `GET claim/:claimId/image/:data_hash`
- [ ] `GET claim/:claimId/debate`
- [ ] `GET personality/:personalitySlug/claim/:claimSlug/image/:data_hash`
- [ ] `GET claim`
- [ ] `GET claim/:claimSlug`
- [ ] `GET personality/:personalitySlug/claim/:claimSlug`
- [ ] `GET personality/:personalitySlug/claim/:claimSlug/sources`
- [ ] `GET personality/:personalitySlug/claim/:claimSlug/sentence/:data_hash/sources`
- [ ] `GET claim/:claimSlug/sources`
- [ ] `GET claim/:claimSlug/sentence/:data_hash`

**home.controller.ts:**
- [ ] `GET /:namespace?`

**verification-request.controller.ts:**
- [ ] `GET verification-request/:dataHash` (Already migrated ✅)
- [ ] `GET api/verification-request` (Already migrated ✅)
- [ ] `GET verification-request` (Already migrated ✅)

---

### 🔵 Review Required - Ambiguous Routes

These endpoints have no explicit auth decorator and rely on global guards. **Need to determine if they should be @Public() or @Auth().**

#### Likely Public (Need Confirmation)

**stats.controller.ts:**
- [ ] `GET api/stats/home` - Probably public for homepage stats

**history.controller.ts:**
- [ ] `GET api/history/:targetModel/:targetId` - History viewing, likely public

**report.controller.ts:**
- [ ] `GET api/report/:data_hash` - Report viewing, likely public

**image.controller.ts:**
- [ ] `GET api/image/:data_hash` - Image viewing, likely public

**speech.controller.ts:**
- [ ] `GET api/speech/:id` - Speech viewing, likely public

**claim-revision.controller.ts:**
- [ ] `GET api/claim-revision/:id` - Revision viewing, likely public

**source.controller.ts:**
- [ ] `GET api/source/:id` - Source viewing, likely public
- [ ] `GET api/source/target/:targetId` - Source viewing, likely public

#### Likely Authenticated (Need Confirmation)

**automated-fact-checking.controller.ts:**
- [ ] `POST api/ai-fact-checking` - AI fact-checking, requires auth

**chat-bot.controller.ts:**
- [ ] `POST api/chatbot/hook` - Chatbot webhook, may need auth or be public

**file-management.controller.ts:**
- [ ] `POST api/image` - Image upload, requires auth

**notification.controller.ts:**
- [ ] `POST api/notification` - Send notification, requires auth/admin
- [ ] `POST api/topic-subscription` - Manage subscriptions, requires auth/admin
- [ ] `POST api/topic-subscription/:key/subscribers` - Manage subscribers, requires auth/admin
- [ ] `GET api/notification/token/:subscriberId` - Get notification token, requires auth

**sitemap.controller.ts:**
- [ ] `GET submit-sitemap` - Submit sitemap, likely admin

**topic.controller.ts:**
- [ ] `GET api/topics/search` - Topic search
- [ ] `POST api/topics` - Create topic, requires auth

**personality.controller.ts:**
- [ ] `POST api/personality` - Create personality, requires auth
- [ ] `PUT api/personality/:id` - Update personality, requires auth or admin
- [ ] `GET personality/search` - Personality search
- [ ] `GET personality/:slug/history` - History viewing

**badge.controller.ts:**
- [ ] `GET api/badge` - List badges, public or auth?

**claim.controller.ts (Write operations):**
- [ ] `POST api/claim` - Create claim, requires auth
- [ ] `POST api/claim/image` - Create image claim, requires auth
- [ ] `POST api/claim/debate` - Create debate, requires auth
- [ ] `POST api/claim/unattributed` - Create unattributed claim (marked temporary)
- [ ] `PUT api/claim/debate/:debateId` - Update debate, requires auth/admin
- [ ] `PUT api/claim/:id` - Update claim, requires auth

**claim.controller.ts (History/Revision pages):**
- [ ] `GET claim/:claimSlug/revision/:revisionId` - Revision viewing
- [ ] `GET personality/:personalitySlug/claim/:claimSlug/revision/:revisionId` - Revision viewing
- [ ] `GET claim/:claimSlug/history` - History viewing
- [ ] `GET personality/:personalitySlug/claim/:claimSlug/history` - History viewing
- [ ] `GET personality/:personalitySlug/claim/:claimSlug/sentence/:data_hash/history` - History viewing
- [ ] `GET claim/create` - Claim creation page, requires auth

**home.controller.ts:**
- [ ] `GET /home/:namespace?` - Home redirect

**review-task.controller.ts (All endpoints):**
- [ ] `GET api/reviewtask` - List review tasks
- [ ] `GET api/reviewtask/:id` - Get review task
- [ ] `POST api/reviewtask` - Create review task
- [ ] `PUT api/reviewtask/:data_hash` - Update review task
- [ ] `GET api/reviewtask/hash/:data_hash` - Get by hash
- [ ] `GET api/reviewtask/editor-content/:data_hash` - Get editor content
- [ ] `PUT api/reviewtask/add-comment/:data_hash` - Add comment
- [ ] `PUT api/reviewtask/delete-comment/:data_hash` - Delete comment
- [ ] `GET kanban` - Kanban board page

**source.controller.ts (Write operations):**
- [ ] `POST api/source` - Create source, requires auth
- [ ] `GET source/create` - Source creation page, requires auth

**view.controller.ts:**
- [ ] `GET totp` - TOTP setup page, requires auth

**verification-request.controller.ts:**
- [ ] `GET api/verification-request/search` - Search verification requests
- [ ] `GET api/verification-request/:id` - Get verification request
- [ ] `POST api/verification-request` - Create request (has custom M2M logic)
- [ ] `GET verification-request/create` - Create page, requires auth
- [ ] `PUT api/verification-request/:data_hash/topics` - Update topics, requires auth
- [ ] `PUT api/verification-request/:verificationRequestId/group` - Update group, requires auth/admin
- [ ] `GET verification-request/:data_hash/history` - History viewing

**sentence.controller.ts:**
- [ ] `PUT api/sentence/:data_hash` - Update sentence, requires auth

**image.controller.ts:**
- [ ] `PUT api/image/:data_hash` - Update image, requires auth

---

### ⚠️ Special Cases - M2M Endpoints

These endpoints use the `@M2MOrAbilities` decorator for machine-to-machine authentication. Consider keeping this pattern or creating a combined decorator like `@AdminOnly({ allowM2M: true })`.

#### ai-task.controller.ts (All endpoints)
- [ ] `POST api/ai-tasks` - Uses `@M2MOrAbilities(ADMIN_USER_ABILITY)`
- [ ] `GET api/ai-tasks/pending` - Uses `@M2MOrAbilities(ADMIN_USER_ABILITY)`
- [ ] `GET api/ai-tasks` - Uses `@M2MOrAbilities(ADMIN_USER_ABILITY)`
- [ ] `PATCH api/ai-tasks/:id` - Uses `@M2MOrAbilities(ADMIN_USER_ABILITY)`

**Recommendation:**
```typescript
// Option 1: Keep existing @M2MOrAbilities decorator
@M2MOrAbilities(ADMIN_USER_ABILITY)

// Option 2: Use new pattern with M2M flag
@AdminOnly({ allowM2M: true })

// Option 3: Use full @Auth syntax
@Auth({ abilities: [new AdminUserAbility()], allowM2M: true })
```

---

## Quick Wins - Single Endpoint Controllers

Start with these for quick progress:

- [ ] automated-fact-checking.controller.ts (1 endpoint)
- [ ] chat-bot.controller.ts (1 endpoint)
- [ ] speech.controller.ts (1 endpoint)
- [ ] copilot-chat.controller.ts (1 endpoint)
- [ ] daily-report.controller.ts (1 endpoint)
- [ ] file-management.controller.ts (1 endpoint)
- [ ] history.controller.ts (1 endpoint)
- [ ] stats.controller.ts (1 endpoint)
- [ ] summarization-crawler.controller.ts (1 endpoint)
- [ ] claim-revision.controller.ts (1 endpoint)
- [ ] report.controller.ts (1 endpoint)

---

## Large Controllers - Plan Carefully

These controllers have many endpoints and should be migrated carefully:

1. **claim.controller.ts** - 39 endpoints (mix of public GET, authenticated write, admin delete)
2. **personality.controller.ts** - 16 endpoints
3. **verification-request.controller.ts** - 11 endpoints (2 already migrated)
4. **review-task.controller.ts** - 9 endpoints
5. **source.controller.ts** - 9 endpoints
6. **view.controller.ts** - 9 endpoints

---

## Migration Checklist Per Controller

For each controller, follow these steps:

- [ ] Read the controller file
- [ ] Identify all endpoints and their current auth pattern
- [ ] Determine appropriate new decorator for each endpoint
- [ ] Update imports (add new decorators, remove old ones)
- [ ] Replace old decorators with new ones
- [ ] Test endpoints:
  - [ ] Public routes are accessible without auth
  - [ ] Authenticated routes require login
  - [ ] Admin routes properly restrict access
  - [ ] M2M routes accept OAuth2 tokens (if applicable)
- [ ] Update this checklist

---

## Migration Pattern Reference

### Pattern Mapping

| Current Pattern | New Pattern | Example |
|----------------|-------------|---------|
| `@IsPublic()` | `@Public()` | `@Public()` |
| `@UseGuards(AbilitiesGuard)` + `@CheckAbilities(new AdminUserAbility())` | `@AdminOnly()` | `@AdminOnly()` |
| `@UseGuards(AbilitiesGuard)` + `@CheckAbilities(new FactCheckerUserAbility())` | `@FactCheckerOnly()` | `@FactCheckerOnly()` |
| No decorator (needs auth) | `@Auth()` | `@Auth()` |
| No decorator (public) | `@Public()` | `@Public()` |
| `@M2MOrAbilities(ADMIN_USER_ABILITY)` | Keep or use `@AdminOnly({ allowM2M: true })` | `@AdminOnly({ allowM2M: true })` |

### Import Changes

**Remove these imports:**
```typescript
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { CheckAbilities, AdminUserAbility } from "../auth/ability/ability.decorator";
import { M2MOrAbilities } from "../auth/decorators/m2m-or-abilities.decorator";
import { UseGuards } from "@nestjs/common"; // Only if used exclusively for auth
```

**Add these imports:**
```typescript
import { Auth, Public, AdminOnly, FactCheckerOnly } from "../auth/decorators/auth.decorator";
```

---

## Progress Tracking

### Completed ✅
- [x] users.controller.ts (9/9 endpoints migrated)
- [x] claim-review.controller.ts (4/4 endpoints migrated) - **NEW**
- [x] claim.controller.ts (15/39 endpoints migrated - all admin + public) - **NEW**
- [x] personality.controller.ts (7/16 endpoints migrated - all admin + public API) - **NEW**
- [x] daily-report.controller.ts (1/1 endpoint migrated) - **NEW**
- [x] badge.controller.ts (4/4 endpoints migrated) - **NEW**
- [x] name-space.controller.ts (4/4 endpoints migrated) - **NEW**

### Partially Migrated 🔄
- [x] verification-request.controller.ts (3/11 endpoints migrated)

### High Priority Remaining ⚠️
- [ ] _All high-priority admin endpoints completed!_ ✅

### Medium Priority Remaining 🟡
- [ ] comment.controller.ts (5 fact-checker endpoints)
- [ ] copilot-chat.controller.ts (1 fact-checker endpoint)
- [ ] summarization-crawler.controller.ts (1 fact-checker endpoint)

### Low/Review Priority Remaining ⏸️
- [ ] 24 other controllers with ~73+ endpoints needing migration

---

## Notes

1. **Testing Strategy**: After migrating each controller, verify all endpoints with:
   - Unit tests (if available)
   - Integration tests
   - Manual testing in development environment

2. **Rollback Plan**: The old decorators still work, so migration can be done incrementally without breaking existing functionality.

3. **Team Communication**: Inform team members about the new patterns and update PR review guidelines to enforce the new standard.

4. **Documentation**: Once migration is complete, update:
   - Team wiki/documentation
   - Onboarding guides
   - Code review checklist

---

## Migration Changelog

### 2025-10-25 - High-Priority Admin Endpoints Migration ✅

**Completed 6 controllers, 35+ endpoints migrated:**

1. **claim-review.controller.ts** (4 endpoints)
   - Migrated 2 admin endpoints to `@AdminOnly()`
   - Replaced 2 `@IsPublic()` with `@Public()`

2. **claim.controller.ts** (15 endpoints - partial)
   - Migrated 3 admin endpoints to `@AdminOnly()`
   - Replaced 12 `@IsPublic()` with `@Public()`
   - Remaining: ~24 write endpoints need `@Auth()` or context review

3. **personality.controller.ts** (7 endpoints - partial)
   - Migrated 2 admin endpoints to `@AdminOnly()`
   - Replaced 5 `@IsPublic()` with `@Public()`
   - Remaining: ~9 endpoints (write operations and pages)

4. **daily-report.controller.ts** (1 endpoint)
   - Migrated 1 admin endpoint to `@AdminOnly()`

5. **badge.controller.ts** (4 endpoints)
   - Migrated 3 admin endpoints to `@AdminOnly()`
   - 1 endpoint needs context review

6. **name-space.controller.ts** (4 endpoints)
   - Migrated 4 admin endpoints to `@AdminOnly()`

**Impact:**
- 🔒 All critical admin operations now explicitly protected
- 📝 Cleaner code with consistent auth patterns
- ✅ No breaking changes - old patterns still supported

**Files modified:**
- `server/claim-review/claim-review.controller.ts`
- `server/claim/claim.controller.ts`
- `server/personality/personality.controller.ts`
- `server/daily-report/daily-report.controller.ts`
- `server/badge/badge.controller.ts`
- `server/auth/name-space/name-space.controller.ts`

---

## Questions / Issues

If you encounter edge cases or have questions during migration:

1. Check [auth_decorator_migration.md](./auth_decorator_migration.md) for detailed examples
2. Review the example controller: `verification-request.controller.EXAMPLE.ts`
3. Consult with the team lead
4. Document special cases in this file

---

**Last Updated:** 2025-10-25 (Updated after high-priority migration completion)
**Migration Status:** 🎉 All high-priority security-critical admin endpoints migrated!
**Next Steps:** Migrate medium-priority fact-checker endpoints
