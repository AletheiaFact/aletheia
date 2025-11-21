# Design System Usage Examples

This document provides practical examples of using Aletheia's design system components and tokens.

---

## Typography Examples

### Using Typography Tokens

```tsx
import { typography, fontSize, fontWeight, lineHeight } from '../styles';

// Headings
const Heading1 = styled.h1`
  ${typography.headings.h1}
`;

const Heading2 = styled.h2`
  font-size: ${fontSize['4xl']};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.tight};
`;

// Body text
const BodyText = styled.p`
  ${typography.body.default}
`;

// Custom text style
const Label = styled.label`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.normal};
`;
```

### Responsive Typography

```tsx
import { responsiveFontSize } from '../styles';

const ResponsiveHeading = styled.h1`
  font-size: ${responsiveFontSize.h1}; // 36px - 48px based on viewport
`;
```

---

## Semantic Colors Examples

### Using Semantic Colors

```tsx
import { semanticColors } from '../styles';

// Surfaces
const Card = styled.div`
  background-color: ${semanticColors.surface.elevated};
  border: 1px solid ${semanticColors.border.default};
`;

// Text
const PrimaryText = styled.p`
  color: ${semanticColors.text.primary};
`;

const SecondaryText = styled.span`
  color: ${semanticColors.text.secondary};
`;

// Actions (Buttons)
const PrimaryButton = styled.button`
  background-color: ${semanticColors.action.primary};
  color: ${semanticColors.text.inverse};

  &:hover {
    background-color: ${semanticColors.action.primaryHover};
  }

  &:disabled {
    background-color: ${semanticColors.action.primaryDisabled};
  }
`;

// Feedback (Alerts)
const ErrorAlert = styled.div`
  background-color: ${semanticColors.feedback.errorLight};
  border-left: 4px solid ${semanticColors.feedback.error};
  color: ${semanticColors.text.primary};
`;
```

---

## Form Validation Examples

### Basic Form with Validation

```tsx
import { useState } from 'react';
import { FormGroup, Input } from '../components/Form';
import { validators } from '../utils/validation';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Real-time validation
    const result = validators.email()(value);
    setEmailError(result.error || '');
  };

  return (
    <form>
      <FormGroup
        label="Email address"
        name="email"
        required
        error={emailError}
        helperText="We'll never share your email"
      >
        <Input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="name@example.com"
          state={emailError ? 'error' : 'default'}
        />
      </FormGroup>
    </form>
  );
}
```

### Advanced Form with Custom Validation

```tsx
import { useState } from 'react';
import { FormGroup, Input, Textarea } from '../components/Form';
import { ValidatorBuilder } from '../utils/validation';

function CreateClaimForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Custom validator
  const titleValidator = new ValidatorBuilder()
    .required('Claim title')
    .minLength(10, 'Claim title')
    .maxLength(200, 'Claim title')
    .build();

  const descriptionValidator = new ValidatorBuilder()
    .required('Description')
    .minLength(50, 'Description')
    .build();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);

    const result = titleValidator(value);
    setErrors(prev => ({ ...prev, title: result.error || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const titleResult = titleValidator(title);
    const descriptionResult = descriptionValidator(description);

    setErrors({
      title: titleResult.error || '',
      description: descriptionResult.error || '',
    });

    if (titleResult.isValid && descriptionResult.isValid) {
      // Submit form
      console.log('Form is valid!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup
        label="Claim title"
        name="title"
        required
        error={errors.title}
        helperText="Be specific and concise"
      >
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          state={errors.title ? 'error' : 'default'}
        />
      </FormGroup>

      <FormGroup
        label="Description"
        name="description"
        required
        error={errors.description}
        helperText="Provide context for fact-checkers"
      >
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          state={errors.description ? 'error' : 'default'}
          rows={4}
        />
      </FormGroup>

      <button type="submit">Create claim</button>
    </form>
  );
}
```

---

## Skeleton Loader Examples

### Basic Skeleton

```tsx
import { Skeleton } from '../components/Skeleton';

function LoadingText() {
  return <Skeleton variant="text" count={3} />;
}

function LoadingAvatar() {
  return <Skeleton variant="circular" width={40} height={40} />;
}

function LoadingCard() {
  return <Skeleton variant="rounded" width="100%" height={200} />;
}
```

### Using Skeleton Presets

```tsx
import {
  SkeletonCard,
  SkeletonProfile,
  SkeletonList,
  SkeletonReviewCard,
  SkeletonClaimCard,
} from '../components/Skeleton';

function LoadingStates() {
  return (
    <>
      {/* Loading card */}
      <SkeletonCard height={250} />

      {/* Loading profile */}
      <SkeletonProfile />

      {/* Loading list */}
      <SkeletonList items={5} />

      {/* Loading review card (Aletheia-specific) */}
      <SkeletonReviewCard />

      {/* Loading claim card (Aletheia-specific) */}
      <SkeletonClaimCard />
    </>
  );
}
```

