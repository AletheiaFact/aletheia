# CopilotReviewV2 - Design Brief for State-Aware Review Interface

## Context

We're redesigning the claim review interface (CopilotReviewV2) to replace the legacy form-based workflow with a chat-first, AI-assisted experience. The core insight: **each copilot session maps 1:1 to a review task**, so the UI must reflect the task's current state, the logged-in user's role, and the available actions at every stage.

The layout has three columns:
- **Left sidebar**: Session list (each session = a review task)
- **Center**: Chat thread + composer (primary), with a toggle to "Form mode" (legacy editor + form)
- **Right sidebar**: Report preview panel

---

## Workflow Overview

There are 3 report types. Each has a different state flow:

### Fact-Checking (primary, most complex)

```
unassigned → assigned → reported → crossChecking → submitted → published
                ↑            |            |              |
                |            |            v              v
                |            |    addCommentCrossChecking |
                |            |            |              |
                +------------+------------+--------------+
                     (revision loops on disagreement)
```

### Informative News (simpler)

```
assigned → reported → published
              ↑
              +-- (go back)
```

### Verification Requests (admin-only)

```
unassigned → assignedRequest → published
                    |
                    v
             rejectedRequest
```

---

## Screens to Design (by State)

### 1. Unassigned

**Who sees it**: Admins only (regular users and fact-checkers see read-only)

**What's happening**: A claim exists but no one has been assigned to review it.

**UI requirements**:
- Banner at the top of the chat area: "This review task is not assigned yet"
- For admins: "Assign to myself" button in the banner
- For admins: Ability to search/select a user to assign (user search input)
- For non-admins: Informational banner only, no action buttons
- Session sidebar entry should show an "unassigned" badge/status
- Report preview: Shows the claim being reviewed with "Not reviewed" status
- Chat is functional (user can ask the AI about the claim even before assignment)

**Data displayed**: Claim content, personality (public figure), classification = none

---

### 2. Assigned (Active Reviewing)

**Who sees it**: The assigned fact-checker, admins

**What's happening**: A fact-checker is actively working on the review. Auto-draft saving is active.

**UI requirements**:
- Status indicator: "In progress" or "Reviewing" with the assigned user's name/avatar
- The chat thread is the primary workspace - the AI helps the reviewer write the report
- Form mode toggle available: switches to the visual editor (Remirror) with sections:
  - Summary (Resumo da conclusao)
  - Questions the verification should answer
  - Verification report
  - How we verified (methodology)
  - Sources list (add/remove)
  - Classification dropdown (not-fact, false, misleading, unsustainable, unverifiable, exaggerated, arguable, trustworthy-but, trustworthy)
- Report preview (right panel) updates in real-time as the report is built
- Action button: "Finish Report" (transitions to `reported`)
- Draft indicator: Show "Draft saved" with timestamp
- For admins: "Re-assign" option available

**Data collected**: summary, questions, report, verification, sources, classification

**RBAC**:
- Assigned fact-checker: Full edit access
- Admins: Can view, can re-assign
- Other users: Read-only view of the claim (no report visible yet)

---

### 3. Reported (Awaiting Handler Selection)

**Who sees it**: The fact-checker who reported, admins

**What's happening**: Initial report is complete. An admin or the fact-checker must decide the next step: send for cross-checking or send for review.

**UI requirements**:
- Status: "Report complete - awaiting next step"
- The report is visible in the preview panel (read-only)
- Two action paths clearly presented:
  - "Send for Cross-checking" - opens user search to select a cross-checker
  - "Send for Review" - opens user search to select a reviewer
- "Go back" option to return to editing (transitions back to `assigned`)
- For admins: Direct "Publish" option may be available (for Informative News workflow)

**RBAC**:
- Fact-checker/Admin: Can select next handler
- Other users: Can view the report but cannot take action

---

### 4. Cross-Checking

**Who sees it**: The assigned cross-checker, admins, the original fact-checker (read-only)

**What's happening**: A second reviewer (cross-checker) is independently reviewing the report.

**UI requirements**:
- Status: "Cross-checking in progress" with cross-checker's name
- The original report is visible (read-only) in the editor/preview
- The cross-checker's classification is visible alongside the original
- Two actions for the cross-checker:
  - "Approve" (submit without comment) - returns to `reported`
  - "Add Comment" - opens comment flow (transitions to `addCommentCrossChecking`)
- Chat is available for the cross-checker to ask the AI about the claim

**RBAC**:
- Cross-checker: Can approve or comment
- Original fact-checker: Read-only view
- Admin: Can override/manage

---

### 5. Add Comment (Cross-Checking Feedback)

**Who sees it**: The cross-checker

**What's happening**: The cross-checker disagrees or has feedback. They provide a comment and their own classification.

