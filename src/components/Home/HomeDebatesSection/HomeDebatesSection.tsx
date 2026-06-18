import { Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";

import GridList from "../../GridList";
import { NameSpaceEnum } from "../../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import HomeDebatesSectionStyle from "./HomeDebatesSection.style";
import { Debate } from "../../../types/Debates";
import DebateCard from "../../Debate/DebateCard";

interface HomeDebatesSectionProps {
    debates: Debate[];
}

const HomeDebatesSection = ({ debates }: HomeDebatesSectionProps) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const seeAllHref =
        nameSpace === NameSpaceEnum.Main ? "/claim" : `/${nameSpace}/claim`;

    if (!Array.isArray(debates) || debates.length === 0) return null;

    return (
        <HomeDebatesSectionStyle>
            <Box className="debates-inner">
                <GridList
                    title={t("debates:sectionTitle")}
                    subtitle={t("debates:sectionSubtitle")}
                    dataSource={debates}
                    itemSize={{ xs: 12, md: 6 }}
                    href={seeAllHref}
                    seeMoreButtonLabel={t("debates:seeAll")}
                    seeMoreButtonPosition="top"
                    dataCy="testSeeMoreDebates"
                    getKey={(debate) => debate.claimId}
                    renderItem={(debateClaim) => (
                        <DebateCard debateClaim={debateClaim} />
                    )}
                />
            </Box>
        </HomeDebatesSectionStyle>
    );
};

export default HomeDebatesSection;
