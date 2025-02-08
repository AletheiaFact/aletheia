import AletheiaButton, { ButtonType } from "../Button";
import { Grid, Typography } from "@mui/material";

import React from "react";
import ClaimSourceListItem from "./ClaimSourceListItem";
import { ClaimSourceListStyle } from "./ClaimSourceList.style";
import { useTranslation } from "next-i18next";

const ClaimSourceList = ({
    sources,
    seeMoreHref,
    showAllSources = false,
}: {
    sources: any[];
    seeMoreHref: string;
    showAllSources?: boolean;
}) => {
    const { t } = useTranslation();
    const sourcesGridColumns = 6;
    const dataSource = showAllSources
        ? sources
        : sources.slice(0, sourcesGridColumns);

    return (
        <ClaimSourceListStyle>
            {sources && (
                <Grid container style={{ width: '100%' }}>
                    {dataSource.map((source, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            key={source}
                        >
                            <ClaimSourceListItem
                                source={source}
                                index={index + 1}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            {!showAllSources && sources?.length > sourcesGridColumns && (
                <AletheiaButton
                    type={ButtonType.blue}
                    href={seeMoreHref}
                    className="all-sources-link-button"
                >
                    <Typography variant="h4" className="all-sources-link">
                        {t("claim:seeSourcesButton")}
                    </Typography>
                </AletheiaButton>
            )}
        </ClaimSourceListStyle>
    );
};

export default ClaimSourceList;
