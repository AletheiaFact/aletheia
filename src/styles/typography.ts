/**
 * Typography Design System
 * Based on GitLab Pajamas typography principles adapted for Aletheia
 *
 * Provides standardized font scales, line heights, font weights,
 * and heading hierarchy for consistent typography across the app.
 */

/**
 * Font families
 * Aletheia uses Open Sans for body text and Noticia Text for headings
 */
export const fontFamily = {
  body: '"Open Sans", sans-serif',
  heading: '"Noticia Text", serif',
  mono: 'Monaco, Consolas, "Courier New", monospace',
} as const;

/**
 * Font size scale
 * Uses rem units for responsive typography (assuming 1rem = 16px)
 */
export const fontSize = {
  xs: '0.75rem',     // 12px - Small labels, captions
  sm: '0.875rem',    // 14px - Secondary text, form labels
  md: '1rem',        // 16px - Body text (default)
  lg: '1.125rem',    // 18px - Large body text
  xl: '1.25rem',     // 20px - Small headings
  '2xl': '1.5rem',   // 24px - h4
  '3xl': '1.875rem', // 30px - h3
  '4xl': '2.25rem',  // 36px - h2
  '5xl': '3rem',     // 48px - h1
  '6xl': '3.75rem',  // 60px - Display headings
} as const;

/**
 * Font size in pixels (for reference and specific use cases)
 */
export const fontSizePx = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

/**
 * Line height scale
 * Provides appropriate line spacing for different text sizes
 */
export const lineHeight = {
  none: 1,
  tight: 1.25,    // Headings
  snug: 1.375,    // Subheadings
  normal: 1.5,    // Body text (default)
  relaxed: 1.75,  // Long-form content
  loose: 2,       // Very spacious text
} as const;

/**
 * Font weights
 * Maps to Open Sans and Noticia Text available weights
 */
export const fontWeight = {
  normal: 400,    // Regular text
  medium: 500,    // Headings (Noticia Text default)
  semibold: 600,  // Emphasis
  bold: 700,      // Strong emphasis
  extrabold: 800, // Extra emphasis (Open Sans only)
} as const;

/**
 * Letter spacing
 * For fine-tuning readability
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

/**
 * Heading styles
 * Pre-configured heading typography following Aletheia's design
 */
export const headings = {
  h1: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize['5xl'],      // 48px
    fontWeight: fontWeight.medium,  // 500
    lineHeight: lineHeight.tight,   // 1.25
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize['4xl'],      // 36px
    fontWeight: fontWeight.medium,  // 500
    lineHeight: lineHeight.tight,   // 1.25
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize['3xl'],      // 30px
    fontWeight: fontWeight.medium,  // 500
    lineHeight: lineHeight.snug,    // 1.375
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize['2xl'],      // 24px
    fontWeight: fontWeight.medium,  // 500
    lineHeight: lineHeight.snug,    // 1.375
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl,          // 20px
    fontWeight: fontWeight.medium,  // 500
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,          // 18px
    fontWeight: fontWeight.medium,  // 500
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
} as const;

/**
 * Body text styles
 * Pre-configured body typography
 */
export const body = {
  // Large body text
  large: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.lg,          // 18px
    fontWeight: fontWeight.normal,  // 400
    lineHeight: lineHeight.relaxed, // 1.75
    letterSpacing: letterSpacing.normal,
  },
  // Default body text
  default: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,          // 16px
    fontWeight: fontWeight.normal,  // 400
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
  // Small body text
  small: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,          // 14px
    fontWeight: fontWeight.normal,  // 400
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
  // Extra small (captions, labels)
  caption: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,          // 12px
    fontWeight: fontWeight.normal,  // 400
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.wide,
  },
} as const;

/**
 * Responsive typography utilities
 * Font sizes that adapt to screen size using clamp()
 */
export const responsiveFontSize = {
  h1: 'clamp(2.25rem, 5vw, 3rem)',      // 36px - 48px
  h2: 'clamp(1.875rem, 4vw, 2.25rem)',  // 30px - 36px
  h3: 'clamp(1.5rem, 3vw, 1.875rem)',   // 24px - 30px
  h4: 'clamp(1.25rem, 2.5vw, 1.5rem)',  // 20px - 24px
  body: 'clamp(0.875rem, 1.5vw, 1rem)', // 14px - 16px
} as const;

/**
 * Text transform utilities
 */
export const textTransform = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  none: 'none',
} as const;

/**
 * Text decoration utilities
 */
export const textDecoration = {
  underline: 'underline',
  lineThrough: 'line-through',
  none: 'none',
} as const;

/**
 * Text alignment utilities
 */
export const textAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify',
} as const;

/**
 * Helper function to create responsive font size
 * @param min - Minimum font size in px
 * @param preferred - Preferred viewport-based size
 * @param max - Maximum font size in px
 * @returns CSS clamp() string
 *
 * @example
 * createResponsiveFontSize(16, '2vw', 24) // 'clamp(1rem, 2vw, 1.5rem)'
 */
export const createResponsiveFontSize = (
  min: number,
  preferred: string,
  max: number
): string => {
  return `clamp(${min / 16}rem, ${preferred}, ${max / 16}rem)`;
};

/**
 * Helper function to create text style object
 * @param size - Font size key
 * @param weight - Font weight key
 * @param height - Line height key
 * @returns Text style object
 *
 * @example
 * createTextStyle('md', 'normal', 'normal')
 * // Returns: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 }
 */
export const createTextStyle = (
  size: keyof typeof fontSize,
  weight: keyof typeof fontWeight = 'normal',
  height: keyof typeof lineHeight = 'normal'
) => ({
  fontSize: fontSize[size],
  fontWeight: fontWeight[weight],
  lineHeight: lineHeight[height],
});

/**
 * Typography presets for common UI elements
 */
export const uiText = {
  // Button text
  button: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,          // 14px
    fontWeight: fontWeight.semibold, // 600
    lineHeight: lineHeight.none,    // 1
    letterSpacing: letterSpacing.normal,
  },
  // Form labels
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,          // 14px
    fontWeight: fontWeight.medium,  // 500
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
  // Input text
  input: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,          // 16px
    fontWeight: fontWeight.normal,  // 400
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
  // Helper text
  helper: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,          // 12px
    fontWeight: fontWeight.normal,  // 400
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
  // Error text
  error: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,          // 14px
    fontWeight: fontWeight.normal,  // 400
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
  // Badge/tag text
  badge: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,          // 12px
    fontWeight: fontWeight.semibold, // 600
    lineHeight: lineHeight.none,    // 1
    letterSpacing: letterSpacing.wide,
    textTransform: textTransform.uppercase,
  },
  // Code text
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,          // 14px
    fontWeight: fontWeight.normal,  // 400
    lineHeight: lineHeight.normal,  // 1.5
    letterSpacing: letterSpacing.normal,
  },
} as const;

/**
 * Export consolidated typography object
 */
export const typography = {
  fontFamily,
  fontSize,
  fontSizePx,
  lineHeight,
  fontWeight,
  letterSpacing,
  headings,
  body,
  uiText,
  responsiveFontSize,
  textTransform,
  textDecoration,
  textAlign,
} as const;

export default typography;
