import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import HomePersonalitiesSectionStyle from "./HomePersonalitiesSection.style";
import { currentNameSpace } from "../../../atoms/namespace";
import { NameSpaceEnum } from "../../../types/Namespace";
import PersonalityCard from "../../Personality/PersonalityCard";
import GridList from "../../GridList";
import { Personality } from "../../../types/Personality";

interface HomePersonalitiesSectionProps {
    personalities: Personality[];
}

const HomePersonalitiesSection = ({
    personalities,
}: HomePersonalitiesSectionProps) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    if (!Array.isArray(personalities) || personalities.length === 0) {
        return null;
    }

    const seeAllHref =
        nameSpace !== NameSpaceEnum.Main
            ? `/${nameSpace}/personality`
            : "/personality";

    return (
        <HomePersonalitiesSectionStyle container>
            <Box className="personalities-inner">
                <GridList
                    title={t("home:personalitiesSectionTitle")}
                    subtitle={t("home:personalitiesSectionSubtitle")}
                    dataSource={personalities}
                    href={seeAllHref}
                    dataCy="testSeeMorePersonality"
                    seeMoreButtonLabel={t("home:personalitiesSectionSeeAll")}
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
