import { Box, Grid, Typography } from "@mui/material"
import React from "react";

import colors from "../../../styles/colors";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import CardBase from "../../CardBase";
import GridList from "../../GridList";
import PersonalityMinimalCard from "../../Personality/PersonalityMinimalCard";
import { NameSpaceEnum } from "../../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import HomeDebatesSectionStyle from "./HomeDebatesSection.style";
import { Debate } from "../../../types/Debates";
import { useTranslations } from "next-intl";

interface HomeDebatesSectionProps {
    debates: Debate[];
}

const HomeDebatesSection = ({ debates }: HomeDebatesSectionProps) => {
    const tDebates = useTranslations("debates");
    const [nameSpace] = useAtom(currentNameSpace);

    const seeAllHref =
        nameSpace === NameSpaceEnum.Main ? "/claim" : `/${nameSpace}/claim`;


    if (!Array.isArray(debates) || debates.length === 0) return null;

    return (
        <HomeDebatesSectionStyle>
            <Box className="debates-inner">
                <GridList
                    title={tDebates("sectionTitle")}
                    subtitle={tDebates("sectionSubtitle")}
                    dataSource={debates}
                    itemSize={{ xs: 12, sm: 6 }}
                    href={seeAllHref}
                    seeMoreButtonLabel={tDebates("seeAll")}
                    seeMoreButtonPosition="top"
                    dataCy="testSeeMoreDebates"
                    getKey={(debate) => debate.claimId}
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
                                            {tDebates("liveLabel")})
                                        </Typography>
                                    </Grid>
                                    <Grid container
                                        style={{
                                            justifyContent: "space-evenly",
                                        }}
                                    >
                                        {debateClaim.personalities.map((p) => {
                                            return (
                                                <Grid item key={p._id} xs={12} sm={5.5}>
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
                                            <AletheiaButton
                                                type={ButtonType.primary}
                                                href={
                                                    nameSpace === NameSpaceEnum.Main
                                                        ? `/claim/${debateClaim.claimId}/debate`
                                                        : `/${nameSpace}/claim/${debateClaim.claimId}/debate`
                                                }
                                            >
                                                {tDebates("seeDebate")}
                                            </AletheiaButton>
                                        </Grid>
                                    </Grid>
                                </div>
                            </CardBase>
                        );
                    }}
                />
            </Box>
        </HomeDebatesSectionStyle>
    );
};

export default HomeDebatesSection;
