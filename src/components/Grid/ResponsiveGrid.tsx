/**
 * ResponsiveGrid Component
 * Based on GitLab Pajamas grid principles adapted for Aletheia
 *
 * Combines GridContainer and MUI Grid for a complete grid layout solution
 * Follows the 8px spacing system with standardized gaps
 *
 * Usage:
 * <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ResponsiveGrid>
 */

import { Grid } from "@mui/material";
import { gap as gapTokens, spacing } from "../../styles";
import { ReactNode } from "react";

interface ResponsiveColumns {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

interface ResponsiveGridProps {
    children: ReactNode;
    columns?: ResponsiveColumns | number; // Number of columns at different breakpoints or fixed
    gap?: keyof typeof gapTokens; // Gap between items
    rowGap?: keyof typeof gapTokens; // Row gap (vertical)
    columnGap?: keyof typeof gapTokens; // Column gap (horizontal)
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
    style?: React.CSSProperties;
}

/**
 * ResponsiveGrid - Responsive grid layout component
 *
 * @param columns - Number of columns at different breakpoints or a fixed number
 * @param gap - Uniform gap between items (none, xxs, xs, sm, md, lg, xl, 2xl, 3xl)
 * @param rowGap - Vertical gap between rows
 * @param columnGap - Horizontal gap between columns
 * @param alignItems - Vertical alignment of items
 * @param justifyContent - Horizontal alignment of items
 *
 * @example
 * // 3 columns on all screens
 * <ResponsiveGrid columns={3} gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </ResponsiveGrid>
 *
 * @example
 * // Responsive columns: 1 on mobile, 2 on tablet, 3 on desktop
 * <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </ResponsiveGrid>
 */
const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
    children,
    columns = 12,
    gap,
    rowGap,
    columnGap,
    alignItems,
    justifyContent,
    style,
}) => {
    // Calculate column width based on total columns (12-column system)
    const calculateColumnWidth = (cols: number) => {
        return 12 / cols;
    };

    // Determine if columns is a number or responsive object
    const isResponsive = typeof columns === "object";
    const columnConfig = isResponsive
        ? columns
        : {
              xs: calculateColumnWidth(columns as number),
              sm: calculateColumnWidth(columns as number),
              md: calculateColumnWidth(columns as number),
              lg: calculateColumnWidth(columns as number),
              xl: calculateColumnWidth(columns as number),
          };

    // Calculate the final gap values
    const finalGap = gap ? gapTokens[gap] : undefined;
    const finalRowGap = rowGap ? gapTokens[rowGap] : finalGap;
    const finalColumnGap = columnGap ? gapTokens[columnGap] : finalGap;

    return (
        <Grid
            container
            spacing={0} // We'll use gap instead
            sx={{
                ...(finalRowGap && { rowGap: finalRowGap }),
                ...(finalColumnGap && { columnGap: finalColumnGap }),
                ...(alignItems && { alignItems }),
                ...(justifyContent && { justifyContent }),
            }}
            style={style}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <Grid
                        item
                        key={index}
                        xs={columnConfig.xs || 12}
                        sm={columnConfig.sm || columnConfig.xs || 12}
                        md={columnConfig.md || columnConfig.sm || columnConfig.xs || 12}
                        lg={columnConfig.lg || columnConfig.md || columnConfig.sm || columnConfig.xs || 12}
                        xl={columnConfig.xl || columnConfig.lg || columnConfig.md || columnConfig.sm || columnConfig.xs || 12}
                    >
                        {child}
                    </Grid>
                ))
            ) : (
                <Grid
                    item
                    xs={columnConfig.xs || 12}
                    sm={columnConfig.sm || columnConfig.xs || 12}
                    md={columnConfig.md || columnConfig.sm || columnConfig.xs || 12}
                    lg={columnConfig.lg || columnConfig.md || columnConfig.sm || columnConfig.xs || 12}
                    xl={columnConfig.xl || columnConfig.lg || columnConfig.md || columnConfig.sm || columnConfig.xs || 12}
                >
                    {children}
                </Grid>
            )}
        </Grid>
    );
};

export default ResponsiveGrid;
