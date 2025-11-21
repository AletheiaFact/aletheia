# GitLab Pajamas Integration Roadmap for Aletheia

## Already Implemented ✅

- **8px Spacing System** - Complete with design tokens
- **Layout System** - Container widths, component heights, shadows, z-index
- **Responsive Grid** - 12-column system with responsive utilities
- **Design Documentation** - Comprehensive design system guide

---

## Recommended Next Implementations

Based on GitLab Pajamas design system, here are the additional features we can implement to further improve Aletheia:

---

## 🎯 Priority 1: High Impact, Low Effort

### 1. Typography System ⭐⭐⭐

**What**: Standardized font scales, line heights, and heading hierarchy

**Benefits**:
- Consistent text sizing across the app
- Better readability and visual hierarchy
- Responsive typography out of the box
- Type-safe font tokens

**Implementation**:
```typescript
// src/styles/typography.ts
export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  md: '1rem',       // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '2.5rem',  // 40px
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};
```

**Use Cases**:
- Headings (h1-h6)
- Body text
- Captions and labels
- UI elements

**Effort**: Low (2-4 hours)
**Impact**: High - Improves consistency and accessibility

---

### 2. Color Token System ⭐⭐⭐

**What**: Semantic color tokens based on GitLab's approach

**Current State**: Aletheia has colors defined, but not semantically organized

**Improvement**:
```typescript
// Semantic color tokens
export const semanticColors = {
  // Surface colors
  surface: {
    primary: colors.white,
    secondary: colors.lightNeutral,
    tertiary: colors.lightNeutralSecondary,
  },

  // Text colors
  text: {
    primary: colors.black,
    secondary: colors.blackSecondary,
    tertiary: colors.neutralSecondary,
    disabled: colors.neutralTertiary,
  },

  // Action colors
  action: {
    primary: colors.primary,
    hover: colors.lightPrimary,
    active: colors.lightSecondary,
    disabled: colors.neutralTertiary,
  },

  // Feedback colors
  feedback: {
    success: colors.active,      // Green
    warning: '#DB950D',          // Orange
    error: colors.error,         // Red
    info: colors.lightSecondary, // Blue
  },

  // Border colors
  border: {
    default: colors.lightNeutralSecondary,
    focus: colors.primary,
    error: colors.error,
  },
};
```

**Benefits**:
- Easier theming (light/dark mode)
- Self-documenting code
- Consistent color usage
- Better accessibility

**Effort**: Low (3-5 hours)
**Impact**: High - Foundation for theming

---

### 3. Enhanced Alert Component ⭐⭐

**What**: Standardized alert/notification component following Pajamas patterns

**Current State**: AletheiaAlert exists, but can be enhanced

**GitLab Pattern**:
- 5 variants: danger, warning, success, info, tip
- Optional title, icon, dismissal, actions
- Severity ordering
- Clear usage guidelines

**Implementation**:
```tsx
<Alert
  variant="warning"
  title="Profile incomplete"
  dismissible
  onDismiss={handleDismiss}
  actions={[
    { label: "Complete profile", onClick: handleComplete },
    { label: "Later", variant: "secondary" }
  ]}
>
  Your profile is missing required information.
</Alert>
```

**Effort**: Medium (4-6 hours)
**Impact**: Medium - Better user feedback

---

### 4. Form Validation System ⭐⭐⭐

**What**: Standardized form validation with GitLab best practices

**GitLab Patterns**:
- Real-time validation
- Clear error messages (specific, concise, actionable)
- Validation messages always visible (not in tooltips)
- Success states for confirmed valid input
- Keyboard shortcuts (Cmd/Ctrl+Enter to submit)

**Implementation**:
```tsx
<FormField
  label="Email address"
  required
  error={errors.email}
  helpText="We'll never share your email"
  validationMode="onChange"
>
  <Input type="email" {...register('email')} />
</FormField>
```

**Error Message Standards**:
```typescript
// ❌ Bad
"Invalid input"

// ✅ Good
"Email must include @ symbol and domain"

// ❌ Bad
"Password doesn't meet requirements"

// ✅ Good
"Password must be at least 8 characters with one number"
```

**Effort**: Medium (6-8 hours)
**Impact**: High - Improves UX and reduces errors

---

## 🎯 Priority 2: High Impact, Medium Effort

### 5. Icon System ⭐⭐⭐

**What**: Standardized icon library with sizing and usage guidelines

**GitLab Approach**:
- UI icons (16px default)
- Status icons (12px)
- Consistent stroke weight (1.5px)
- Rounded caps
- Accessibility (aria-labels)

