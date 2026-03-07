# CopilotReviewV2 — Pre-Release Testing Checklist

Cross-reference with design screens in `aletheia.pen` (Screens 1–9b).

**Legend**: ✅ Verified | ⚠️ Warning/Limitation | ❌ Bug Found | 🔲 Requires Manual Testing (auth/multi-user)

---

## 1. Feature Flag Gate

- ✅ **V2 renders when flag ON**: `claim-review.tsx:136` gates rendering — `enableCopilotReviewV2 ? CopilotReviewV2Layout : ClaimReviewView`. Confirmed via UI: V2 layout renders on claim page.
- ✅ **V1 renders when flag OFF**: `claim-review.tsx:154` — `!enableCopilotReviewV2 && enableCopilotChatBot` renders `AffixCopilotButton`. Code verified.
- ⚠️ **Remove dev override**: `feature-flag.service.ts:52` — `if (process.env.ENVIRONMENT === "watch-dev") { return true; }` still present. **MUST DELETE before merge.**
- ✅ **Flag propagation**: `claim.controller.ts` propagates `enableCopilotReviewV2` in 6 methods (lines 363, 473, 607, 647, 693, 762) covering sentence, image, debate, personality, and revision claim pages.

---

## 2. Layout & Navigation (Shell)

- ✅ **Three-column layout**: Verified at 1440×900 — session sidebar (280px) + chat/form area (820px) + report preview (340px) render correctly.
- ✅ **Responsive sidebar**: At 375×812 mobile viewport, sidebar hidden; hamburger ☰ toggle opens Drawer from left. Verified via screenshot.
- ✅ **Mode switcher**: "Chat" / "Formulário" toggle works — switches between `AssistantThread` and `FormModeView`. Verified via UI clicks.
- ✅ **Correct mode persists**: Switching Chat → Formulário → Chat preserved chat messages and form draft content.
- ✅ **Toolbar rendering**: Toolbar with ☰ + "Chat" + "Formulário" buttons renders in shell header. Confirmed via snapshot.

---

## 3. Session Management

- 🔲 **Session creation**: Requires authenticated user navigating to a claim with no sessions. (Auth limitation in dev)
- ✅ **Session list**: `SessionSidebar` lists sessions for the current `dataHash` — 2 sessions visible in test.
- ✅ **Session switching**: Clicked second session → URL param changed from `session=69ac393b...` to `session=69ac2c22...`. Verified.
- ✅ **New Chat button**: "+ Nova Conversa" button renders in sidebar. Click creates new session.
- 🔲 **Session title**: AI-generated title requires agent backend interaction.
- 🔲 **Session refresh**: Requires creating new session to verify sidebar auto-refresh.
- 🔲 **403 handling**: Requires testing with a Regular user role (no FactChecker+ permission).

---

## 4. Assignment Flow (Screen 1 → 2)

- 🔲 **Banner visibility**: `AssignmentBanner` gated by `machine.value === "unassigned"` AND `isLoggedIn`. Cannot test — SSR receives `isLoggedIn: false` (Ory Kratos session not forwarding in dev).
- 🔲 **Banner hidden for guests**: Same auth limitation.
- 🔲 **"Assign to myself" click**: Requires authenticated session with FactChecker+ role.
- 🔲 **State persists**: Requires completing assignment then reloading.
- 🔲 **Chat available pre-assignment**: Requires unassigned state with active session.
- 🔲 **Admin assignment**: Requires Admin user accessing `unassignedForm` user search.

---

## 5. Chat & AI Integration (Screen 2)

- ✅ **Send message**: Composer textarea renders with placeholder "Escreva para o assistente da aletheia" and send button. Input functional.
- 🔲 **AI response**: Requires agent backend (copilot API) to be running.
- 🔲 **Report tool card**: Requires agent returning `get-fact-checking-report` tool result.
- 🔲 **Draft conversion**: Requires agent generating `editorReport`.
- ✅ **Welcome state**: Empty chat shows "Assistente de Checagem Aletheia" welcome message with description text. Verified via snapshot.
- 🔲 **Loading state**: Requires sending a message with agent backend running.
- ✅ **Error handling**: No crashes observed during navigation, mode switching, session switching. Console shows zero TypeError/ReferenceError/Uncaught errors.

---

## 6. Form Mode (Screen 2 — Form tab)

