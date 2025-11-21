# Aletheia Design System - Quick Start Guide

Welcome to Aletheia's enhanced design system! This guide will get you started in 5 minutes.

---

## 🚀 What's New?

Based on GitLab Pajamas, we now have:
1. **Typography System** - Standardized fonts, sizes, and styles
2. **Semantic Colors** - Meaningful color tokens for theming
3. **Form Components** - Validation and beautiful forms
4. **Skeleton Loaders** - Professional loading states
5. **Content Guidelines** - Writing standards for UI text

---

## 📖 Quick Examples

### 1. Typography

```tsx
import { typography, fontSize, fontWeight } from '../styles';

// Use pre-made heading styles
const Heading = styled.h1`
  ${typography.headings.h1}
`;

// Or custom combinations
const Label = styled.label`
  font-size: ${fontSize.sm};      // 14px
  font-weight: ${fontWeight.medium}; // 500
`;
```

### 2. Colors

```tsx
import { semanticColors } from '../styles';

// Surfaces
const Card = styled.div`
  background: ${semanticColors.surface.elevated};
  border: 1px solid ${semanticColors.border.default};
`;

// Text
const Text = styled.p`
  color: ${semanticColors.text.primary};
`;

// Actions
const Button = styled.button`
  background: ${semanticColors.action.primary};

  &:hover {
    background: ${semanticColors.action.primaryHover};
  }
`;
```

### 3. Forms

```tsx
import { FormGroup, Input } from '../components/Form';
import { validators } from '../utils/validation';

function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const result = validators.email()(value);
    setError(result.error || '');
  };

  return (
    <FormGroup
      label="Email address"
      required
      error={error}
      helperText="We'll never share your email"
    >
      <Input
        type="email"
        value={email}
        onChange={handleChange}
        state={error ? 'error' : 'default'}
      />
    </FormGroup>
  );
}
```

### 4. Loading States

```tsx
import { SkeletonReviewCard, SkeletonList } from '../components/Skeleton';

function ReviewList() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <SkeletonReviewCard />;
  }

  return <ReviewCard data={data} />;
}
```

---

## 📚 Full Documentation

| Document | What's Inside |
|----------|---------------|
| **DESIGN_SYSTEM.md** | Spacing, layout, complete reference |
| **CONTENT_GUIDELINES.md** | Writing standards, error messages |
| **EXAMPLES.md** | Code examples for all features |
| **GITLAB_PAJAMAS_ROADMAP.md** | Future enhancements |
| **IMPLEMENTATION_PHASE2_SUMMARY.md** | Technical details |

---

## ✅ Checklist for New Components

When creating a new component:

- [ ] Use **typography tokens** instead of hardcoded font sizes
- [ ] Use **semantic colors** instead of color values
- [ ] Use **spacing tokens** instead of pixel values
- [ ] Add **loading states** with Skeleton components
- [ ] Follow **content guidelines** for UI text
- [ ] Use **FormField** for form inputs
- [ ] Validate forms with **validation utilities**

---

## 🎯 Common Imports

```tsx
// Design tokens
import {
  typography,
  fontSize,
  fontWeight,
  semanticColors,
  spacing,
  borderRadius,
  shadows,
} from '../styles';

// Components
import { GridContainer, ResponsiveGrid } from '../components/Grid';
import { FormGroup, Input, Textarea } from '../components/Form';
import { Skeleton, SkeletonReviewCard } from '../components/Skeleton';

// Utilities
import { validators, ValidatorBuilder } from '../utils/validation';
```

---

## 💡 Migration Tips

### Before
```tsx
const Button = styled.button`
  font-size: 14px;
  padding: 8px 12px;
  background: #11273a;
`;
```

### After
```tsx
const Button = styled.button`
  ${typography.uiText.button}
  padding: ${spacing.sm} ${spacing.button};
  background: ${semanticColors.action.primary};
`;
```

---

## 🆘 Need Help?

1. Check **EXAMPLES.md** for code examples
2. Read **CONTENT_GUIDELINES.md** for writing standards
3. Review **DESIGN_SYSTEM.md** for complete reference
4. Look at updated components in `src/components/` for patterns

---

## 🎨 Design Tokens Cheat Sheet

```tsx
// Typography
typography.headings.h1
typography.body.default
typography.uiText.button
fontSize.md              // 1rem (16px)
fontWeight.semibold      // 600

// Colors
semanticColors.text.primary
semanticColors.surface.elevated
semanticColors.action.primary
semanticColors.feedback.error
semanticColors.border.default

// Spacing
spacing.sm               // 0.5rem (8px)
spacing.md               // 1rem (16px)
spacing.xl               // 2rem (32px)

// Layout
borderRadius.sm          // 4px
borderRadius.lg          // 10px
shadows.md               // Standard shadow
heights.button           // 40px
```

---

Happy coding! 🚀

For questions or suggestions, open an issue or consult the documentation.

**Version**: 1.0.0
**Last Updated**: November 2025