**Implementation Strategy**:
```typescript
// src/components/Icon/Icon.tsx
<Icon
  name="check-circle"
  size="md"         // 16px
  color="success"   // Semantic color
  aria-label="Verified"
/>

// Icon sizes
export const iconSizes = {
  sm: '12px',   // Status icons
  md: '16px',   // Default UI icons
  lg: '24px',   // Large icons
  xl: '32px',   // Extra large
};
```

**Current State**: Icons are scattered, inconsistent sizing

**Benefits**:
- Visual consistency
- Better accessibility
- Easier maintenance
- Performance (icon sprite)

**Effort**: Medium (8-10 hours)
**Impact**: High - Visual consistency across app

---

### 6. Content Guidelines & Microcopy Standards ⭐⭐

**What**: Writing style guide for UI text

**GitLab Principles**:
- Clear and direct voice
- Brevity (users skim, don't read)
- Objective-focused (task first, solution second)
- Sentence case (not title case)
- Avoid jargon and colloquialisms
- Consistent terminology

**Implementation**:
Create `CONTENT_GUIDELINES.md` with:

1. **Voice & Tone**
   - Professional yet friendly
   - Helpful and understanding
   - Respectful of user's work

2. **Writing Patterns**
   ```
   ❌ "We're sorry, but an error occurred"
   ✅ "Unable to save changes. Please try again."

   ❌ "In order to verify your account"
   ✅ "Verify your account"

   ❌ "Integrate with Sentry to monitor your errors"
   ✅ "Monitor your errors by integrating with Sentry"
   ```

3. **Capitalization**
   - Sentence case for labels: "Email address" not "Email Address"
   - Sentence case for buttons: "Save changes" not "Save Changes"

4. **Error Messages**
   - What happened + Why + What to do
   - Specific, not generic
   - No "sorry" or filler words

**Effort**: Low (4-6 hours to document, ongoing to implement)
**Impact**: High - Improves UX and professionalism

---

### 7. Component Library Enhancement ⭐⭐

**What**: Standardize existing components following Pajamas patterns

**Components to Enhance**:

#### Button Variants
```tsx
// Current: ButtonType enum
// Enhanced: More semantic variants
<Button variant="primary">Save</Button>
<Button variant="danger">Delete</Button>
<Button variant="link">Cancel</Button>
<Button size="sm" | "md" | "lg">Action</Button>
<Button loading>Saving...</Button>
<Button icon={<SaveIcon />}>Save</Button>
```

#### Input Variants
```tsx
<Input
  state="error" | "success" | "default"
  size="sm" | "md" | "lg"
  prefix={<SearchIcon />}
  suffix={<ClearIcon />}
/>
```

#### Card Variants
```tsx
<Card variant="default" | "elevated" | "flat">
  <Card.Header>
  <Card.Body>
  <Card.Footer>
</Card>
```

**Effort**: Medium (10-15 hours)
**Impact**: High - Consistent component API

---

## 🎯 Priority 3: Medium Impact, High Effort

### 8. Accessibility Enhancements ⭐⭐⭐

**What**: WCAG AA compliance and keyboard navigation

**GitLab Standards**:
- All colors meet 4.5:1 contrast ratio
- Keyboard navigation for all interactive elements
- ARIA labels for icons and actions
- Screen reader support
- Focus indicators

**Implementation Checklist**:
- [ ] Audit color contrast ratios
- [ ] Add keyboard shortcuts documentation
- [ ] Implement focus management
- [ ] Add ARIA labels to icons
- [ ] Test with screen readers
- [ ] Create accessibility testing guide

**Tools**:
- axe DevTools for automated testing
- Lighthouse for audits
- NVDA/JAWS for screen reader testing

**Effort**: High (20-30 hours)
**Impact**: High - Legal compliance, inclusivity

---

### 9. Design Tokens for Theming ⭐⭐

**What**: Complete design token system supporting multiple themes

**GitLab Approach**:
- 10 theme options (Indigo, Blue, Green, Red, Light, Dark, etc.)
- Consistent token naming
- Same palettes for light/dark, different applications

**Implementation**:
```typescript
// Theme tokens
export const createTheme = (variant: ThemeVariant) => ({
  colors: {
    primary: themeColors[variant].primary,
    surface: themeColors[variant].surface,
    text: themeColors[variant].text,
  },
  spacing: spacing, // Universal across themes
  typography: typography, // Universal across themes
});

// Usage
<ThemeProvider theme={createTheme('dark')}>
  <App />
</ThemeProvider>
```

**Benefits**:
- Dark mode support
- User preference customization
- Brand customization per namespace
- Better accessibility

**Effort**: High (15-25 hours)
**Impact**: Medium - Nice to have, user preference

---

### 10. Animation & Transition System ⭐

**What**: Standardized animations and transitions

**GitLab Approach**:
- Consistent timing functions
- Purposeful animations (not decorative)
- Performance-conscious
- Respects `prefers-reduced-motion`

**Implementation**:
```typescript
// src/styles/animations.ts
export const transitions = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};

export const easings = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const animations = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  slideDown: keyframes`
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
};
```

**Effort**: Medium (8-12 hours)
**Impact**: Low - Polish, not essential

---

## 📊 Prioritization Matrix

| Feature | Impact | Effort | Priority | Timeline |
|---------|--------|--------|----------|----------|
| Typography System | High | Low | **P1** | Week 1 |
| Color Tokens | High | Low | **P1** | Week 1 |
| Form Validation | High | Medium | **P1** | Week 2 |
| Content Guidelines | High | Low | **P1** | Week 1 |
| Enhanced Alerts | Medium | Medium | **P2** | Week 3 |
| Icon System | High | Medium | **P2** | Week 3-4 |
| Component Library | High | Medium | **P2** | Week 4-5 |
| Accessibility | High | High | **P3** | Week 6-8 |
| Theming System | Medium | High | **P3** | Week 8-10 |
| Animations | Low | Medium | **P4** | Future |

---

## 🚀 Recommended Implementation Order

### Phase 1: Foundations (Weeks 1-2)
1. Typography System
2. Color Token System
3. Content Guidelines Documentation
4. Form Validation Standards

**Goal**: Establish design language foundations

### Phase 2: Components (Weeks 3-5)
1. Enhanced Alert Component
2. Icon System
3. Component Library Standardization

**Goal**: Consistent component patterns

### Phase 3: Polish (Weeks 6-10)
1. Accessibility Enhancements
2. Theming System (Dark Mode)
3. Animation System

**Goal**: Professional polish and inclusivity

---

## 💡 Quick Wins (Start Today)

These can be implemented immediately with minimal effort:

### 1. Content Audit ✅
- Review all UI text
- Fix capitalization (use sentence case)
- Simplify error messages
- Remove jargon and filler words

### 2. Consistent Spacing ✅
- Already done! Keep using design tokens

### 3. Button Cleanup ✅
- Standardize button labels
- Use action-oriented text
- Consistent button variants

### 4. Form Labels ✅
- Sentence case for all labels
- Required fields clearly marked
- Help text where needed

---

## 📚 Documentation Needed

For each implementation, create:

1. **Technical Documentation**
   - API reference
   - Usage examples
   - Migration guide

2. **Design Guidelines**
   - When to use
   - Best practices
   - Accessibility notes

3. **Storybook Stories** (Optional)
   - Component variants
   - Interactive examples
   - Props documentation

---

## 🎨 Design System Maturity Levels

**Current Level**: **Level 2 - Systematic**
- Design tokens implemented ✅
- Layout system defined ✅
- Some components standardized ✅
- Basic documentation ✅

**Target Level**: **Level 4 - Integrated**
- Complete component library
- Comprehensive design tokens
- Accessibility standards
- Content guidelines
- Theming support
- Full documentation

---

## 🤔 Should We Implement All of This?

**No!** Pick what makes sense for Aletheia's needs:

### Must Have (Do First)
- ✅ Spacing System (Done!)
- ✅ Layout System (Done!)
- 🔲 Typography System
- 🔲 Color Tokens
- 🔲 Form Validation
- 🔲 Content Guidelines

### Should Have (High Value)
- 🔲 Icon System
- 🔲 Enhanced Alerts
- 🔲 Component Standardization
- 🔲 Accessibility Improvements

### Nice to Have (If Time Permits)
- 🔲 Theming/Dark Mode
- 🔲 Animation System
- 🔲 Advanced Components

---

## 📖 Resources

- **GitLab Pajamas**: https://design.gitlab.com
- **Pajamas Components**: https://design.gitlab.com/components/overview
- **Color System**: https://design.gitlab.com/product-foundations/colors
- **Typography**: https://design.gitlab.com/product-foundations/typography
- **Accessibility**: https://design.gitlab.com/usability/inclusive-design

---

## 🎯 Next Steps

1. **Review this roadmap** - Decide which features align with Aletheia's goals
2. **Prioritize** - Pick 2-3 features to start with
3. **Plan** - Create implementation plan with timelines
4. **Execute** - Build incrementally, document as you go
5. **Iterate** - Get feedback and refine

**Let me know which features you'd like to implement first, and I can help build them!**

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Status**: Planning Phase
