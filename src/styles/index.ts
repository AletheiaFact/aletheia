/**
 * Aletheia Design System
 * Centralized export for all design tokens and utilities
 *
 * Based on GitLab Pajamas layout principles with Aletheia's design identity
 */

// Core design tokens
export { default as colors } from './colors';
export * from './colors';

export { default as spacing } from './spacing';
export * from './spacing';

export { default as layout } from './layout';
export * from './layout';

export { default as typography } from './typography';
export * from './typography';

export { default as semanticColors } from './semanticColors';
export * from './semanticColors';

// Media queries
export * from './mediaQueries';

// Theme configuration
export * from './namespaceThemes';

/**
 * Quick access to commonly used design tokens
 */
export const designTokens = {
  // Re-export for convenience
  get colors() {
    return require('./colors').default;
  },
  get spacing() {
    return require('./spacing').default;
  },
  get layout() {
    return require('./layout').default;
  },
  get typography() {
    return require('./typography').default;
  },
  get semanticColors() {
    return require('./semanticColors').default;
  },
};