### Conditional Loading

```tsx
import { useState, useEffect } from 'react';
import { SkeletonReviewCard } from '../components/Skeleton';
import ReviewCard from '../components/ClaimReview/ReviewCard';

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reviews
    fetchReviews().then(data => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {loading ? (
        // Show skeletons while loading
        <>
          <SkeletonReviewCard />
          <SkeletonReviewCard />
          <SkeletonReviewCard />
        </>
      ) : (
        // Show actual content when loaded
        reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))
      )}
    </div>
  );
}
```

---

## Grid System Examples

### Responsive Grid

```tsx
import { ResponsiveGrid } from '../components/Grid';
import { SkeletonCard } from '../components/Skeleton';

function Dashboard() {
  return (
    <ResponsiveGrid
      columns={{ xs: 1, sm: 2, md: 3 }}
      gap="lg"
    >
      <DashboardCard title="Claims" />
      <DashboardCard title="Reviews" />
      <DashboardCard title="Activity" />
    </ResponsiveGrid>
  );
}
```

### Container with Grid

```tsx
import { GridContainer, ResponsiveGrid } from '../components/Grid';

function ClaimsList() {
  return (
    <GridContainer maxWidth="xl" spacing="xl" centered>
      <ResponsiveGrid columns={{ xs: 1, md: 2 }} gap="md">
        {claims.map(claim => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </ResponsiveGrid>
    </GridContainer>
  );
}
```

---

## Complete Component Example

Here's a complete example combining typography, colors, forms, and loading states:

```tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  typography,
  semanticColors,
  spacing,
  borderRadius,
  shadows,
} from '../styles';
import { FormGroup, Input } from '../components/Form';
import { SkeletonCard } from '../components/Skeleton';
import { validators } from '../utils/validation';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${spacing['3xl']};
`;

const Heading = styled.h1`
  ${typography.headings.h1}
  color: ${semanticColors.text.primary};
  margin-bottom: ${spacing.xl};
`;

const Description = styled.p`
  ${typography.body.default}
  color: ${semanticColors.text.secondary};
  margin-bottom: ${spacing['2xl']};
`;

const Card = styled.div`
  background: ${semanticColors.surface.elevated};
  border: 1px solid ${semanticColors.border.default};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  box-shadow: ${shadows.md};
`;

const SubmitButton = styled.button`
  background-color: ${semanticColors.action.primary};
  color: ${semanticColors.text.inverse};
  padding: ${spacing.sm} ${spacing.xl};
  border: none;
  border-radius: ${borderRadius.sm};
  ${typography.uiText.button}
  cursor: pointer;

  &:hover {
    background-color: ${semanticColors.action.primaryHover};
  }

  &:disabled {
    background-color: ${semanticColors.action.primaryDisabled};
    cursor: not-allowed;
  }
`;

function VerificationRequestPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const result = validators.email()(value);
    setEmailError(result.error || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validators.email()(email);
    if (result.isValid) {
      console.log('Request submitted!');
    } else {
      setEmailError(result.error || '');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <SkeletonCard height={400} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Heading>Request verification</Heading>
      <Description>
        Submit your claim for fact-checking verification. Our team will review
        and respond within 48 hours.
      </Description>

      <Card>
        <form onSubmit={handleSubmit}>
          <FormGroup
            label="Email address"
            name="email"
            required
            error={emailError}
            helperText="We'll notify you when verification is complete"
          >
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="name@example.com"
              state={emailError ? 'error' : 'default'}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={Boolean(emailError)}>
            Submit request
          </SubmitButton>
        </form>
      </Card>
    </PageContainer>
  );
}

export default VerificationRequestPage;
```

---

## Best Practices

### DO ✅

```tsx
// Use semantic colors
color: ${semanticColors.text.primary}

// Use typography tokens
${typography.headings.h2}

// Use spacing tokens
padding: ${spacing.xl}

// Use design system components
<FormGroup label="Email" required>
  <Input type="email" />
</FormGroup>

// Show loading states
{loading ? <SkeletonCard /> : <Card />}
```

### DON'T ❌

```tsx
// Hardcode colors
color: #111111

// Hardcode font sizes
font-size: 24px

// Hardcode spacing
padding: 32px

// Create custom form fields without using FormGroup
<div>
  <label>Email</label>
  <input />
</div>

// Show nothing while loading
{!loading && <Card />}
```

---

## More Examples

For more examples, see:
- `DESIGN_SYSTEM.md` - Complete design system documentation
- `CONTENT_GUIDELINES.md` - Writing and microcopy standards
- Updated components in `src/components/` directory

---

**Version**: 1.0.0
**Last Updated**: November 2025
