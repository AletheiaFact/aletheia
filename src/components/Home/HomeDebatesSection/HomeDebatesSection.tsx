import { Box } from "@mui/material"
import React from "react";

import GridList from "../../GridList";
import { NameSpaceEnum } from "../../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import HomeDebatesSectionStyle from "./HomeDebatesSection.style";
import { Debate } from "../../../types/Debates";
import { useTranslations } from "next-intl";
import DebateCard from "../../Debate/DebateCard";

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
                    itemSize={{ xs: 12, md: 6 }}
                    href={seeAllHref}
                    seeMoreButtonLabel={tDebates("seeAll")}
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
