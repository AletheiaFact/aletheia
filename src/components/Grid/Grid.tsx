/**
 * Grid Component - Enhanced MUI Grid with Design Tokens
 *
 * Drop-in replacement for MUI Grid that uses Aletheia design tokens
 * for spacing, padding, and gaps.
 *
 * Usage:
 * import { Grid } from '../components/Grid';
 *
 * // Same API as MUI Grid, but with design token support
 * <Grid container spacing="md">
 *   <Grid item xs={12} md={6}>Content</Grid>
 * </Grid>
 */

import { Grid as MuiGrid, GridProps as MuiGridProps } from "@mui/material";
import { spacing, gap } from "../../styles";
import React from "react";

// Extended props to support design token keys
interface GridProps extends Omit<MuiGridProps, 'spacing' | 'columnSpacing' | 'rowSpacing'> {
    spacing?: keyof typeof spacing | number;
    columnSpacing?: keyof typeof spacing | number;
    rowSpacing?: keyof typeof spacing | number;
    gap?: keyof typeof gap;
}

/**
 * Grid - Enhanced MUI Grid with design token support
 *
 * @param spacing - Spacing between grid items (xxs, xs, sm, md, lg, xl, 2xl, 3xl) or number
 * @param columnSpacing - Column spacing (xxs, xs, sm, md, lg, xl, 2xl, 3xl) or number
 * @param rowSpacing - Row spacing (xxs, xs, sm, md, lg, xl, 2xl, 3xl) or number
 * @param gap - Gap using design tokens (none, xxs, xs, sm, md, lg, xl, 2xl, 3xl)
 *
 * @example
 * // Using design tokens
 * <Grid container spacing="md">
 *   <Grid item xs={12} md={6}>Content</Grid>
 * </Grid>
 *
 * @example
 * // Using gap instead of spacing
 * <Grid container gap="lg">
 *   <Grid item xs={12}>Content</Grid>
 * </Grid>
 *
 * @example
 * // Different column and row spacing
 * <Grid container columnSpacing="md" rowSpacing="lg">
 *   <Grid item xs={12} md={4}>Item 1</Grid>
 *   <Grid item xs={12} md={4}>Item 2</Grid>
 * </Grid>
 */
const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
    spacing: gridSpacing,
    columnSpacing: gridColumnSpacing,
    rowSpacing: gridRowSpacing,
    gap: gridGap,
    sx,
    ...restProps
}, ref) => {
    // Convert design token strings to actual spacing values
    const getSpacingValue = (value?: keyof typeof spacing | number) => {
        if (value === undefined) return undefined;
        if (typeof value === 'number') return value;
        // Convert rem to spacing units (1rem = 16px = 2 spacing units in MUI)
        const remValue = parseFloat(spacing[value]);
        return remValue;
    };

    const processedSpacing = getSpacingValue(gridSpacing);
    const processedColumnSpacing = getSpacingValue(gridColumnSpacing);
    const processedRowSpacing = getSpacingValue(gridRowSpacing);

    // Build sx prop with gap if specified
    const enhancedSx = {
        ...(gridGap && { gap: gap[gridGap] }),
        ...sx,
    };

    return (
        <MuiGrid
            ref={ref}
            spacing={processedSpacing}
            columnSpacing={processedColumnSpacing}
            rowSpacing={processedRowSpacing}
            sx={enhancedSx}
            {...restProps}
        />
    );
});

Grid.displayName = 'Grid';

export default Grid;
