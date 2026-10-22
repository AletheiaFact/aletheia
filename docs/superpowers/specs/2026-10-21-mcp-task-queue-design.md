# MCP task queue: claim, cross-check and review tools

## Intent

Fact-checkers and reviewers want to drive their daily work through an MCP
client (Claude) with plain requests:

- "Pegue a próxima tarefa" (get me the next task)
- "Pegue o próximo Cross checking atribuído para mim"
- "Pegue as tarefas que preciso revisar para publicar"

The MCP server (`server/mcp/`) today can list/get review tasks and create one
(`start_review_task`), but it has no notion of a work queue: it cannot hand out
"the next" task, cannot filter by "mine", and cannot take a task from a review
backlog.

**Deadline and load driver:** the presidential debate on Friday 2026-10-23.
Thousands of people will use the MCP at once for real-time checking. Two
consequences:

1. Handing out work must be **atomic**: two people must never get the same
   task. The adversarial spec already flags a race on `start_review_task`
   (`server/mcp/mcp-adversarial.spec.ts`, one `it.fails`).
2. For the debate the **cross-checking step is skipped**: reported tasks go
   straight to review.

## Diagram

```
debate audio -> speech-to-text -> triage/correction of text
   -> API/MCP -> Claim -> [Fila de trabalho] -> Review Task -> ClaimReview
                                                      |
Claude (via API/MCP) reads/writes Claim, Review Task, ClaimReview (dotted)
                                                      v
                              Stream de checagens (PUB/SUB)
                    -> browser extension | Debate View | push / web
```

See at: https://excalidraw.com/#room=bdd686c49b58293f86d8,cWs47Kzg5mqs1ft3WuJRpg

What it changes in this design:

