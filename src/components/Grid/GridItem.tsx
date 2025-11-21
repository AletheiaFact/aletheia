/**
 * GridItem Component
 * Based on GitLab Pajamas grid principles adapted for Aletheia
 *
 * Individual grid item that works within a GridContainer or MUI Grid
 *
 * Usage:
 * <GridItem xs={12} md={6} lg={4}>
 *   Content
 * </GridItem>
 */

import { Grid, GridProps } from "@mui/material";
import { gap } from "../../styles";
import { ReactNode } from "react";

interface GridItemProps extends GridProps {
    children: ReactNode;
    gap?: keyof typeof gap; // Gap between items
}

/**
 * GridItem - Responsive grid item component
 *
 * @param gap - Gap between grid items (none, xxs, xs, sm, md, lg, xl, 2xl, 3xl)
 * @param xs - Grid columns on extra small screens (0-575px)
 * @param sm - Grid columns on small screens (576-767px)
 * @param md - Grid columns on medium screens (768-991px)
 * @param lg - Grid columns on large screens (992-1199px)
 * @param xl - Grid columns on extra large screens (1200px+)
 */
const GridItem: React.FC<GridItemProps> = ({
    children,
    gap: itemGap,
    sx,
    ...restProps
}) => {
    return (
        <Grid
            item
            sx={{
                ...(itemGap && { gap: gap[itemGap] }),
                ...sx,
            }}
            {...restProps}
        >
            {children}
        </Grid>
    );
};

export default GridItem;
