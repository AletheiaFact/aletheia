/**
 * Spacing Design Tokens
 * Based on GitLab Pajamas 8px spacing system
 *
 * Following the Pajamas principle: "By following a set spatial convention,
 * we decrease design complexity while increasing consistency."
 *
 * Base unit: 8px
 * Scale: Uses geometric progression (8 * 2^n) with augmented values for flexibility
 *
 * Usage Guidelines:
 * - 2px-4px: Internal component spacing (fine-tuned spacing)
 * - 8px: Separating related elements within a component
 * - 16px: Separating unrelated elements or component sections
 * - 24px: Dividing content subsections
 * - 32px: Dividing major content sections
 * - 48px+: Large section dividers and page-level spacing
 */

// Base spacing unit (8px)
const BASE_UNIT = 8;

/**
 * Spacing scale values in pixels
 * Follows GitLab Pajamas spacing scale
 */
export const spacingPx = {
  0: 0,
  1: 2,    // 0.125rem - Fine-tuned spacing
  2: 4,    // 0.25rem - Internal component spacing
  3: 8,    // 0.5rem - Related elements
  4: 12,   // 0.75rem - Special case: horizontal padding for tabs/buttons/forms
  5: 16,   // 1rem - Unrelated elements
  6: 24,   // 1.5rem - Content subsections
  7: 32,   // 2rem - Major content sections
  8: 48,   // 3rem - Large section dividers
  9: 64,   // 4rem - Extra large section spacing
  10: 96,  // 6rem - Page-level spacing
  11: 128, // 8rem - Extra large page-level spacing
  12: 160, // 10rem - Maximum spacing value
} as const;

/**
 * Spacing scale in rem units (assuming 1rem = 16px)
 * Preferred for responsive design
 */
export const spacingRem = {
  0: '0',
  1: '0.125rem',  // 2px
  2: '0.25rem',   // 4px
  3: '0.5rem',    // 8px
  4: '0.75rem',   // 12px
  5: '1rem',      // 16px
  6: '1.5rem',    // 24px
  7: '2rem',      // 32px
  8: '3rem',      // 48px
  9: '4rem',      // 64px
  10: '6rem',     // 96px
  11: '8rem',     // 128px
  12: '10rem',    // 160px
} as const;

/**
 * Semantic spacing tokens for common use cases
 * Use these for better code readability and consistency
 */
export const spacing = {
  // Fine-tuned spacing
  xxs: spacingRem[1],    // 2px - Minimal spacing
  xs: spacingRem[2],     // 4px - Very tight spacing

  // Component-level spacing
  sm: spacingRem[3],     // 8px - Related elements
  md: spacingRem[5],     // 16px - Unrelated elements
  lg: spacingRem[6],     // 24px - Subsections
  xl: spacingRem[7],     // 32px - Major sections

  // Large spacing
  '2xl': spacingRem[8],  // 48px - Large dividers
  '3xl': spacingRem[9],  // 64px - Extra large spacing
  '4xl': spacingRem[10], // 96px - Page-level spacing
  '5xl': spacingRem[11], // 128px - Extra large page-level
  '6xl': spacingRem[12], // 160px - Maximum spacing

  // Special purpose
  button: spacingRem[4], // 12px - Horizontal padding for buttons/tabs/forms

  // Direct access to scale
  scale: spacingRem,
  scalePx: spacingPx,
} as const;

/**
 * Helper function to get spacing value by multiplier
 * @param multiplier - Number to multiply base unit by
 * @returns Spacing value in rem
 *
 * @example
 * getSpacing(2) // Returns '1rem' (16px)
 * getSpacing(4) // Returns '2rem' (32px)
 */
export const getSpacing = (multiplier: number): string => {
  return `${(multiplier * BASE_UNIT) / 16}rem`;
};

/**
 * Helper function to create spacing strings for CSS
 * Supports 1-4 values like CSS margin/padding shorthand
 *
 * @param values - 1-4 spacing scale keys
 * @returns Space-separated spacing values
 *
 * @example
 * spacingValue(5) // Returns '1rem'
 * spacingValue(5, 3) // Returns '1rem 0.5rem'
 * spacingValue(5, 3, 5, 3) // Returns '1rem 0.5rem 1rem 0.5rem'
 */
export const spacingValue = (...values: Array<keyof typeof spacingRem>): string => {
  return values.map(v => spacingRem[v]).join(' ');
};

/**
 * Gap utilities for flexbox/grid layouts
 * Use these for consistent spacing in flex and grid containers
 */
export const gap = {
  none: '0',
  xxs: spacing.xxs,
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
} as const;

/**
 * Padding presets for common components
 * Based on Aletheia's existing patterns
 */
export const padding = {
  card: spacingValue(5),           // 16px - Standard card padding
  cardLarge: spacingValue(7),      // 32px - Large card padding
  button: spacingValue(3, 4),      // 8px 12px - Button padding
  input: spacingValue(3, 4),       // 8px 12px - Input field padding
  modal: spacingValue(6),          // 24px - Modal padding
  section: spacingValue(7),        // 32px - Section padding
  page: spacingValue(9),           // 64px - Page container padding
} as const;

/**
 * Margin presets for common spacing needs
 */
export const margin = {
  none: '0',
  auto: 'auto',
  elementGap: spacing.sm,      // 8px - Gap between related elements
  componentGap: spacing.md,    // 16px - Gap between components
  sectionGap: spacing.lg,      // 24px - Gap between sections
  majorGap: spacing.xl,        // 32px - Gap between major sections
} as const;

export default spacing;
