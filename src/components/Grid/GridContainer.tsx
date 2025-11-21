/**
 * GridContainer Component
 * Based on GitLab Pajamas grid principles adapted for Aletheia
 *
 * Provides a responsive 12-column grid system with consistent spacing
 * and container widths based on breakpoints.
 *
 * Usage:
 * <GridContainer maxWidth="lg" spacing="md">
 *   <GridItem xs={12} md={6}>Content</GridItem>
 *   <GridItem xs={12} md={6}>Content</GridItem>
 * </GridContainer>
 */

import { Container, ContainerProps } from "@mui/material";
import { containerWidths, spacing } from "../../styles";
import { ReactNode } from "react";

type MaxWidth = keyof typeof containerWidths;
type Spacing = keyof typeof spacing;

interface GridContainerProps extends Omit<ContainerProps, "maxWidth"> {
    children: ReactNode;
    maxWidth?: MaxWidth;
    spacing?: Spacing;
    fluid?: boolean; // Full width container
    centered?: boolean; // Center content horizontally
}

/**
 * GridContainer - Responsive container component
 *
 * @param maxWidth - Maximum width at different breakpoints (sm, md, lg, xl, xxl, full)
 * @param spacing - Padding inside the container (xxs, xs, sm, md, lg, xl, 2xl, etc.)
 * @param fluid - If true, container takes full width
 * @param centered - If true, content is centered
 */
const GridContainer: React.FC<GridContainerProps> = ({
    children,
    maxWidth = "xl",
    spacing: containerSpacing = "md",
    fluid = false,
    centered = false,
    sx,
    ...restProps
}) => {
    return (
        <Container
            maxWidth={false}
            sx={{
                maxWidth: fluid ? "100%" : containerWidths[maxWidth],
                padding: spacing[containerSpacing],
                margin: centered ? "0 auto" : undefined,
                width: "100%",
                ...sx,
            }}
            {...restProps}
        >
            {children}
        </Container>
    );
};

export default GridContainer;