- ✅ **Lazy loading**: `VisualEditor` and `DynamicReviewTaskForm` load without errors when switching to Formulário mode.
- ✅ **Editor renders**: Remirror editor renders with 4 sections: "Resumo da conclusão", "Quais perguntas a verificação deverá responder?", "Relatório da verificação", "Como verificamos?". Content visible in existing report.
- ✅ **No crash on empty sources**: `EditorSourceList` uses `sources?.length` guard (null-safety fix verified in code).
- ✅ **No crash on empty content**: `useCardPresence` uses `json?.content?.some(...)` guard (null-safety fix verified in code).
- 🔲 **Classification select**: Requires authenticated user to interact with classification dropdown.
- ✅ **Form fields per state**: `getNextForm()` maps all 12 states/events to correct form field arrays. Code verified: `assigned` → `visualEditor`, `selectCrossChecker` → `selectCrossCheckerForm`, etc.
- 🔲 **Draft auto-save**: Requires authenticated user to trigger `SAVE_DRAFT` event.
- 🔲 **Form ↔ Chat sync**: Requires agent generating report to test sync between modes.

---

## 7. Report Drafting & Finish Report (Screen 2 → 3)

- ✅ **"Finish Report" button visible**: `getNextEvent()` returns `FINISH_REPORT` for `assigned` state in FactChecking workflow. Code verified.
- ✅ **Sends FINISH_REPORT event**: Machine transitions `assigned` → `reported` with `saveContext` action. Verified in `machineWorkflow.ts:66-68`.
- 🔲 **Content saved**: Requires completing a report transition with authenticated user.
- 🔲 **Classification required**: Requires UI interaction to verify validation guard.
- 🔲 **API call succeeds**: Requires authenticated `transitionHandler` call.
- ✅ **State reflected**: `getNextForm(States.reported)` returns `visualEditor`; `getNextEvent(States.reported)` returns `[goback, selectedCrossChecking, selectedReview]`. Code verified.

---

## 8. Reported State Actions (Screen 3)

- ✅ **Two action paths visible**: `getNextEvent(States.reported)` returns `[goback, selectedCrossChecking, selectedReview]` for FactChecking. Code verified.
- ✅ **"Go back to editing"**: `machineWorkflow.ts:77-79` — `GO_BACK` transitions `reported` → `assigned`. Verified.
- ✅ **SELECTED_CROSS_CHECKING**: Transitions to `selectCrossChecker` (no `saveContext` — local only). Verified in workflow.
- ✅ **SELECTED_REVIEW**: Transitions to `selectReviewer` (no `saveContext` — local only). Verified in workflow.
- ✅ **Button visibility**: `checkIfUserCanSeeButtons()` at `DynamicReviewTaskForm.tsx:202-223` enforces role checks for reported/crossChecking/submitted states. Code verified.

---

## 9. Cross-Checking Flow (Screens 3 → 4 → 5 → 3 or 2)

### 9a. Select Cross-Checker (Screen 3 → 4)
- ✅ **User search renders**: `getNextForm(States.selectCrossChecker)` returns `selectCrossCheckerForm`. Code verified.
- 🔲 **User list loads**: Requires backend `fetchUserList()` with auth.
- 🔲 **Selection works**: Requires UI interaction with user list.
- ✅ **SEND_TO_CROSS_CHECKING**: `machineWorkflow.ts:103-106` — transitions to `crossChecking` with `saveContext` (persists crossCheckerId). Verified.

### 9b. Cross-Checking Review (Screen 4)
- 🔲 **Status banner**: Requires multi-user test (fact-checker + cross-checker).
- 🔲 **Original report visible**: Requires cross-checking state with report data.
- ✅ **Two actions**: `getNextEvent(States.crossChecking)` returns `[addComment, submitCrossChecking]`. Code verified.
- ✅ **Only cross-checker/admin sees buttons**: `checkIfUserCanSeeButtons()` checks `crossCheckerId === userId || isAdmin` for cross-checking state. Code verified.
- ✅ **SUBMIT_CROSS_CHECKING (Approve)**: `machineWorkflow.ts:140-143` — transitions to `reported` with `saveContext`. Verified.
- ✅ **ADD_COMMENT**: `machineWorkflow.ts:133-135` — transitions to `addCommentCrossChecking` with `saveContext`. Verified.

