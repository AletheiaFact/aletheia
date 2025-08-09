# Claim Creation

## Overview
Claim creation allows users to submit new fact-checkable content to the platform through manual entry or automated import processes.

## Creation Methods

### Manual Entry
- Direct text input
- Copy-paste from sources
- Form-based submission
- Rich text editor

### Automated Import
- API integration
- Bulk CSV upload
- Web scraping
- RSS feed monitoring

## Creation Workflow

### Step 1: Select Claim Type
- Text (sentence/paragraph)
- Image
- Speech
- Debate
- Unattributed

### Step 2: Enter Content
- Input claim text/media
- Add context information
- Specify date and location
- Include source references

### Step 3: Attribution
- Select personality
- Search existing profiles
- Create new personality
- Link to Wikidata

### Step 4: Categorization
- Select topics
- Add tags
- Set priority
- Choose language

### Step 5: Review & Submit
- Preview claim
- Validate information
- Check for duplicates
- Submit for processing

## Validation Rules

### Content Requirements
- Minimum length: 10 characters
- Maximum length: 5000 characters
- Supported languages: PT, EN
- Required fields validation

### Quality Checks
- Duplicate detection
- Spam filtering
- Format validation
- Source verification

## User Permissions

### Who Can Create
- Registered users
- Verified contributors
- Moderators
- Administrators

### Approval Process
- Auto-approval for trusted users
- Moderation queue for new users
- Admin review for sensitive topics

## Technical Details
- **Component**: `ClaimCreate.tsx`
- **Forms**: `BaseClaimForm.tsx`
- **API**: `POST /api/claim`
- **Validation**: Server-side and client-side