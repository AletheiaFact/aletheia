import { Grid, Typography } from "@mui/material"
import { useTranslation } from "next-i18next";
import React from "react";

import colors from "../../styles/colors";
import Button from "../Button";
import CardBase from "../CardBase";
import GridList from "../GridList";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const DebateGrid = ({ debates }) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <GridList
            title={"Debates"}
            dataSource={debates}
            loggedInMaxColumns={1}
            gridLayout={{
                gutter: 10,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
            }}
            disableSeeMoreButton={true}
            renderItem={(debateClaim) => {
                return (
                    <CardBase
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: colors.lightNeutral,
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                            }}
                        >
                            <Grid container>
                                <Typography
                                    variant="h3"
                                    style={{
                                        fontSize: "22px",
                                        lineHeight: "32px",
                                        margin: "0 0 16px 0",
                                        fontWeight: 400,
                                        color: colors.neutral,
                                    }}
                                >
                                    {debateClaim.title} (
                                    {t("debates:liveLabel")})
                                </Typography>
                            </Grid>
                            <Grid container
                                style={{
                                    justifyContent: "space-evenly",
                                }}
                            >
                                {debateClaim.personalities.map((p) => {
                                    return (
                                        <Grid item key={p._id} xs={12} md={5.5}>
                                            <PersonalityMinimalCard
                                                personality={p}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                            <Grid container
                                style={{
                                    justifyContent: "center",
                                    marginTop: "16px",
                                }}
                            >
                                <Grid item>
                                    <Button
                                        href={
                                            nameSpace !== NameSpaceEnum.Main
                                                ? `/${nameSpace}/claim/${debateClaim.claimId}/debate`
                                                : `/claim/${debateClaim.claimId}/debate`
                                        }
                                    >
                                        <span style={{ marginTop: 4 }}>
                                            {t("debates:seeDebate")}
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </CardBase>
                );
            }}
        />
    );
};

export default DebateGrid;
