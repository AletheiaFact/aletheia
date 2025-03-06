import { useTranslation } from "next-i18next";
import React from "react";

import GridList from "../GridList";
import PersonalityCard from "./PersonalityCard";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../types/Namespace";

const PersonalitiesGrid = ({ personalities, title }) => {
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
            loggedInMaxColumns={6}
            href={href}
            dataCy="testSeeMorePersonality"
            seeMoreButtonLabel={t("home:seeMorePersonalitiesButton")}
            renderItem={(p) => (
                <PersonalityCard personality={p} summarized={true} />
            )}
        />
    );
};

export default PersonalitiesGrid;
