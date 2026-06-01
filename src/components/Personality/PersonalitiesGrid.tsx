import { useTranslation } from "next-i18next";
import React from "react";

import GridList from "../GridList";
import PersonalityCard from "./PersonalityCard";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../types/Namespace";
import { Personality } from "../../types/Personality";

interface PersonalitiesGridProps {
    personalities: Personality[];
    title: string;
}

const PersonalitiesGrid = ({
    personalities,
    title,
}: PersonalitiesGridProps) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const href =
        nameSpace !== NameSpaceEnum.Main
            ? `/${nameSpace}/personality`
            : "/personality";

    return (
        <GridList
            title={title}
            dataSource={personalities}
            itemSize={{ xs: 12, sm: 6 }}
            href={href}
            dataCy="testSeeMorePersonality"
            seeMoreButtonLabel={t("home:seeMorePersonalitiesButton")}
            getKey={(personality) => personality.id}
            renderItem={(personality) => (
                <PersonalityCard personality={personality} summarized={true} />
            )}
        />
    );
};

export default PersonalitiesGrid;
