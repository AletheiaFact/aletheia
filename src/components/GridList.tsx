import SectionTitle from "./SectionTitle";
import { Grid } from "@mui/material";
import React from "react";
import Button, { ButtonType } from "./Button";
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
}) => {
    return (
        <>
            <SectionTitle>{title}</SectionTitle>

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
                    <Button href={href} type={ButtonType.blue} data-cy={dataCy}>
                        {seeMoreButtonLabel} <ArrowForwardOutlined fontSize="small"/>
                    </Button>
                </Grid>
            )}
        </>
    );
};

export default GridList;
