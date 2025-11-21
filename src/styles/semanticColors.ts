/**
 * Semantic Color System
 * Based on GitLab Pajamas color principles adapted for Aletheia
 *
 * Organizes colors by purpose/meaning rather than name.
 * This makes code more maintainable and enables easier theming.
 *
 * Use semantic colors instead of base colors whenever possible:
 * ✅ Good: color: semanticColors.text.primary
 * ❌ Bad:  color: colors.black
 */

import colors from './colors';

/**
 * Surface colors - for backgrounds and containers
 */
export const surface = {
  // Primary surfaces
  primary: colors.white,
  secondary: colors.lightNeutral,           // #f5f5f5
  tertiary: colors.lightNeutralSecondary,   // #eeeeee

  // Elevated surfaces (cards, modals)
  elevated: colors.white,

  // Overlay surfaces
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(255, 255, 255, 0.9)',

  // Disabled surfaces
  disabled: colors.lightNeutralSecondary,

  // Special surfaces
  brand: colors.primary,                    // #11273a - Navy blue
  brandLight: colors.lightTertiary,         // #dae8ea

  // Fact-check specific surfaces
  factCheckHighlight: colors.lightTertiary,
} as const;

/**
 * Text colors - for all text content
 */
export const text = {
  // Primary text hierarchy
  primary: colors.black,                    // #111111 - Main text
  secondary: colors.blackSecondary,         // #515151 - Secondary text
  tertiary: colors.neutralSecondary,        // #979a9b - Tertiary text
  quaternary: colors.neutralTertiary,       // #c2c8cc - Subtle text

  // Special text colors
  disabled: colors.neutralTertiary,
  inverse: colors.white,                    // Text on dark backgrounds
  link: colors.primary,                     // Links
  linkHover: colors.lightPrimary,           // Link hover state

  // Status text
  success: colors.active,                   // #49DE80 - Green
  warning: '#DB9F0D',                       // Orange (solid version)
  error: colors.error,                      // #ff4d4f - Red
  info: colors.lightSecondary,              // #67bef2 - Blue
} as const;

/**
 * Border colors - for borders, dividers, outlines
 */
export const border = {
  // Default borders
  default: colors.lightNeutralSecondary,    // #eeeeee
  subtle: colors.lightNeutral,              // #f5f5f5
  strong: colors.neutralTertiary,           // #c2c8cc

  // Interactive borders
  focus: colors.primary,                    // Focus outline
  hover: colors.secondary,                  // Hover state
  active: colors.lightPrimary,              // Active state

  // Status borders
  error: colors.error,
  warning: '#DB9F0D',
  success: colors.active,
  info: colors.lightSecondary,

  // Disabled
  disabled: colors.neutralTertiary,
} as const;

/**
 * Action colors - for interactive elements
 */
export const action = {
  // Primary actions (main buttons, CTAs)
  primary: colors.primary,                  // #11273a - Navy
  primaryHover: colors.lightPrimary,        // #4F8DB4 - Lighter navy
  primaryActive: colors.secondary,          // #657e8e - Pressed state
  primaryDisabled: colors.neutralTertiary,

  // Secondary actions
  secondary: colors.secondary,              // #657e8e
  secondaryHover: colors.tertiary,
  secondaryActive: colors.quartiary,
  secondaryDisabled: colors.neutralTertiary,

  // Tertiary actions (subtle, low priority)
  tertiary: colors.tertiary,
  tertiaryHover: colors.quartiary,
  tertiaryActive: colors.lightTertiary,
  tertiaryDisabled: colors.neutralTertiary,

  // Danger actions (destructive)
  danger: colors.error,                     // #ff4d4f
  dangerHover: '#ff7875',
  dangerActive: '#d32f2f',
  dangerDisabled: colors.neutralTertiary,

  // Link actions
  link: colors.primary,
  linkHover: colors.lightPrimary,
  linkActive: colors.lightSecondary,
  linkVisited: colors.secondary,
} as const;

/**
 * Feedback colors - for alerts, notifications, status indicators
 */
export const feedback = {
  // Success (positive outcomes)
  success: colors.active,                   // #49DE80 - Green
  successLight: 'rgba(73, 222, 128, 0.1)',
  successBorder: colors.active,

  // Warning (attention needed)
  warning: '#DB9F0D',                       // Orange
  warningLight: 'rgba(219, 159, 13, 0.1)',
  warningBorder: '#DB9F0D',

  // Error (problems, failures)
  error: colors.error,                      // #ff4d4f - Red
  errorLight: 'rgba(255, 77, 79, 0.1)',
  errorBorder: colors.error,

  // Info (informational)
  info: colors.lightSecondary,              // #67bef2 - Blue
  infoLight: 'rgba(103, 190, 242, 0.1)',
  infoBorder: colors.lightSecondary,

  // Tip (helpful information)
  tip: colors.lightPrimary,                 // #4F8DB4
  tipLight: 'rgba(79, 141, 180, 0.1)',
  tipBorder: colors.lightPrimary,
} as const;

