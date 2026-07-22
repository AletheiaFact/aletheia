import React from "react";
import { Box } from "@mui/material";
import { useAtom } from "jotai";
import HomePersonalitiesSectionStyle from "./HomePersonalitiesSection.style";
import { currentNameSpace } from "../../../atoms/namespace";
import { NameSpaceEnum } from "../../../types/Namespace";
import PersonalityCard from "../../Personality/PersonalityCard";
import GridList from "../../GridList";
import { Personality } from "../../../types/Personality";
import { useTranslations } from "next-intl";

interface HomePersonalitiesSectionProps {
    personalities: Personality[];
}

const HomePersonalitiesSection = ({
    personalities,
}: HomePersonalitiesSectionProps) => {
    const tHome = useTranslations("home");
    const [nameSpace] = useAtom(currentNameSpace);

    if (!Array.isArray(personalities) || personalities.length === 0) {
        return null;
    }

    const seeAllHref =
        nameSpace === NameSpaceEnum.Main
            ? "/personality"
            : `/${nameSpace}/personality`;

    return (
        <HomePersonalitiesSectionStyle container>
            <Box className="personalities-inner">
                <GridList
                    title={tHome("personalitiesSectionTitle")}
                    subtitle={tHome("personalitiesSectionSubtitle")}
                    dataSource={personalities}
                    href={seeAllHref}
                    dataCy="testSeeMorePersonality"
                    seeMoreButtonLabel={tHome("personalitiesSectionSeeAll")}
                    seeMoreButtonPosition="top"
                    itemSize={{ xs: 12, md: 6, lg: 4 }}
                    getKey={(personality) => personality.id}
                    renderItem={(personality) => (
                        <PersonalityCard
                            personality={personality}
                            summarized={true}
                        />
                    )}
                />
            </Box>
        </HomePersonalitiesSectionStyle>
    );
};

export default HomePersonalitiesSection;
