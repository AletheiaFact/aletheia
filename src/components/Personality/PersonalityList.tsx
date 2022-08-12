import { Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import api from "../../api/personality";
import BaseList from "../List/BaseList";
import Seo from "../Seo";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";
import PersonalityCard from "./PersonalityCard";
import PersonalityCreateCTA from "./PersonalityCreateCTA";

const PersonalityList = () => {
    const { i18n, t } = useTranslation();
    const createPersonalityCTA = (
        <Row
            style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >
            <PersonalityCreateCTA href="/personality/search" />
        </Row>
    );
    return (
        <>
            <Seo
                title={t("seo:personalityListTitle")}
                description={t("seo:personalityListDescription")}
            />
            <BaseList
                apiCall={api.getPersonalities}
                filter={{
                    i18n,
                }}
                emptyFallback={createPersonalityCTA}
                renderItem={(p) =>
                    p && (
                        <PersonalityCard
                            personality={p}
                            summarized={true}
                            key={p._id}
                        />
                    )
                }
                footer={createPersonalityCTA}
                skeleton={<PersonalitySkeleton />}
            />
        </>
    );
};
export default PersonalityList;
