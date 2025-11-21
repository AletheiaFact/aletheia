/**
 * Layout Design System
 * Based on GitLab Pajamas layout principles adapted for Aletheia
 *
 * Provides standardized layout constants, container widths,
 * responsive utilities, and layout helpers.
 */

import { spacing, spacingRem } from './spacing';

/**
 * Container max-widths for different breakpoints
 * Ensures content doesn't stretch too wide on large screens
 */
export const containerWidths = {
  sm: '540px',   // Small devices
  md: '720px',   // Medium devices
  lg: '960px',   // Large devices
  xl: '1140px',  // Extra large devices
  xxl: '1320px', // Extra extra large devices
  full: '100%',  // Full width
} as const;

/**
 * Responsive breakpoint values (matches mediaQueries.ts)
 * Used for consistent responsive behavior across the app
 */
export const breakpoints = {
  xs: 576,  // Small phones
  sm: 768,  // Tablets
  md: 992,  // Small desktops
  lg: 1200, // Large desktops
  xl: 1400, // Extra large screens
} as const;

/**
 * Common component heights based on 8px grid
 */
export const heights = {
  header: '56px',        // 7 * 8px - Main header height
  footer: 'auto',        // Footer adjusts to content
  button: '40px',        // 5 * 8px - Standard button
  buttonSmall: '32px',   // 4 * 8px - Small button
  buttonLarge: '48px',   // 6 * 8px - Large button
  input: '40px',         // 5 * 8px - Standard input
  inputSmall: '32px',    // 4 * 8px - Small input
  inputLarge: '48px',    // 6 * 8px - Large input
  navbar: '64px',        // 8 * 8px - Navigation bar
  toolbar: '48px',       // 6 * 8px - Toolbar
  card: 'auto',          // Cards adjust to content
} as const;

/**
 * Border radius values following 8px grid system
 * Maintains consistency with Aletheia's existing patterns
 */
export const borderRadius = {
  none: '0',
  sm: '4px',    // 0.5 * 8px - Small radius (inputs, buttons)
  md: '8px',    // 1 * 8px - Medium radius (modals)
  lg: '10px',   // Standard radius (cards) - Aletheia standard
  xl: '16px',   // 2 * 8px - Large radius
  '2xl': '24px', // 3 * 8px - Extra large radius
  round: '30px', // Rounded (pills, rounded buttons)
  circle: '50%', // Perfect circle (avatars)
  full: '9999px', // Fully rounded
} as const;

/**
 * Z-index layers for consistent stacking order
 * Prevents z-index conflicts across the application
 */
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  notification: 800,
  header: 1000,
  toolbar: 1001,
  drawer: 1200,
  muiModal: 1300, // MUI default modal z-index
  copilotDrawer: 999999, // Copilot drawer (maintains existing behavior)
} as const;

/**
 * Shadow system for elevation and depth
 * Based on Aletheia's existing shadow patterns
 */
export const shadows = {
  none: 'none',
  xs: '0px 1px 2px rgba(0, 0, 0, 0.1)',                    // Minimal shadow
  sm: '0px 2px 2px rgba(0, 0, 0, 0.25)',                   // Input/light shadow
  md: '0px 3px 3px rgba(0, 0, 0, 0.25)',                   // Card shadow (standard)
  lg: '0px 4px 6px rgba(0, 0, 0, 0.25)',                   // Elevated card
  xl: '0px 0px 15px rgba(0, 0, 0, 0.25)',                  // Modal/large shadow
  '2xl': '0px 10px 20px rgba(0, 0, 0, 0.3)',               // High elevation
  dashboard: '1px 4px 10px 3px rgba(0, 0, 0, 0.1)',        // Dashboard items
  hover: '0px 3px 3px rgba(0, 0, 0, 0.35)',                // Hover state (intensified)
  selected: '0px 4px 8px rgba(0, 0, 0, 0.3)',              // Selected state
} as const;

/**
 * Transition presets for consistent animations
 */
export const transitions = {
  fast: '0.15s',
  normal: '0.3s',
  slow: '0.5s',

  // Common easing functions
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Preset transition strings
  default: 'all 0.3s ease-in-out',
  transform: 'transform 0.3s ease-in-out',
  opacity: 'opacity 0.3s ease-in-out',
  color: 'color 0.15s ease-in-out',
} as const;