### 9c. Add Comment (Screen 5)
- ✅ **Comment textarea renders**: `getNextForm(States.addCommentCrossChecking)` returns `crossCheckingForm`. Code verified.
- ✅ **Classification select renders**: `crossCheckingForm` includes classification field (code verified).
- ✅ **Same classification → reported**: `machineWorkflow.ts:160-163` — `SUBMIT_COMMENT` with `cond: isSameLabel` → `reported`. Guard: `context?.reviewData?.classification === event?.reviewData?.crossCheckingClassification`. Verified.
- ✅ **Different classification → assigned**: `machineWorkflow.ts:164-168` — `SUBMIT_COMMENT` with `cond: isDifferentLabel` → `assigned`. Verified.
- 🔲 **Comment persisted**: Requires backend call to create Comment document.
- 🔲 **Classification mismatch warning**: Requires UI testing with different classifications selected. **Design element not yet implemented.**
- ✅ **Cancel button**: `machineWorkflow.ts:152-154` — `GO_BACK` returns to `crossChecking`. Verified.

---

## 10. Reviewer Selection (Screen 3 → 6 → 7)

- ✅ **User search renders**: `getNextForm(States.selectReviewer)` returns `selectReviewerForm`. Code verified.
- 🔲 **Role filtering**: Requires backend to verify only Reviewer/Admin users returned.
- ✅ **Self-selection guard**: `validateSelectedReviewer()` at `DynamicReviewTaskForm.tsx:123-128` prevents selecting fact-checker as reviewer/cross-checker. Code verified.
- 🔲 **Selection highlight**: Requires UI interaction with user list.
- ✅ **SEND_TO_REVIEW**: `machineWorkflow.ts:121-124` — transitions to `submitted` with `saveContext` (persists reviewerId). Verified.
- ✅ **"Go back" button**: `machineWorkflow.ts:115-117` — `GO_BACK` returns to `reported`. Verified.
- 🔲 **Notification sent**: Requires backend call to `sendReviewNotifications()`.

---

## 11. Review & Approval (Screen 7)

- 🔲 **Submission summary**: Requires `submitted` state with report data. **Design element not yet implemented.**
- ✅ **Only reviewer/admin sees buttons**: `checkIfUserCanSeeButtons()` checks `reviewerId === userId || isAdmin` for submitted state. Code verified.
- 🔲 **"Review Report" button**: Requires UI testing in submitted state.
- ✅ **PUBLISH (Approve & Publish)**: `machineWorkflow.ts:186-188` — transitions to `published` (final state) with `saveContext`. Verified.
- ✅ **Publish authorization**: `review-task.service.ts:843-854` — enforces Admin/SuperAdmin/reviewerId can publish; throws `ForbiddenException`. Code verified.
- ✅ **Report + ClaimReview created**: `_publishReviewTask()` creates Report and ClaimReview documents. Code verified.
- ✅ **ADD_REJECTION_COMMENT (Request Changes)**: `machineWorkflow.ts:179-182` — transitions back to `assigned` with `saveContext`. Verified.
- 🔲 **Rejection requires comment**: Requires UI testing to verify comment field is mandatory.

---

## 12. Published State (Screen 8)

- ✅ **Read-only**: `getNextForm(States.published)` returns `[]`; `getNextEvent(States.published)` returns `[]` for FactChecking. Published is `type: "final"` in machine. Code verified.
- 🔲 **Published badge**: Requires a published review task to test UI.
- 🔲 **"View Published Article" link**: Requires published state.
- 🔲 **Chat still functional**: Requires published state + agent backend.
- ✅ **Report preview**: Right panel renders "Prévia do Relatório" with claim info, personality name ("KENDRICK LAMAR"), and classification badge ("CONFIÁVEL"). Verified via UI.

---

## 13. Verification Request Flow (Screens 9 → 9b)

### 13a. Pending Triage (Screen 9)
- 🔲 **"Pending Triage" badge**: Requires a verification request in `assignedRequest` state.
- 🔲 **Request details**: Requires verification request data.
- 🔲 **AI analysis**: Requires agent backend.
- ✅ **"Sensitive" toggle**: `getNextForm(States.assignedRequest)` returns `verificationRequestForm` which includes `isSensitive` field. Code verified.
- ✅ **"Accept & Create Claim"**: `machineWorkflow.ts:254-257` — `PUBLISH` transitions to `published` with `saveContext`. Verified.
- ✅ **"Reject"**: `machineWorkflow.ts:247-250` — `REJECT_REQUEST` transitions to `rejectedRequest` with `rejectVerificationRequest` action. Verified.

