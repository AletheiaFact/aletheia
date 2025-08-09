# Review Tasks

## Overview
Review tasks are the fundamental units of work in the fact-checking process, organizing and tracking the verification of individual claims.

## Task Properties

### Basic Information
- Task ID and reference
- Associated claim
- Priority level
- Due date
- Current status

### Assignment Details
- Primary reviewer
- Cross-checker
- Review team
- Workload distribution

## Task Management

### Creation
- Automatic task generation from claims
- Manual task creation
- Bulk task import
- Priority assignment

### Assignment Logic
- Skill-based matching
- Workload balancing
- Language preferences
- Expertise areas
- Availability checking

### Queue Management
- Priority queues
- FIFO processing
- Deadline-based sorting
- Custom filters

## Task States
- **Unassigned** - Awaiting reviewer
- **Assigned** - Reviewer allocated
- **In Progress** - Active review
- **Under Review** - Quality check
- **Completed** - Review finished
- **Published** - Publicly available

## Features

### Task Dashboard
- Personal task queue
- Team overview
- Progress tracking
- Deadline alerts

### Task Actions
- Accept/Reject assignment
- Request reassignment
- Escalate issues
- Mark completion

## Technical Details
- **Module**: `review-task.module.ts`
- **Controller**: `review-task.controller.ts`
- **Database**: review_tasks collection
- **API**: `/api/review-task/*`