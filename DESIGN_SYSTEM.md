# Aletheia Design System

**Based on GitLab Pajamas layout principles with Aletheia's design identity**

This design system provides a comprehensive set of design tokens, layout utilities, and components to ensure consistency across the Aletheia platform. It combines the robust 8px spacing system from GitLab's Pajamas design system with Aletheia's unique visual identity.

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Spacing System](#spacing-system)
3. [Layout System](#layout-system)
4. [Components](#components)
5. [Usage Examples](#usage-examples)
6. [Migration Guide](#migration-guide)

---

## Design Principles

### Core Philosophy

> "By following a set spatial convention, we decrease design complexity while increasing consistency."
> — GitLab Pajamas Design System

Our design system follows these key principles:

1. **8px Base Unit**: All spacing values are multiples of 8px for visual consistency
2. **Semantic Naming**: Spacing tokens use meaningful names (sm, md, lg) instead of arbitrary numbers
3. **Responsive First**: Design tokens support responsive behavior out of the box
4. **Component Consistency**: Reusable components ensure consistent patterns across the app
5. **Preserved Identity**: All color, typography, and brand elements remain uniquely Aletheia

---

## Spacing System

### The 8px Grid

All spacing in Aletheia follows an 8px base unit. This creates a harmonious visual rhythm and makes spacing decisions easier.

### Spacing Scale

```typescript
import { spacing, spacingRem, spacingPx } from '../styles';
```

| Token | Rem | Pixels | Use Case |
|-------|-----|--------|----------|
| `spacing.xxs` | 0.125rem | 2px | Minimal spacing, fine-tuned adjustments |
| `spacing.xs` | 0.25rem | 4px | Very tight spacing |
| `spacing.sm` | 0.5rem | 8px | Related elements within a component |
| `spacing.button` | 0.75rem | 12px | Horizontal padding for buttons/tabs/forms |
| `spacing.md` | 1rem | 16px | Unrelated elements or component sections |
| `spacing.lg` | 1.5rem | 24px | Content subsections |
| `spacing.xl` | 2rem | 32px | Major content sections |
| `spacing['2xl']` | 3rem | 48px | Large section dividers |
| `spacing['3xl']` | 4rem | 64px | Extra large spacing |
| `spacing['4xl']` | 6rem | 96px | Page-level spacing |
| `spacing['5xl']` | 8rem | 128px | Extra large page-level spacing |
| `spacing['6xl']` | 10rem | 160px | Maximum spacing value |

### Semantic Spacing Guidelines

**When to use which spacing:**

- **2px-4px (xxs-xs)**: Internal component spacing, fine-tuned adjustments
  ```tsx
  marginRight: spacing.xs // 4px between icon and text
  ```

- **8px (sm)**: Separating related elements
  ```tsx
  gap: spacing.sm // 8px gap between related buttons
  ```

- **16px (md)**: Separating unrelated elements
  ```tsx
  gap: spacing.md // 16px gap between card sections
  ```

- **24px (lg)**: Dividing content subsections
  ```tsx
  marginBottom: spacing.lg // 24px between subsections
  ```

- **32px (xl)**: Dividing major content sections
  ```tsx
  padding: spacing.xl // 32px padding for card content
  ```

- **48px+ (2xl and above)**: Large dividers and page-level spacing
  ```tsx
  padding: spacing['3xl'] // 64px page container padding
  ```

### Helper Functions

```typescript
import { getSpacing, spacingValue } from '../styles';

// Get spacing by multiplier
getSpacing(2) // Returns '1rem' (16px)
getSpacing(4) // Returns '2rem' (32px)

// Create spacing strings (like CSS shorthand)
spacingValue(5)          // '1rem'
spacingValue(5, 3)       // '1rem 0.5rem'
spacingValue(5, 3, 5, 3) // '1rem 0.5rem 1rem 0.5rem'
```

### Presets

```typescript
import { padding, margin, gap } from '../styles';

// Common padding presets
padding.card        // '1rem' (16px)
padding.cardLarge   // '2rem' (32px)
padding.button      // '0.5rem 0.75rem' (8px 12px)
padding.input       // '0.5rem 0.75rem' (8px 12px)
padding.modal       // '1.5rem' (24px)
padding.section     // '2rem' (32px)
padding.page        // '4rem' (64px)

// Common margin presets
margin.elementGap   // '0.5rem' (8px)
margin.componentGap // '1rem' (16px)
margin.sectionGap   // '1.5rem' (24px)
margin.majorGap     // '2rem' (32px)

// Gap utilities for flexbox/grid
gap.sm             // '0.5rem' (8px)
gap.md             // '1rem' (16px)
gap.lg             // '1.5rem' (24px)
```

---

## Layout System

### Container Widths

```typescript
import { containerWidths } from '../styles';
```

| Breakpoint | Max Width |
|------------|-----------|
| `sm` | 540px |
| `md` | 720px |
| `lg` | 960px |
| `xl` | 1140px |
| `xxl` | 1320px |
| `full` | 100% |

### Component Heights

```typescript
import { heights } from '../styles';
```

| Component | Height |
|-----------|--------|
| `header` | 56px (7 × 8px) |
| `button` | 40px (5 × 8px) |
| `buttonSmall` | 32px (4 × 8px) |
| `buttonLarge` | 48px (6 × 8px) |
| `input` | 40px (5 × 8px) |
| `navbar` | 64px (8 × 8px) |
| `toolbar` | 48px (6 × 8px) |

### Border Radius

```typescript
import { borderRadius } from '../styles';
```

| Token | Value | Use Case |
|-------|-------|----------|
| `none` | 0 | No rounding |
| `sm` | 4px | Inputs, buttons |
| `md` | 8px | Modals |
| `lg` | 10px | Cards (Aletheia standard) |
| `xl` | 16px | Large cards |
| `2xl` | 24px | Extra large elements |
| `round` | 30px | Pills, rounded buttons |
| `circle` | 50% | Avatars |
| `full` | 9999px | Fully rounded |

### Shadows

```typescript
import { shadows } from '../styles';
```

| Token | Shadow | Use Case |
|-------|--------|----------|
| `xs` | `0px 1px 2px rgba(0,0,0,0.1)` | Minimal elevation |
| `sm` | `0px 2px 2px rgba(0,0,0,0.25)` | Inputs, light elements |
| `md` | `0px 3px 3px rgba(0,0,0,0.25)` | Cards (standard) |
| `lg` | `0px 4px 6px rgba(0,0,0,0.25)` | Elevated cards |
| `xl` | `0px 0px 15px rgba(0,0,0,0.25)` | Modals, large shadows |
| `hover` | `0px 3px 3px rgba(0,0,0,0.35)` | Hover states |
| `selected` | `0px 4px 8px rgba(0,0,0,0.3)` | Selected elements |

### Z-Index Layers

```typescript
import { zIndex } from '../styles';
```

| Layer | Value | Use Case |
|-------|-------|----------|
| `base` | 0 | Default layer |
| `dropdown` | 100 | Dropdown menus |
| `sticky` | 200 | Sticky elements |
| `fixed` | 300 | Fixed positioning |
| `modal` | 500 | Modals |
| `tooltip` | 700 | Tooltips |
| `header` | 1000 | Main header |
| `drawer` | 1200 | Side drawers |

### Flexbox Utilities

```typescript
import { flexbox, createFlexGap } from '../styles';

// Pre-built flexbox patterns
<div style={flexbox.center}>Centered content</div>
<div style={flexbox.rowBetween}>Space between items</div>
<div style={flexbox.columnCentered}>Centered column</div>

// Or create custom flex with gap
const myFlex = createFlexGap(5, 'row'); // 16px gap, row direction
```

Available flexbox patterns:
- `flexbox.row` / `flexbox.column`
- `flexbox.center` - Center both axes
- `flexbox.centerH` - Center horizontally
- `flexbox.centerV` - Center vertically
- `flexbox.spaceBetween` / `flexbox.spaceAround` / `flexbox.spaceEvenly`
- `flexbox.rowCentered` / `flexbox.columnCentered`
- `flexbox.rowBetween` - Row with space-between

### Layout Helpers

```typescript
import {
  createCardLayout,
  createResponsivePadding,
  truncateText,
  createSticky
} from '../styles';

// Create card with standard styling
const cardStyle = createCardLayout('elevated');

// Responsive padding
const responsivePadding = createResponsivePadding(5, 6, 9);
// Mobile: 16px, Tablet: 24px, Desktop: 64px

// Truncate text
const truncate = truncateText(2); // 2 lines with ellipsis

// Sticky positioning
const stickyHeader = createSticky('top', 0);
```

---

## Components

### Grid System

#### GridContainer

```tsx
import { GridContainer } from '../components/Grid';

<GridContainer maxWidth="lg" spacing="md" centered>
  {/* Content */}
</GridContainer>
```

**Props:**
- `maxWidth`: `sm | md | lg | xl | xxl | full` (default: `xl`)
- `spacing`: Any spacing token (default: `md`)
- `fluid`: Boolean - full width container
- `centered`: Boolean - center content horizontally

#### ResponsiveGrid

```tsx
import { ResponsiveGrid } from '../components/Grid';

// 1 column on mobile, 2 on tablet, 3 on desktop
<ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ResponsiveGrid>
```

**Props:**
- `columns`: Number or `{ xs, sm, md, lg, xl }`
- `gap`: Uniform gap between all items
- `rowGap`: Vertical gap only
- `columnGap`: Horizontal gap only
- `alignItems`: Vertical alignment
- `justifyContent`: Horizontal alignment

---

## Usage Examples

### Example 1: Card Component with Design Tokens

```tsx
import styled from 'styled-components';
import { spacing, borderRadius, shadows } from '../styles';

const StyledCard = styled.div`
  padding: ${spacing.xl}; /* 32px */
  border-radius: ${borderRadius.lg}; /* 10px - Aletheia standard */
  box-shadow: ${shadows.md}; /* Standard card shadow */
  gap: ${spacing.md}; /* 16px gap between sections */

  .card-header {
    margin-bottom: ${spacing.lg}; /* 24px */
  }

  .card-actions {
    margin-top: ${spacing.md}; /* 16px */
    gap: ${spacing.sm}; /* 8px between buttons */
  }
`;
```

### Example 2: Responsive Layout with MUI

```tsx
import { Box } from '@mui/material';
import { spacing, responsiveSpacing } from '../styles';

<Box
  sx={{
    padding: {
      xs: responsiveSpacing.pagePadding.mobile,   // 16px
      md: responsiveSpacing.pagePadding.tablet,   // 24px
      lg: responsiveSpacing.pagePadding.desktop,  // 64px
    },
    gap: spacing.md, // 16px
  }}
>
  {/* Content */}
</Box>
```

### Example 3: Form Layout

```tsx
import styled from 'styled-components';
import { spacing, heights, borderRadius } from '../styles';

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}; /* 8px between label and input */
  margin-bottom: ${spacing.md}; /* 16px between form groups */

  input {
    height: ${heights.input}; /* 40px */
    padding: ${spacing.sm} ${spacing.button}; /* 8px 12px */
    border-radius: ${borderRadius.sm}; /* 4px */
  }
`;
```

### Example 4: Using Grid Components

```tsx
import { GridContainer, ResponsiveGrid } from '../components/Grid';

function Dashboard() {
  return (
    <GridContainer maxWidth="xl" spacing="xl">
      <ResponsiveGrid
        columns={{ xs: 1, sm: 2, lg: 3 }}
        gap="lg"
      >
        <DashboardCard title="Card 1" />
        <DashboardCard title="Card 2" />
        <DashboardCard title="Card 3" />
      </ResponsiveGrid>
    </GridContainer>
  );
}
```

---

## Migration Guide

### Migrating from Hardcoded Values

**Before:**
```tsx
const Button = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0px 3px 3px rgba(0,0,0,0.25);
`;
```

**After:**
```tsx
import { spacing, borderRadius, shadows } from '../styles';

const Button = styled.button`
  padding: ${spacing.sm} ${spacing.button}; /* 8px 12px */
  border-radius: ${borderRadius.sm}; /* 4px */
  margin-bottom: ${spacing.md}; /* 16px */
  box-shadow: ${shadows.md}; /* Standard card shadow */
`;
```

### Migrating MUI Components

**Before:**
```tsx
<Box sx={{ padding: "32px", gap: "16px" }}>
  Content
</Box>
```

**After:**
```tsx
import { spacing } from '../styles';

<Box sx={{ padding: spacing.xl, gap: spacing.md }}>
  Content
</Box>
```

### Benefits of Migration

1. **Consistency**: All spacing follows the same 8px grid
2. **Maintainability**: Change spacing values in one place
3. **Semantics**: Code is self-documenting with meaningful names
4. **Responsiveness**: Design tokens support responsive behavior
5. **Type Safety**: TypeScript autocomplete for all tokens

---

## Quick Reference

### Import Statements

```typescript
// Spacing
import { spacing, spacingRem, spacingPx, gap, padding, margin } from '../styles';

// Layout
import {
  containerWidths,
  heights,
  borderRadius,
  shadows,
  zIndex,
  flexbox
} from '../styles';

// Helpers
import {
  getSpacing,
  spacingValue,
  createFlexGap,
  createGridGap,
  createCardLayout,
  truncateText
} from '../styles';

// Components
import { GridContainer, GridItem, ResponsiveGrid } from '../components/Grid';

// Colors (unchanged)
import colors from '../styles/colors';
```

### Common Patterns Cheat Sheet

```tsx
// Card styling
padding: ${spacing.xl};           // 32px major section
borderRadius: ${borderRadius.lg}; // 10px Aletheia standard
boxShadow: ${shadows.md};         // Standard card shadow

// Button styling
height: ${heights.button};        // 40px standard
padding: ${spacing.sm} ${spacing.button}; // 8px 12px
borderRadius: ${borderRadius.sm}; // 4px

// Section spacing
marginBottom: ${spacing.lg};      // 24px subsection
gap: ${spacing.md};               // 16px between elements

// Flexbox
display: flex;
gap: ${spacing.sm};               // 8px related items
gap: ${spacing.md};               // 16px unrelated items
```

---

## Further Resources

- **GitLab Pajamas**: https://design.gitlab.com
- **Aletheia Colors**: `/src/styles/colors.ts`
- **Media Queries**: `/src/styles/mediaQueries.ts`
- **Component Examples**: `/src/components/`

---

## Support

For questions or suggestions about the design system, please:
1. Check this documentation first
2. Review the source files in `/src/styles/`
3. Open an issue on GitHub
4. Contact the design team

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Based on**: GitLab Pajamas Design System + Aletheia Design Identity
