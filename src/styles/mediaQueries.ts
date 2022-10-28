const breakpoints = {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
};

/** Exports media queries for each breakpoint
 *  @max-width xs, sm, md and lg
 *  @min-width xl
 */
const queries = {
    xs: `(max-width: ${breakpoints.xs - 1}px)`,
    sm: `(max-width: ${breakpoints.sm - 1}px)`,
    md: `(max-width: ${breakpoints.md - 1}px)`,
    lg: `(max-width: ${breakpoints.lg - 1}px)`,
    xl: `(min-width: ${breakpoints.lg}px)`,
};

export { breakpoints, queries };