**UI requirements**:
- Comment textarea (required)
- Classification dropdown (cross-checker's independent classification)
- "Submit Comment" button
- Visual comparison: original classification vs. cross-checker's classification
- Warning if classifications differ: "Different classifications will return the task to the fact-checker for revision"

**Transition logic** (important for the designer to understand):
- If classifications match → task returns to `reported` (cross-checking approved)
- If classifications differ → task returns to `assigned` (fact-checker must revise)

---

### 6. Select Reviewer

**Who sees it**: The fact-checker, admins

**What's happening**: Choosing who will perform the final review/approval.

**UI requirements**:
- User search component to find and select a reviewer
- Only users with Reviewer or Admin roles should appear
- The selected reviewer must NOT be the same person as the fact-checker
- "Send to Review" button
- "Go back" option

---

### 7. Submitted (Awaiting Final Approval)

**Who sees it**: The assigned reviewer, admins

**What's happening**: The report is with the final reviewer for approval or rejection.

**UI requirements**:
- Status: "Awaiting approval" with reviewer's name
- Full report visible and editable (reviewer can make corrections)
- Two actions:
  - "Publish" - finalizes and publishes the fact-check
  - "Reject" - opens rejection comment field, returns task to `assigned`
- Rejection requires a comment explaining why

**RBAC**:
- Reviewer: Can publish or reject
- Fact-checker: Can view but not act
- Admin: Can publish directly

---

### 8. Published (Final State)

**Who sees it**: Everyone

**What's happening**: The fact-check is live and publicly visible.

**UI requirements**:
- Status: "Published" with green indicator and publication date
- Full report displayed read-only in the preview panel
- Classification badge prominently displayed
- No action buttons (except for Verification Requests which can be reset)
- Chat remains functional for post-publication questions

---

### 9. Verification Request States (Admin-Only Flow)

#### 9a. Assigned Request

**Who sees it**: Admins only

**UI requirements**:
- Status: "Verification request assigned"
- "Is Sensitive" checkbox/toggle
- Two actions: "Publish" or "Reject Request"
- Publish redirects to claim creation flow

#### 9b. Rejected Request

**Who sees it**: Admins, the requesting user

**UI requirements**:
- Status: "Request rejected" with red indicator
- Read-only view of the request
- No actions available (final state)

---

## Cross-Cutting Design Considerations

### Session Sidebar

Each session entry should display:
- Claim title or excerpt (truncated)
- Current state as a colored badge/chip:
  - Unassigned: grey
  - Assigned/In Progress: blue
  - Reported: yellow/amber
  - Cross-checking: purple
  - Submitted: orange
  - Published: green
  - Rejected: red
- Assigned user avatar(s)
- Last activity timestamp
- Report type icon (fact-check, news, request)

### Report Preview Panel (Right Sidebar)

Adapts based on state:
- **Pre-report** (unassigned/early assigned): Shows claim info, personality, "Not reviewed" status
- **During review** (assigned): Live preview of the report being written
- **Post-report** (reported onwards): Full report with classification badge
- **Published**: Final report with all metadata

### Role-Based UI Patterns

| Role | Can see | Can interact with |
|------|---------|-------------------|
| Regular user | Published reviews, claim info | Chat only (ask AI about the claim) |
| Fact-checker | Their assigned tasks | Edit report, select handlers, chat |
| Reviewer | Tasks assigned for review | Approve/reject, minor edits |
| Admin | All tasks in all states | All actions, re-assign, publish |

### Chat Integration with States

The AI assistant should be context-aware of the current state:
- **Unassigned**: Can discuss the claim, help decide if it needs review
- **Assigned**: Can help research, draft report sections, find sources
- **Cross-checking**: Can explain the report to the cross-checker, highlight key findings
- **Submitted**: Can summarize the review for the approver
- **Published**: Can answer questions about the published fact-check

### Responsive Behavior

- **Desktop** (>1024px): Three-column layout (sidebar + chat + preview)
- **Tablet** (768-1024px): Two columns (chat + preview), sidebar as drawer
- **Mobile** (<768px): Single column (chat), sidebar and preview as drawers/modals

### Classification Visual Language

Each classification should have a distinct color:
- not-fact (grey) - Not a factual claim
- false (dark red) - False
- misleading (red) - Misleading
- unsustainable (orange-red) - Unsustainable
- unverifiable (orange) - Cannot be verified
- exaggerated (yellow) - Exaggerated
- arguable (amber) - Arguable
- trustworthy-but (light green) - Trustworthy with caveats
- trustworthy (green) - Trustworthy

---

## Technical Notes for Handoff

- State machine uses XState (finite state machine library)
- Real-time updates via WebSocket (collaborative editing with Yjs)
- i18n: All text must support Portuguese (pt) and English (en)
- Rich text editor: Remirror (ProseMirror-based)
- Component library: Material-UI (MUI)
- Styling: styled-components
- The chat is powered by assistant-ui library with a custom runtime
