# Migration Note: Form Components

## Important: FormField vs FormGroup

### What Changed?

We discovered a naming conflict between:
1. **Existing `FormField.ts`** - Type definitions and factory functions for the form system
2. **New `FormGroup.tsx`** - React component for rendering form fields with validation

### The Fix

The new form wrapper component has been renamed from `FormField` to `FormGroup` to avoid conflicts.

### Original FormField (Still Exists)

```typescript
// src/components/Form/FormField.ts
export type FormField = {
  fieldName: string;
  label: string;
  type: string;
  // ... other properties
};

export const createFormField = (props: CreateFormFieldProps): FormField => {
  // Factory function for creating form field configurations
};

export const fieldValidation = (value, validationFunction) => {
  // Validation helper
};
```

**Usage** (unchanged):
```typescript
import { createFormField, FormField } from '../components/Form/FormField';

const myField: FormField = createFormField({
  fieldName: 'email',
  type: 'text',
});
```

### New FormGroup Component

```typescript
// src/components/Form/FormGroup.tsx
const FormGroup: React.FC<FormGroupProps> = ({ label, children, error, ... }) => {
  // Form field wrapper with label, validation, helper text
};
```

**Usage**:
```tsx
import { FormGroup, Input } from '../components/Form';

<FormGroup
  label="Email address"
  required
  error={errors.email}
  helperText="We'll never share your email"
>
  <Input type="email" value={email} onChange={handleChange} />
</FormGroup>
```

### Migration Required?

**No migration needed** if you're using:
- ✅ Existing `createFormField` function
- ✅ Existing `FormField` type
- ✅ Existing form system

**Update imports** if you're using documentation examples:
```tsx
// ❌ Old (from docs)
import { FormField, Input } from '../components/Form';

// ✅ New (corrected)
import { FormGroup, Input } from '../components/Form';
```

### Both Are Available

You can use both in the same file if needed:

```tsx
import {
  FormField,       // Type definition
  createFormField, // Factory function
  FormGroup,       // React component
  Input
} from '../components/Form';

// Use the factory function
const fieldConfig: FormField = createFormField({
  fieldName: 'email',
  type: 'text',
});

// Use the React component
<FormGroup label="Email" error={error}>
  <Input type="email" />
</FormGroup>
```

### Summary

- **FormField.ts** = Type definitions and utilities (unchanged, original)
- **FormGroup.tsx** = New React wrapper component for forms
- Both are exported from `src/components/Form/index.ts`
- No breaking changes to existing code
- Documentation updated to use correct names

---

**Date**: November 2025
**Impact**: None (naming clarification only)
**Action Required**: Update imports if using new FormGroup component