/**
 * Grid system based on 12-column layout
 * Compatible with Material-UI Grid
 */
export const grid = {
  columns: 12,
  gutterWidth: spacing.md,      // 16px - Standard gutter
  gutterWidthSmall: spacing.sm, // 8px - Tight gutter
  gutterWidthLarge: spacing.lg, // 24px - Wide gutter
} as const;

/**
 * Responsive padding/margin utilities
 * Returns different spacing values based on breakpoint
 */
export const responsiveSpacing = {
  // Page-level padding
  pagePadding: {
    mobile: spacingRem[5],  // 16px on mobile
    tablet: spacingRem[6],  // 24px on tablet
    desktop: spacingRem[9], // 64px on desktop
  },

  // Section padding
  sectionPadding: {
    mobile: spacingRem[6],  // 24px on mobile
    tablet: spacingRem[7],  // 32px on tablet
    desktop: spacingRem[8], // 48px on desktop
  },

  // Card padding
  cardPadding: {
    mobile: spacingRem[4],  // 12px on mobile
    tablet: spacingRem[5],  // 16px on tablet
    desktop: spacingRem[5], // 16px on desktop
  },
} as const;

/**
 * Common flexbox utilities as objects
 * Can be spread into styled-components or MUI sx prop
 */
export const flexbox = {
  // Direction
  row: { display: 'flex', flexDirection: 'row' as const },
  column: { display: 'flex', flexDirection: 'column' as const },
  rowReverse: { display: 'flex', flexDirection: 'row-reverse' as const },
  columnReverse: { display: 'flex', flexDirection: 'column-reverse' as const },

  // Alignment
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  centerH: { display: 'flex', justifyContent: 'center' },
  centerV: { display: 'flex', alignItems: 'center' },
  spaceBetween: { display: 'flex', justifyContent: 'space-between' },
  spaceAround: { display: 'flex', justifyContent: 'space-around' },
  spaceEvenly: { display: 'flex', justifyContent: 'space-evenly' },

  // Common patterns
  rowCentered: { display: 'flex', flexDirection: 'row' as const, alignItems: 'center' },
  columnCentered: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' },
  rowBetween: { display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' },
} as const;

/**
 * Layout helper: Creates a flex container with gap
 */
export const createFlexGap = (gap: keyof typeof spacing.scale, direction: 'row' | 'column' = 'row') => ({
  display: 'flex',
  flexDirection: direction,
  gap: spacingRem[gap],
});

/**
 * Layout helper: Creates a grid container with gap
 */
export const createGridGap = (gap: keyof typeof spacing.scale, columns?: number) => ({
  display: 'grid',
  gap: spacingRem[gap],
  ...(columns && { gridTemplateColumns: `repeat(${columns}, 1fr)` }),
});

/**
 * Layout helper: Creates responsive padding
 */
export const createResponsivePadding = (
  mobile: keyof typeof spacing.scale,
  tablet: keyof typeof spacing.scale,
  desktop: keyof typeof spacing.scale
) => ({
  padding: spacingRem[mobile],
  '@media (min-width: 768px)': {
    padding: spacingRem[tablet],
  },
  '@media (min-width: 992px)': {
    padding: spacingRem[desktop],
  },
});

/**
 * Layout helper: Creates a card layout with standard styling
 */
export const createCardLayout = (variant: 'default' | 'elevated' | 'flat' = 'default') => ({
  backgroundColor: '#ffffff',
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  ...(variant === 'default' && {
    border: '1px solid #eeeeee',
    boxShadow: shadows.md,
  }),
  ...(variant === 'elevated' && {
    boxShadow: shadows.lg,
  }),
  ...(variant === 'flat' && {
    border: '1px solid #eeeeee',
  }),
});

/**
 * Layout helper: Truncate text with ellipsis
 */
export const truncateText = (lines: number = 1) => {
  if (lines === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    };
  }

  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
};

/**
 * Layout helper: Creates a sticky header/footer
 */
export const createSticky = (position: 'top' | 'bottom', offset: number = 0) => ({
  position: 'sticky' as const,
  [position]: offset,
  zIndex: zIndex.sticky,
});

/**
 * Export all layout tokens
 */
export const layout = {
  containerWidths,
  breakpoints,
  heights,
  borderRadius,
  zIndex,
  shadows,
  transitions,
  grid,
  responsiveSpacing,
  flexbox,
} as const;

export default layout;