/**
 * Status colors - for priority levels and states
 */
export const status = {
  // Priority levels
  critical: colors.critical,                // #d32f2f - Dark red
  high: colors.high,                        // #f57c00 - Orange
  medium: colors.medium,                    // #fbc02d - Yellow
  low: colors.low,                          // #388e3c - Green

  // Active/Inactive states
  active: colors.active,                    // #49DE80 - Green
  inactive: colors.inactive,                // #FBCC13 - Yellow

  // Online/Offline
  online: colors.active,
  offline: colors.neutralSecondary,
  away: colors.medium,

  // Processing states
  pending: colors.medium,
  processing: colors.lightSecondary,
  complete: colors.active,
  failed: colors.error,
} as const;

/**
 * Brand colors - Aletheia specific branding
 */
export const brand = {
  primary: colors.primary,                  // #11273a - Navy blue
  secondary: colors.secondary,              // #657e8e
  tertiary: colors.tertiary,                // #9bbcd1

  light: {
    primary: colors.lightPrimary,           // #4F8DB4
    secondary: colors.lightSecondary,       // #67bef2
    tertiary: colors.lightTertiary,         // #dae8ea
  },

  logo: colors.logo,                        // #E8E8E8
} as const;

/**
 * Fact-check classification colors
 * These are Aletheia-specific and should remain unchanged
 */
export const factCheck = {
  notFact: '#006060',            // Teal
  trustworthy: '#008000',        // Green
  trustworthyBut: '#5A781D',     // Olive
  arguable: '#9F6B3F',           // Brown
  misleading: '#D6395F',         // Rose
  false: '#D32B20',              // Red
  unsustainable: '#A74165',      // Mauve
  exaggerated: '#B8860B',        // Dark goldenrod
  unverifiable: '#C9502A',       // Burnt orange
} as const;

/**
 * Shadow colors - for elevation and depth
 */
export const shadow = {
  default: colors.shadow,                   // rgba(0, 0, 0, 0.25)
  light: 'rgba(0, 0, 0, 0.1)',
  medium: 'rgba(0, 0, 0, 0.25)',
  heavy: 'rgba(0, 0, 0, 0.35)',

  // Colored shadows
  primary: 'rgba(17, 39, 58, 0.2)',        // Navy shadow
  success: 'rgba(73, 222, 128, 0.2)',
  error: 'rgba(255, 77, 79, 0.2)',
} as const;

/**
 * Data visualization colors
 * For charts, graphs, and data representations
 */
export const dataViz = {
  // Chromatic palette for charts
  blue: colors.lightSecondary,              // #67bef2
  green: colors.active,                     // #49DE80
  orange: '#DB9F0D',
  red: colors.error,                        // #ff4d4f
  purple: '#9b59b6',
  teal: '#006060',

  // Sequential palette (light to dark)
  sequential: [
    colors.lightTertiary,      // Lightest
    colors.quartiary,
    colors.tertiary,
    colors.secondary,
    colors.primary,            // Darkest
  ],

  // Diverging palette (for opposing values)
  diverging: [
    colors.error,              // Negative extreme
    '#ff7875',
    colors.lightNeutralSecondary,
    '#69c0ff',
    colors.lightSecondary,     // Positive extreme
  ],
} as const;

/**
 * Helper function to create color with opacity
 * @param color - Hex or RGB color
 * @param opacity - Opacity value 0-1
 * @returns RGBA color string
 *
 * @example
 * withOpacity(colors.primary, 0.5) // 'rgba(17, 39, 58, 0.5)'
 */
export const withOpacity = (color: string, opacity: number): string => {
  // If already rgba, replace opacity
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${opacity})`);
  }

  // If rgb, convert to rgba
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }

  // If hex, convert to rgba
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};

/**
 * Helper function to darken a color
 * @param color - RGB color string
 * @param amount - Amount to darken (0-1)
 * @returns Darkened RGB color
 *
 * @example
 * darken('rgb(100, 100, 100)', 0.2) // Darker gray
 */
export const darken = (color: string, amount: number): string => {
  const match = color.match(/\d+/g);
  if (!match) return color;

  const [r, g, b] = match.map(Number);
  const factor = 1 - amount;

  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
};

/**
 * Helper function to lighten a color
 * @param color - RGB color string
 * @param amount - Amount to lighten (0-1)
 * @returns Lightened RGB color
 *
 * @example
 * lighten('rgb(100, 100, 100)', 0.2) // Lighter gray
 */
export const lighten = (color: string, amount: number): string => {
  const match = color.match(/\d+/g);
  if (!match) return color;

  const [r, g, b] = match.map(Number);

  return `rgb(${Math.round(r + (255 - r) * amount)}, ${Math.round(g + (255 - g) * amount)}, ${Math.round(b + (255 - b) * amount)})`;
};

/**
 * Consolidated semantic colors export
 */
export const semanticColors = {
  surface,
  text,
  border,
  action,
  feedback,
  status,
  brand,
  factCheck,
  shadow,
  dataViz,
} as const;

export default semanticColors;