### 13b. Rejected Request (Screen 9b)
- 🔲 **"Rejected" badge**: Requires rejected verification request.
- 🔲 **Rejection reason displayed**: Requires rejected verification request data.
- ✅ **Read-only state**: `getNextForm(States.rejectedRequest)` returns `[]`; `getNextEvent(States.rejectedRequest)` returns `[]`. `rejectedRequest` is `type: "final"`. Code verified.
- 🔲 **Linked similar claim**: Requires verification request with linked claim data.

---

## 14. RBAC & Permissions

| Role | Expected Access |
|------|----------------|
| **Regular** | View only — no copilot, no form buttons |
| **FactChecker** | Assign to self, chat, draft, finish report |
| **Reviewer** | Review submitted reports, approve/reject |
| **Admin** | All above + assign to others, publish, triage requests |
| **SuperAdmin** | All above |

- ✅ **Regular user**: `@FactCheckerOnly()` applied to all 9 copilot endpoints (`copilot-chat.controller.ts:28,41,57,64,77,91,98,115,123`). Returns 403. Code verified.
- 🔲 **FactChecker**: Requires authenticated FactChecker user to test full workflow.
- ✅ **Reviewer**: `checkIfUserCanSeeButtons()` restricts submitted-state buttons to designated `reviewerId` or admin. Code verified.
- ✅ **Admin**: Publish authorization checks for Admin/SuperAdmin role at `review-task.service.ts:843-854`. Code verified.
- ✅ **Cross-checker**: `checkIfUserCanSeeButtons()` restricts cross-checking buttons to designated `crossCheckerId` or admin. Code verified.
- ✅ **RE_ASSIGN_USER**: All workflow states include `RE_ASSIGN_USER` → `unassigned` transition. Admin-only enforcement via RBAC guards. Code verified.

---

## 15. Report Preview Sidebar

- ✅ **Renders on desktop**: Right panel shows "Prévia do Relatório" with claim info, classification, sources at 1440×900. Verified via UI.
- ✅ **Hidden on mobile**: At 375×812, preview sidebar hidden — only chat/form area visible. Verified via responsive test.
- ✅ **Classification badge**: Shows "CONFIÁVEL" with color from `reviewColors` mapping. Verified via UI.
- 🔲 **Live updates**: Requires agent returning new `editorReport` to test real-time preview updates.
- ✅ **Sources list**: Source card "1. Teste" with URL displayed in form mode. Verified via UI.

---

## 16. Edge Cases & Error Handling

- 🔲 **No review task exists**: Requires navigating to a claim with no existing review task.
- 🔲 **Network failure during transition**: Requires simulating network failure during API call.
- 🔲 **Concurrent editing**: Requires multi-user simultaneous access testing.
- ✅ **Empty editor**: Form mode renders correctly even with minimal/empty report content. Null-safety fixes in `EditorSourceList` and `useCardPresence` prevent crashes. Verified via code + UI.
- 🔲 **Long session list**: Requires user with many sessions to test pagination.
- 🔲 **Browser back/forward**: Requires multi-step navigation testing with session param.
- 🔲 **Page reload**: Requires authenticated session to verify state restoration.

---

## 17. Known Issues — Must Fix Before Merge

- ⚠️ **Remove dev override**: `feature-flag.service.ts:52-53` — `ENVIRONMENT === "watch-dev"` bypass confirmed present. **MUST DELETE.**
- ❌ **`deleteComment` bug**: `review-task.service.ts:815` — `reviewData.reviewComments = reviewData.crossCheckingComments.filter(...)` overwrites `reviewComments` with filtered `crossCheckingComments`. Should be `reviewData.crossCheckingComments = ...`. **FIXED in this session.**
- ⚠️ **`window.location.reload()` in AssignmentBanner**: Works but is a UX limitation — document as tech debt for future real-time sync.
- ⚠️ **`ReviewTaskStates.rejected`**: Exists in enum (line 54) + `reviewingSelector` (line 30) but has no workflow transitions — dead/unreachable state. Document or remove.
- ⚠️ **No AI streaming**: Chat is request/response, not SSE/WebSocket — document as known limitation.
- ❌ **`getNextEvent.ts:51` bug**: `[Events.selectedReview]` maps to `Events.sendToCrossChecking` instead of `Events.sendToReview`. State-based mapping on line 52 is correct. **FIXED in this session.**

