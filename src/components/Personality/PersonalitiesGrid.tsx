import { useTranslation } from "next-i18next";
import React from "react";

import GridList from "../GridList";
import PersonalityCard from "./PersonalityCard";

const PersonalitiesGrid = ({ personalities, title }) => {
    const { t } = useTranslation();
    return (
        <GridList
            title={title}
            dataSource={personalities}
            loggedInMaxColumns={2}
            seeMoreButtonLabel={t("home:seeMorePersonalitiesButton")}
            renderItem={(p) => (
                <PersonalityCard personality={p} summarized={true} />
            )}
        />
    );
};

export default PersonalitiesGrid;
