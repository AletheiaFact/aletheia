import React from "react";
import AletheiaButton, { ButtonType } from "./AletheiaButton";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import GridListStyle from "./GridList.style";

type ItemSize = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
};

export type SeeMorePosition = "top" | "bottom" | "both";

interface GridListProps<ItemType> {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    dataSource: ItemType[];
    renderItem: (item: ItemType) => React.ReactNode;
    href?: string;
    dataCy?: string;
    seeMoreButtonLabel?: string;
    disableSeeMoreButton?: boolean;
    seeMoreButtonPosition?: SeeMorePosition;
    itemSize?: ItemSize;
    hasDivider?: boolean;
    getKey?: (item: ItemType, index: number) => string | number;
}

const DEFAULT_ITEM_SIZE: ItemSize = { xs: 12, md: 6 };

const GridList = <ItemType,>({
    title,
    subtitle,
    dataSource,
    renderItem,
    href = "",
    dataCy = "",
    seeMoreButtonLabel = "",
    disableSeeMoreButton = false,
    seeMoreButtonPosition = "bottom",
    itemSize = DEFAULT_ITEM_SIZE,
    hasDivider = false,
    getKey,
}: GridListProps<ItemType>) => {
    const showTop =
        !disableSeeMoreButton &&
        (seeMoreButtonPosition === "top" || seeMoreButtonPosition === "both");

    const showBottom =
        !disableSeeMoreButton &&
        (seeMoreButtonPosition === "bottom" ||
            seeMoreButtonPosition === "both");

    return (
        <GridListStyle container $hasSubtitle={!!subtitle}>
            <Box className="grid-list-header">
                {subtitle ? (
                    <Box className="grid-list-header-text">
                        <Typography variant="h2" className="grid-list-title">
                            {title}
                        </Typography>
                        <Typography
                            variant="body1"
                            className="grid-list-subtitle"
                        >
                            {subtitle}
                        </Typography>
                    </Box>
                ) : (
                    <>{title}</>
                )}
                {showTop && (
                    <AletheiaButton
                        type={ButtonType.whiteOutline}
                        href={href}
                        endIcon={<ArrowForwardOutlined fontSize="small" />}
                        data-cy={dataCy}
                    >
                        {seeMoreButtonLabel}
                    </AletheiaButton>
                )}
            </Box>
            {hasDivider && <Divider variant="fullWidth" />}
            <Grid container spacing={2}>
                {dataSource.map((item, index) => {
                    const itemKey = getKey ? getKey(item, index) : index;

                    return (
                        <Grid container item {...itemSize} key={itemKey}>
                            {renderItem(item)}
                        </Grid>
                    );
                })}
            </Grid>
            {showBottom && (
                <Box className="grid-list-bottom-action">
                    <AletheiaButton
                        href={href}
                        endIcon={<ArrowForwardOutlined fontSize="small" />}
                        type={ButtonType.primary}
                        data-cy={dataCy}
                    >
                        {seeMoreButtonLabel}
                    </AletheiaButton>
                </Box>
            )}
        </GridListStyle>
    );
};

export default GridList;