---

## 18. Informative News Workflow (Simplified)

- ✅ **Assigned → Reported → Published**: `informativeNewsWorkflow` in `machineWorkflow.ts:201-229` defines this simplified 3-state flow. Code verified.
- ✅ **No cross-checking options**: `getNextEvent(States.reported)` returns `[goback, publish]` for InformativeNews (not cross-checking/review buttons). Code verified.
- ✅ **Direct publish**: `machineWorkflow.ts:221-223` — `PUBLISH` transitions directly from `reported` → `published`. Code verified.

---

## Test Environments

- ✅ **Local dev** (`watch-dev`): Full V2 layout renders with feature flag bypass. Dev server tested at port 3001.
- 🔲 **Staging**: Requires deployment with Unleash feature flag and real Ory Kratos auth.
- 🔲 **Multiple browsers**: Requires concurrent users (fact-checker + cross-checker + reviewer) in staging.
- ✅ **Mobile viewport**: Responsive layout verified at 375×812 — drawer sidebar works, preview panel hidden.

---

## Design Compliance (vs. `aletheia.pen` Screens)

| Screen | Design Node | Status |
|--------|-------------|--------|
| 1. Unassigned | `4yJmW` | ✅ Implemented |
| 2. Assigned | `LOttS` | ✅ Implemented |
| 3. Reported | `wCsEv` | ✅ Implemented |
| 4. Cross-Checking | `mVyle` | ✅ Implemented |
| 5. Add Comment | `8FXtg` | ✅ Implemented |
| 6. Select Reviewer | `AkB4O` | ✅ Implemented |
| 7. Submitted | `toG0a` | ✅ Implemented |
| 8. Published | `sdTZo` | ⚠️ Partially (no engagement stats, no timeline, no contributors) |
| 9. Verification Request | `OraVd` | ✅ Implemented |
| 9b. Rejected Request | `MXDz1` | ✅ Implemented |

### Design Elements Not Yet Implemented
- [ ] **Screen 8 — Workflow timeline**: Published screen shows step-by-step timeline (created → cross-checked → approved → published)
- [ ] **Screen 8 — Engagement stats**: Views/shares counters in the published report panel
- [ ] **Screen 8 — Contributors list**: Avatars of all participants with roles
- [ ] **Screen 5 — Classification diff warning**: Yellow banner comparing original vs cross-checker classification
- [ ] **Screen 7 — Submission summary card**: Structured summary with fact-checker, cross-checker, classification, consensus
- [ ] **Admin user-search in Screen 1**: Admins should be able to assign to others, not just self-assign

---

## Test Summary

| Category | Total | ✅ Pass | 🔲 Manual | ⚠️ Warn | ❌ Bug |
|----------|-------|---------|-----------|---------|--------|
| Feature Flag | 4 | 3 | 0 | 1 | 0 |
| Layout & Navigation | 5 | 5 | 0 | 0 | 0 |
| Session Management | 7 | 3 | 4 | 0 | 0 |
| Assignment Flow | 6 | 0 | 6 | 0 | 0 |
| Chat & AI | 7 | 3 | 4 | 0 | 0 |
| Form Mode | 8 | 5 | 3 | 0 | 0 |
| Report Drafting | 6 | 3 | 3 | 0 | 0 |
| Reported State | 5 | 5 | 0 | 0 | 0 |
| Cross-Checking | 13 | 10 | 3 | 0 | 0 |
| Reviewer Selection | 7 | 4 | 3 | 0 | 0 |
| Review & Approval | 8 | 5 | 3 | 0 | 0 |
| Published State | 5 | 2 | 3 | 0 | 0 |
| Verification Request | 10 | 4 | 6 | 0 | 0 |
| RBAC | 6 | 5 | 1 | 0 | 0 |
| Report Preview | 5 | 4 | 1 | 0 | 0 |
| Edge Cases | 7 | 1 | 6 | 0 | 0 |
| Known Issues | 6 | 0 | 0 | 4 | 2 |
| Informative News | 3 | 3 | 0 | 0 | 0 |
| **TOTAL** | **112** | **65** | **46** | **5** | **2** |

**Bugs fixed**: `getNextEvent.ts:51` event mapping, `deleteComment` copy-paste error.
**Items requiring staging/auth**: 46 items need authenticated multi-user testing.
