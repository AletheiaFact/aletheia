import React from "react";
import AletheiaButton, { ButtonType } from "./AletheiaButton";
import { Box, Button as MuiButton, Divider, Grid, Typography } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import colors from "../styles/colors";
import GridListStyle from "./GridList.style";

type ItemSize = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
};

export type SeeMorePosition = "top" | "bottom" | "both";

interface GridListProps<T = any> {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    dataSource: T[];
    renderItem: (item: T) => React.ReactNode;
    href?: string;
    dataCy?: string;
    seeMoreButtonLabel?: string;
    disableSeeMoreButton?: boolean;
    seeMoreButtonPosition?: SeeMorePosition;
    itemSize?: ItemSize;
    hasDivider?: boolean;
}

const DEFAULT_ITEM_SIZE: ItemSize = { xs: 12, md: 6 };

const TopActionButton = ({
    href,
    dataCy,
    label,
}: {
    href: string;
    dataCy: string;
    label: string;
}) => (
    <MuiButton
        href={href}
        variant="outlined"
        endIcon={<ArrowForwardOutlined fontSize="small" />}
        className="grid-list-top-action"
        data-cy={dataCy}
        sx={{
            borderColor: colors.primary,
            color: colors.primary,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
            padding: "8px 18px",
            borderRadius: "6px",
            background: colors.white,
            "&:hover": {
                borderColor: colors.primary,
                background: colors.lightNeutral,
            },
        }}
    >
        {label}
    </MuiButton>
);

const GridList = <T,>({
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
}: GridListProps<T>) => {

    const showTop =
        !disableSeeMoreButton &&
        (seeMoreButtonPosition === "top" ||
            seeMoreButtonPosition === "both");

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
                    <>
                        {title}
                    </>
                )}
                {showTop && (
                    <TopActionButton
                        href={href}
                        dataCy={dataCy}
                        label={seeMoreButtonLabel}
                    />
                )}
            </Box>
            {hasDivider && <Divider variant="fullWidth" />}
            <Grid container spacing={2}>
                {dataSource.map((item) => (
                    <Grid container item {...itemSize} key={(item as any)?._id}>
                        {renderItem(item)}
                    </Grid>
                ))}
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