- The **queue is fed on claim creation**: creating a Claim (through the
  ingest pipeline's MCP call) also creates its Review Task in `unassigned`.
  So `next_review_task` only has to take the oldest `unassigned` task. The
  "oldest claim sentence with no task" fallback and its anti-join are
  dropped.
- Claude touches **ClaimReview** too: publishing from MCP is likely in scope
  (see open question 4).
- The pipeline before the MCP (audio, speech-to-text, triage) and the
  pipeline after ClaimReview (check stream, pub/sub, extension, Debate View,
  push) are **not part of this design**.
- No cross-checking box: consistent with skipping it for the debate.

## Vocabulary (from `src/machines/reviewTask/`)

Fact-checking workflow, states in `ReviewTaskStates`:

```
unassigned -> assigned -> reported -+-> selectCrossChecker -> cross-checking -> ...
                                    |
                                    +-> selectReviewer -> submitted -> published
```

- **cross checking** = the `cross-checking` state (a second checker validates
  the report). Confirmed by the maintainer: it is a workflow state.
- **reviewing** (the maintainers' word) = `submitted`: the reviewer reads the report
  and publishes or rejects it.
- Skipping cross-checking already works: `reported --selectedReview-->
  selectReviewer --sendToReview--> submitted`.
- Per-task people live in `machine.context.reviewData`: `usersId[]`
  (assignees, already an array), `reviewerId` (single), `crossCheckerId`
  (single).
- The XState machine runs in the frontend. The server persists the `machine`
  document it is given. `server/mcp/review-workflow.service.ts` builds
  those documents server-side and validates the current state before each
  transition.

## Decisions (from the discussion)

| Topic | Decision |
|---|---|
| Who can ask | Anyone logged in; each tool validates role and namespace |
| Queue order | Oldest first (`createdAt` ascending) |
| "Next task" source | Oldest `unassigned` review task. Tasks are created `unassigned` when the claim is created (the diagram's "Fila de trabalho"). Earlier idea of falling back to claims without a task is dropped |
| Cross-check tool | Lists tasks in `cross-checking` where `crossCheckerId` is the caller. Pre-assigned, no queue |
| Review tool | Lists tasks where `reviewerId` is the caller |
| Review backlog | Reuse `selectReviewer` with `reviewerId` empty as the backlog. **No new state, no XState/frontend change** (decision, simplified from a new-state idea for the deadline) |
| Joining | New tool `join_review_task`. Anyone with permission may join, no owner approval (decision) |
| Debate flow | Skip cross-checking: `reported -> selectReviewer` |

## Tools (proposed)

All registered in `server/mcp/tools/`, behind the same guard, namespace check
(`assertNamespaceAccess`) and CASL checks as the existing tools.

0. **Queue feed (not a tool):** creating a claim sentence (MCP
   `create_claim`, and ideally the web path too, builder decides) also creates
   its review task in `unassigned`. Needs a check that today's code does not
   already do this, and idempotency on `data_hash`.
1. **`next_review_task`** (write). Atomically picks the oldest `unassigned`
   task and assigns it to the caller (`usersId=[me]`, state `assigned`).
   Must retry on a lost race instead of failing.
2. **`join_review_task`** (write). Adds the caller to `usersId` of a task in
   `assigned` or `reported` (my call, see below). Idempotent: joining twice is a
   no-op.
3. **`next_cross_checking`** (read). The caller's oldest `cross-checking`
   task where `crossCheckerId` is them. Returns the task, plus a count of
   how many are waiting.
4. **`claim_review_task`** (write). Atomically takes the oldest `selectReviewer`
   task with no `reviewerId`, sets `reviewerId=me` and moves it to
   `submitted`. Reviewer/Admin only.
5. **`list_my_review_tasks`** (read). Tasks in `submitted` where
   `reviewerId` is the caller, oldest first. This answers "tarefas que
   preciso revisar para publicar".

7. **`publish_review_task`** (write), in scope (decision). Moves a
   `submitted` task to `published` and creates the ClaimReview with the same
   rules as the web `publish` event (classification, summary and report
   required). Only the task's `reviewerId` (or Admin) may call it. The
   builder must mirror what the web path does around publishing (history,
   state events, notifications, the ClaimReview write).
6. **`send_to_review`** (write). Moves a `reported` task to `selectReviewer`
   (the review backlog) with `reviewerId` empty. Only an assignee of the task
   (or Admin) may call it. The web UI keeps doing the same through the
   existing machine, so both paths feed the same backlog (decision).

Naming and exact input schemas are left to the builder (Zod 4 via the
existing `tools/schemas.ts`).

Also needed: `list_review_tasks` hardcodes
`filterUser: { assigned:false, crossChecked:false, reviewed:false }`
(`server/mcp/tools/read-review-tools.ts`). The "mine" filters
(`usersId`, `crossCheckerId`, `reviewerId` in
`server/review-task/review-task.service.ts` `getQueryObject`) already exist
and just need exposing.

## Goals

- The three requests work end to end from an MCP client.
- No two callers ever receive the same task (atomic claim, tested under
  concurrency).
- Business rules cannot be bypassed through MCP: role, namespace, valid
  source state. Covered by adversarial tests in the style of
  `mcp-adversarial.spec.ts`.
- Holds up for the debate: queue queries use indexes, no collection scans.

## Non-goals

- A new workflow state, or any change to the XState machine, permissions
  or Kanban UI.
- A cross-checking queue where people pick tasks (assignment stays
  manual/pre-assigned).
- Web UI for the new features (the web app may not show "joined" users
  specially).
- A Postgres port. Mongo only for now, but keep new queries behind
  `ReviewTaskService` so the port stays mechanical.
- The check stream after ClaimReview (pub/sub, browser extension, Debate View,
  push) and the audio/speech-to-text pipeline before the MCP. The
  stream is being planned separately; to be reconciled later. The
  only contract this design owes it: publishing creates the ClaimReview the
  same way the web app does, so whatever listens to ClaimReview keeps working.

## Anti-goals (would be a failure even if it "works")

- Two people receiving the same `unassigned` task **without knowing about
  each other**. Example: two users ask for "the next task" at the same
  instant and both get task X, so both write a report for it. `next_review_task`
  must hand X to exactly one of them and the other gets the next task.
- (Not a failure, wanted) Several people on one task **on purpose**. Example:
  Ana holds task X and Bruno uses `join_review_task` to help, knowing Ana is
  there. A task may have many assignees with different focus (writing the
  report, looking things up in databases, reviewing before cross-checking).
  The difference is that a person chose to join an existing task; nobody
  chose to be duplicated by a race.
- A regular user, or a user outside the namespace, takes or joins a task.
- Transitions that skip history / state events / notifications, because
  the update bypassed `ReviewTaskService`.
- A "next task" query that scans a large collection on each call (it must
  use an index on state + `createdAt`).

## Constraints

- Branch `feat/mcp-task-queue`, based on the MCP work (not `stage`, which
  does not have `server/mcp/review-workflow.service.ts` yet).
- Zod 4 only, `ZodBody` etc. as in `CLAUDE.md`; no new class-validator DTOs.
- Work in `ReviewTaskService`/`ReviewWorkflowService`; the state machine
  stays in the frontend, server-side transitions follow
  `machineWorkflow.ts`.
- Delivery before Friday 2026-10-23.

## My calls (not decided by the team, please check)

- `join_review_task` works while the task is `assigned` or `reported`, so
  helpers can still add research or a pre-review after the report is written.
  Not after the task reaches review or `published`.
- Claiming a review requires role Reviewer or Admin.
- `next_review_task` retries a bounded number of times on a lost race, then
  returns a clear "no task available".
- A reviewer may not claim a task they are an assignee of (four-eyes).
  Remove this if the web app allows it.

## Calls added after the builder check (my calls, please check)

- **Roles:** FactChecker, Reviewer, Admin and SuperAdmin may take and join
  tasks (CASL create/update). Regular and anonymous are rejected. Claiming a
  review is Reviewer/Admin/SuperAdmin only.
- **Claim vs side effects:** the claim is one guarded `findOneAndUpdate`
  (filter on `machine.value` and, for reviews, `reviewerId` empty) that writes
  the new `machine` document. History and state events are then recorded
  through `ReviewTaskService`. If that second step fails, the claim stands
  (the task is correctly owned), the failure is logged, and the events are
  not rolled back or retried inline.
- **Duplicate tasks:** uniqueness is on `data_hash` alone (schema
  `unique: true`, no namespace in the key). If the index is missing in an
  environment, adding a migration for it is in scope and ships first.
- **Queue feed:** the review task is created together with the claim, in
  `unassigned`. Duplicate protection comes from the unique `data_hash`.
  Backfill of existing claims without a task is not part of this work unless
  the debate needs it (builder to flag).
- **Four-eyes** applies to Admin as well.
- **Co-checker cap:** placeholder of 10 per task, configurable, until the
  maintainer answers.

## Open questions for the maintainer

1. Does the Excalidraw diagram match the vocabulary above? In particular, is
   "reviewing" = `submitted`, and is `selectReviewer` with empty `reviewerId`
   an acceptable backlog?
2. Four-eyes: may the author review their own report?
3. Is there a cap on co-checkers per task? Should assignees have roles
   (writer, researcher, pre-reviewer), or is `usersId` a flat list?
   The design assumes a flat list.
4. Publishing from MCP is in scope (decided). Confirm: may a reviewer
   publish with no further approval, and what must be in the ClaimReview?
5. Is the cross-check skip only for the debate, or the new default? (Today
   it is a manual choice at `reported`; the tools do not force it.)

## Builder findings (2026-10-21, PR #2653)

Facts found in the code while building, that change or sharpen the
decisions above:

- **The web app never persists `selectReviewer`.** `SELECTED_REVIEW` is a
  transient UI event (`src/machines/reviewTask/reviewTaskMachine.ts`,
  `shouldNotUpdateReviewTask`): the web picks the reviewer in the form and
  saves straight to `submitted`. Confirmed in the browser: clicking "Selecione
  um revisor" sends no request. So the statement in tool 6 that "both paths
  feed the same backlog" does not hold: **only MCP's `send_to_review` feeds
  the backlog**. The web flow is unchanged.
- **Backlog tasks are invisible in the Kanban.** There is no `selectReviewer`
  column, and `getQueryMatchForMachineValue("selectReviewer")` builds
  `machine.value.selectReviewer: {$exists: true}`, which never matches the
  plain string. Opening the sentence page directly still works (the machine
  starts in `selectReviewer` and offers "send to review"). Making the Kanban
  show it is a frontend change, which the non-goals rule out; it is open
  question 6 below.
- **`machine.value` shape.** The web persists XState's `state.value`, so
  `assigned` is stored as `{ assigned: "undraft" | "draft" }`. MCP
  `start_review_task` and `saveDraft`'s auto-create stored the plain string
  `"assigned"`, which the Kanban cannot see. Fixed in both, plus migration
  `20261021130000` for existing documents (maintainer decision).
- **Notifications are sent by the browser** (`sendReviewNotifications.ts`).
  MCP transitions now notify server-side through `NotificationService`
  (maintainer decision): `send_to_review` (other assignees, "reviewSubmit")
  and `publish_review_task` (assignees, "reviewPublished"). Best-effort, pt
  messages from `public/locales/pt/notification.json`.
- **Atomicity needs no retry loop.** Each hand-out is a single
  `findOneAndUpdate` filtered on the source state and sorted by `_id`; Mongo
  serializes them, so a caller that "loses" simply matches the next task.
  An e2e test fires `waiting + 3` concurrent `next_review_task` calls against
  real Mongo: every task goes to exactly one caller and the extra 3 get
  `task: null`.
- **No new index.** The existing
  `reviewTaskType_1_nameSpace_1_machine.value_1__id_-1` serves all four queue
  queries as an IXSCAN with index-provided sort (verified with `explain`).
  `data_hash_1` is unique locally; migration `20261021120000` creates it
  where missing and logs (does not fail) if duplicates block it.
- **Queue feed placement (open question 7).** Implemented only in MCP
  `create_claim`. The web claim form and the live debate editor
  (`DebateService.addSpeechToDebate`) do not enqueue yet.
  `start_review_task` now takes an existing `unassigned` task atomically
  instead of refusing it, so the two entry points coexist.
- **History/state events parity.** `_createStateEvent` and
  `_createReviewTaskHistory` only derive the type from object-shaped values,
  so plain-string states (`reported`, `submitted`, `selectReviewer`) are
  recorded as type "published" — on the web path as well. MCP mirrors this;
  fixing it would change the web's audit trail and is left out.
- **Four-eyes is MCP-only.** The web reviewer picker does not exclude the
  task's assignees. `claim_review_task` excludes them (including admins), as
  decided.

Open questions added by the builder:

6. Should backlog (`selectReviewer`, no reviewer) tasks appear in the Kanban?
   Needs a frontend change (column + query).
7. Should the web claim form and the debate editor also feed the queue? The
   recommended place is the service layer (`ClaimService` create and
   `DebateService.addSpeechToDebate`), so every entry point enqueues once.

## Left to the builder

- The index for "oldest `unassigned` task" (state + `createdAt`), and
  whether `review_tasks.data_hash` (declared unique in the schema) really has
  its index in every environment.
- Where the claim-creation hook lives so the web and MCP paths both create the
  `unassigned` task exactly once (sentence `data_hash` is nested in the claim
  content tree).
- How to make the claim atomic while still writing history/state events
  (a guarded `findOneAndUpdate` plus the normal update path, or equivalent).
- Result shapes, pagination, and load-test approach.

## Tasks

`[x]` done, `[~]` started, `[ ]` not started. Work lands in draft PR #2653.

### Data and storage

- [x] Persist `assigned` in the web's shape (`{ assigned: "undraft" | "draft" }`)
      in `start_review_task` and `saveDraft`'s auto-create
- [x] Migration `20261021130000`: normalize existing plain `"assigned"` values
      (run on the local DB)
- [x] Migration `20261021120000`: make sure the unique `reviewtasks.data_hash`
      index exists (log and skip on duplicates)
- [x] Confirm queue queries use the existing
      `reviewTaskType_1_nameSpace_1_machine.value_1__id_-1` index (`explain`)
- [ ] Run both migrations on staging and production; check the duplicate log
- [ ] Close the `start_review_task` create race (the `it.fails` test):
      `ReviewTaskService.create` fires `save()` without awaiting, so a
      duplicate-key error is lost

### Queue primitives (`ReviewTaskQueueService`)

- [x] `transitionAtomically`: guarded `findOneAndUpdate`, then best-effort
      history and state event
- [x] `enqueueUnassigned`: upsert on `data_hash`, duplicate key means queued
- [x] `findOldest` / `countMatching` for caller-scoped reads
- [x] `publishSubmitted`: one-shot `submitted` → `published`, then Report +
      ClaimReview like the web path

### MCP tools

- [x] `next_review_task` (atomic hand-out of the oldest `unassigned` task)
- [x] `join_review_task` (`assigned`/`reported`, idempotent, cap
      `mcp.task_queue.max_assignees`, default 10)
- [x] `next_cross_checking` (oldest task where the caller is cross-checker, plus
      count)
- [x] `list_my_review_tasks` (`submitted` where the caller is reviewer)
- [x] `list_review_tasks`: session-only `mine` filter
- [x] `send_to_review` (`reported` → backlog, assignee or admin)
- [x] `claim_review_task` (reviewer/admin, four-eyes, atomic)
- [x] `publish_review_task` (reviewer or admin, web publish fields required)
- [x] `start_review_task` takes a queued `unassigned` task instead of refusing
- [x] Compact task view in tool results (state, sentence, people)
- [ ] Update `server/mcp/README.md` with the new tools

### Queue feed

- [x] MCP `create_claim` enqueues one `unassigned` task per sentence
- [~] Feed the queue from the web claim form and the live debate editor
      (`ClaimService` create, `DebateService.addSpeechToDebate`), waiting on
      open question 7
- [ ] Backfill existing claims without tasks, if the debate needs it

### Notifications

- [x] Server-side notifications for `send_to_review` ("reviewSubmit") and
      `publish_review_task` ("reviewPublished")
- [ ] Use each recipient's locale instead of always pt

### Tests

- [x] Adversarial suite, one spec per concern (`server/mcp/adversarial/`):
      roles, namespaces, M2M, four-eyes, state guards, cap, publish rules,
      operator smuggling
- [x] e2e on real Mongo: queue feed, concurrent hand-out (`waiting + 3`
      callers, 5/5 runs), queue → report → backlog → review → published
      ClaimReview, join
- [x] Discovery e2e lists the new tools
- [ ] Manual run through an MCP client (Claude) against a deployed
      environment
- [ ] Load test at debate scale (thousands of concurrent `next_review_task`)
- [ ] Fix the existing full-suite e2e flakes (claim-review, personality,
      Postgres setup pass alone and fail in parallel); they predate this work

### Code structure

- [x] Split `ReviewWorkflowService` into queue, workflow, notifier and helpers
      (`server/mcp/review-workflow/`)
- [x] Split `ReviewTaskService` (1185 → 749 lines): pipelines, effects, queue

### Decisions and delivery

- [x] Record builder findings in this spec
- [~] Maintainer answers to open questions 1–7 (documented, not answered yet)
- [~] Show the maintainer the backlog (`selectReviewer`) task on the web:
      confirmed that "Selecione um revisor" saves nothing, but no screenshot
      yet (captcha pop-up first, then the local login page kept
      hot-reloading)
- [ ] Kanban column for backlog tasks (only if question 6 says yes; frontend
      change)
- [~] Land the stacked PRs #2650, #2651 and #2652 (open)
- [ ] Mark #2653 ready for review
