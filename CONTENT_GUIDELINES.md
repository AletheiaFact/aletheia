# Aletheia Content Guidelines

**Based on GitLab Pajamas UI Text and Content Standards**

This guide establishes standards for writing UI text, microcopy, and content throughout the Aletheia platform. Following these guidelines ensures a consistent, professional, and user-friendly experience.

---

## Table of Contents

1. [Voice and Tone](#voice-and-tone)
2. [Core Writing Principles](#core-writing-principles)
3. [UI Text Standards](#ui-text-standards)
4. [Error Messages](#error-messages)
5. [Form Guidelines](#form-guidelines)
6. [Button Labels](#button-labels)
7. [Notifications and Alerts](#notifications-and-alerts)
8. [Capitalization Rules](#capitalization-rules)
9. [Common Patterns](#common-patterns)
10. [Word List](#word-list)

---

## Voice and Tone

### Brand Voice

Aletheia's copy should be **clear, direct, and trustworthy**. We strike a balance between professional and friendly, acting as a **trusted, helpful, and understanding colleague** in the fight against misinformation.

**Our voice is**:
- ✅ **Professional** - Accurate, well-informed, credible
- ✅ **Friendly** - Approachable, conversational, human
- ✅ **Helpful** - Supportive, educational, empowering
- ✅ **Respectful** - Mindful of users' time and intelligence

**Our voice is NOT**:
- ❌ Condescending or patronizing
- ❌ Overly casual or unprofessional
- ❌ Alarmist or sensational
- ❌ Apologetic without cause

### Tone Variations

Adjust tone based on context:

| Context | Tone | Example |
|---------|------|---------|
| Success | Positive, celebratory | "Claim reviewed successfully!" |
| Error | Helpful, solution-focused | "Unable to save. Check your connection and try again." |
| Warning | Cautious, informative | "This action cannot be undone." |
| Info | Neutral, educational | "Reviews help verify information accuracy." |
| Empty states | Encouraging, actionable | "Start fact-checking by creating your first claim." |

---

## Core Writing Principles

### 1. Consistency First

> "Match existing language on the same screen over following the latest style guidance."

- **Check existing UI** - Use the same terms already in the app
- **Be consistent** - Don't call the same thing by different names
- **Reference order**:
  1. Existing text on the same page
  2. Component-specific guidelines (this document)
  3. General style guides

### 2. Clarity Over Cleverness

> "Users will skim content, rather than read text carefully."

- **Be direct** - Say what you mean, mean what you say
- **Use common words** - Avoid jargon, technical terms, and insider language
- **Short sentences** - One idea per sentence
- **Active voice** - "Review the claim" not "The claim should be reviewed"

### 3. Brevity

Remove unnecessary words without losing meaning:

❌ **Wordy**: "In order to verify this information, you will need to provide sources."
✅ **Concise**: "Provide sources to verify this information."

❌ **Wordy**: "Please be advised that your changes have been saved successfully."
✅ **Concise**: "Changes saved."

❌ **Wordy**: "We're sorry, but an error has occurred."
✅ **Concise**: "Unable to complete action. Please try again."

### 4. User-Focused

Start with the user's task or problem, then the solution:

❌ **Product-focused**: "Integrate with fact-checking databases to monitor misinformation."
✅ **User-focused**: "Monitor misinformation by integrating fact-checking databases."

❌ **Product-focused**: "Our AI copilot helps you write reviews."
✅ **User-focused**: "Write reviews faster with AI assistance."

---

## UI Text Standards

### Headlines and Titles

**Rules**:
- Sentence case (not title case)
- No punctuation at end
- Brief and descriptive
- Action-oriented when possible

**Examples**:
```
✅ Review history
✅ Create new claim
✅ Verify sources
✅ Fact-check classifications

❌ Review History (title case)
❌ Create New Claim. (punctuation)
❌ The History of Reviews (verbose)
```

### Body Text

**Rules**:
- Short paragraphs (2-3 sentences max)
- One idea per paragraph
- Use lists for multiple points
- Line height 1.5 for readability

**Example**:
```markdown
✅ Good paragraph:
Reviews help verify the accuracy of public statements. Each review
includes sources, fact-checking, and a classification rating.

❌ Bad paragraph:
When you create a review, you're helping to verify the accuracy of
public statements and claims made by public figures, which is really
important for combating misinformation, and each review that you create
should include properly sourced information along with your fact-checking
analysis and also a classification rating that indicates the truthfulness.
```

---

## Error Messages

> "Error messages should be clear about what happened, why, and what to do next."

### Error Message Formula

**What happened** + **Why** (optional) + **What to do**

### Examples

❌ **Bad**: "Invalid input"
✅ **Good**: "Email must include @ symbol and domain"

❌ **Bad**: "Error"
✅ **Good**: "Unable to save changes. Check your internet connection and try again."

❌ **Bad**: "Password doesn't meet requirements"
✅ **Good**: "Password must be at least 8 characters with one number"

❌ **Bad**: "Something went wrong"
✅ **Good**: "Unable to load claims. Refresh the page to try again."

### Error Message Guidelines

**DO**:
- ✅ Be specific about the problem
- ✅ Explain what the user can do
- ✅ Use plain language
- ✅ Be brief (1-2 sentences)

**DON'T**:
- ❌ Use "sorry" unless the error is our fault
- ❌ Blame the user ("You entered an invalid email")
- ❌ Use technical jargon ("Error 500", "Null reference exception")
- ❌ Be vague ("Something went wrong", "Invalid input")

### Error Message Tone

❌ **Apologetic**: "We're terribly sorry, but we were unable to process your request."
✅ **Helpful**: "Unable to process request. Please try again."

❌ **Blame**: "You entered an invalid email address."
✅ **Neutral**: "Email address must include @ symbol."

---

## Form Guidelines

### Field Labels

**Rules**:
- Sentence case
- No colon at end
- Clear and concise
- Noun or noun phrase

**Examples**:
```
✅ Email address
✅ Password
✅ Claim title
✅ Source URL

❌ Email Address: (title case, colon)
❌ Enter your email address (instruction, not label)
❌ Email (too brief, unclear)
```

### Placeholder Text

**Rules**:
- Example of expected format
- Not required information
- Light gray (accessible contrast)
- Disappears on focus

**Examples**:
```
✅ name@example.com
✅ https://source.com/article
✅ YYYY-MM-DD

❌ Required (doesn't help user)
❌ Enter email (instruction, not example)
```

### Helper Text

**Rules**:
- Additional context or instructions
- Appears below field
- Brief (1 sentence)
- Optional but helpful

**Examples**:
```
✅ "We'll never share your email address"
✅ "Must be at least 8 characters"
✅ "Sources help verify your review"

❌ "This field is for entering your email address which we will use
    to send you notifications" (too long)
```

### Required Field Indicators

**Use**:
- Asterisk (*) next to label
- "Required" text
- Red color for asterisk

**Example**:
```
Email address *
Password (optional)
```

### Validation Messages

Show validation in real-time when possible:

✅ **Success state**: "Email verified"
✅ **Error state**: "Email must include @ symbol"

Place validation messages directly below the field, not in tooltips.

---

## Button Labels

### Button Label Rules

**DO**:
- ✅ Start with a verb
- ✅ Be specific about the action
- ✅ Use sentence case
- ✅ Keep it short (1-3 words)

**DON'T**:
- ❌ Use generic labels ("OK", "Submit")
- ❌ Use title case
- ❌ Be vague ("Continue", "Next")

### Button Label Examples

| Context | ❌ Bad | ✅ Good |
|---------|--------|---------|
| Save form | Submit | Save changes |
| Delete item | OK | Delete claim |
| Create new | Add | Create claim |
| Cancel action | No | Cancel |
| Confirm action | Yes | Confirm deletion |
| Sign up | Submit | Create account |

### Primary vs Secondary Actions

**Primary action**: Most important, appears once per screen
```
✅ Save review
✅ Publish claim
✅ Submit verification
```

**Secondary action**: Less important, can appear multiple times
```
✅ Cancel
✅ Save draft
✅ Preview
```

### Destructive Actions

Be explicit about destructive actions:

❌ **Vague**: "Delete"
✅ **Clear**: "Delete claim"

❌ **Casual**: "Remove it"
✅ **Professional**: "Remove reviewer"

---

## Notifications and Alerts

### Alert Types and Usage

**Success** - Confirm positive outcomes
```
✅ "Review published successfully"
✅ "Sources verified"
✅ "Changes saved"
```

**Warning** - Caution about potential issues
```
✅ "This claim has no sources"
✅ "Review will be visible to everyone"
✅ "Unsaved changes will be lost"
```

**Error** - Communicate problems
```
✅ "Unable to publish review. Add at least one source."
✅ "Connection lost. Reconnect to save changes."
✅ "Image file too large. Max size is 5MB."
```

**Info** - Provide context
```
✅ "Reviews are checked by moderators before publishing"
✅ "This feature is in beta"
✅ "10 claims waiting for review"
```

**Tip** - Educate users
```
✅ "Tip: Add multiple sources to strengthen your review"
✅ "Pro tip: Use keyboard shortcuts to work faster"
```

### Alert Structure

**Title** (optional): Single-line, sentence fragment, no punctuation
**Message**: 1-2 sentences, clear and actionable
**Actions** (optional): Maximum 2 buttons

**Example**:
```
┌─────────────────────────────────────┐
│ ⚠️  Profile incomplete              │
│                                     │
│ Your profile is missing required    │
│ information for fact-checking.      │
│                                     │
│ [Complete profile] [Later]         │
└─────────────────────────────────────┘
```

---

## Capitalization Rules

### Sentence Case (DEFAULT)

Use sentence case for:
- ✅ Button labels
- ✅ Field labels
- ✅ Headings and titles
- ✅ Menu items
- ✅ Tab labels
- ✅ Column headers

**Examples**:
```
✅ Save changes
✅ Email address
✅ Review history
✅ Export to CSV

❌ Save Changes (title case)
❌ Email Address (title case)
```

### Title Case

**Only use for**:
- Proper nouns (Aletheia, OpenAI, Wikipedia)
- Product names (Copilot, Review Dashboard)
- Named features or tools

### ALL CAPS

**Avoid** unless:
- Acronyms (URL, API, CSV)
- Badges or labels where appropriate

---

## Common Patterns

### Empty States

Encourage action with helpful, positive messaging:

❌ **Negative**: "No claims found"
✅ **Positive**: "Create your first claim to start fact-checking"

❌ **Passive**: "There are no reviews yet"
✅ **Active**: "Be the first to review this claim"

### Loading States

Keep it simple:
```
✅ Loading...
✅ Saving changes...
✅ Verifying sources...

❌ Please wait while we load your data...
```

### Confirmation Messages

Be specific about what happened:

❌ **Vague**: "Success"
✅ **Specific**: "Review published"

❌ **Vague**: "Saved"
✅ **Specific**: "Changes saved"

### Call-to-Action

Lead with benefit or outcome:

❌ **Feature-first**: "Use AI Copilot to help you write reviews"
✅ **Benefit-first**: "Write reviews faster with AI Copilot"

❌ **Feature-first**: "Enable notifications to get updates"
✅ **Benefit-first**: "Stay updated with notifications"

---

## Word List

Use these terms consistently:

| ✅ Use This | ❌ Not This | Context |
|------------|-------------|---------|
| Sign in | Log in, Login | Authentication |
| Sign out | Log out, Logout | Authentication |
| Email address | Email, E-mail | Forms |
| Username | User name, Login name | Account |
| Fact-check | Fact check, FactCheck | Verification |
| Claim | Statement, Post | Content |
| Review | Fact-check, Analysis | Verification |
| Source | Reference, Link | Citations |
| Classification | Rating, Label | Review type |
| Personality | Public figure, Person | People |
| Dashboard | Home, Main page | Navigation |
| Settings | Preferences, Options | Configuration |
| Delete | Remove, Erase | Destructive action |
| Cancel | Abort, Stop | Action cancellation |

---

## Terminology

### Consistent Term Usage

**DO**:
- ✅ Use the same term throughout the app
- ✅ Define terms on first use if technical
- ✅ Use terms from the domain (fact-checking, verification)

**DON'T**:
- ❌ Vary terms for the same concept
- ❌ Use jargon without explanation
- ❌ Create new terms when common ones exist

### Avoid These

- ❌ "Please" (implied politeness without adding value)
- ❌ "In order to" (use "to")
- ❌ "We're sorry" (unless it's genuinely our fault)
- ❌ "Currently" (implied by present tense)
- ❌ "Simply" or "Just" (patronizing)
- ❌ "Obviously" (if obvious, don't say it)

---

## Accessibility Considerations

### Screen Reader Text

Provide context for icons and actions:

```jsx
// ✅ Good
<IconButton aria-label="Delete claim">
  <DeleteIcon />
</IconButton>

// ❌ Bad
<IconButton>
  <DeleteIcon />
</IconButton>
```

### Alt Text for Images

Be descriptive and concise:

```html
✅ <img alt="Barack Obama speaking at podium" />
✅ <img alt="Fact-check classification chart" />

❌ <img alt="Image" />
❌ <img alt="obama.jpg" />
```

---

## Quick Reference

### Before Publishing UI Text

Ask yourself:

1. ☑️ Is it **clear** what this means?
2. ☑️ Is it **concise** (no unnecessary words)?
3. ☑️ Is it **consistent** with similar text nearby?
4. ☑️ Is it **helpful** (does it guide the user)?
5. ☑️ Is it **accessible** (screen reader friendly)?
6. ☑️ Does it use **sentence case**?
7. ☑️ Does it avoid **jargon**?

---

## Examples in Context

### Good Form

```
Create new claim
────────────────

Claim title *
[___________________________]
Be specific and concise

Description
[___________________________]
[___________________________]
Provide context for fact-checkers

Source URL
[___________________________]
https://example.com/article

[Create claim] [Cancel]
```

### Good Error Message

```
┌─────────────────────────────────────┐
│ ⚠️  Unable to save claim            │
│                                     │
│ Title must be at least 10           │
│ characters. Add more detail.        │
│                                     │
│ [Got it]                           │
└─────────────────────────────────────┘
```

### Good Empty State

```
No claims yet

Create your first claim to start
fact-checking public statements.

[Create claim]
```

---

## Resources

- **GitLab Pajamas**: https://design.gitlab.com/content/ui-text
- **Nielsen Norman Group**: https://www.nngroup.com/articles/microcopy/
- **Mailchimp Content Style Guide**: https://styleguide.mailchimp.com/

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Based on**: GitLab Pajamas Content Guidelines
