import SectionTitle from "./SectionTitle";
import { Grid } from "@mui/material";
import React from "react";
import AletheiaButton, { ButtonType } from "./AletheiaButton";
import { ArrowForwardOutlined } from "@mui/icons-material";

const GridList = ({
    renderItem,
    loggedInMaxColumns = 6,
    dataSource,
    title,
    href = "",
    dataCy = "",
    seeMoreButtonLabel = "",
    disableSeeMoreButton = false,
    hasDivider = false,
}) => {
    return (
        <>
            <SectionTitle
                children={title}
                hasDivider={hasDivider}
            />

            <Grid container columnSpacing={1}>
                {dataSource.map((item) => (
                    <Grid container
                        item
                        xs={12}
                        md={loggedInMaxColumns}
                        lg={6}
                        key={item}
                    >
                        {renderItem(item)}
                    </Grid>
                ))}
            </Grid>

            {!disableSeeMoreButton && (
                <Grid item
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "48px 0 64px 0",
                    }}
                >
                    <AletheiaButton
                        href={href}
                        type={ButtonType.primary}
                        data-cy={dataCy}
                        endIcon={<ArrowForwardOutlined fontSize="small" />}
                    >
                        {seeMoreButtonLabel}
                    </AletheiaButton>
                </Grid>
            )}
        </>
    );
};

export default GridList;
